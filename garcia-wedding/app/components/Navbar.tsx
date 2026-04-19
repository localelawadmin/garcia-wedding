'use client';

// garcia-wedding/app/components/Navbar.tsx
// Top navigation bar shown on the main WeddingSite (after authentication).
// Uses GarciaLogo — NOTE: do NOT pass a 'color' prop to GarciaLogo, it no longer accepts one.

import GarciaLogo from './GarciaLogo';

const NAV_LINKS = [
  { label: 'Schedule', href: '#schedule' },
  { label: 'Travel', href: '#travel' },
  { label: 'Wedding Party', href: '#wedding-party' },
  { label: 'Things To Do', href: '#things-to-do' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Registry', href: '#registry' },
];

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(26,39,68,0.08)',
      }}
    >
      <GarciaLogo width={120} height={48} />
      <div style={{ display: 'flex', gap: 32 }}>
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: "'Helvetica Now Display','Arial Narrow','Helvetica Neue',sans-serif",
              fontStretch: 'condensed',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#1A2744',
              textDecoration: 'none',
              opacity: 0.8,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
