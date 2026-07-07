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

const CREAM = '#FDFDFC';
// Save-the-date palette (Haley's names): olive / pistachio / sky blue, plus a derived deep olive for ink
const OLIVE = '#AFB885';      // "olive" — ink-section fields + inverse-stripe ground
const PISTACHIO = '#E2E8CE';  // "pistachio" — thick stripe band on light sections
const SKY = '#DEE9F2';        // "sky blue" — the two thin stripe lines, accents
const DEEP = OLIVE;           // section fills (was powder blue)
const DEEP_DARK = '#4E5B37';  // derived deep olive — ink: text, dark cards, strokes

// Noise texture (SVG turbulence as data URI) — adds paper grain to backgrounds
const NOISE_BG = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";
const NOISE_CARD = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.95' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

// Stripe backgrounds with paper-grain texture layered on top via blend
const stripeCream = `${NOISE_BG}, repeating-linear-gradient(90deg, ${SKY} 0 3px, ${CREAM} 3px 8px, ${PISTACHIO} 8px 32px, ${CREAM} 32px 37px, ${SKY} 37px 40px, ${CREAM} 40px 80px)`;
const stripeInk   = `${NOISE_BG}, repeating-linear-gradient(90deg, ${SKY} 0 3px, ${OLIVE} 3px 8px, ${CREAM} 8px 32px, ${OLIVE} 32px 37px, ${SKY} 37px 40px, ${OLIVE} 40px 80px)`;
const stripeCreamSize = '280px 280px, auto';
const stripeInkSize   = '280px 280px, auto';

// Wavy oval path for the invite section (generated from sin-wave perimeter)
const WAVY_PATH = "M 789.55 240.00 L 788.78 246.09 L 786.53 252.12 L 782.93 258.03 L 778.19 263.79 L 772.59 269.35 L 766.43 274.73 L 760.07 279.93 L 753.82 285.00 L 747.99 289.99 L 742.84 294.97 L 738.54 300.01 L 735.20 305.17 L 732.83 310.53 L 731.36 316.11 L 730.64 321.95 L 730.45 328.04 L 730.53 334.34 L 730.56 340.79 L 730.26 347.30 L 729.33 353.77 L 727.51 360.10 L 724.62 366.15 L 720.52 371.82 L 715.15 377.01 L 708.55 381.67 L 700.81 385.76 L 692.08 389.27 L 682.60 392.26 L 672.60 394.79 L 662.34 396.98 L 652.07 398.95 L 642.04 400.85 L 632.43 402.84 L 623.37 405.06 L 614.94 407.62 L 607.16 410.62 L 599.99 414.12 L 593.31 418.12 L 586.99 422.59 L 580.86 427.45 L 574.74 432.57 L 568.43 437.80 L 561.79 442.97 L 554.67 447.88 L 547.00 452.35 L 538.71 456.23 L 529.82 459.37 L 520.38 461.69 L 510.46 463.14 L 500.18 463.72 L 489.67 463.50 L 479.06 462.58 L 468.48 461.11 L 458.04 459.27 L 447.80 457.25 L 437.81 455.26 L 428.08 453.49 L 418.58 452.10 L 409.24 451.21 L 400.00 450.90 L 390.76 451.21 L 381.42 452.10 L 371.92 453.49 L 362.19 455.26 L 352.20 457.25 L 341.96 459.27 L 331.52 461.11 L 320.94 462.58 L 310.33 463.50 L 299.82 463.72 L 289.54 463.14 L 279.62 461.69 L 270.18 459.37 L 261.29 456.23 L 253.00 452.35 L 245.33 447.88 L 238.21 442.97 L 231.57 437.80 L 225.26 432.57 L 219.14 427.45 L 213.01 422.59 L 206.69 418.12 L 200.01 414.12 L 192.84 410.62 L 185.06 407.62 L 176.63 405.06 L 167.57 402.84 L 157.96 400.85 L 147.93 398.95 L 137.66 396.98 L 127.40 394.79 L 117.40 392.26 L 107.92 389.27 L 99.19 385.76 L 91.45 381.67 L 84.85 377.01 L 79.48 371.82 L 75.38 366.15 L 72.49 360.10 L 70.67 353.77 L 69.74 347.30 L 69.44 340.79 L 69.47 334.34 L 69.55 328.04 L 69.36 321.95 L 68.64 316.11 L 67.17 310.53 L 64.80 305.17 L 61.46 300.01 L 57.16 294.97 L 52.01 289.99 L 46.18 285.00 L 39.93 279.93 L 33.57 274.73 L 27.41 269.35 L 21.81 263.79 L 17.07 258.03 L 13.47 252.12 L 11.22 246.09 L 10.45 240.00 L 11.22 233.91 L 13.47 227.88 L 17.07 221.97 L 21.81 216.21 L 27.41 210.65 L 33.57 205.27 L 39.93 200.07 L 46.18 195.00 L 52.01 190.01 L 57.16 185.03 L 61.46 179.99 L 64.80 174.83 L 67.17 169.47 L 68.64 163.89 L 69.36 158.05 L 69.55 151.96 L 69.47 145.66 L 69.44 139.21 L 69.74 132.70 L 70.67 126.23 L 72.49 119.90 L 75.38 113.85 L 79.48 108.18 L 84.85 102.99 L 91.45 98.33 L 99.19 94.24 L 107.92 90.73 L 117.40 87.74 L 127.40 85.21 L 137.66 83.02 L 147.93 81.05 L 157.96 79.15 L 167.57 77.16 L 176.63 74.94 L 185.06 72.38 L 192.84 69.38 L 200.01 65.88 L 206.69 61.88 L 213.01 57.41 L 219.14 52.55 L 225.26 47.43 L 231.57 42.20 L 238.21 37.03 L 245.33 32.12 L 253.00 27.65 L 261.29 23.77 L 270.18 20.63 L 279.62 18.31 L 289.54 16.86 L 299.82 16.28 L 310.33 16.50 L 320.94 17.42 L 331.52 18.89 L 341.96 20.73 L 352.20 22.75 L 362.19 24.74 L 371.92 26.51 L 381.42 27.90 L 390.76 28.79 L 400.00 29.10 L 409.24 28.79 L 418.58 27.90 L 428.08 26.51 L 437.81 24.74 L 447.80 22.75 L 458.04 20.73 L 468.48 18.89 L 479.06 17.42 L 489.67 16.50 L 500.18 16.28 L 510.46 16.86 L 520.38 18.31 L 529.82 20.63 L 538.71 23.77 L 547.00 27.65 L 554.67 32.12 L 561.79 37.03 L 568.43 42.20 L 574.74 47.43 L 580.86 52.55 L 586.99 57.41 L 593.31 61.88 L 599.99 65.88 L 607.16 69.38 L 614.94 72.38 L 623.37 74.94 L 632.43 77.16 L 642.04 79.15 L 652.07 81.05 L 662.34 83.02 L 672.60 85.21 L 682.60 87.74 L 692.08 90.73 L 700.81 94.24 L 708.55 98.33 L 715.15 102.99 L 720.52 108.18 L 724.62 113.85 L 727.51 119.90 L 729.33 126.23 L 730.26 132.70 L 730.56 139.21 L 730.53 145.66 L 730.45 151.96 L 730.64 158.05 L 731.36 163.89 L 732.83 169.47 L 735.20 174.83 L 738.54 179.99 L 742.84 185.03 L 747.99 190.01 L 753.82 195.00 L 760.07 200.07 L 766.43 205.27 L 772.59 210.65 L 778.19 216.21 L 782.93 221.97 L 786.53 227.88 L 788.78 233.91 Z";

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
            fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase',
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
                  fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase',
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
            fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase',
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
  const sectionBg  = isPattern ? "url('/photos/floral.jpg')" : (tone === 'cream' ? stripeCream : stripeInk);
  const boxBg      = tone === 'cream' ? PISTACHIO : CREAM;
  const fg         = DEEP_DARK;
  // hairline rim: soft olive on light panels, faint cream on dark panels
  const boxBorder  = 'rgba(175,184,133,.65)';
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
        backgroundSize: isPattern ? '700px auto' : '260px 260px, auto',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: isPattern ? 'normal' : 'soft-light, normal',
        color: fg,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{
        maxWidth: maxW, margin: '0 auto', width: '100%',
        background: boxBg,
        border: `1px solid ${boxBorder}`,
        padding: 'clamp(48px, 6vw, 72px) clamp(32px, 5vw, 56px)',
        boxShadow: '0 6px 18px rgba(40,48,28,.13), 0 1px 3px rgba(40,48,28,.09)',
      }}>
        {children}
      </div>
      {foot && (
        <div style={{
          position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center',
          fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
          opacity: .45,
        }}>{foot}</div>
      )}
    </section>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
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
      filter: 'url(#tint-deep-dark)',
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

const EventActions: React.FC<{ calId: string; mapQuery: string; tone: Tone }> = ({ calId, mapQuery }) => {
  const hoverBg = DEEP_DARK;
  const hoverFg = CREAM;
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
            <div key={k} className="event-row" style={{
              display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16,
              fontSize: 15, letterSpacing: '-0.005em', lineHeight: 1.45, fontWeight: 400,
            }}>
              <div style={{
                textTransform: 'uppercase', opacity: .5, letterSpacing: '0.07em',
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
  <div style={{ padding: '28px 26px', background: 'rgba(78, 91, 55, .03)', position: 'relative' }}>
    <Bracket pos="tl" /><Bracket pos="br" />
    <h3 className="heading" style={{ fontSize: 22, lineHeight: 1.05, margin: 0, fontWeight: 400, letterSpacing: '-0.005em' }}>{name}</h3>
    <p style={{ fontSize: 9.5, letterSpacing: '0.07em', textTransform: 'uppercase', opacity: .55, margin: '10px 0 0', fontWeight: 400 }}>{address}</p>
    <div style={{ width: 24, height: 1, background: 'currentColor', opacity: .3, margin: '12px 0' }} />
    {note && <p style={{ fontSize: 13.5, lineHeight: 1.5, opacity: .82, fontWeight: 400, letterSpacing: '-0.005em', margin: 0 }}>{note}</p>}
  </div>
);

type CardTone = 'ink' | 'cream' | 'pattern';
function cardColors(tone: CardTone) {
  // Card fill contrasts with section tone; text + icon are inverse of fill.
  // Pattern section reads as cream-ish (floral wallpaper) so it sides with cream.
  // light-stripe (cream) sections have a PISTACHIO panel -> cards are cream;
  // dark-stripe (ink) & pattern sections have a cream panel -> cards are pistachio. Text always olive-deep.
  return {
    bg: tone === 'cream' ? CREAM : PISTACHIO,
    fg: DEEP_DARK,
    border: 'rgba(175,184,133,.65)',
  };
}

const EatTile: React.FC<{ name: string; address: string; note: string; mapUrl?: string; tone?: CardTone }> = ({ name, address, note, mapUrl, tone = 'cream' }) => {
  const { bg, fg, border } = cardColors(tone);
  // Default Google Maps URL: include the business NAME so Maps lands on the listing,
  // not just an address search. mapUrl prop can override with a real place URL.
  const href = mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}, Cape May, NJ`)}`;
  return (
    <div style={{ padding: '22px 24px', background: bg, color: fg, border: `1px solid ${border}`, fontSize: 13.5, lineHeight: 1.5, fontWeight: 400, letterSpacing: '-0.005em' }}>
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
      <p style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: .6, margin: '6px 0 8px', fontWeight: 400 }}>{address}</p>
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
  const { bg, fg, border } = cardColors(tone);
  return (
    <div style={{ padding: '32px 30px', background: bg, color: fg, border: `1px solid ${border}` }}>
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

  // Mobile: scrolling DOWN only — when scrolling fully stops with the next section >=50% on
  // screen, ease it up to the top. Driven by scrollend so it never fights an in-progress flick.
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth > 768) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let restTop = scroller.scrollTop;
    let cooldown = false;
    const trySnap = () => {
      if (cooldown) return;
      const now = scroller.scrollTop;
      const down = now > restTop + 4;
      restTop = now;
      if (!down) return;
      const vh = window.innerHeight;
      const sections = Array.from(scroller.querySelectorAll('section')) as HTMLElement[];
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top > 6 && r.top < vh * 0.5) {
          cooldown = true;
          scroller.scrollTo({ top: now + r.top, behavior: 'smooth' });
          setTimeout(() => { cooldown = false; restTop = scroller.scrollTop; }, 750);
          break;
        }
      }
    };
    let t: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => { clearTimeout(t); t = setTimeout(trySnap, 150); };
    const hasScrollEnd = 'onscrollend' in window;
    if (hasScrollEnd) scroller.addEventListener('scrollend', trySnap);
    else scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scrollend', trySnap);
      scroller.removeEventListener('scroll', onScroll);
      clearTimeout(t);
    };
  }, []);

  const scrollTop = () => scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      ref={scrollerRef}
      className="wedding-scroller"
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
          position: 'fixed', bottom: 108, right: 22,
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '4px 22px 10px',
          background: 'rgba(78, 91, 55, .65)', border: '1px solid rgba(242, 239, 233, .45)',
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
          position: 'fixed', bottom: 156, right: 70,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(78, 91, 55, .65)', color: CREAM,
          border: '1px solid rgba(242, 239, 233, .45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(14px) saturate(180%)', WebkitBackdropFilter: 'blur(14px) saturate(180%)',
          cursor: 'pointer', padding: 0, zIndex: 200,
          opacity: (showTop && !noteOpen) ? 1 : 0,
          pointerEvents: (showTop && !noteOpen) ? 'auto' : 'none',
          transition: 'opacity .35s ease, background .25s ease, color .25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = DEEP_DARK; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(78, 91, 55, .65)'; e.currentTarget.style.color = CREAM; }}
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
          <div className="hero-desktop" style={{
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

          <div className="hero-mobile" style={{
            display: 'none', flexDirection: 'column', alignItems: 'center', gap: 20,
            padding: '0 24px', textAlign: 'center',
          }}>
            <img src="/photos/agenda/haley-and-george.png" alt="Haley & George" style={{ width: 'min(82vw, 340px)', height: 'auto', display: 'block', filter: 'brightness(0) invert(.96)' }} />
            <img src="/photos/agenda/cape-may-nj.png" alt="Cape May, NJ" style={{ height: 30, width: 'auto', display: 'block', filter: 'brightness(0) invert(.96)' }} />
            <img src="/photos/agenda/june-2027.png" alt="June 2027" style={{ height: 30, width: 'auto', display: 'block', filter: 'brightness(0) invert(.96)' }} />
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          color: CREAM,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: .8, fontWeight: 400 }}>
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
          backgroundColor: DEEP, backgroundImage: stripeInk, backgroundSize: '260px 260px, auto', backgroundBlendMode: 'soft-light, normal', color: DEEP_DARK,
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
              fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase',
              fontWeight: 400, marginTop: 24, opacity: .8,
            }}>
              June 17–19, 2027
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <SectionShell id="agenda" tone="pattern" wide foot="↓ scroll for each event">
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
            <div key={card.name} className="agenda-item" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
            }}>
              <Icon src={card.src} size={96} tone="cream" />
              <div className="agenda-text">
                <div className="heading agenda-name" style={{ fontSize: 20, fontWeight: 400 }}>{card.name}</div>
                <div className="agenda-meta" style={{
                  fontSize: 10, letterSpacing: '0.14em', opacity: .65,
                  lineHeight: 1.5, fontWeight: 400, textTransform: 'uppercase', marginTop: 6,
                }}>
                  {card.meta[0]}<br />{card.meta[1]}
                </div>
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
              fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
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

      <EventSection calId="welcome" mapQuery="The+Pier+House+at+La+Mer+Beachfront+Resort+1317+Beach+Avenue+Cape+May+NJ" id="welcome" tone="cream" eyebrow="Thursday · June 17"
        name="Welcome Drinks" iconSrc={ICON.pier}
        rows={[
          ['Time',   '8:00 — 10:00 PM'],
          ['Place',  'The Pier House at La Mer Beachfront Resort'],
          ['Attire', 'Summer Cocktail'],
          ['Note',   'Welcome to Cape May! Come grab a drink with the Bride and Groom to kick off their wedding weekend.'],
        ]} />

      <EventSection calId="ceremony" mapQuery="Our+Lady+Star+of+the+Sea+525+Washington+Street+Cape+May+NJ" id="ceremony" tone="pattern" eyebrow="Friday · June 18"
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


      <SectionShell id="accommodations" tone="pattern" wide foot="More options on FAQ ↓">
        <Title>The Accommodations</Title>
        <AccommodationsBody />
      </SectionShell>

      <SectionShell id="getting-there" tone="ink">
        <Title>Travel Options</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 8 }} className="pair-grid">
          <Tile tone="ink" heading="By Car"      body="Cape May is at the southern tip of New Jersey. ~2.5 hrs from New York City, ~1.75 hrs from Philadelphia. Garden State Parkway south to Exit 0." />
          <Tile tone="ink" heading="By Air"      body="Closest airports: ACY (45 min), PHL (90 min), EWR (~3 hrs). If flying, rental car recommended." />
          <Tile tone="ink" heading="By Ferry"    body="Cape May–Lewes Ferry from Delaware. Walk-on or drive-on." />
          <Tile tone="ink" heading="Around Town" body="Walkable downtown. Trolleys, bikes, and Uber operate locally." />
        </div>
      </SectionShell>

      <SectionShell id="things" tone="pattern">
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
          ].map(eat => <EatTile key={eat.name} tone="pattern" {...eat} />)}
        </div>
      </SectionShell>

      <SectionShell id="dress" tone="cream">
        <Title>The Dress Code</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="pair-grid">
          <Tile tone="cream" heading="Welcome Drinks"  body={<>Summer Cocktail.<br/><br/>We ask that ladies wear a dress of any length, and gentleman wear a button down and pants. Jackets are preferred, but not required.</>} />
          <Tile tone="cream" heading="Mass & Reception" body={<>Black Tie Optional.<br/><br/>We ask that ladies wear a floor-length gown. Bright, summery colors and patterns are encouraged. For gentlemen, a black tuxedo or dark suit is preferred. The reception is fully outdoors on grass; block heels are strongly recommended.</>} />
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
            fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', marginTop: 16, fontWeight: 400, alignSelf: 'flex-start',
            color: 'inherit', textDecoration: 'none',
          }}>View Registry →</a>
      </SectionShell>
      */}

      <SectionShell id="faq" tone="pattern">
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
          backgroundColor: DEEP, backgroundImage: stripeInk, backgroundSize: '260px 260px, auto', backgroundBlendMode: 'soft-light, normal', color: DEEP_DARK,
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
            <path d={WAVY_PATH} fill={CREAM} stroke={DEEP_DARK} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </svg>
          <div style={{ position: 'relative', zIndex: 1, padding: '0 clamp(48px, 8vw, 96px)', textAlign: 'center', width: '100%', color: DEEP_DARK }}>
            <div style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 400, marginBottom: 14, opacity: .75 }}>
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
              className="contact-email"
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
          :global(.agenda-grid) {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            max-width: 470px; margin-left: auto; margin-right: auto;
          }
          :global(.agenda-item) {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            text-align: left !important;
            gap: 16px !important;
            padding: 6px 4px !important;
          }
          :global(.agenda-item:nth-child(even)) {
            flex-direction: row-reverse !important;
            text-align: right !important;
          }
          :global(.agenda-item img) { width: 96px !important; height: 96px !important; }
          :global(.agenda-text) { flex: 1 1 auto; min-width: 0; }
          :global(.agenda-name) { font-size: 28px !important; }
          :global(.agenda-meta) { font-size: 12.5px !important; line-height: 1.3 !important; letter-spacing: 0.1em !important; margin-top: 4px !important; }
          :global(.pair-grid)    { grid-template-columns: 1fr !important; gap: 16px !important; }
          :global(.things-grid)  { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}
