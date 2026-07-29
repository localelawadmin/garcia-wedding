'use client';

import { useState } from 'react';

const LINKS = [
  { label: 'Schedule', href: '#agenda' },
  { label: 'Stay',     href: '#accommodations' },
  { label: 'Travel',   href: '#getting-there' },
  { label: 'Dining',   href: '#things' },
  { label: 'Attire',   href: '#dress' },
  { label: 'FAQ',      href: '#faq' },
];

const CREAM = '#FDFDFC';
const bar: React.CSSProperties = { display: 'block', width: 22, height: 1.5, background: CREAM, borderRadius: 2 };

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(78, 91, 55, 0.62)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(253, 253, 252, 0.12)',
        color: CREAM,
      }}
    >
      <div
        style={{
          maxWidth: 1080, margin: '0 auto',
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <a href="#hero" aria-label="Haley & George — home" style={{ display: 'block', position: 'relative', zIndex: 1 }}>
          <img
            className="nav-logo-full"
            src="/photos/agenda/haley-and-george.png"
            alt="Haley & George"
            style={{ height: 52, width: 'auto', display: 'block', position: 'relative', zIndex: 1 }}
          />
          <img
            className="nav-logo-mark"
            data-hg-target="nav"
            src="/photos/agenda/hg-monogram-cream.png"
            alt="Haley & George"
            style={{ height: 40, width: 'auto', display: 'none', position: 'relative', zIndex: 1 }}
          />
        </a>

        {/* Desktop inline links */}
        <div style={{ display: 'flex', gap: 26 }} className="nav-links">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                opacity: .85, fontWeight: 400, color: CREAM, textDecoration: 'none',
                transition: 'opacity .25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Tablet / mobile hamburger */}
        <button
          type="button"
          className="nav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'none', flexDirection: 'column', justifyContent: 'center',
            gap: 5, width: 34, height: 34, padding: 0,
            background: 'transparent', border: 'none', cursor: 'pointer',
            position: 'relative', zIndex: 2,
          }}
        >
          <span style={{ ...bar, transition: 'transform .3s ease, opacity .3s ease', transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
          <span style={{ ...bar, transition: 'opacity .2s ease', opacity: open ? 0 : 1 }} />
          <span style={{ ...bar, transition: 'transform .3s ease, opacity .3s ease', transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Tablet / mobile dropdown menu */}
      <div
        className="nav-menu"
        style={{
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
          background: 'rgba(78, 91, 55, 0.92)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(253, 253, 252, 0.12)',
          padding: '4px 24px 16px',
        }}
      >
        {LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            style={{
              color: CREAM, textDecoration: 'none',
              fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 400,
              padding: '15px 2px', borderBottom: '1px solid rgba(253, 253, 252, 0.10)',
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      <style jsx>{`
        @media (pointer: coarse), (max-width: 1024px) {
          :global(.nav-links) { display: none !important; }
          :global(.nav-burger) { display: flex !important; }
        }
        @media (pointer: fine) and (min-width: 1025px) {
          :global(.nav-burger) { display: none !important; }
          :global(.nav-menu) { display: none !important; }
        }
        /* Logo swaps to the compact HG monogram on phones only (not tablet) */
        @media (max-width: 600px) {
          :global(.nav-logo-full) { display: none !important; }
          :global(.nav-logo-mark) { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
