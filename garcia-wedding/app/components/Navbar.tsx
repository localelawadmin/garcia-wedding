'use client';

const LINKS = [
  { label: 'Schedule', href: '#agenda' },
  { label: 'Stay',     href: '#accommodations' },
  { label: 'Travel',   href: '#getting-there' },
  { label: 'Dining',   href: '#things' },
  { label: 'Attire',   href: '#dress' },
  { label: 'FAQ',      href: '#faq' },
];

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(78, 91, 55, 0.62)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(242, 239, 233, 0.12)',
        color: '#FDFDFC',
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
            src="/photos/agenda/haley-and-george.png"
            alt="Haley & George"
            style={{
              height: 52, width: 'auto', display: 'block',
              position: 'relative', zIndex: 1,
            }}
          />
        </a>
        <div style={{ display: 'flex', gap: 26 }} className="nav-links">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                opacity: .85, fontWeight: 400,
                color: '#FDFDFC', textDecoration: 'none',
                transition: 'opacity .25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          :global(.nav-links) { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
