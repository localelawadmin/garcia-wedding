'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';
import NoteFromCouple from './NoteFromCouple';

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
const DEEP = '#99b0c2';
const DEEP_DARK = '#4c647a';

// Noise texture (SVG turbulence as data URI) — adds paper grain to backgrounds
const NOISE_BG = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";
const NOISE_CARD = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.95' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

// Stripe backgrounds with paper-grain texture layered on top via blend
const stripeCream = `${NOISE_BG}, repeating-linear-gradient(90deg, ${DEEP} 0 28px, ${CREAM} 28px 40px)`;
const stripeInk   = `${NOISE_BG}, repeating-linear-gradient(90deg, ${DEEP} 0 28px, ${CREAM} 28px 40px)`;
const stripeCreamSize = '280px 280px, auto';
const stripeInkSize   = '280px 280px, auto';

// Wavy oval path for the invite section (generated from sin-wave perimeter)
const WAVY_PATH = "M 780.00 240.00 L 783.49 245.83 L 786.47 251.78 L 788.70 257.82 L 789.98 263.90 L 790.16 269.98 L 789.15 275.98 L 786.93 281.85 L 783.56 287.54 L 779.13 293.01 L 773.81 298.23 L 767.83 303.22 L 761.40 307.98 L 754.79 312.57 L 748.23 317.05 L 741.93 321.48 L 736.07 325.96 L 730.78 330.55 L 726.11 335.34 L 722.07 340.37 L 718.59 345.67 L 715.56 351.26 L 712.82 357.10 L 710.18 363.14 L 707.43 369.31 L 704.35 375.50 L 700.76 381.60 L 696.48 387.47 L 691.41 393.00 L 685.45 398.09 L 678.60 402.63 L 670.88 406.59 L 662.38 409.93 L 653.22 412.67 L 643.55 414.86 L 633.54 416.59 L 623.36 417.98 L 613.18 419.17 L 603.15 420.31 L 593.38 421.55 L 583.94 423.03 L 574.87 424.85 L 566.16 427.11 L 557.77 429.85 L 549.63 433.07 L 541.63 436.72 L 533.67 440.72 L 525.64 444.94 L 517.43 449.23 L 508.95 453.42 L 500.16 457.33 L 491.02 460.80 L 481.53 463.66 L 471.71 465.81 L 461.64 467.17 L 451.37 467.69 L 440.99 467.41 L 430.59 466.37 L 420.25 464.69 L 410.04 462.51 L 400.00 460.00 L 390.15 457.34 L 380.48 454.71 L 370.96 452.27 L 361.55 450.18 L 352.17 448.54 L 342.74 447.41 L 333.21 446.82 L 323.51 446.72 L 313.60 447.05 L 303.46 447.67 L 293.10 448.46 L 282.57 449.23 L 271.94 449.82 L 261.31 450.06 L 250.79 449.79 L 240.51 448.89 L 230.58 447.29 L 221.13 444.93 L 212.23 441.83 L 203.94 438.03 L 196.28 433.61 L 189.22 428.70 L 182.71 423.44 L 176.64 417.98 L 170.88 412.48 L 165.26 407.09 L 159.64 401.91 L 153.84 397.06 L 147.73 392.58 L 141.20 388.49 L 134.17 384.79 L 126.62 381.41 L 118.57 378.29 L 110.12 375.30 L 101.40 372.35 L 92.57 369.31 L 83.85 366.08 L 75.43 362.54 L 67.56 358.64 L 60.41 354.33 L 54.17 349.58 L 48.94 344.42 L 44.81 338.87 L 41.78 333.00 L 39.78 326.90 L 38.70 320.63 L 38.38 314.30 L 38.60 307.98 L 39.12 301.75 L 39.71 295.65 L 40.13 289.71 L 40.16 283.94 L 39.66 278.33 L 38.51 272.85 L 36.66 267.45 L 34.14 262.09 L 31.04 256.71 L 27.51 251.25 L 23.75 245.69 L 20.00 240.00 L 16.51 234.17 L 13.53 228.22 L 11.30 222.18 L 10.02 216.10 L 9.84 210.02 L 10.85 204.02 L 13.07 198.15 L 16.44 192.46 L 20.87 186.99 L 26.19 181.77 L 32.17 176.78 L 38.60 172.02 L 45.21 167.43 L 51.77 162.95 L 58.07 158.52 L 63.93 154.04 L 69.22 149.45 L 73.89 144.66 L 77.93 139.63 L 81.41 134.33 L 84.44 128.74 L 87.18 122.90 L 89.82 116.86 L 92.57 110.69 L 95.65 104.50 L 99.24 98.40 L 103.52 92.53 L 108.59 87.00 L 114.55 81.91 L 121.40 77.37 L 129.12 73.41 L 137.62 70.07 L 146.78 67.33 L 156.45 65.14 L 166.46 63.41 L 176.64 62.02 L 186.82 60.83 L 196.85 59.69 L 206.62 58.45 L 216.06 56.97 L 225.13 55.15 L 233.84 52.89 L 242.23 50.15 L 250.37 46.93 L 258.37 43.28 L 266.33 39.28 L 274.36 35.06 L 282.57 30.77 L 291.05 26.58 L 299.84 22.67 L 308.98 19.20 L 318.47 16.34 L 328.29 14.19 L 338.36 12.83 L 348.63 12.31 L 359.01 12.59 L 369.41 13.63 L 379.75 15.31 L 389.96 17.49 L 400.00 20.00 L 409.85 22.66 L 419.52 25.29 L 429.04 27.73 L 438.45 29.82 L 447.83 31.46 L 457.26 32.59 L 466.79 33.18 L 476.49 33.28 L 486.40 32.95 L 496.54 32.33 L 506.90 31.54 L 517.43 30.77 L 528.06 30.18 L 538.69 29.94 L 549.21 30.21 L 559.49 31.11 L 569.42 32.71 L 578.87 35.07 L 587.77 38.17 L 596.06 41.97 L 603.72 46.39 L 610.78 51.30 L 617.29 56.56 L 623.36 62.02 L 629.12 67.52 L 634.74 72.91 L 640.36 78.09 L 646.16 82.94 L 652.27 87.42 L 658.80 91.51 L 665.83 95.21 L 673.38 98.59 L 681.43 101.71 L 689.88 104.70 L 698.60 107.65 L 707.43 110.69 L 716.15 113.92 L 724.57 117.46 L 732.44 121.36 L 739.59 125.67 L 745.83 130.42 L 751.06 135.58 L 755.19 141.13 L 758.22 147.00 L 760.22 153.10 L 761.30 159.37 L 761.62 165.70 L 761.40 172.02 L 760.88 178.25 L 760.29 184.35 L 759.87 190.29 L 759.84 196.06 L 760.34 201.67 L 761.49 207.15 L 763.34 212.55 L 765.86 217.91 L 768.96 223.29 L 772.49 228.75 L 776.25 234.31 Z";

type Tone = 'cream' | 'ink' | 'pattern';


type Hotel = {
  name: string; frame: 18 | 19 | 20; logo: string; price: string;
  details: React.ReactNode[]; bookUrl?: string;
};

const HOTELS: Hotel[] = [
  { name: 'La Mer Beachfront Resort', frame: 20, logo: 'la-mer', price: '$$$',
    details: [
      'Where our welcome drinks will take place.',
      <>Starts at $564/night. Use code <strong>270617DWRB</strong> to access the block. Check-in at 4 PM.</>,
    ],
    bookUrl: 'https://capemaylamer.com/?selfbook=true&hotel=2032&startdate=2027-06-17&enddate=2027-06-19&adult=2&child=0&group=270617DWRB' },
  { name: 'The Beach Club on Madison', frame: 18, logo: 'beach-club', price: '$',
    details: [
      'A bit further back from the beach.',
      'Starts at $294/night. Check-in at 4 PM.',
    ],
    bookUrl: 'https://www.beachclubcapemay.com/?selfbook=true&hotel=42068&startdate=2027-06-17&enddate=2027-06-19&adult=2&child=0&group=2706DRISCO' },
  { name: 'The Grand Hotel', frame: 19, logo: 'grand', price: '$$',
    details: [
      'Beachfront classic — 28 rooms reserved for our block.',
      <>Starts at $406/night. Select your dates first, then enter Group ID <strong>744882</strong> to unlock the block.</>,
    ],
    bookUrl: 'https://www.grandhotelcapemay.com' },
  { name: 'Marquis de Lafayette', frame: 20, logo: 'marquis', price: '$$',
    details: [
      '50 rooms reserved for our wedding block.',
      <>Starts at $389/night. Use code <strong>DRISGAR6</strong>. If booking by phone, mention the Driscoll Garcia Wedding Room Block.</>,
    ],
    bookUrl: 'https://marquiscapemay.com' },
  { name: 'Hotel Montreal', frame: 18, logo: 'montreal', price: '$$',
    details: [
      '10% off all rooms for our guests.',
      'Booking code coming soon — we\'ll update this card once we have it.',
    ] },
  { name: 'ICONA Cape May', frame: 19, logo: 'icona', price: '$$$',
    details: [
      'Reaching back out in summer to lock the block.',
      'Check back closer to the date for the booking link and code.',
    ] },
  { name: 'Ocean Club Hotel', frame: 20, logo: 'ocean-club', price: '$$$',
    details: ['Still in conversation — details to come.'] },
  { name: 'The Inn of Cape May', frame: 18, logo: 'inn', price: '$$$',
    details: ['Still in conversation — details to come.'] },
];

const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
  const [open, setOpen] = useState(false);
  const frameSrc = `/photos/accommodations/frames/${hotel.frame}.png`;
  const fillSrc  = `/photos/accommodations/frames/${hotel.frame}-fill.png`;
  const logoSrc  = `/photos/accommodations/logos/${hotel.logo}.png`;
  // Stamp-style frame (18) is rendered slightly compressed vertically so it reads more rectangular
  const isStamp = hotel.frame === 18;
  // Icona logo sits slightly low in its art — nudge it up so 'ICONA' centers in the frame
  const isIcona = hotel.logo === 'icona';
  const toggle = () => setOpen(o => !o);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div onClick={toggle} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        aria-expanded={open} aria-controls={`hotel-${hotel.logo}-details`}
        style={{
          position: 'relative', aspectRatio: '1 / 1',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6,
          cursor: 'pointer',
        }}>
        <img src={fillSrc} alt="" aria-hidden="true" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', pointerEvents: 'none',
          transform: isStamp ? 'scaleY(0.78)' : undefined,
        }} />
        <img src={frameSrc} alt="" aria-hidden="true" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', pointerEvents: 'none',
          filter: 'url(#tint-deep-dark)',
          transform: isStamp ? 'scaleY(0.78)' : undefined,
        }} />
        <img src={logoSrc} alt={hotel.name} style={{
          position: 'relative', zIndex: 2,
          maxWidth: '72%', maxHeight: '72%', objectFit: 'contain',
          filter: 'url(#tint-deep-dark)',
          transform: isIcona ? 'translateY(-9%)' : undefined,
          pointerEvents: 'none',
        }} />
      </div>
      <div style={{ borderTop: '1px solid currentColor', marginTop: 4 }}>
        <button type="button" onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          style={{
            width: '100%', padding: '14px 4px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'transparent', border: 'none', color: 'inherit',
            cursor: 'pointer', font: 'inherit',
          }}>
          <span className="heading" style={{ fontSize: 24, lineHeight: 1, fontStyle: 'italic', fontWeight: 400, letterSpacing: 0 }}>{hotel.price}</span>
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            fontWeight: 400, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            Details
            <span style={{ position: 'relative', display: 'inline-block', width: 12, height: 12 }}>
              <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'currentColor', transform: 'translateY(-50%)' }} />
              <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'currentColor', transform: 'translateX(-50%)', opacity: open ? 0 : 1, transition: 'opacity .25s' }} />
            </span>
          </span>
        </button>
        <div id={`hotel-${hotel.logo}-details`} style={{
          maxHeight: open ? 180 : 0, minHeight: open ? 180 : 0, overflow: 'hidden',
          opacity: open ? 1 : 0, paddingBottom: open ? 16 : 0,
          transition: 'max-height .35s ease, min-height .35s ease, opacity .35s ease, padding .35s ease',
          display: 'flex', flexDirection: 'column',
        }}>
          {hotel.details.map((line, i) => (
            <p key={i} style={{ fontSize: 13, lineHeight: 1.55, opacity: .85, margin: '0 0 8px', letterSpacing: '-0.005em' }}>{line}</p>
          ))}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10 }}>
            {hotel.bookUrl && (
              <a href={hotel.bookUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                  fontWeight: 400, opacity: 0.9, color: 'inherit', textDecoration: 'none',
                  borderBottom: '1px solid currentColor', paddingBottom: 2,
                }}>Book →</a>
            )}
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, Cape May, NJ`)}`}
              target="_blank" rel="noopener noreferrer" aria-label={`Open ${hotel.name} in Google Maps`}
              onMouseEnter={(e) => { const t = e.currentTarget; t.style.background = CREAM; t.style.color = DEEP_DARK; }}
              onMouseLeave={(e) => { const t = e.currentTarget; t.style.background = 'transparent'; t.style.color = 'inherit'; }}
              style={{
                marginLeft: 'auto',
                width: 28, height: 28, borderRadius: '50%', border: '1px solid currentColor',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                color: 'inherit', textDecoration: 'none', transition: 'background .2s, color .2s',
              }}>
              <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 1.5 C5 1.5 3 3.5 3 6 C3 9 8 14 8 14 S13 9 13 6 C13 3.5 11 1.5 8 1.5 Z" />
                <circle cx="8" cy="6" r="1.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


function priceTier(p: string): number { return p.length; }

const AccommodationsBody: React.FC = () => {
  const [sortByPrice, setSortByPrice] = useState(false);
  const sorted = sortByPrice
    ? [...HOTELS].sort((a, b) => priceTier(a.price) - priceTier(b.price))
    : HOTELS;
  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto 28px' }}>
        <p style={{ fontSize: 16, lineHeight: 1.6, opacity: .82, margin: '0 0 14px', letterSpacing: '-0.005em', fontWeight: 400 }}>Get ready for a fun stay in Cape May!</p>
        <p style={{ fontSize: 16, lineHeight: 1.6, opacity: .82, margin: '0 0 14px', letterSpacing: '-0.005em', fontWeight: 400 }}>We&apos;ve secured room blocks at several local hotels and resorts — from beachfront classics to boutique stays, at a range of price points. Cape May is small enough that no matter where you stay, you&apos;ll be close to the action and events.</p>
        <p style={{ fontSize: 16, lineHeight: 1.6, opacity: .82, margin: '0 0 14px', letterSpacing: '-0.005em', fontWeight: 400 }}>If you wish to book elsewhere, the area is full of Airbnbs and rental properties as well.</p>
        <p style={{ fontSize: 16, lineHeight: 1.6, opacity: .82, margin: 0, letterSpacing: '-0.005em', fontWeight: 400 }}>We will be sharing trolley pickup points and schedule closer to the date.</p>
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto 12px', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={() => setSortByPrice(v => !v)}
          aria-pressed={sortByPrice}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            fontWeight: 400, opacity: 0.85, cursor: 'pointer', userSelect: 'none',
            background: 'transparent', border: 'none', color: 'inherit', padding: '4px 0',
          }}>
          <span aria-hidden="true" style={{
            width: 14, height: 14, border: '1px solid currentColor',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <span style={{
              width: 8, height: 8, background: 'currentColor',
              opacity: sortByPrice ? 1 : 0, transition: 'opacity .15s ease',
            }} />
          </span>
          <span>Sort by Estimated Price</span>
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 28px', margin: '8px auto 0', maxWidth: 720 }} className="hotels-grid">
        {sorted.map(h => <HotelCard key={h.name} hotel={h} />)}
      </div>
    </>
  );
};

const SectionShell: React.FC<{
  id?: string; tone: Tone; children: React.ReactNode;
  wide?: boolean; foot?: React.ReactNode;
}> = ({ id, tone, children, wide, foot }) => {
  const isPattern  = tone === 'pattern';
  const sectionBg  = isPattern ? "url('/photos/trellis.jpg')" : (tone === 'cream' ? stripeCream : stripeInk);
  const boxBg      = tone === 'ink' ? DEEP_DARK : CREAM;
  const fg         = tone === 'ink' ? CREAM : DEEP_DARK;
  const maxW       = wide ? 1080 : 720;
  return (
    <section
      id={id}
      style={{
        minHeight: '100vh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        padding: '110px 24px 70px',
        backgroundColor: isPattern ? CREAM : (tone === 'cream' ? CREAM : DEEP),
        backgroundImage: sectionBg,
        backgroundSize: isPattern ? '540px auto' : '260px 260px, auto',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: isPattern ? 'normal' : 'soft-light',
        color: fg,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{
        maxWidth: maxW, margin: '0 auto', width: '100%',
        background: boxBg,
        padding: 'clamp(48px, 6vw, 72px) clamp(32px, 5vw, 56px)',
        boxShadow: '0 14px 40px rgba(20,30,45,.12), 0 2px 8px rgba(20,30,45,.08)',
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
      filter: tone === 'ink' ? 'url(#tint-cream)' : 'url(#tint-deep-dark)',
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

function downloadAllICS() {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const blocks = Object.keys(EVENT_DATA).map(id => {
    const ev = EVENT_DATA[id];
    return [
      'BEGIN:VEVENT',
      'UID:' + id + '@garcia-wedding',
      'DTSTAMP:' + stamp,
      'DTSTART:' + ev.start, 'DTEND:' + ev.end,
      'SUMMARY:' + ev.summary,
      'LOCATION:' + ev.location.replace(/,/g, '\\,'),
      'DESCRIPTION:' + ev.description.replace(/,/g, '\\,'),
      'END:VEVENT',
    ].join('\r\n');
  });
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Garcia Wedding//EN', ...blocks, 'END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'garcia-wedding-weekend.ics';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

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
    width: 30, height: 30, borderRadius: '50%',
    border: '1px solid currentColor', background: 'transparent',
    color: 'inherit', cursor: 'pointer', padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background .25s, color .25s',
    textDecoration: 'none',
  };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverFg; };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; };
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-start', marginTop: 20 }}>
      <button type="button" aria-label="Add to calendar" title="Add to calendar"
        onClick={() => downloadICS(calId)}
        onMouseEnter={onEnter} onMouseLeave={onLeave}
        style={baseStyle}
      >
        <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round">
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
        <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
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
  <SectionShell id={id} tone={tone} foot={foot} wide>
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
          margin: '0 0 22px', letterSpacing: '-0.005em', paddingTop: '0.12em',
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


const HotelTile: React.FC<{ name: string; address: string; note?: string }> = ({ name, address, note }) => (
  <div style={{ padding: '28px 26px', background: 'rgba(76, 100, 122, .03)', position: 'relative' }}>
    <Bracket pos="tl" /><Bracket pos="br" />
    <h3 className="heading" style={{ fontSize: 22, lineHeight: 1.05, margin: 0, fontWeight: 400, letterSpacing: '-0.005em' }}>{name}</h3>
    <p style={{ fontSize: 9.5, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: .55, margin: '10px 0 0', fontWeight: 400 }}>{address}</p>
    <div style={{ width: 24, height: 1, background: 'currentColor', opacity: .3, margin: '12px 0' }} />
    {note && <p style={{ fontSize: 13.5, lineHeight: 1.5, opacity: .82, fontWeight: 400, letterSpacing: '-0.005em', margin: 0 }}>{note}</p>}
  </div>
);

type CardTone = 'ink' | 'cream' | 'pattern';
function cardColors(tone: CardTone) {
  // Card fill contrasts with section tone; text + icon are inverse of fill.
  // Pattern section reads as cream-ish (trellis wallpaper) so it sides with cream.
  const isLightSection = tone === 'cream' || tone === 'pattern';
  return {
    bg: isLightSection ? DEEP_DARK : CREAM,
    fg: isLightSection ? CREAM : DEEP_DARK,
  };
}

const EatTile: React.FC<{ name: string; address: string; note: string; mapUrl?: string; tone?: CardTone }> = ({ name, address, note, mapUrl, tone = 'cream' }) => {
  const { bg, fg } = cardColors(tone);
  // Default Google Maps URL: include the business NAME so Maps lands on the listing,
  // not just an address search. mapUrl prop can override with a real place URL.
  const href = mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}, Cape May, NJ`)}`;
  return (
    <div style={{ padding: '22px 24px', background: bg, color: fg, fontSize: 13.5, lineHeight: 1.5, fontWeight: 400, letterSpacing: '-0.005em' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <strong className="heading" style={{ display: 'block', fontSize: 19, opacity: .94, margin: 0, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.005em' }}>{name}</strong>
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} in Google Maps`}
          onMouseEnter={(e) => { const t = e.currentTarget; t.style.background = fg; t.style.color = bg; }}
          onMouseLeave={(e) => { const t = e.currentTarget; t.style.background = 'transparent'; t.style.color = 'inherit'; }}
          style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'inherit', textDecoration: 'none', transition: 'background .2s, color .2s' }}>
          <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 1.5 C5 1.5 3 3.5 3 6 C3 9 8 14 8 14 S13 9 13 6 C13 3.5 11 1.5 8 1.5 Z" />
            <circle cx="8" cy="6" r="1.5" />
          </svg>
        </a>
      </div>
      <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: .6, margin: '6px 0 8px', fontWeight: 400 }}>{address}</p>
      <p style={{ margin: 0 }}>{note}</p>
    </div>
  );
};

const Bracket: React.FC<{ pos: 'tl' | 'br' }> = ({ pos }) => (
  <span aria-hidden="true" style={{
    position: 'absolute',
    width: 18, height: 18, opacity: .45, pointerEvents: 'none',
    ...(pos === 'tl'
      ? { top: 0, left: 0, borderTop: '1px solid currentColor', borderLeft: '1px solid currentColor' }
      : { bottom: 0, right: 0, borderBottom: '1px solid currentColor', borderRight: '1px solid currentColor' }),
  }} />
);

const Tile: React.FC<{ heading: string; body: React.ReactNode; tone?: CardTone }> = ({ heading, body, tone = 'ink' }) => {
  const { bg, fg } = cardColors(tone);
  return (
    <div style={{ padding: '32px 30px', background: bg, color: fg }}>
      <h3 className="heading" style={{ fontSize: 26, lineHeight: 1.05, margin: 0, fontWeight: 400, letterSpacing: '-0.005em' }}>{heading}</h3>
      <div style={{ width: 26, height: 1, background: 'currentColor', opacity: .35, margin: '12px 0 14px' }} />
      <p style={{ fontSize: 14, lineHeight: 1.55, opacity: .85, fontWeight: 400, letterSpacing: '-0.005em', margin: 0 }}>{body}</p>
    </div>
  );
};

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
  const [noteOpen, setNoteOpen] = useState(false);
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
      <NoteFromCouple onOpenChange={setNoteOpen} />

      {/* Countdown pill */}
      <div
        style={{
          position: 'fixed', bottom: 78, right: 22,
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '4px 22px 10px',
          background: 'rgba(76, 100, 122, .65)', border: '1px solid rgba(242, 239, 233, .45)',
          borderRadius: 999, color: CREAM,
          backdropFilter: 'blur(14px) saturate(180%)', WebkitBackdropFilter: 'blur(14px) saturate(180%)',
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
          position: 'fixed', bottom: 134, right: 70,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(76, 100, 122, .65)', color: CREAM,
          border: '1px solid rgba(242, 239, 233, .45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(14px) saturate(180%)', WebkitBackdropFilter: 'blur(14px) saturate(180%)',
          cursor: 'pointer', padding: 0, zIndex: 200,
          opacity: (showTop && !noteOpen) ? 1 : 0,
          pointerEvents: (showTop && !noteOpen) ? 'auto' : 'none',
          transition: 'opacity .35s ease, background .25s ease, color .25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = DEEP_DARK; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(76, 100, 122, .65)'; e.currentTarget.style.color = CREAM; }}
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
            filter: 'saturate(1.05) brightness(.95) contrast(1.06)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,.20) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,.35) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity: .18, mixBlendMode: 'overlay',
          backgroundImage: GRAIN_SVG,
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: CREAM,
        }}>
          <div style={{
            maxWidth: 1080, width: '100%', margin: '0 auto',
            padding: '0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
          <img
            src={HG}
            alt="Haley & George"
            style={{
              height: 140, width: 'auto', display: 'block',
              filter: 'brightness(0) invert(.95)',
            }}
          />
          <div style={{
            textAlign: 'right',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center',
            gap: 4,
          }}>
            <img src="/photos/agenda/cape-may-nj.png" alt="Cape May, NJ" style={{ height: 52, width: 'auto', display: 'block' }} />
            <img src="/photos/agenda/june-2027.png" alt="June 2027" style={{ height: 52, width: 'auto', display: 'block' }} />
          </div>
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
          backgroundColor: DEEP, backgroundImage: stripeInk, backgroundSize: '260px 260px, auto', backgroundBlendMode: 'soft-light', color: CREAM,
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
            textAlign: 'center', width: '100%', color: DEEP_DARK,
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
      <SectionShell id="agenda" tone="ink" wide foot="↓ scroll for each event">
        <Title>The Agenda</Title>
        <Lede>We can&apos;t wait to see you and celebrate in Cape May! Please see below for the details on each event.</Lede>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28, marginTop: 28 }} className="agenda-grid">
          {[
            { src: ICON.pier,    name: 'Welcome',     meta: ['Thu · 8 PM', 'The Pier House'] },
            { src: ICON.osos,    name: 'Nuptial Mass', meta: ['Fri · 1:30 PM', 'Our Lady Star of the Sea'] },
            { src: ICON.tent,    name: 'Reception',   meta: ['Fri · 5 PM', 'Isaac Smith Vineyard'] },
            { src: ICON.carneys, name: 'After Party', meta: ['Fri · 10:30', "Carney's"] },
            { src: ICON.beach,   name: 'Beach Day',   meta: ['Sat · 10 AM', 'Cape May'] },
          ].map(card => (
            <div key={card.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
            }}>
              <Icon src={card.src} size={96} tone="ink" />
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
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <button
            type="button"
            aria-label="Add all events to your calendar"
            onClick={downloadAllICS}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '12px 26px', border: '1px solid currentColor',
              borderRadius: 999,
              fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
              cursor: 'pointer', background: 'transparent', color: 'inherit',
              fontFamily: 'inherit', fontWeight: 400,
              transition: 'background .25s, color .25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = DEEP_DARK; e.currentTarget.style.color = CREAM; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; }}
          >
            <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round">
              <rect x="1.5" y="3" width="9" height="9" rx="1" />
              <line x1="1.5" y1="5.5" x2="10.5" y2="5.5" />
              <line x1="3.5" y1="2" x2="3.5" y2="4" />
              <line x1="8.5" y1="2" x2="8.5" y2="4" />
              <line x1="13" y1="11" x2="13" y2="14" strokeWidth={1.4} />
              <line x1="11.5" y1="12.5" x2="14.5" y2="12.5" strokeWidth={1.4} />
            </svg>
            Add all to calendar
          </button>
        </div>
      </SectionShell>

      <EventSection calId="welcome" mapQuery="The+Pier+House+at+La+Mer+Beachfront+Resort+1317+Beach+Avenue+Cape+May+NJ" id="welcome" tone="pattern" eyebrow="Thursday · June 17"
        name="Welcome Drinks" iconSrc={ICON.pier}
        rows={[
          ['Time',   '8:00 — 10:00 PM'],
          ['Place',  'The Pier House at La Mer Beachfront Resort'],
          ['Attire', 'Summer Cocktail'],
          ['Note',   'Welcome to Cape May! Come grab a drink with the Bride and Groom to kick off their wedding weekend.'],
        ]} />

      <EventSection calId="ceremony" mapQuery="Our+Lady+Star+of+the+Sea+525+Washington+Street+Cape+May+NJ" id="ceremony" tone="cream" eyebrow="Friday · June 18"
        name="Nuptial Mass" iconSrc={ICON.osos}
        rows={[
          ['Time',    '1:30 PM'],
          ['Place',   'Our Lady Star of the Sea'],
          ['Address', '525 Washington Street, Cape May, NJ'],
          ['Note',    'Mass will begin promptly. We kindly ask that you are seated 15–30 minutes prior.'],
        ]} />

      <EventSection calId="reception" mapQuery="Isaac+Smith+Vineyard+1039+Seashore+Road+Cape+May+NJ" id="reception" tone="ink" eyebrow="Friday · June 18"
        name="Reception" iconSrc={ICON.tent}
        rows={[
          ['Time',    '5:00 — 10:00 PM'],
          ['Place',   'Isaac Smith Vineyard'],
          ['Address', '1039 Seashore Road, Cape May, NJ'],
          ['Note',    'Please review the Travel section for information on arranged transportation.'],
        ]} />

      <EventSection calId="afterparty" mapQuery="Carneys+Restaurant+Bar+411+Beach+Ave+Cape+May+NJ" id="afterparty" tone="pattern" eyebrow="Friday · June 18"
        name="After Party" iconSrc={ICON.carneys}
        rows={[
          ['Time',    '10:30 PM — 2:00 AM'],
          ['Place',   "Carney's Restaurant & Bar"],
          ['Address', '411 Beach Ave, Cape May, NJ'],
        ]} />

      <EventSection calId="beach" mapQuery="Cape+May+Beach+NJ" id="beach" tone="cream" eyebrow="Saturday · June 19"
        name="Beach Day" iconSrc={ICON.beach}
        rows={[
          ['Time', '10 AM onward'],
          ['Note', 'Stop by the beach on your way out to say goodbye to the new Mr. and Mrs. Garcia! Or stick around and enjoy a few extra days in Cape May.'],
        ]} />

      {/* RSVP */}
      <section
        id="rsvp"
        style={{
          minHeight: '100vh', scrollSnapAlign: 'start', scrollSnapStop: 'always',
          backgroundColor: CREAM, backgroundImage: "url('/photos/trellis.jpg')",
          backgroundSize: '540px auto', backgroundRepeat: 'repeat',
          padding: '110px 24px 70px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          color: DEEP_DARK, position: 'relative',
        }}
      >
        <div style={{
          maxWidth: 720, margin: '0 auto', width: '100%',
          background: CREAM,
          padding: 'clamp(48px, 6vw, 72px) clamp(32px, 5vw, 56px)',
          boxShadow: '0 14px 40px rgba(20,30,45,.12), 0 2px 8px rgba(20,30,45,.08)',
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '24px auto 0', aspectRatio: '600 / 480' }}>
            <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <linearGradient id="envGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5d7488" />
                  <stop offset="100%" stopColor="#3d5469" />
                </linearGradient>
                <filter id="envShadow" x="-15%" y="-15%" width="130%" height="130%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                  <feOffset dx="0" dy="10" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.22" /></feComponentTransfer>
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g filter="url(#envShadow)">
                <rect x="30" y="200" width="540" height="260" rx="5" fill="url(#envGrad)" />
                <path d="M 30 200 L 300 360 L 570 200" stroke="rgba(255,255,255,.18)" strokeWidth={1} fill="none" />
                <line x1="30" y1="460" x2="570" y2="460" stroke="rgba(0,0,0,.18)" strokeWidth={0.5} />
              </g>
            </svg>
            <div style={{
              position: 'absolute', top: '5%', left: '11%', right: '11%', bottom: '36%',
              background: CREAM,
              padding: 'clamp(22px, 4vw, 34px) clamp(20px, 3.5vw, 28px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
              transform: 'rotate(-1.5deg)',
              boxShadow: '0 10px 28px rgba(20,30,45,.20), 0 2px 5px rgba(20,30,45,.08)',
              color: DEEP_DARK,
            }}>
              <h3 className="heading" style={{
                fontSize: 'clamp(48px, 7vw, 68px)', lineHeight: 1, letterSpacing: '-.01em', margin: '0 0 12px',
                fontWeight: 400,
              }}>RSVP</h3>
              <div style={{ width: 36, height: 1, background: 'currentColor', opacity: .35, margin: '0 0 14px' }} />
              <p style={{
                fontSize: 'clamp(11px, 1.4vw, 12.5px)', lineHeight: 1.6, opacity: .85,
                fontWeight: 400, letterSpacing: '-.005em', margin: 0, maxWidth: 320,
              }}>
                We are so excited to celebrate with you. Enclosed in your invitation there is an RSVP card and envelope. We kindly ask that you mark your response, enclose, and drop it in a mailbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionShell id="accommodations" tone="ink" wide foot="More options on FAQ ↓">
        <Title>The Accommodations</Title>
        <AccommodationsBody />
      </SectionShell>

      <SectionShell id="getting-there" tone="pattern">
        <Title>Travel Options</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 8 }} className="pair-grid">
          <Tile tone="pattern" heading="By Car"      body="Cape May is at the southern tip of New Jersey. ~2.5 hrs from New York City, ~1.75 hrs from Philadelphia. Garden State Parkway south to Exit 0." />
          <Tile tone="pattern" heading="By Air"      body="Closest airports: ACY (45 min), PHL (90 min), EWR (~3 hrs). If flying, rental car recommended." />
          <Tile tone="pattern" heading="By Ferry"    body="Cape May–Lewes Ferry from Delaware. Walk-on or drive-on." />
          <Tile tone="pattern" heading="Around Town" body="Walkable downtown. Trolleys, bikes, and Uber operate locally." />
        </div>
      </SectionShell>

      <SectionShell id="things" tone="cream">
        <Title>Places to Eat</Title>
        <Lede>A few of our favorite spots in town. Reservations recommended for dinners.</Lede>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 22px' }} className="things-grid">
          {[
            { name: 'The Buoy Coffee Shop', address: '722 Beach Avenue', note: 'A morning must!' },
          { name: 'Avalon Coffee of Cape May', address: '7 Gurney Street', note: 'Coffee, a breakfast sandwich, or an acai bowl.' },
          { name: "Uncle Bill's Pancake House", address: '261 Beach Avenue', note: "Sit-down breakfast you won't forget — bonus points for the gluten-free pancakes." },
          { name: 'The Mad Batter', address: '19 Jackson Street', note: 'Great for mimosas and omelettes!' },
          { name: 'Ugly Mug Bar & Restaurant', address: '426 Washington Street', note: 'A perfect Irish pub for a beer and a burger.' },
          { name: 'Ocean Club Hotel', address: '1035 Beach Avenue', note: 'Quick lunch on their pool deck.' },
          { name: "Harry's Ocean Bar & Grille", address: '1025 Beach Avenue', note: 'Quick stop for brunch or lunch.' },
          { name: 'Rusty Nail', address: '205 Beach Avenue', note: 'Live music, good drinks, appetizers, feet in the sand.' },
          { name: "George's Place Beachfront", address: '301 Beach Avenue', note: "The Groom's favorite — gyros, salads, and smoothies." },
          { name: 'Beach Plum Farm', address: '140 Stevens Street, West Cape May', note: 'Worth the short drive.' },
          { name: 'Westside Market', address: '517 Broadway, West Cape May', note: 'Best deli in town.' },
          ].map(eat => <EatTile key={eat.name} tone="cream" {...eat} />)}
        </div>
      </SectionShell>

      <SectionShell id="dress" tone="ink">
        <Title>The Dress Code</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="pair-grid">
          <Tile tone="ink" heading="Welcome Drinks"  body={<>Summer Cocktail.<br/><br/>We ask that ladies wear a dress of any length, and gentleman wear a button down and pants. Jackets are preferred, but not required.</>} />
          <Tile tone="ink" heading="Mass & Reception" body={<>Black Tie Optional.<br/><br/>We ask that ladies wear a floor-length gown. Bright, summery colors and patterns are encouraged. For gentlemen, a black tuxedo or dark suit is preferred. The reception is fully outdoors on grass; block heels are strongly recommended.</>} />
        </div>
      </SectionShell>

      {/* Registry section temporarily disabled
      <SectionShell id="registry" tone="pattern">
        <Title>Registry</Title>
        <Lede>Your presence is the gift. If you'd like to celebrate further, we've put a few things together.</Lede>
        <a href="https://www.zola.com/wedding/haleyandgeorge2027/registry" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', padding: '12px 26px', border: '1px solid currentColor',
            borderRadius: 999,
            fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
            cursor: 'pointer', marginTop: 16, fontWeight: 400, alignSelf: 'flex-start',
            color: 'inherit', textDecoration: 'none',
          }}>View Registry →</a>
      </SectionShell>
      */}

      <SectionShell id="faq" tone="cream">
        <Title>FAQ</Title>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FaqRow q='How far in advance should I book my hotel?' a='As soon as possible — hotels in Cape May in summer go fast.' />
          <FaqRow q="What's the dress code for Welcome Drinks?" a='Summer cocktail. Dresses (any length) for women, button-down and pants for men. Jackets preferred but not required.' />
          <FaqRow q='Where can I go for dinner on Thursday night?' a='Check the Places to Eat section for our local favorites. We highly recommend making a reservation in advance.' />
          <FaqRow q="What's the dress code for the ceremony and reception?" a='Black tie optional. Tux or dark suit for men, floor-length gowns for women — bright, summery colors encouraged. The reception is outdoors on grass, so block heels are strongly recommended.' />
          <FaqRow q='Can I bring a plus-one?' a='We kindly ask that only guests listed on the formal invitation attend.' />
          <FaqRow q='Will there be transportation to the ceremony?' a="No — we recommend Ubering or using your hotel's shuttle service." />
          <FaqRow q='When should I get to the ceremony?' a='The mass starts promptly at 1:30 PM — please arrive 15–30 minutes early to find your seat.' />
          <FaqRow q='Will there be transportation to the reception?' a='Yes — a shuttle leaves Our Lady Star of the Sea promptly at 4:15 PM, with stops at the participating hotels.' />
          <FaqRow q='Can I add an extra day to the hotel room block?' a='Absolutely — many of us are staying through the weekend. Call the hotel to extend your stay, and book early to secure your room.' />
        </div>
      </SectionShell>
      {/* CONTACT */}
      <section
        id="contact"
        style={{
          minHeight: '100vh', scrollSnapAlign: 'start', scrollSnapStop: 'always',
          backgroundColor: CREAM, backgroundImage: stripeCream, backgroundSize: '260px 260px, auto', backgroundBlendMode: 'soft-light', color: DEEP_DARK,
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
          <svg viewBox="0 0 800 480" preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <path d={WAVY_PATH} fill={DEEP_DARK} stroke="rgba(242,239,233,.5)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </svg>
          <div style={{ position: 'relative', zIndex: 1, padding: '0 clamp(48px, 8vw, 96px)', textAlign: 'center', width: '100%', color: CREAM }}>
            <div style={{ fontSize: 14, letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 400, marginBottom: 14, opacity: .75 }}>
              Any questions?
            </div>
            <h2 className="heading" style={{
              fontSize: 'clamp(40px, 5.5vw, 68px)', lineHeight: 1, margin: 0, letterSpacing: '-0.005em', paddingTop: '0.12em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, whiteSpace: 'nowrap',
            }}>
              <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: .3, maxWidth: 32 }} aria-hidden="true" />
              Send us a note!
              <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: .3, maxWidth: 32 }} aria-hidden="true" />
            </h2>
            <a
              href="mailto:thegarciawedding.2027@gmail.com"
              style={{
                display: 'inline-block', marginTop: 28,
                fontSize: 13, letterSpacing: '0.15em', color: 'inherit', textDecoration: 'none',
                borderBottom: '1px solid currentColor', paddingBottom: 2,
                transition: 'opacity .25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.65'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              thegarciawedding.2027@gmail.com
            </a>
          </div>
        </div>
      </section>


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
