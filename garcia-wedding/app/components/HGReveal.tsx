'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HGDraw from './HGDraw';

const OLIVE = '#AFB885';        // Haley's Olive — the entrance field
const OLIVE_DEEP = '#4E5B37';   // ink: the monogram while it sits on the olive
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
  const [creamInk, setCreamInk] = useState(false);
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

  // The lander owns the monogram while it draws — see LandingPage. This picks it up
  // only at hand-off: one measurement of where it currently sits, then it travels.
  // No per-frame tracking, so there is nothing for a keyboard or a pinch to knock loose.
  useLayoutEffect(() => {
    if (phase !== 'lander') {
      if (!boxRef.current) {
        const b = measure('#lander-hg-slot');
        if (b) setBox(b);
      }
    } else if (boxRef.current) {
      setBox(null);
    }
  }, [phase]);

  // The monogram turns cream once the olive field is up and holds it through the
  // travel, so it's already matching the hero's cream monogram on arrival. Cream on
  // Olive is a soft 2.1:1 — deliberately tonal rather than high-contrast.
  useEffect(() => {
    if (phase === 'lander') { setCreamInk(false); return; }
    const t = setTimeout(() => setCreamInk(true), 420);
    return () => clearTimeout(t);
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
          // Transparent while the lander owns the screen, then opaque INSTANTLY the
          // moment it starts dissolving — so the lander still fades onto solid colour
          // with no cross-fade gap, but nothing full-screen is ever stacked under the
          // lander waiting to show through if anything goes wrong with it.
          opacity: phase === 'lander' || phase === 'reveal' ? 0 : 1,
          transition: phase === 'reveal' ? 'opacity 1.2s cubic-bezier(.22,1,.36,1)' : 'none',
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
        {/* already finished — the drawing happened on the card */}
        <HGDraw color={creamInk ? CREAM : OLIVE_DEEP} width={BASE} draw={false} />
      </div>
    </>
  );
}
