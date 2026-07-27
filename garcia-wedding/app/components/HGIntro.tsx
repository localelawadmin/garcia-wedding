'use client';

import { useEffect, useState } from 'react';
import HGDraw from './HGDraw';

const OLIVE = '#4E5B37';   // the menu bar's colour, solid
const CREAM = '#FDFDFC';

/**
 * The reveal after the password: a solid olive field, the monogram draws itself,
 * then the whole panel lifts away and the site fades up underneath.
 */
export default function HGIntro({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: OLIVE,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: leaving ? 0 : 1,
        transition: 'opacity .85s cubic-bezier(.22,1,.36,1)',
        pointerEvents: leaving ? 'none' : 'auto',
      }}
    >
      <HGDraw
        color={CREAM}
        width="min(300px, 58vw)"
        speed={1.2}
        delay={520}
        onDone={() => setTimeout(() => setLeaving(true), 620)}
      />
    </div>
  );
}
