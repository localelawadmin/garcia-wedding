'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';

const HG = '/photos/agenda/hg.png';
const HERO_PHOTO = '/photos/hero-beach.jpg';

const ICON = {
  pier:    '/photos/agenda/pier-house.png',
  osos:    '/photos/agenda/osos.png',
  tent:    '/photos/agenda/reception-tent.png',
  carneys: '/photos/agenda/carneys.png',
  beach:   '/photos/agenda/beach.png',
};

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")";

const CREAM = '#f2efe9';
const DEEP = '#6a857f';
const DEEP_DARK = '#3f5953';

// Stripe backgrounds for sections (vertical, 28px dominant + 12px accent)
const stripeCream = `repeating-linear-gradient(90deg, ${CREAM} 0 28px, ${DEEP} 28px 40px)`;
const stripeInk   = `repeating-linear-gradient(90deg, ${DEEP} 0 28px, ${CREAM} 28px 40px)`;

// Wavy oval path for the invite section (generated from sin-wave perimeter)
const WAVY_PATH = "M 780.00 240.00 L 783.49 245.83 L 786.47 251.78 L 788.70 257.82 L 789.98 263.90 L 790.16 269.98 L 789.15 275.98 L 786.93 281.85 L 783.56 287.54 L 779.13 293.01 L 773.81 298.23 L 767.83 303.22 L 761.40 307.98 L 754.79 312.57 L 748.23 317.05 L 741.93 321.48 L 736.07 325.96 L 730.78 330.55 L 726.11 335.34 L 722.07 340.37 L 718.59 345.67 L 715.56 351.26 L 712.82 357.10 L 710.18 363.14 L 707.43 369.31 L 704.35 375.50 L 700.76 381.60 L 696.48 387.47 L 691.41 393.00 L 685.45 398.09 L 678.60 402.63 L 670.88 406.59 L 662.38 409.93 L 653.22 412.67 L 643.55 414.86 L 633.54 416.59 L 623.36 417.98 L 613.18 419.17 L 603.15 420.31 L 593.38 421.55 L 583.94 423.03 L 574.87 424.85 L 566.16 427.11 L 557.77 429.85 L 549.63 433.07 L 541.63 436.72 L 533.67 440.72 L 525.64 444.94 L 517.43 449.23 L 508.95 453.42 L 500.16 457.33 L 491.02 460.80 L 481.53 463.66 L 471.71 465.81 L 461.64 467.17 L 451.37 467.69 L 440.99 467.41 L 430.59 466.37 L 420.25 464.69 L 410.04 462.51 L 400.00 460.00 L 390.15 457.34 L 380.48 454.71 L 370.96 452.27 L 361.55 450.18 L 352.17 448.54 L 342.74 447.41 L 333.21 446.82 L 323.51 446.72 L 313.60 447.05 L 303.46 447.67 L 293.10 448.46 L 282.57 449.23 L 271.94 449.82 L 261.31 450.06 L 250.79 449.79 L 240.51 448.89 L 230.58 447.29 L 221.13 444.93 L 212.23 441.83 L 203.94 438.03 L 196.28 433.61 L 189.22 428.70 L 182.71 423.44 L 176.64 417.98 L 170.88 412.48 L 165.26 407.09 L 159.64 401.91 L 153.84 397.06 L 147.73 392.58 L 141.20 388.49 L 134.17 384.79 L 126.62 381.41 L 118.57 378.29 L 110.12 375.30 L 101.40 372.35 L 92.57 369.31 L 83.85 366.08 L 75.43 362.54 L 67.56 358.64 L 60.41 354.33 L 54.17 349.58 L 48.94 344.42 L 44.81 338.87 L 41.78 333.00 L 39.78 326.90 L 38.70 320.63 L 38.38 314.30 L 38.60 307.98 L 39.12 301.75 L 39.71 295.65 L 40.13 289.71 L 40.16 283.94 L 39.66 278.33 L 38.51 272.85 L 36.66 267.45 L 34.14 262.09 L 31.04 256.71 L 27.51 251.25 L 23.75 245.69 L 20.00 240.00 L 16.51 234.17 L 13.53 228.22 L 11.30 222.18 L 10.02 216.10 L 9.84 210.02 L 10.85 204.02 L 13.07 198.15 L 16.44 192.46 L 20.87 186.99 L 26.19 181.77 L 32.17 176.78 L 38.60 172.02 L 45.21 167.43 L 51.77 162.95 L 58.07 158.52 L 63.93 154.04 L 69.22 149.45 L 73.89 144.66 L 77.93 139.63 L 81.41 134.33 L 84.44 128.74 L 87.18 122.90 L 89.82 116.86 L 92.57 110.69 L 95.65 104.50 L 99.24 98.40 L 103.52 92.53 L 108.59 87.00 L 114.55 81.91 L 121.40 77.37 L 129.12 73.41 L 137.62 70.07 L 146.78 67.33 L 156.45 65.14 L 166.46 63.41 L 176.64 62.02 L 186.82 60.83 L 196.85 59.69 L 206.62 58.45 L 216.06 56.97 L 225.13 55.15 L 233.84 52.89 L 242.23 50.15 L 250.37 46.93 L 258.37 43.28 L 266.33 39.28 L 274.36 35.06 L 282.57 30.77 L 291.05 26.58 L 299.84 22.67 L 308.98 19.20 L 318.47 16.34 L 328.29 14.19 L 338.36 12.83 L 348.63 12.31 L 359.01 12.59 L 369.41 13.63 L 379.75 15.31 L 389.96 17.49 L 400.00 20.00 L 409.85 22.66 L 419.52 25.29 L 429.04 27.73 L 438.45 29.82 L 447.83 31.46 L 457.26 32.59 L 466.79 33.18 L 476.49 33.28 L 486.40 32.95 L 496.54 32.33 L 506.90 31.54 L 517.43 30.77 L 528.06 30.18 L 538.69 29.94 L 549.21 30.21 L 559.49 31.11 L 569.42 32.71 L 578.87 35.07 L 587.77 38.17 L 596.06 41.97 L 603.72 46.39 L 610.78 51.30 L 617.29 56.56 L 623.36 62.02 L 629.12 67.52 L 634.74 72.91 L 640.36 78.09 L 646.16 82.94 L 652.27 87.42 L 658.80 91.51 L 665.83 95.21 L 673.38 98.59 L 681.43 101.71 L 689.88 104.70 L 698.60 107.65 L 707.43 110.69 L 716.15 113.92 L 724.57 117.46 L 732.44 121.36 L 739.59 125.67 L 745.83 130.42 L 751.06 135.58 L 755.19 141.13 L 758.22 147.00 L 760.22 153.10 L 761.30 159.37 L 761.62 165.70 L 761.40 172.02 L 760.88 178.25 L 760.29 184.35 L 759.87 190.29 L 759.84 196.06 L 760.34 201.67 L 761.49 207.15 L 763.34 212.55 L 765.86 217.91 L 768.96 223.29 L 772.49 228.75 L 776.25 234.31 Z";

type Tone = 'cream' | 'ink';

const SectionShell: React.FC<{
  id?: string; tone: Tone; children: React.ReactNode;
  wide?: boolean; foot?: React.ReactNode;
}> = ({ id, tone, children, wide, foot }) => {
  const sectionBg  = tone === 'cream' ? stripeCream : stripeInk;
  const boxBg      = tone === 'cream' ? CREAM : DEEP_DARK;
  const fg         = tone === 'cream' ? DEEP_DARK : CREAM;
  const maxW       = wide ? 1080 : 720;
  return (
    <section
      id={id}
      style={{
        minHeight: '100vh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        padding: '110px 24px 70px',
        background: sectionBg, color: fg,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{
        maxWidth: maxW, margin: '0 auto', width: '100%',
        background: boxBg,
        padding: 'clamp(48px, 6vw, 72px) clamp(32px, 5vw, 56px)',
      }}>
        {children}
      </div>
      {foot && (
        <div style={{
          position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center',
          fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase',
          opacity: .45,
        }}>{foot}</div>
      )}
    </section>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase',
    opacity: .55, marginBottom: 14, fontWeight: 400,
  }}>{children}</div>
);

const NumEyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="heading" style={{
    fontSize: 16, letterSpacing: '0.02em', opacity: .65, marginBottom: 10, fontWeight: 400,
  }}>{children}</div>
);

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="heading" style={{
    fontSize: 'clamp(64px, 8vw, 110px)', lineHeight: 0.8,
    margin: '0 0 32px', letterSpacing: '-0.005em', paddingTop: '0.12em',
  }}>{children}</h2>
);

const Lede: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontSize: 16, lineHeight: 1.55, maxWidth: 560, opacity: .8,
    margin: '0 0 28px', fontWeight: 400, letterSpacing: '-0.005em',
  }}>{children}</p>
);

const Icon: React.FC<{ src: string; size?: number; tone: Tone }> = ({ src, size = 96, tone }) => (
  <img
    src={src}
    alt=""
    style={{
      width: size, height: size, objectFit: 'contain', display: 'block',
      filter: tone === 'cream' ? 'url(#tint-deep-dark)' : 'url(#tint-cream)',
    }}
  />
);


const EVENT_DATA: Record<string, { summary: string; start: string; end: string; location: string; description: string }> = {
  welcome:    { summary: 'Welcome Drinks — Haley & George', start: '20270618T000000Z', end: '20270618T020000Z', location: 'The Pier House at La Mer Beachfront Resort, 1317 Beach Avenue, Cape May, NJ', description: 'Welcome to Cape May — come grab a drink with us before the weekend takes off.' },
  ceremony:   { summary: 'Wedding Ceremony — Haley & George', start: '20270618T180000Z', end: '20270618T193000Z', location: 'Our Lady Star of the Sea, 525 Washington Street, Cape May, NJ', description: 'Mass starts promptly. Please arrive 15-30 minutes early.' },
  reception:  { summary: 'Wedding Reception — Haley & George', start: '20270618T210000Z', end: '20270619T020000Z', location: 'Isaac Smith Vineyard, 1039 Seashore Road, Cape May, NJ', description: '' },
  afterparty: { summary: 'After Party — Haley & George', start: '20270619T023000Z', end: '20270619T060000Z', location: "Carney's Restaurant & Bar, 411 Beach Ave, Cape May, NJ", description: '' },
  beach:      { summary: 'Beach Day — Haley & George', start: '20270619T140000Z', end: '20270619T180000Z', location: 'Cape May Beach, Cape May, NJ', description: 'Stop by the beach on your way out to say goodbye to the new Mr. and Mrs. Garcia — or stay the weekend.' },
};

function downloadICS(id: string) {
  const ev = EVENT_DATA[id]; if (!ev) return;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Garcia Wedding//EN','BEGIN:VEVENT',
    'UID:' + id + '@garcia-wedding',
    'DTSTAMP:' + stamp,
    'DTSTART:' + ev.start, 'DTEND:' + ev.end,
    'SUMMARY:' + ev.summary,
    'LOCATION:' + ev.location.replace(/,/g, '\\,'),
    'DESCRIPTION:' + ev.description.replace(/,/g, '\\,'),
    'END:VEVENT','END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = id + '.ics';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

const EventActions: React.FC<{ calId: string; mapQuery: string; tone: Tone }> = ({ calId, mapQuery, tone }) => {
  const hoverBg = tone === 'cream' ? DEEP_DARK : CREAM;
  const hoverFg = tone === 'cream' ? CREAM : DEEP_DARK;
  const baseStyle: React.CSSProperties = {
    width: 36, height: 36, borderRadius: '50%',
    border: '1px solid currentColor', background: 'transparent',
    color: 'inherit', cursor: 'pointer', padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background .25s, color .25s',
    textDecoration: 'none',
  };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverFg; };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; };
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
      <button type="button" aria-label="Add to calendar" title="Add to calendar"
        onClick={() => downloadICS(calId)}
        onMouseEnter={onEnter} onMouseLeave={onLeave}
        style={baseStyle}
      >
        <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round">
          <rect x="1.5" y="3" width="9" height="9" rx="1" />
          <line x1="1.5" y1="5.5" x2="10.5" y2="5.5" />
          <line x1="3.5" y1="2" x2="3.5" y2="4" />
          <line x1="8.5" y1="2" x2="8.5" y2="4" />
          <line x1="13" y1="11" x2="13" y2="14" strokeWidth={1.4} />
          <line x1="11.5" y1="12.5" x2="14.5" y2="12.5" strokeWidth={1.4} />
        </svg>
      </button>
      <a target="_blank" rel="noopener noreferrer"
        href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
        aria-label="Open in maps" title="Open in maps"
        onMouseEnter={onEnter} onMouseLeave={onLeave}
        style={baseStyle}
      >
        <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 1.5 C5 1.5 3 3.5 3 6 C3 9 8 14 8 14 S13 9 13 6 C13 3.5 11 1.5 8 1.5 Z" />
          <circle cx="8" cy="6" r="1.5" />
        </svg>
      </a>
    </div>
  );
};

const EventSection: React.FC<{
  id: string; tone: Tone; eyebrow: string; name: string; iconSrc: string;
  rows: Array<[string, string]>; foot?: string;
  calId: string; mapQuery: string;
}> = ({ id, tone, eyebrow, name, iconSrc, rows, foot, calId, mapQuery }) => (
  <SectionShell id={id} tone={tone} foot={foot}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'center',
    }} className="event-grid">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon src={iconSrc} size={220} tone={tone} />
      </div>
      <div>
        <h3 className="heading" style={{
          fontSize: 'clamp(64px, 8vw, 110px)', lineHeight: 0.8,
          margin: '0 0 26px', letterSpacing: '-0.005em', paddingTop: '0.12em',
        }}>{name}</h3>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16,
          paddingTop: 22, borderTop: '1px solid currentColor',
        }}>
          {rows.map(([k, v]) => (
            <div key={k} style={{
              display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16,
              fontSize: 15, letterSpacing: '-0.005em', lineHeight: 1.45, fontWeight: 400,
            }}>
              <div style={{
                textTransform: 'uppercase', opacity: .5, letterSpacing: '0.3em',
                fontSize: 10, fontWeight: 400, paddingTop: 4,
              }}>{k}</div>
              <div>{v}</div>
            </div>
          ))}
        </div>
        <EventActions calId={calId} mapQuery={mapQuery} tone={tone} />
      </div>
    </div>
    <style jsx>{`
      @media (max-width: 768px) { :global(.event-grid) { grid-template-columns: 1fr !important; gap: 24px !important; } }
    `}</style>
  </SectionShell>
);

const Tile: React.FC<{ heading: string; body: string }> = ({ heading, body }) => (
  <div style={{ padding: 26, border: '1px solid currentColor' }}>
    <h3 className="heading" style={{ fontSize: 22, margin: '0 0 12px', fontWeight: 400 }}>{heading}</h3>
    <p style={{ fontSize: 15, lineHeight: 1.5, opacity: .8, fontWeight: 400, letterSpacing: '-0.005em', margin: 0 }}>{body}</p>
  </div>
);

const FaqRow: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid currentColor' }}>
      <button
        onClick={() => setOpen(o => !o)}
        type="button"
        style={{
          width: '100%', padding: '20px 0', textAlign: 'left',
          background: 'transparent', border: 'none', color: 'inherit',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          font: 'inherit',
        }}
      >
        <span style={{ fontSize: 16, letterSpacing: '-0.005em', fontWeight: 400, lineHeight: 1.4, paddingRight: 16 }}>{q}</span>
        <span style={{ width: 22, height: 22, position: 'relative', flexShrink: 0, opacity: .85 }}>
          <span style={{
            position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
            background: 'currentColor', transform: 'translateY(-50%)',
          }} />
          <span style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
            background: 'currentColor', transform: `translateX(-50%) ${open ? 'rotate(90deg)' : 'rotate(0deg)'}`,
            transformOrigin: 'center', transition: 'transform .3s ease, opacity .3s ease',
            opacity: open ? 0 : 1,
          }} />
        </span>
      </button>
      <div style={{
        maxHeight: open ? 240 : 0, overflow: 'hidden',
        transition: 'max-height .35s ease, opacity .35s ease, padding .35s ease',
        opacity: open ? 1 : 0, paddingBottom: open ? 20 : 0,
      }}>
        <p style={{ fontSize: 15, lineHeight: 1.55, opacity: .8, margin: 0, maxWidth: 580, fontWeight: 400, letterSpacing: '-0.005em' }}>{a}</p>
      </div>
    </div>
  );
};

// Welcome Drinks target time: Jun 17, 2027 8:00 PM ET (EDT, UTC-4)
const COUNTDOWN_TARGET = new Date('2027-06-17T20:00:00-04:00').getTime();

export default function WeddingSite() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > window.innerHeight * 0.6);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const diff = COUNTDOWN_TARGET - Date.now();
      setDays(Math.max(0, Math.ceil(diff / 86400000)));
    };
    tick();
    const id = setInterval(tick, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTop = () => scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      ref={scrollerRef}
      style={{
        position: 'fixed', inset: 0,
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        background: CREAM,
      }}
    >
      {/* Hidden SVG filter defs for line-art alpha colorization */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="tint-deep-dark" colorInterpolationFilters="sRGB">
            <feFlood floodColor={DEEP_DARK} />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
          <filter id="tint-cream" colorInterpolationFilters="sRGB">
            <feFlood floodColor={CREAM} />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
      </svg>

      <Navbar />
      <MusicPlayer />

      {/* Countdown pill */}
      <div
        style={{
          position: 'fixed', bottom: 78, right: 22,
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '4px 22px 10px',
          background: 'rgba(0,0,0,.5)', border: '1px solid rgba(242,239,233,.35)',
          borderRadius: 999, color: CREAM,
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          zIndex: 200,
          fontFamily: "'Montmartre','Cormorant Garamond',Georgia,serif",
          fontStyle: 'italic', fontWeight: 400, lineHeight: 1,
          WebkitTextStroke: '0.4px currentColor',
        }}
        aria-label="Countdown to Welcome Drinks"
      >
        <span style={{ fontSize: 18 }}>{days ?? '—'}</span>
        <span style={{ fontSize: 14, opacity: .9 }}>days to go!</span>
      </div>

      {/* Back-to-top */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        type="button"
        style={{
          position: 'fixed', bottom: 134, right: 22,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(0,0,0,.5)', color: CREAM,
          border: '1px solid rgba(242,239,233,.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer', padding: 0, zIndex: 200,
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? 'auto' : 'none',
          transition: 'opacity .35s ease, background .25s ease, color .25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#0a0a0a'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,.5)'; e.currentTarget.style.color = CREAM; }}
      >
        <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      {/* HERO */}
      <section
        id="hero"
        style={{
          minHeight: '100vh', scrollSnapAlign: 'start', scrollSnapStop: 'always',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <img
          src={HERO_PHOTO}
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 40%',
            filter: 'saturate(.5) brightness(.88) contrast(1.04)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,.35) 0%, rgba(0,0,0,.05) 40%, rgba(0,0,0,.55) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity: .18, mixBlendMode: 'overlay',
          backgroundImage: GRAIN_SVG,
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(40px, 12vw, 180px)',
          color: CREAM,
        }}>
          <img
            src={HG}
            alt="Haley & George"
            style={{
              width: 130, height: 'auto', display: 'block',
              filter: 'brightness(0) invert(.95)',
            }}
          />
          <div style={{
            textAlign: 'right',
            fontFamily: "'Inter Tight', -apple-system, sans-serif",
            fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
            fontWeight: 400, lineHeight: 1.5,
          }}>
            <span style={{ display: 'block' }}>Cape May,</span>
            <span style={{ display: 'block' }}>June 2027</span>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          color: CREAM,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', opacity: .8, fontWeight: 400 }}>
            Scroll
          </div>
          <div className="scroll-bob" style={{ width: 1, height: 40, background: CREAM, opacity: .55 }} />
        </div>
      </section>

      {/* INVITE — wavy oval card on striped cream section */}
      <section
        id="invite"
        style={{
          minHeight: '100vh', scrollSnapAlign: 'start', scrollSnapStop: 'always',
          background: stripeCream, color: DEEP_DARK,
          padding: '110px 24px 70px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'relative', width: '100%', maxWidth: 760,
          aspectRatio: '800 / 480',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg
            viewBox="0 0 800 480"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <path d={WAVY_PATH} fill={CREAM} stroke={DEEP_DARK} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </svg>
          <div style={{
            position: 'relative', zIndex: 1,
            padding: '0 clamp(48px, 8vw, 96px)',
            textAlign: 'center', width: '100%',
          }}>
            <h2 className="heading" style={{
              fontSize: 'clamp(40px, 5.5vw, 68px)', lineHeight: 1,
              margin: 0, letterSpacing: '-0.005em', paddingTop: '0.12em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
              whiteSpace: 'nowrap',
            }}>
              <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: .3, maxWidth: 32 }} aria-hidden="true" />
              Meet us in Cape May!
              <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: .3, maxWidth: 32 }} aria-hidden="true" />
            </h2>
            <div style={{
              fontSize: 18, letterSpacing: '0.4em', textTransform: 'uppercase',
              fontWeight: 400, marginTop: 24, opacity: .8,
            }}>
              June 17–19, 2027
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <SectionShell id="agenda" tone="cream" wide foot="↓ scroll for each event">
        <NumEyebrow>No. 01</NumEyebrow>
        <Title>The Agenda</Title>
        <Lede>Three days in Cape May. Here&apos;s the shape of it — each event has its own page below.</Lede>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28, marginTop: 28 }} className="agenda-grid">
          {[
            { src: ICON.pier,    name: 'Welcome',     meta: ['Thu · 8 PM', 'La Mer'] },
            { src: ICON.osos,    name: 'Ceremony',    meta: ['Fri · 2 PM', 'Star of the Sea'] },
            { src: ICON.tent,    name: 'Reception',   meta: ['Fri · 5 PM', 'Isaac Smith'] },
            { src: ICON.carneys, name: 'After Party', meta: ['Fri · 10:30', "Carney's"] },
            { src: ICON.beach,   name: 'Beach Day',   meta: ['Sat · 10 AM', 'Cape May'] },
          ].map(card => (
            <div key={card.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
            }}>
              <Icon src={card.src} size={96} tone="cream" />
              <div className="heading" style={{ fontSize: 20, fontWeight: 400 }}>{card.name}</div>
              <div style={{
                fontSize: 10, letterSpacing: '0.14em', opacity: .65,
                lineHeight: 1.5, fontWeight: 400, textTransform: 'uppercase',
              }}>
                {card.meta[0]}<br />{card.meta[1]}
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <EventSection calId="welcome" mapQuery="The+Pier+House+at+La+Mer+Beachfront+Resort+1317+Beach+Avenue+Cape+May+NJ" id="welcome" tone="ink" eyebrow="Thursday · June 17"
        name="Welcome Drinks" iconSrc={ICON.pier}
        rows={[
          ['Time',   '8:00 — 10:00 PM'],
          ['Place',  'The Pier House at La Mer Beachfront Resort'],
          ['Attire', 'Summer Cocktail'],
          ['Note',   'Welcome to Cape May — come grab a drink with us before the weekend takes off.'],
        ]} foot="No. 02 / Welcome Drinks" />

      <EventSection calId="ceremony" mapQuery="Our+Lady+Star+of+the+Sea+525+Washington+Street+Cape+May+NJ" id="ceremony" tone="cream" eyebrow="Friday · June 18"
        name="Ceremony" iconSrc={ICON.osos}
        rows={[
          ['Time',    '2:00 PM'],
          ['Place',   'Our Lady Star of the Sea'],
          ['Address', '525 Washington Street, Cape May, NJ'],
          ['Note',    'Mass starts promptly. Please arrive 15–30 minutes early.'],
        ]} foot="No. 03 / Ceremony" />

      <EventSection calId="reception" mapQuery="Isaac+Smith+Vineyard+1039+Seashore+Road+Cape+May+NJ" id="reception" tone="ink" eyebrow="Friday · June 18"
        name="Reception" iconSrc={ICON.tent}
        rows={[
          ['Time',    '5:00 — 10:00 PM'],
          ['Place',   'Isaac Smith Vineyard'],
          ['Address', '1039 Seashore Road, Cape May, NJ'],
        ]} foot="No. 04 / Reception" />

      <EventSection calId="afterparty" mapQuery="Carneys+Restaurant+Bar+411+Beach+Ave+Cape+May+NJ" id="afterparty" tone="cream" eyebrow="Friday · June 18"
        name="After Party" iconSrc={ICON.carneys}
        rows={[
          ['Time',    '10:30 PM — 2:00 AM'],
          ['Place',   "Carney's Restaurant & Bar"],
          ['Address', '411 Beach Ave, Cape May, NJ'],
        ]} foot="No. 05 / After Party" />

      <EventSection calId="beach" mapQuery="Cape+May+Beach+NJ" id="beach" tone="ink" eyebrow="Saturday · June 19"
        name="Beach Day" iconSrc={ICON.beach}
        rows={[
          ['Time', '10 AM onward'],
          ['Note', 'Stop by the beach on your way out to say goodbye to the new Mr. and Mrs. Garcia — or stay the weekend.'],
        ]} foot="No. 06 / Beach Day" />

      <SectionShell id="accommodations" tone="cream" foot="More options on FAQ ↓">
        <NumEyebrow>No. 07</NumEyebrow>
        <Title>The Accommodations</Title>
        <Lede>A few places we&apos;ve reserved blocks at, plus options for stays nearby.</Lede>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="pair-grid">
          <Tile heading="La Mer Beachfront Resort" body="1317 Beach Avenue. This is also where Welcome Drinks are happening." />
          <Tile heading="Hotel Macomber"           body="Beachfront classic, walking distance to the church and town." />
        </div>
      </SectionShell>

      <SectionShell id="getting-there" tone="ink">
        <NumEyebrow>No. 08</NumEyebrow>
        <Title>Getting There</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 8 }} className="pair-grid">
          <Tile heading="By Car"      body="Cape May is at the southern tip of NJ. ~2.5 hrs from NYC, ~1.75 hrs from Philly. Garden State Parkway south to Exit 0." />
          <Tile heading="By Air"      body="Closest airports: ACY (45 min), PHL (90 min), EWR (~3 hrs). Rentals recommended." />
          <Tile heading="By Ferry"    body="Cape May–Lewes Ferry from Delaware. Walk-on or drive-on." />
          <Tile heading="Around Town" body="Walkable downtown. Trolleys, bikes, and Uber operate locally." />
        </div>
      </SectionShell>

      <SectionShell id="things" tone="cream">
        <NumEyebrow>No. 09</NumEyebrow>
        <Title>Things to Do</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="things-grid">
          {[
            ['Eat',   'The Ebbitt Room · The Lobster House · Mad Batter'],
            ['Drink', 'Cape May Brewing Co · Hawk Haven Vineyard'],
            ['Beach', 'Sunset Beach for the cement ship at golden hour'],
            ['Walk',  'Washington Street Mall · Victorian district'],
            ['Light', 'Cape May Lighthouse — climb if you’re up for it'],
            ['Sail',  'Whale & dolphin tours from the harbor'],
          ].map(([k, v]) => (
            <div key={k} style={{
              fontSize: 15, lineHeight: 1.5, padding: 22,
              border: '1px solid currentColor', opacity: .9,
              fontWeight: 400, letterSpacing: '-0.005em',
            }}>
              <strong className="heading" style={{
                display: 'block', fontSize: 20, opacity: .85, marginBottom: 8, fontWeight: 400,
              }}>{k}</strong>
              {v}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="dress" tone="ink">
        <NumEyebrow>No. 10</NumEyebrow>
        <Title>The Dress Code</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="pair-grid">
          <Tile heading="Welcome Drinks"        body="Summer cocktail. Linen, light dresses, loafers welcome." />
          <Tile heading="Ceremony & Reception" body="Black tie optional. Florals, cream, and ivory are encouraged but not required." />
        </div>
      </SectionShell>

      <SectionShell id="registry" tone="cream">
        <NumEyebrow>No. 11</NumEyebrow>
        <Title>Registry</Title>
        <Lede>Your presence is the gift. If you&apos;d like to celebrate further, we&apos;ve put a few things together.</Lede>
        <div style={{
          display: 'inline-flex', padding: '14px 36px', border: '1px solid currentColor',
          fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
          cursor: 'pointer', marginTop: 16, fontWeight: 400, alignSelf: 'flex-start',
        }}>View Registry →</div>
      </SectionShell>

      <SectionShell id="faq" tone="ink" foot="Haley & George · Cape May · 06.18.2027">
        <NumEyebrow>No. 12</NumEyebrow>
        <Title>FAQ</Title>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FaqRow q="Can I bring a plus-one?"
            a="If your invitation includes a plus-one, you'll see them listed on your RSVP. Otherwise we're keeping the guest list close — thank you for understanding." />
          <FaqRow q="Is there parking at the venue?"
            a="Yes — both Star of the Sea and Isaac Smith Vineyard have on-site parking. Carney's is in town, so plan to walk or rideshare from your hotel." />
          <FaqRow q="Are kids welcome?"
            a="We love your kids, but we're keeping the celebration adults-only. Cape May has a few sitters that come highly recommended — happy to share if useful." />
          <FaqRow q="What's the weather like in June?"
            a="Mid-June in Cape May runs 70°–80°F during the day and dips to the 60s after sunset. A light layer for the reception is a good call." />
          <FaqRow q="Will there be transportation between events?"
            a="We won't have shuttles, but Cape May is walkable and Uber/Lyft are reliable in town. The Pier House and Isaac Smith Vineyard are about a 10-minute drive apart." />
          <FaqRow q="When should I RSVP by?"
            a="Please RSVP by April 1, 2027. If you're delayed, just shoot us a note and we'll work it out." />
        </div>
      </SectionShell>

      <style jsx>{`
        @media (max-width: 768px) {
          :global(.agenda-grid)  { grid-template-columns: repeat(5, 1fr) !important; gap: 8px !important; }
          :global(.pair-grid)    { grid-template-columns: 1fr !important; gap: 16px !important; }
          :global(.things-grid)  { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}
