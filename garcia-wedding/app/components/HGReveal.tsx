'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HGDraw from './HGDraw';

const OLIVE = '#4E5B37';
const CREAM = '#FDFDFC';
const BASE = 200;               // the monogram is rendered at this width, then scaled

type Box = { x: number; y: number; w: number };

/**
 * The monogram is one continuous element across the whole entrance:
 * it draws itself on the lander card, stays put while the page turns olive,
 * then travels to where the hero's monogram sits and hands over to it.
 */
export default function HGReveal({
  phase,
  onArrived,
}: {
  phase: 'lander' | 'green' | 'move' | 'reveal';
  onArrived: () => void;
}) {
  const [box, setBox] = useState<Box | null>(null);
  const boxRef = useRef<Box | null>(null);
  boxRef.current = box;

  const measure = (sel: string): Box | null => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(sel));
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width > 4 && r.height > 4) return { x: r.left, y: r.top, w: r.width };
    }
    return null;
  };

  // Sit over the lander's slot — and keep sitting on it. The card animates in,
  // fonts settle, and mobile browsers resize the viewport as the URL bar hides,
  // so a one-shot measurement drifts. Track it until the monogram starts moving.
  useLayoutEffect(() => {
    if (phase !== 'lander') return;
    let raf = 0;
    const tick = () => {
      const b = measure('#lander-hg-slot');
      const cur = boxRef.current;
      if (b && (!cur || Math.abs(b.x - cur.x) > 0.5 || Math.abs(b.y - cur.y) > 0.5 || Math.abs(b.w - cur.w) > 0.5)) {
        setBox(b);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // travel to the hero's monogram
  useEffect(() => {
    if (phase !== 'move') return;
    const target = measure('[data-hg-target="hero"]') ?? measure('[data-hg-target="nav"]');
    if (target) setBox(target);
    const t = setTimeout(onArrived, 1000);
    return () => clearTimeout(t);
  }, [phase, onArrived]);

  if (!box) return null;
  const scale = box.w / BASE;
  const moving = phase === 'move' || phase === 'reveal';

  return (
    <>
      {/* the olive field rises behind the monogram, which never moves for this beat */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, background: OLIVE, zIndex: 260,
          opacity: phase === 'lander' ? 0 : phase === 'reveal' ? 0 : 1,
          transition: phase === 'reveal'
            ? 'opacity 1.1s cubic-bezier(.22,1,.36,1)'
            : 'opacity 1.35s cubic-bezier(.4,0,.2,1)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', left: 0, top: 0, zIndex: 320,
          transform: `translate(${box.x}px, ${box.y}px) scale(${scale})`,
          transformOrigin: 'top left',
          transition: moving ? 'transform 1s cubic-bezier(.6,0,.2,1)' : 'none',
          opacity: phase === 'reveal' ? 0 : 1,
          // fade out only once the hero's own monogram is under it
          transitionProperty: moving ? 'transform, opacity' : 'opacity',
          transitionDuration: moving ? '1s, .5s' : '.5s',
          transitionDelay: phase === 'reveal' ? '0s, .35s' : '0s',
          pointerEvents: 'none',
        }}
      >
        <HGDraw
          color={phase === 'lander' ? '#4E5B37' : CREAM}
          width={BASE}
          speed={1.2}
          delay={420}
        />
      </div>
    </>
  );
}
