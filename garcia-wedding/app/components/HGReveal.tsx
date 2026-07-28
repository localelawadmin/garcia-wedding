'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HGDraw from './HGDraw';
import { LANDER_WAVY_INNER } from './LandingPage';

const OLIVE = '#4E5B37';
const CREAM = '#FDFDFC';
const BASE = 200;               // the monogram is rendered at this width, then scaled

type Box = { x: number; y: number; w: number };
type Rect = { x: number; y: number; w: number; h: number };

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
  const [card, setCard] = useState<Rect | null>(null);
  const cardRef = useRef<Rect | null>(null);
  cardRef.current = card;
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
      // the card's own frame too, so its outline can outlive the card itself
      const el = document.querySelector<HTMLElement>('#lander-card-slot');
      if (el) {
        const r = el.getBoundingClientRect();
        const cc = cardRef.current;
        if (r.width > 4 && (!cc || Math.abs(r.left - cc.x) > 0.5 || Math.abs(r.top - cc.y) > 0.5 || Math.abs(r.width - cc.w) > 0.5)) {
          setCard({ x: r.left, y: r.top, w: r.width, h: r.height });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // the card is still fading for a beat after the password, and cream ink on the
  // cream card would vanish — hold olive until the olive field is actually showing
  useEffect(() => {
    if (phase === 'lander') { setCreamInk(false); return; }
    const t = setTimeout(() => setCreamInk(true), 480);
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
      {/* The card dissolves, but a copy of its blue outline is held at full strength
          underneath — so the shape stays while the photos and copy go. It leaves
          quickly, and only once the monogram starts travelling. */}
      {card && phase !== 'lander' && (
        <svg
          viewBox="0 0 480 600"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: 'fixed', left: card.x, top: card.y, width: card.w, height: card.h,
            zIndex: 300, pointerEvents: 'none',
            opacity: phase === 'green' ? 1 : 0,
            transition: 'opacity .34s ease',
          }}
        >
          <path d={LANDER_WAVY_INNER} fill="none" stroke="#DEE9F2" strokeWidth={3} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
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
          color={creamInk ? CREAM : '#4E5B37'}
          width={BASE}
          speed={1.2}
          delay={420}
        />
      </div>
    </>
  );
}
