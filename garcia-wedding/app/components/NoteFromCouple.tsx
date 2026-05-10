'use client';

import { useEffect, useState } from 'react';

const CREAM = '#f2efe9';
const DEEP_DARK = '#4c647a';

export default function NoteFromCouple() {
  const [open, setOpen] = useState(false);

  // Auto-open on first user interaction with the site (post-password)
  useEffect(() => {
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
      cleanup();
    };
    const cleanup = () => {
      document.removeEventListener('pointerdown', fire);
      document.removeEventListener('wheel', fire);
      document.removeEventListener('touchstart', fire);
      document.removeEventListener('keydown', fire);
      document.removeEventListener('scroll', fire, true);
    };
    document.addEventListener('pointerdown', fire);
    document.addEventListener('wheel', fire);
    document.addEventListener('touchstart', fire);
    document.addEventListener('keydown', fire);
    document.addEventListener('scroll', fire, true);
    return () => cleanup();
  }, []);

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 190,
    right: 22,
    width: open ? 'min(360px, calc(100vw - 44px))' : 36,
    maxHeight: open ? 600 : 36,
    height: open ? 'auto' : 36,
    borderRadius: open ? 18 : '50%',
    background: 'rgba(76, 100, 122, .85)',
    border: '1px solid rgba(242, 239, 233, .45)',
    color: CREAM,
    backdropFilter: 'blur(14px) saturate(180%)',
    WebkitBackdropFilter: 'blur(14px) saturate(180%)',
    zIndex: 200,
    overflow: 'hidden',
    transition: 'width .4s ease, max-height .4s ease, border-radius .4s ease',
  };

  return (
    <div style={baseStyle} role="region" aria-label="Note from Haley and George">
      {/* Closed-state icon button */}
      <button
        type="button"
        aria-label="Open note from Haley and George"
        onClick={() => setOpen(true)}
        style={{
          position: 'absolute', top: 0, left: 0, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', color: 'inherit',
          cursor: 'pointer', padding: 0,
          opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto',
          transition: 'opacity .3s ease',
        }}
      >
        <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="12" height="10" rx="1" />
          <path d="M2 4 L8 9 L14 4" />
        </svg>
      </button>

      {/* Open-state content */}
      <div style={{
        padding: '22px 22px 22px',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .35s ease',
        position: 'relative',
      }}>
        <button
          type="button"
          aria-label="Close note"
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute', top: 10, right: 12,
            width: 22, height: 22, borderRadius: '50%',
            background: 'transparent', color: 'inherit',
            border: '1px solid rgba(242,239,233,.45)',
            cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .25s, color .25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = DEEP_DARK; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; }}
        >
          <svg viewBox="0 0 12 12" width={9} height={9} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
            <path d="M3 3 L9 9 M9 3 L3 9" />
          </svg>
        </button>

        <div style={{
          fontSize: 9.5, letterSpacing: '0.35em', textTransform: 'uppercase',
          opacity: .7, marginBottom: 14, paddingRight: 30, fontWeight: 400,
        }}>
          A Note from the Bride and Groom
        </div>

        <p style={{
          fontSize: 13, lineHeight: 1.55, margin: '0 0 14px',
          letterSpacing: '-0.005em', fontWeight: 400, color: 'inherit',
        }}>
          Hey, we can&apos;t wait to celebrate with you all! Thanks for checking out our wedding website. All of your essential information is here — from locations and timing, to accommodation options, and more. Take a look, and always feel free to drop us an email, text, or call if there&apos;s something that hasn&apos;t been addressed here. See you in Cape May!
        </p>

        <div className="heading" style={{
          fontStyle: 'italic', fontSize: 18, lineHeight: 1, marginTop: 6,
        }}>
          — Haley &amp; George
        </div>
      </div>
    </div>
  );
}
