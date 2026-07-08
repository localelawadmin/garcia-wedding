'use client';

import { useEffect, useState } from 'react';

const CREAM = '#FDFDFC';
const DEEP_DARK = '#4E5B37';
const ACCENT = '#c8a96a'; // warm accent for the unread badge — soft gold against blue

export default function NoteFromCouple({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  // Auto-open on first user interaction with the site (desktop only — not mobile)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
      setHasOpenedOnce(true);
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

  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);

  return (
    <div
      role="region"
      aria-label="Note from Haley and George"
      style={{
        position: 'fixed',
        bottom: 156,
        right: 22,
        width: open ? 'min(380px, calc(100vw - 44px))' : 36,
        maxHeight: open ? 600 : 36,
        height: open ? 'auto' : 36,
        borderRadius: open ? 18 : '50%',
        background: 'rgba(78, 91, 55, .65)',
        border: '1px solid rgba(242, 239, 233, .45)',
        color: CREAM,
        backdropFilter: 'blur(14px) saturate(180%)',
        WebkitBackdropFilter: 'blur(14px) saturate(180%)',
        zIndex: 200,
        overflow: 'visible',
        transition: 'width .4s ease, max-height .4s ease, border-radius .4s ease',
      }}
    >
      <div style={{ overflow: 'hidden', borderRadius: open ? 18 : '50%', height: '100%', position: 'relative' }}>
        {/* Closed state — centered envelope icon */}
        <button
          type="button"
          aria-label="Open note from Haley and George"
          onClick={() => setOpen(true)}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', color: 'inherit',
            cursor: 'pointer', padding: 0,
            opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto',
            transition: 'opacity .3s ease',
          }}
        >
          <svg viewBox="0 0 16 16" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
            <rect x="2" y="3.5" width="12" height="9" rx="1" />
            <path d="M2.5 4.5 L8 9 L13.5 4.5" />
          </svg>
        </button>

        {/* Open state — content card */}
        <div style={{
          padding: '24px 24px 22px',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .35s ease',
        }}>
          <button
            type="button"
            aria-label="Close note"
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute', top: 12, right: 12,
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

          <div className="heading" style={{
            fontStyle: 'italic', fontSize: 22, lineHeight: 1, fontWeight: 400,
            marginBottom: 16, paddingRight: 36,
          }}>
            A Note from the Bride and Groom
          </div>

          <p style={{
            fontSize: 13.5, lineHeight: 1.55, margin: '0 0 12px',
            letterSpacing: '-0.005em', fontWeight: 400, color: 'inherit',
          }}>
            Hi! We can&apos;t wait to celebrate with you all in our favorite place!
          </p>
          <p style={{
            fontSize: 13.5, lineHeight: 1.55, margin: '0 0 12px',
            letterSpacing: '-0.005em', fontWeight: 400, color: 'inherit',
          }}>
            Welcome to our wedding website! All of your essential information can be found here - from locations and timing to accommodation options and more. Always feel free to send us an email, text, or call if there&apos;s something that hasn&apos;t been addressed here.
          </p>
          <p style={{
            fontSize: 13.5, lineHeight: 1.55, margin: '0 0 14px',
            letterSpacing: '-0.005em', fontWeight: 400, color: 'inherit',
          }}>
            See you in Cape May!
          </p>

          <div className="heading" style={{
            fontStyle: 'italic', fontSize: 18, lineHeight: 1, marginTop: 4,
          }}>
            — Haley &amp; George
          </div>
        </div>
      </div>

      {/* Pulsing ring while unread */}
      {!open && !hasOpenedOnce && (
        <span aria-hidden="true" style={{
          position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
          border: `2px solid ${ACCENT}`,
          animation: 'note-pulse 2s ease-out infinite',
        }} />
      )}
      {/* iOS-style unread badge — only visible when closed AND never been opened */}
      {!open && !hasOpenedOnce && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: -3, right: -3,
            width: 12, height: 12, borderRadius: '50%',
            background: ACCENT,
            border: `2px solid ${DEEP_DARK}`,
            boxShadow: '0 1px 3px rgba(0,0,0,.25)',
          }}
        />
      )}
    </div>
  );
}
