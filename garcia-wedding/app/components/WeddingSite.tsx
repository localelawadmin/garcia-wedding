'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';

const PHOTOS = [
  { url: 'https://picsum.photos/seed/beach1/500/650', rotate: -5 },
  { url: 'https://picsum.photos/seed/flowers2/600/480', rotate: 3 },
  { url: 'https://picsum.photos/seed/golden3/500/500', rotate: -2 },
  { url: 'https://picsum.photos/seed/sunset4/500/650', rotate: 4 },
  { url: 'https://picsum.photos/seed/ocean5/600/460', rotate: -3 },
];

const agenda = [
  { day: 'Friday', date: 'June 17', event: 'Rehearsal Dinner', time: '7:00 PM', location: 'Location TBD', icon: '🥂' },
  { day: 'Saturday', date: 'June 18', event: 'Ceremony', time: '5:00 PM', location: 'Our Lady Star of the Sea Church', icon: '💍' },
  { day: 'Saturday', date: 'June 18', event: 'Cocktail Hour', time: '6:00 PM', location: 'The Venue, Cape May', icon: '🍸' },
  { day: 'Saturday', date: 'June 18', event: 'Reception', time: '7:00 PM', location: 'The Venue, Cape May', icon: '✨' },
  { day: 'Sunday', date: 'June 19', event: 'Farewell Brunch', time: '11:00 AM', location: 'Location TBD', icon: '☀️' },
];

const hotels = [
  { name: 'Congress Hall', desc: "Cape May's iconic grand hotel.", note: 'Book early — fills up fast.' },
  { name: 'The Virginia Hotel', desc: 'Boutique charm steps from the beach.', note: 'Intimate and elegant.' },
  { name: 'Cape May Holiday Inn', desc: 'Great value, easy parking.', note: 'Close to venue.' },
];

const swatches = [
  { name: 'Salmon', hex: '#E8896A' },
  { name: 'Blush', hex: '#F2C4BA' },
  { name: 'Periwinkle', hex: '#B8C8E0' },
  { name: 'Sage', hex: '#ABBE9C' },
  { name: 'Cream', hex: '#E8DFC8' },
];

const localKnowledge = [
  { category: 'Restaurants', items: [
    { name: 'The Ebbitt Room', desc: 'Historic fine dining in Cape May.' },
    { name: 'The Lobster House', desc: 'Classic seafood on the water.' },
    { name: "Louisa's Café", desc: 'Charming farm-to-table brunch spot.' },
  ]},
  { category: 'Beaches', items: [
    { name: 'Sunset Beach', desc: 'Watch for Cape May diamonds!' },
    { name: 'Higbee Beach', desc: 'Birding, sunsets, and serenity.' },
    { name: 'Beach Ave', desc: "Classic Cape May boardwalk." },
  ]},
  { category: 'Things To Do', items: [
    { name: 'Cape May Whale Watch', desc: 'Dolphins and whales up close.' },
    { name: 'Cape May Lighthouse', desc: 'Climb for panoramic views.' },
    { name: 'Washington Street Mall', desc: 'Boutique shopping & dining.' },
    { name: 'Cape May Winery', desc: 'Wine tasting in the vineyards.' },
  ]},
  { category: 'Coffee', items: [
    { name: 'The Coffee Talk', desc: 'Cozy spot for your morning cup.' },
    { name: "Whale's Tale", desc: 'Beachside café and smoothies.' },
  ]},
];

const faqs = [
  { q: 'Is there a shuttle to/from the venue?', a: 'Details TBD — check back closer to the date.' },
  { q: 'Are kids welcome?', a: "We love your little ones! This is an adult-only reception, but children are welcome at the ceremony." },
  { q: "What's the parking situation?", a: 'Parking is available near the venue. We recommend carpooling when possible.' },
  { q: 'Can I bring a plus one?', a: 'Please refer to your invitation. If your invitation includes a guest, their name will appear on the envelope.' },
  { q: 'Will there be a signature cocktail?', a: 'Obviously yes. Details forthcoming.' },
  { q: 'What should I do about accommodations?', a: "Book early — Cape May in June fills up! See our Accommodations section above." },
];

const CREAM = '#F5F0E8';
const NAVY = '#1A2744';
const ROSE = '#C05A68';
const SALMON = '#E8896A';

const sectionHeader = {
  fontFamily: 'Dancing Script, cursive',
  color: NAVY,
  fontSize: 'clamp(42px, 6vw, 72px)',
  lineHeight: 1.1,
  marginBottom: '16px',
};

const sectionSubline = {
  fontFamily: 'Barlow Condensed, sans-serif',
  color: ROSE,
  fontSize: '13px',
  letterSpacing: '0.35em',
  textTransform: 'uppercase' as const,
  marginBottom: '8px',
};

function PhotoCarousel() {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % PHOTOS.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const prev = (current - 1 + PHOTOS.length) % PHOTOS.length;
  const next = (current + 1) % PHOTOS.length;

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 380, padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px' }} className="hidden md:flex">
        {[prev, current, next].map((idx, i) => (
          <motion.div
            key={idx + '-' + i}
            style={{
              background: '#fff',
              padding: i === 1 ? '14px 14px 36px' : '10px 10px 28px',
              boxShadow: i === 1 ? '0 20px 60px rgba(26,39,68,0.18)' : '0 8px 24px rgba(26,39,68,0.1)',
              rotate: PHOTOS[idx].rotate,
              scale: i === 1 ? 1.1 : 0.88,
              zIndex: i === 1 ? 10 : 5,
            }}
            animate={{ rotate: PHOTOS[idx].rotate }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={PHOTOS[idx].url}
              alt="Wedding photo"
              style={{ display: 'block', width: i === 1 ? 200 : 155, height: i === 1 ? 260 : 200, objectFit: 'cover' }}
            />
          </motion.div>
        ))}
      </div>
      <div className="md:hidden">
        <motion.div
          key={current}
          style={{ background: '#fff', padding: '14px 14px 40px', boxShadow: '0 20px 60px rgba(26,39,68,0.18)', rotate: PHOTOS[current].rotate }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={PHOTOS[current].url} alt="Wedding photo" style={{ width: 240, height: 300, objectFit: 'cover', display: 'block' }} />
        </motion.div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(26,39,68,0.12)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', color: NAVY, fontSize: '18px', letterSpacing: '0.03em', fontWeight: 500 }}>
          {q}
        </span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} style={{ color: ROSE, fontSize: '24px', lineHeight: 1, marginLeft: '16px', flexShrink: 0 }}>
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingBottom: '20px', fontFamily: 'Barlow Condensed, sans-serif', color: NAVY + 'bb', fontSize: '16px', lineHeight: 1.6, letterSpacing: '0.02em' }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Divider({ color = ROSE, width = 60 }: { color?: string; width?: number }) {
  return <div style={{ width, height: 1, background: color, margin: '0 auto 40px', opacity: 0.5 }} />;
}

export default function WeddingSite() {
  return (
    <div style={{ background: CREAM }}>
      <Navbar />

      <section id="hero" style={{ minHeight: '100vh', background: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', width: 1, height: 40, background: NAVY + '30' }} />

        <motion.p
          style={{ ...sectionSubline, marginBottom: '24px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          June 18, 2027 · Cape May, NJ
        </motion.p>

        <motion.h1
          style={{ fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(64px, 10vw, 120px)', color: NAVY, lineHeight: 1, textAlign: 'center', marginBottom: '48px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Haley &amp; George
        </motion.h1>

        <PhotoCarousel />

        <motion.div
          style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div style={{ width: 40, height: 1, background: ROSE, opacity: 0.6 }} />
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: ROSE, fontSize: '13px', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Cape May, New Jersey
          </p>
          <div style={{ width: 40, height: 1, background: ROSE, opacity: 0.6 }} />
        </motion.div>

        <motion.div
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div style={{ width: 1, height: 40, background: NAVY + '40', margin: '0 auto' }} />
        </motion.div>
      </section>

      <section id="weekend-agenda" style={{ padding: '100px 24px', background: NAVY }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ ...sectionSubline, color: SALMON }}>The Schedule</p>
          <h2 style={{ ...sectionHeader, color: '#F5F0E8', marginBottom: '8px' }}>Weekend Agenda</h2>
          <Divider color={SALMON} />

          <div className="hidden md:block" style={{ position: 'relative', marginTop: '60px' }}>
            <div style={{ position: 'absolute', top: 28, left: 0, right: 0, height: 1, background: 'rgba(232,223,200,0.2)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {agenda.map((item, i) => (
                <motion.div
                  key={i}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div style={{ fontSize: '22px', position: 'relative', zIndex: 1 }}>{item.icon}</div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: SALMON, flexShrink: 0 }} />
                  <p style={{ fontFamily: 'Dancing Script, cursive', color: '#F5F0E8', fontSize: '18px', marginBottom: '4px' }}>{item.day}</p>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: SALMON, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>{item.time}</p>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: '#F5F0E8', fontSize: '15px', fontWeight: 600, letterSpacing: '0.05em' }}>{item.event}</p>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'rgba(245,240,232,0.55)', fontSize: '13px', letterSpacing: '0.03em', lineHeight: 1.4 }}>{item.location}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="md:hidden" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {agenda.map((item, i) => (
              <motion.div key={i} style={{ textAlign: 'center' }} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <p style={{ fontFamily: 'Dancing Script, cursive', color: '#F5F0E8', fontSize: '22px', marginBottom: '4px' }}>{item.day}, {item.date}</p>
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: SALMON, fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '4px' }}>{item.time}</p>
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: '#F5F0E8', fontSize: '18px', fontWeight: 600 }}>{item.event}</p>
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'rgba(245,240,232,0.55)', fontSize: '14px' }}>{item.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="accommodations" style={{ padding: '100px 24px', background: CREAM }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>Where to Stay</p>
          <h2 style={sectionHeader}>Accommodations</h2>
          <Divider />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '20px' }}>
            {hotels.map((hotel, i) => (
              <motion.div
                key={i}
                style={{ background: '#fff', padding: '40px 32px', border: '1px solid rgba(26,39,68,0.08)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div style={{ width: 32, height: 1, background: ROSE, opacity: 0.5 }} />
                <h3 style={{ fontFamily: 'Dancing Script, cursive', color: NAVY, fontSize: '28px', lineHeight: 1.2 }}>{hotel.name}</h3>
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: NAVY + '99', fontSize: '15px', letterSpacing: '0.02em', lineHeight: 1.5, flexGrow: 1 }}>{hotel.desc} {hotel.note}</p>
                <button
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.2em', padding: '10px 20px', border: '1px solid ' + NAVY, background: 'transparent', color: NAVY, fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '8px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#F5F0E8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY; }}
                >
                  View Hotel →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="dress-code" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>What to Wear</p>
          <h2 style={sectionHeader}>Dress Code</h2>
          <Divider />
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '22px', color: NAVY, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '48px', fontWeight: 300 }}>Garden Party Formal</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '48px' }}>
            {swatches.map((s) => (
              <div key={s.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: s.hex, border: '1px solid rgba(26,39,68,0.1)' }} />
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '11px', color: NAVY + '70', letterSpacing: '0.1em' }}>{s.hex}</span>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', color: NAVY, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.name}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: NAVY + '99', fontSize: '16px', lineHeight: 1.8, fontStyle: 'italic', letterSpacing: '0.02em' }}>
            Think floral prints, linen suits, sundresses. Florals encouraged. Navy, blush, sage, and coral are all very much on theme. Please no white or black tie.
          </p>
        </div>
      </section>

      <section id="travel-guide" style={{ padding: '100px 24px', background: NAVY }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ ...sectionSubline, color: SALMON }}>Getting Here</p>
          <h2 style={{ ...sectionHeader, color: '#F5F0E8' }}>Travel Guide</h2>
          <Divider color={SALMON} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '48px', marginTop: '20px', textAlign: 'left' }}>
            {[
              { icon: '✈️', title: 'Flying', content: 'Philadelphia (PHL, ~90 min), Atlantic City (ACY, ~45 min), Newark (EWR, ~2.5 hrs).' },
              { icon: '🚗', title: 'Driving', content: 'Take the NJ Parkway to Exit 0. Cape May is at the very southern tip. Parking is available near the venue.' },
              { icon: '🚲', title: 'Getting Around', content: "Cape May is a walkable, bikeable town. Many guests rent bikes — highly recommended." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ width: 32, height: 1, background: SALMON, opacity: 0.6, marginBottom: '16px' }} />
                <h3 style={{ fontFamily: 'Dancing Script, cursive', color: '#F5F0E8', fontSize: '26px', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'rgba(245,240,232,0.6)', fontSize: '15px', lineHeight: 1.7, letterSpacing: '0.02em' }}>{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="local-knowledge" style={{ padding: '100px 24px', background: CREAM }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>Insider Tips</p>
          <h2 style={sectionHeader}>Local Knowledge</h2>
          <Divider />
          <div style={{ columns: '1', columnGap: '24px', textAlign: 'left' }} className="sm:columns-2 lg:columns-3">
            {localKnowledge.map((cat) =>
              cat.items.map((item, j) => (
                <motion.div
                  key={item.name}
                  style={{ background: '#fff', padding: '24px 28px', marginBottom: '24px', breakInside: 'avoid', border: '1px solid rgba(26,39,68,0.06)' }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: j * 0.04 }}
                >
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', color: ROSE, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{cat.category}</span>
                  <h4 style={{ fontFamily: 'Barlow Condensed, sans-serif', color: NAVY, fontSize: '17px', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.02em' }}>{item.name}</h4>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: NAVY + '80', fontSize: '14px', lineHeight: 1.5 }}>{item.desc}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="faq" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>Good Questions</p>
          <h2 style={sectionHeader}>FAQ</h2>
          <Divider />
          <div style={{ textAlign: 'left' }}>
            {faqs.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      <section id="registry" style={{ padding: '100px 24px', background: CREAM }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>Gifts</p>
          <h2 style={sectionHeader}>Registry</h2>
          <Divider />
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: NAVY + '99', fontSize: '16px', lineHeight: 1.8, marginBottom: '48px', letterSpacing: '0.02em' }}>
            Your presence is truly the greatest gift. For those who have asked, we've registered at the following:
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Crate & Barrel', 'Zola'].map((reg) => (
              <a
                key={reg}
                href="#"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.2em', padding: '16px 40px', border: '1px solid ' + NAVY, color: NAVY, fontSize: '13px', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#F5F0E8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY; }}
              >
                {reg} →
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: '60px 24px', background: NAVY, textAlign: 'center' }}>
        <svg width="60" height="30" viewBox="0 0 160 80" style={{ marginBottom: '20px' }}>
          <ellipse cx="80" cy="40" rx="76" ry="36" stroke="#E8DFC8" strokeWidth="1.5" fill="none" />
          <text x="80" y="30" textAnchor="middle" fill="#E8DFC8" fontSize="12" fontFamily="Dancing Script, cursive">The</text>
          <text x="80" y="54" textAnchor="middle" fill="#E8DFC8" fontSize="26" fontFamily="Dancing Script, cursive" fontWeight="700">Garcias</text>
        </svg>
        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'rgba(245,240,232,0.5)', fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          The Garcias · June 18, 2027 · Cape May, NJ
        </p>
        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'rgba(245,240,232,0.3)', fontSize: '11px', letterSpacing: '0.15em' }}>
          Made with love ♥
        </p>
      </footer>

      <MusicPlayer />
    </div>
  );
}
