'use client';

const LINKS = [
  { label: 'Schedule', href: '#agenda' },
  { label: 'Stay',     href: '#accommodations' },
  { label: 'Travel',   href: '#getting-there' },
  { label: 'Things',   href: '#things' },
  { label: 'Dress',    href: '#dress' },
  { label: 'Registry', href: '#registry' },
  { label: 'FAQ',      href: '#faq' },
];

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '22px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 50,
        mixBlendMode: 'difference',
        color: '#f2efe9',
      }}
    >
      <a
        href="#hero"
        style={{
          fontFamily: "'Montmartre','Cormorant Garamond',Georgia,serif",
          fontStyle: 'italic', fontWeight: 300, fontSize: 26,
          letterSpacing: 0, lineHeight: 1, whiteSpace: 'nowrap',
          color: '#f2efe9', textDecoration: 'none',
        }}
      >
        Haley &amp; George
      </a>
      <div style={{ display: 'flex', gap: 26 }} className="nav-links">
        {LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            style={{
              fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
              opacity: .9, fontWeight: 300, color: '#f2efe9', textDecoration: 'none',
              transition: 'opacity .25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.9'; }}
          >
            {l.label}
          </a>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          :global(.nav-links) { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
