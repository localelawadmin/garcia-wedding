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

export default function HGDraw({
  color = '#FDFDFC',
  width = 260,
  speed = 1.2,
  delay = 0,
  onDone,
}: {
  color?: string;
  width?: number | string;
  speed?: number;
  delay?: number;
  onDone?: () => void;
}) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
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

    const setPhase = (i: number, f: number) => {
      const g = grps.current[i];
      const p = refs.current[i];
      if (!g || !p) return;
      if (f <= 0) { g.style.display = 'none'; return; }
      g.style.display = '';
      const ph = HG_PHASES[i];
      const n = ph.L.length / 2;
      const k = Math.max(2, Math.min(n, Math.round(n * f)));
      let d = '';
      for (let j = 0; j < k - 1; j++) {
        // one quad per step: a single long ribbon self-intersects where the pen
        // doubles back, and the opposite windings cancel into holes
        d += `M ${ph.L[2 * j]} ${ph.L[2 * j + 1]} L ${ph.L[2 * j + 2]} ${ph.L[2 * j + 3]} `
           + `L ${ph.R[2 * j + 2]} ${ph.R[2 * j + 3]} L ${ph.R[2 * j]} ${ph.R[2 * j + 1]} Z`;
      }
      p.setAttribute('d', d || 'M 0 0 Z');
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
  }, [speed, delay]);

  const H = HG_H.map(i => <path key={`h${i}`} d={HG_PATHS[i]} />);
  const G = HG_G.map(i => <path key={`g${i}`} d={HG_PATHS[i]} />);

  return (
    <svg
      viewBox={`${BX} ${BY} ${BW} ${BH}`}
      style={{ width, height: 'auto', display: 'block', overflow: 'visible',
               fill: color, transition: 'fill .7s cubic-bezier(.22,1,.36,1)' }}
      aria-label="Haley & George"
      role="img"
    >
      <defs>
        <clipPath id={`hg-vband-${uid}`}><path d={HG_VBAND} /></clipPath>
        <clipPath id={`hg-notv-${uid}`} clipRule="evenodd">
          <path clipRule="evenodd" d={`${RECT} ${HG_VBAND}`} />
        </clipPath>
        {HG_PHASES.map((_, i) => (
          <clipPath key={i} id={`hg-sweep-${uid}-${i}`}>
            <path ref={el => { refs.current[i] = el; }} d="M 0 0 Z" />
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
