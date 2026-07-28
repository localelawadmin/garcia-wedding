'use client';

import { useEffect, useId, useRef } from 'react';
import { HG_VB, HG_PATHS, HG_H, HG_G, HG_VBAND, HG_PHASES } from './hgDrawData';

/**
 * Draws Kate's HG monogram on, in pen order.
 *
 * Her artwork already separates the strokes (paths 0,1 = the H; 2,3 = the G), so
 * each phase is clipped to its own stroke — nothing from the G can show while the
 * H is drawing, and vice versa. The one place two parts of a single stroke cross
 * is the H's vertical over its own crossbar, which HG_VBAND divides.
 */
const [BX, BY, BW, BH] = HG_VB;
const RECT = `M ${BX - 60} ${BY - 60} L ${BX + BW + 60} ${BY - 60} L ${BX + BW + 60} ${BY + BH + 60} L ${BX - 60} ${BY + BH + 60} Z`;

const TOTAL = HG_PHASES.reduce((a, p) => a + p.len, 0);
const LAST_C = HG_PHASES.map(p => p.tag).lastIndexOf('C');
const PRE_LEN = HG_PHASES.slice(0, LAST_C).reduce((a, p) => a + p.len, 0);
const C_LEN = TOTAL - PRE_LEN;

const BASE_MS = 3600;   // full draw at 1x
const PAUSE = 0.14;     // beat before the final stroke

// The sweep is a run of quads, one per step of the pen. Rebuilding the whole run
// every frame meant handing the parser a ~32,000-character `d` 60 times a second,
// which is what made this stutter on tablets. Instead the quads are baked into
// fixed chunks once, at module load: a chunk that is fully drawn never gets touched
// again, and only the single chunk straddling the pen tip is rebuilt per frame.
const CHUNK = 24;       // quads per chunk

const quadOf = (ph: (typeof HG_PHASES)[number], j: number) =>
  `M ${ph.L[2 * j]} ${ph.L[2 * j + 1]} L ${ph.L[2 * j + 2]} ${ph.L[2 * j + 3]} `
  + `L ${ph.R[2 * j + 2]} ${ph.R[2 * j + 3]} L ${ph.R[2 * j]} ${ph.R[2 * j + 1]} Z`;

const OVERLAP = 2;      // quads each finished chunk borrows from the next

// A clipPath unions its children, but each child is anti-aliased on its own — where
// two chunks butt up against each other their edge coverage doesn't sum back to 1
// and a hairline shows through. Overlapping by whole quads means the seam is fully
// covered by both chunks, so it disappears. (A single path had no seams because it
// rasterised as one region; that's the behaviour being restored here.)
const CHUNKS: { d: string; n: number }[][] = HG_PHASES.map(ph => {
  const quads = ph.L.length / 2 - 1;
  const out: { d: string; n: number }[] = [];
  for (let c = 0; c * CHUNK < quads; c++) {
    const lo = c * CHUNK;
    const own = Math.min(lo + CHUNK, quads);          // quads this chunk owns
    const hi = Math.min(own + OVERLAP, quads);        // plus the seam cover
    let d = '';
    for (let j = lo; j < hi; j++) d += quadOf(ph, j);
    out.push({ d, n: own - lo });
  }
  return out;
});

export default function HGDraw({
  color = '#FDFDFC',
  width = 260,
  speed = 1.2,
  delay = 0,
  draw = true,
  onDone,
}: {
  color?: string;
  width?: number | string;
  speed?: number;
  delay?: number;
  draw?: boolean;
  onDone?: () => void;
}) {
  const chunkRefs = useRef<(SVGPathElement | null)[][]>(HG_PHASES.map(() => []));
  const grps = useRef<(SVGGElement | null)[]>([]);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let raf = 0;
    let t0 = 0;
    const dur = BASE_MS / speed;
    const pauseMs = dur * PAUSE;
    const mD = dur * (PRE_LEN / TOTAL);
    const sD = dur * (C_LEN / TOTAL);

    // how many quads each chunk currently has on screen; -1 forces a first write
    const drawn = CHUNKS.map(cs => cs.map(() => -1));
    const shown = HG_PHASES.map(() => -1);

    const setPhase = (i: number, f: number) => {
      const g = grps.current[i];
      if (!g) return;
      const ph = HG_PHASES[i];
      const steps = ph.L.length / 2;
      const k = f <= 0 ? 0 : Math.max(2, Math.min(steps, Math.round(steps * f)));
      const quads = Math.max(0, k - 1);

      const vis = quads > 0 ? 1 : 0;
      if (shown[i] !== vis) { g.style.display = vis ? '' : 'none'; shown[i] = vis; }
      if (!vis) return;

      const cs = CHUNKS[i];
      const st = drawn[i];
      for (let c = 0; c < cs.length; c++) {
        const want = Math.max(0, Math.min(cs[c].n, quads - c * CHUNK));
        if (st[c] === want) continue;          // settled — the common case, costs nothing
        const el = chunkRefs.current[i][c];
        if (el) {
          if (want === 0) el.setAttribute('d', 'M 0 0 Z');
          else if (want === cs[c].n) el.setAttribute('d', cs[c].d);
          else {
            let d = '';
            const lo = c * CHUNK;
            for (let j = lo; j < lo + want; j++) d += quadOf(ph, j);
            el.setAttribute('d', d);
          }
        }
        st[c] = want;
      }
    };

    const render = (pre: number, c: number) => {
      let a = 0, b = 0;
      HG_PHASES.forEach((ph, i) => {
        const isC = i >= LAST_C;
        const budget = isC ? c - b : pre - a;
        if (isC) b += ph.len; else a += ph.len;
        setPhase(i, Math.max(0, Math.min(1, budget / ph.len)));
      });
    };

    if (!draw) { render(PRE_LEN, C_LEN); return; }   // already-complete, no rAF at all

    render(0, 0);

    const frame = (ts: number) => {
      if (!t0) t0 = ts;
      const e = ts - t0 - delay;
      if (e < 0) { raf = requestAnimationFrame(frame); return; }
      let pre: number, c: number;
      if (e < mD) { pre = (e / mD) * PRE_LEN; c = 0; }
      else if (e < mD + pauseMs) { pre = PRE_LEN; c = 0; }
      else { pre = PRE_LEN; c = Math.min(1, (e - mD - pauseMs) / sD) * C_LEN; }
      render(pre, c);
      if (e < mD + pauseMs + sD) raf = requestAnimationFrame(frame);
      else doneRef.current?.();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [speed, delay, draw]);

  const H = HG_H.map(i => <path key={`h${i}`} d={HG_PATHS[i]} />);
  const G = HG_G.map(i => <path key={`g${i}`} d={HG_PATHS[i]} />);

  return (
    <svg
      viewBox={`${BX} ${BY} ${BW} ${BH}`}
      style={{ width, height: 'auto', display: 'block', overflow: 'visible',
               fill: color, transition: 'fill 1.1s cubic-bezier(.4,0,.2,1)' }}
      aria-label="Haley & George"
      role="img"
    >
      <defs>
        <clipPath id={`hg-vband-${uid}`}><path d={HG_VBAND} /></clipPath>
        <clipPath id={`hg-notv-${uid}`} clipRule="evenodd">
          <path clipRule="evenodd" d={`${RECT} ${HG_VBAND}`} />
        </clipPath>
        {HG_PHASES.map((_, i) => (
          // a clipPath unions its children, so splitting the sweep across chunk paths
          // is not just cheaper — it also removes any chance of two quads winding
          // against each other and cancelling into a hole
          <clipPath key={i} id={`hg-sweep-${uid}-${i}`}>
            {CHUNKS[i].map((_, c) => (
              <path key={c} ref={el => { chunkRefs.current[i][c] = el; }} d="M 0 0 Z" />
            ))}
          </clipPath>
        ))}
      </defs>
      {HG_PHASES.map((ph, i) => {
        const art = ph.tag === 'B' ? G : H;
        const inner = (
          <g ref={el => { grps.current[i] = el; }} clipPath={`url(#hg-sweep-${uid}-${i})`}>
            {art}
          </g>
        );
        if (ph.tag === 'A') return <g key={i} clipPath={`url(#hg-notv-${uid})`}>{inner}</g>;
        if (ph.tag === 'C') return <g key={i} clipPath={`url(#hg-vband-${uid})`}>{inner}</g>;
        return <g key={i}>{inner}</g>;
      })}
    </svg>
  );
}
