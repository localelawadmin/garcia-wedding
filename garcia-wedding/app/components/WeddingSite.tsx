'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';

const HG = '/photos/agenda/hg.png';
const HERO_PHOTO = '/photos/proposal-wide.jpg';

const ICON = {
  pier:    '/photos/agenda/pier-house.png',
  osos:    '/photos/agenda/osos.png',
  tent:    '/photos/agenda/reception-tent.png',
  carneys: '/photos/agenda/carneys.png',
  beach:   '/photos/agenda/beach.png',
};

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")";

const cream = '#f2efe9';
const olive = '#49492f';
const ink   = '#0a0a0a';

type Tone = 'cream' | 'ink';

const SectionShell: React.FC<{
  id?: string; tone: Tone; children: React.ReactNode;
  wide?: boolean; foot?: React.ReactNode;
}> = ({ id, tone, children, wide, foot }) => {
  const bg = tone === 'cream' ? cream : ink;
  const fg = tone === 'cream' ? olive : cream;
  const maxW = wide ? 1080 : 720;
  return (
    <section
      id={id}
      style={{
        minHeight: '100vh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        padding: '110px 24px 70px',
        background: bg, color: fg,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: maxW, margin: '0 auto', width: '100%' }}>{children}</div>
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
    fontSize: 'clamp(64px, 8vw, 110px)',
    lineHeight: 0.8,
    margin: '0 0 32px',
    letterSpacing: '-0.005em',
    paddingTop: '0.12em',
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
      width: size, height: size, objectFit: 'contain',
      display: 'block',
      filter: tone === 'cream' ? 'brightness(0)' : 'brightness(0) invert(.95)',
    }}
  />
);

const EventSection: React.FC<{
  id: string; tone: Tone; eyebrow: string; name: string; iconSrc: string;
  rows: Array<[string, string]>; foot?: string;
}> = ({ id, tone, eyebrow, name, iconSrc, rows, foot }) => (
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
          fontSize: 'clamp(64px, 8vw, 110px)',
          lineHeight: 0.8,
          margin: '0 0 26px',
          letterSpacing: '-0.005em',
          paddingTop: '0.12em',
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
        <span style={{
          width: 22, height: 22, position: 'relative', flexShrink: 0,
          opacity: .85,
        }}>
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
        maxHeight: open ? 200 : 0,
        overflow: 'hidden',
        transition: 'max-height .35s ease, opacity .35s ease, padding .35s ease',
        opacity: open ? 1 : 0,
        paddingBottom: open ? 20 : 0,
      }}>
        <p style={{ fontSize: 15, lineHeight: 1.55, opacity: .8, margin: 0, maxWidth: 580, fontWeight: 400, letterSpacing: '-0.005em' }}>{a}</p>
      </div>
    </div>
  );
};

export default function WeddingSite() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > window.innerHeight * 0.6);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={scrollerRef}
      style={{
        position: 'fixed', inset: 0,
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        background: cream,
      }}
    >
      <Navbar />
      <MusicPlayer />

      {/* Back-to-top — sits above the music player on the right */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        type="button"
        style={{
          position: 'fixed', bottom: 78, right: 22,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(0,0,0,.5)', color: cream,
          border: '1px solid rgba(242,239,233,.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer', padding: 0, zIndex: 200,
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? 'auto' : 'none',
          transition: 'opacity .35s ease, background .25s ease, color .25s ease, transform .25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = cream; e.currentTarget.style.color = ink; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,.5)'; e.currentTarget.style.color = cream; }}
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
            objectFit: 'cover',
            objectPosition: 'center 65%',
            filter: 'grayscale(1) brightness(.78) contrast(1.08)',
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

        {/* HG + date row */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(40px, 12vw, 180px)',
          color: cream,
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
            <span style={{ display: 'block' }}>Cape May</span>
            <span style={{ display: 'block' }}>June 2027</span>
          </div>
        </div>

        {/* Scroll prompt */}
        <div style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          color: cream,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', opacity: .8, fontWeight: 400 }}>
            Scroll
          </div>
          <div className="scroll-bob" style={{ width: 1, height: 40, background: cream, opacity: .55 }} />
        </div>
      </section>

      {/* AGENDA */}
      <SectionShell id="agenda" tone="cream" wide foot="↓ scroll for each event">
        <NumEyebrow>No. 01</NumEyebrow>
        <Title>The Agenda</Title>
        <Lede>Three days in Cape May. Here&apos;s the shape of it — each event has its own page below.</Lede>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28, marginTop: 28,
        }} className="agenda-grid">
          {[
            { src: ICON.pier,    name: 'Welcome',     meta: ['Thu · 8 PM', 'La Mer'] },
            { src: ICON.osos,    name: 'Ceremony',    meta: ['Fri · 2 PM', 'Star of the Sea'] },
            { src: ICON.tent,    name: 'Reception',   meta: ['Fri · 5 PM', 'Isaac Smith'] },
            { src: ICON.carneys, name: 'After Party', meta: ['Fri · 10:30', "Carney's"] },
            { src: ICON.beach,   name: 'Beach Day',   meta: ['Sat · 10 AM', 'Cape May'] },
          ].map(card => (
            <div key={card.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: 12,
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

      <EventSection id="welcome" tone="ink" eyebrow="Thursday · June 17"
        name="Welcome Drinks" iconSrc={ICON.pier}
        rows={[
          ['Time',   '8:00 — 10:00 PM'],
          ['Place',  'The Pier House at La Mer Beachfront Resort'],
          ['Attire', 'Summer Cocktail'],
          ['Note',   'Welcome to Cape May — come grab a drink with us before the weekend takes off.'],
        ]} foot="No. 02 / Welcome Drinks" />

      <EventSection id="ceremony" tone="cream" eyebrow="Friday · June 18"
        name="Ceremony" iconSrc={ICON.osos}
        rows={[
          ['Time',    '2:00 PM'],
          ['Place',   'Our Lady Star of the Sea'],
          ['Address', '525 Washington Street, Cape May, NJ'],
          ['Note',    'Mass starts promptly. Please arrive 15–30 minutes early.'],
        ]} foot="No. 03 / Ceremony" />

      <EventSection id="reception" tone="ink" eyebrow="Friday · June 18"
        name="Reception" iconSrc={ICON.tent}
        rows={[
          ['Time',    '5:00 — 10:00 PM'],
          ['Place',   'Isaac Smith Vineyard'],
          ['Address', '1039 Seashore Road, Cape May, NJ'],
        ]} foot="No. 04 / Reception" />

      <EventSection id="afterparty" tone="cream" eyebrow="Friday · June 18"
        name="After Party" iconSrc={ICON.carneys}
        rows={[
          ['Time',    '10:30 PM — 2:00 AM'],
          ['Place',   "Carney's Restaurant & Bar"],
          ['Address', '411 Beach Ave, Cape May, NJ'],
        ]} foot="No. 05 / After Party" />

      <EventSection id="beach" tone="ink" eyebrow="Saturday · June 19"
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
          <FaqRow
            q="Can I bring a plus-one?"
            a="If your invitation includes a plus-one, you'll see them listed on your RSVP. Otherwise we're keeping the guest list close — thank you for understanding."
          />
          <FaqRow
            q="Is there parking at the venue?"
            a="Yes — both Star of the Sea and Isaac Smith Vineyard have on-site parking. Carney's is in town, so plan to walk or rideshare from your hotel."
          />
          <FaqRow
            q="Are kids welcome?"
            a="We love your kids, but we're keeping the celebration adults-only. Cape May has a few sitters that come highly recommended — happy to share if useful."
          />
          <FaqRow
            q="What's the weather like in June?"
            a="Mid-June in Cape May runs 70°–80°F during the day and dips to the 60s after sunset. A light layer for the reception is a good call."
          />
          <FaqRow
            q="Will there be transportation between events?"
            a="We won't have shuttles, but Cape May is walkable and Uber/Lyft are reliable in town. The Pier House and Isaac Smith Vineyard are about a 10-minute drive apart."
          />
          <FaqRow
            q="When should I RSVP by?"
            a="Please RSVP by April 1, 2027. If you're delayed, just shoot us a note and we'll work it out."
          />
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
