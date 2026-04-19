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

const schedule = [
  {
    day: 'Thursday, June 17',
    events: [
      {
        name: 'Welcome Drinks',
        time: '8:00 PM \u2013 10:00 PM',
        location: 'The Pier House \u2013 La Mer Beachfront Resort',
        attire: 'Summer Cocktail',
        note: 'Welcome to Cape May! Come have a drink with the Bride and Groom to kickoff their wedding weekend!',
      },
    ],
  },
  {
    day: 'Friday, June 18',
    events: [
      {
        name: 'Ceremony',
        time: '2:00 PM',
        location: 'Our Lady Star of the Sea Roman Catholic Church',
        address: '525 Washington Street, Cape May, NJ 08204',
        note: 'The mass will start promptly at 2:00 PM. Please arrive 15\u201330 minutes early to find your seat.',
      },
      {
        name: 'Reception',
        time: '5:00 PM \u2013 10:00 PM',
        location: 'Isaac Smith Vineyard',
        address: '1039 Seashore Road, Cape May, NJ 08204',
      },
      {
        name: 'After Party',
        time: '10:30 PM \u2013 2:00 AM',
        location: "Carney\u2019s Restaurant & Bar",
        address: '411 Beach Ave, Cape May, NJ 08204',
      },
    ],
  },
  {
    day: 'Saturday, June 19',
    events: [
      {
        name: 'Beach Day!',
        time: '10:00 AM',
        note: 'Stop by the beach on your way out to say goodbye to the new Mr. and Mrs. Garcia \u2014 or stay the weekend!',
      },
    ],
  },
];

const hotels = [
  {
    name: 'La Mer Beachfront Resort',
    address: '1317 Beach Avenue, Cape May, NJ 08204',
    note: 'This is where we will be having our Welcome Drinks!',
  },
  {
    name: 'The Beach Club on Madison Avenue',
    address: '605 Madison Avenue, Cape May, NJ 08204',
  },
  {
    name: 'Grand Hotel of Cape May',
    address: '1045 Beach Avenue, Cape May, NJ 08204',
    note: 'Room block code: 744882',
  },
];

const bridesParty = [
  { name: 'Hanna Driscoll', role: 'Maid of Honor' },
  { name: 'Chloe Driscoll', role: 'Maid of Honor' },
  { name: 'Alexa Garcia', role: 'Bridesmaid' },
  { name: 'Taylor Lucey', role: 'Bridesmaid' },
  { name: 'Brittany Bruno', role: 'Bridesmaid' },
  { name: 'Olivia Farrington', role: 'Bridesmaid' },
  { name: 'Piper Fowler', role: 'Flower Girl' },
];

const groomsParty = [
  { name: 'Sam DiCocco', role: 'Best Man' },
  { name: 'Daniel Palma', role: 'Groomsman' },
  { name: 'Matt Graziano', role: 'Groomsman' },
  { name: 'Matt Potter', role: 'Groomsman' },
  { name: 'Sean Potter', role: 'Groomsman' },
  { name: 'Patrick Quirke', role: 'Groomsman' },
  { name: 'Beau Saley', role: 'Ring Bearer' },
];

const thingsToDo = [
  { name: 'The Buoy Coffee Shop', address: '722 Beach Avenue', desc: 'A morning must!' },
  { name: 'Avalon Coffee of Cape May', address: '7 Gurney Street', desc: 'Great stop for coffee, a breakfast sandwich, or an acai bowl!' },
  { name: "Uncle Bill\u2019s Pancake House", address: '261 Beach Avenue', desc: 'A sit-down breakfast you won\u2019t forget! Bonus points for the gluten free pancakes!' },
  { name: 'The Mad Batter Restaurant & Bar', address: '19 Jackson Street', desc: 'A great breakfast spot! Best omelettes in town!' },
  { name: 'Ugly Mug Bar & Restaurant', address: '426 Washington Street', desc: 'A perfect Irish Pub to grab a Guinness and a burger!' },
  { name: 'Ocean Club Hotel', address: '1035 Beach Avenue', desc: 'Grab a quick lunch on their pool deck!' },
  { name: "Harry\u2019s Ocean Bar & Grille", address: '1025 Beach Avenue', desc: 'Quick stop for brunch or lunch!' },
  { name: 'Rusty Nail', address: '205 Beach Avenue', desc: 'Live music, good drinks, appetizers, feet in the sand!' },
  { name: "George\u2019s Place Beachfront", address: '301 Beach Avenue', desc: "The Groom\u2019s favorite spot! Great lunch spot for gyros, salads, and smoothies!" },
  { name: 'Beach Plum Farm', address: '140 Stevens Street, West Cape May', desc: 'A sit-down breakfast worth driving to! Farm fresh food, picnic tables, and an indoor market!' },
  { name: 'Westside Market', address: '517 Broadway, West Cape May', desc: 'Best deli in town!' },
];

const faqs = [
  {
    q: 'What is the dress code?',
    a: 'Welcome Drinks: Summer Cocktail Attire \u2014 we request that women wear dresses (any length) and men wear a button-down with dress pants or chinos. No tie required! Reception: Garden Party Formal \u2014 think floral prints, linen suits, sundresses. Florals encouraged. Navy, blush, sage, and coral are all very much on theme. Please no white or black tie.',
  },
  {
    q: 'Can I bring a plus one?',
    a: 'We kindly ask that only guests who are listed on the formal invitation be in attendance.',
  },
  {
    q: 'Will transportation be provided to the reception?',
    a: 'Yes, there will be a shuttle service from the church to the reception. The shuttle will leave from Our Lady Star of the Sea after the ceremony.',
  },
  {
    q: 'Can I add an extra day to the hotel room block?',
    a: 'Absolutely! Most of our family and many of our friends will be continuing the weekend at the beach! Contact the hotel directly to extend your stay.',
  },
  {
    q: 'Will there be transportation provided to the ceremony?',
    a: 'No, we recommend using a rideshare or the hotel\u2019s shuttle service.',
  },
  {
    q: 'When should I get to the ceremony?',
    a: 'The mass will start promptly at 2:00 PM and we ask that you arrive 15\u201330 minutes early to find your seat.',
  },
];

const swatches = [
  { name: 'Salmon', hex: '#E8896A' },
  { name: 'Blush', hex: '#F2C4BA' },
  { name: 'Periwinkle', hex: '#B8C8E0' },
  { name: 'Sage', hex: '#ABBE9C' },
  { name: 'Cream', hex: '#E8DFC8' },
];

const CREAM = '#F5F0E8';
const NAVY = '#1A2744';
const ROSE = '#C05A68';
const SALMON = '#E8896A';

const sectionHeader = {
  fontFamily: 'Black Editorial Script, cursive',
  color: NAVY,
  fontSize: 'clamp(42px, 6vw, 72px)',
  lineHeight: 1.1,
  marginBottom: '16px',
};

const sectionSubline = {
  fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
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
        <span style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: NAVY, fontSize: '18px', letterSpacing: '0.03em', fontWeight: 500 }}>
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
            <p style={{ paddingBottom: '20px', fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: NAVY + 'bb', fontSize: '16px', lineHeight: 1.6, letterSpacing: '0.02em' }}>
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

function PersonCard({ name, role }: { name: string; role: string }) {
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'rgba(26,39,68,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        border: '1.5px solid rgba(26,39,68,0.1)',
      }}>
        {role.includes('Maid') || role.includes('Bridesmaid') || role.includes('Flower') ? '\u2727' : '\u2726'}
      </div>
      <h4 style={{
        fontFamily: 'Black Editorial Script, cursive',
        color: NAVY,
        fontSize: '20px',
        lineHeight: 1.2,
        textAlign: 'center',
      }}>{name}</h4>
      <p style={{
        fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
        color: ROSE,
        fontSize: '11px',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
      }}>{role}</p>
    </motion.div>
  );
}

export default function WeddingSite() {
  return (
    <div style={{ background: CREAM }}>
      <Navbar />

      {/* âââ HERO âââ */}
      <section id="hero" style={{ minHeight: '100vh', background: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', width: 1, height: 40, background: NAVY + '30' }} />

        <motion.p
          style={{ ...sectionSubline, marginBottom: '24px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          June 18, 2027 &middot; Cape May, NJ
        </motion.p>

        <motion.h1
          style={{ fontFamily: 'Black Editorial Script, cursive', fontSize: 'clamp(64px, 10vw, 120px)', color: NAVY, lineHeight: 1, textAlign: 'center', marginBottom: '48px' }}
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
          <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: ROSE, fontSize: '13px', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
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

      {/* âââ SCHEDULE âââ */}
      <section id="schedule" style={{ padding: '100px 24px', background: NAVY }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ ...sectionSubline, color: SALMON }}>The Weekend</p>
          <h2 style={{ ...sectionHeader, color: '#F5F0E8', marginBottom: '8px' }}>Schedule</h2>
          <p style={{
            fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
            color: 'rgba(245,240,232,0.6)',
            fontSize: '15px',
            letterSpacing: '0.03em',
            lineHeight: 1.6,
            marginBottom: '16px',
            maxWidth: 560,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            We can&apos;t wait to celebrate with you! Here&apos;s what the weekend looks like.
          </p>
          <Divider color={SALMON} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', marginTop: '40px', textAlign: 'left' }}>
            {schedule.map((block, bi) => (
              <motion.div
                key={bi}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: bi * 0.1 }}
              >
                <h3 style={{
                  fontFamily: 'Black Editorial Script, cursive',
                  color: '#F5F0E8',
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}>{block.day}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {block.events.map((ev, ei) => (
                    <div key={ei} style={{
                      background: 'rgba(245,240,232,0.05)',
                      border: '1px solid rgba(245,240,232,0.1)',
                      padding: '28px 32px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                        <h4 style={{
                          fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
                          color: '#F5F0E8',
                          fontSize: '18px',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}>{ev.name}</h4>
                        <span style={{
                          fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
                          color: SALMON,
                          fontSize: '13px',
                          letterSpacing: '0.15em',
                        }}>{ev.time}</span>
                      </div>
                      {'location' in ev && ev.location && (
                        <p style={{
                          fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
                          color: 'rgba(245,240,232,0.7)',
                          fontSize: '14px',
                          letterSpacing: '0.03em',
                          lineHeight: 1.5,
                        }}>{ev.location}</p>
                      )}
                      {'address' in ev && ev.address && (
                        <p style={{
                          fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
                          color: 'rgba(245,240,232,0.45)',
                          fontSize: '13px',
                          letterSpacing: '0.03em',
                        }}>{ev.address}</p>
                      )}
                      {'attire' in ev && ev.attire && (
                        <p style={{
                          fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
                          color: SALMON,
                          fontSize: '12px',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          marginTop: '4px',
                        }}>Attire: {ev.attire}</p>
                      )}
                      {ev.note && (
                        <p style={{
                          fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
                          color: 'rgba(245,240,232,0.55)',
                          fontSize: '14px',
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                          marginTop: '4px',
                        }}>{ev.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* âââ TRAVEL / ACCOMMODATIONS âââ */}
      <section id="travel" style={{ padding: '100px 24px', background: CREAM }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>Where to Stay</p>
          <h2 style={sectionHeader}>Travel</h2>
          <Divider />

          {/* Hotels */}
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
                <h3 style={{ fontFamily: 'Black Editorial Script, cursive', color: NAVY, fontSize: '28px', lineHeight: 1.2 }}>{hotel.name}</h3>
                <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: NAVY + '80', fontSize: '14px', letterSpacing: '0.02em', lineHeight: 1.5 }}>
                  {hotel.address}
                </p>
                {hotel.note && (
                  <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: SALMON, fontSize: '13px', letterSpacing: '0.03em', fontStyle: 'italic', lineHeight: 1.5 }}>
                    {hotel.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Getting Here */}
          <div style={{ marginTop: '80px' }}>
            <p style={{ ...sectionSubline, marginBottom: '16px' }}>Getting Here</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '48px', marginTop: '20px', textAlign: 'left' }}>
              {[
                { icon: '\u2708\uFE0F', title: 'Flying', content: 'Philadelphia (PHL, ~90 min), Atlantic City (ACY, ~45 min), Newark (EWR, ~2.5 hrs).' },
                { icon: '\uD83D\uDE97', title: 'Driving', content: 'Take the NJ Parkway to Exit 0. Cape May is at the very southern tip. Parking is available near the venue.' },
                { icon: '\uD83D\uDEB2', title: 'Getting Around', content: 'Cape May is a walkable, bikeable town. Many guests rent bikes \u2014 highly recommended.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
                  <div style={{ fontSize: '28px', marginBottom: '16px' }}>{item.icon}</div>
                  <div style={{ width: 32, height: 1, background: ROSE, opacity: 0.5, marginBottom: '16px' }} />
                  <h3 style={{ fontFamily: 'Black Editorial Script, cursive', color: NAVY, fontSize: '26px', marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: NAVY + '80', fontSize: '15px', lineHeight: 1.7, letterSpacing: '0.02em' }}>{item.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* âââ WEDDING PARTY âââ */}
      <section id="wedding-party" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>Our People</p>
          <h2 style={sectionHeader}>Wedding Party</h2>
          <Divider />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '60px', marginTop: '20px' }}>
            {/* Bride's Side */}
            <div>
              <p style={{
                fontFamily: 'Black Editorial Script, cursive',
                color: ROSE,
                fontSize: '24px',
                marginBottom: '32px',
              }}>The Bride&apos;s Side</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '32px' }}>
                {bridesParty.map((person) => (
                  <PersonCard key={person.name} name={person.name} role={person.role} />
                ))}
              </div>
            </div>

            {/* Groom's Side */}
            <div>
              <p style={{
                fontFamily: 'Black Editorial Script, cursive',
                color: ROSE,
                fontSize: '24px',
                marginBottom: '32px',
              }}>The Groom&apos;s Side</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '32px' }}>
                {groomsParty.map((person) => (
                  <PersonCard key={person.name} name={person.name} role={person.role} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* âââ DRESS CODE âââ */}
      <section id="dress-code" style={{ padding: '100px 24px', background: CREAM }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>What to Wear</p>
          <h2 style={sectionHeader}>Dress Code</h2>
          <Divider />
          <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', fontSize: '22px', color: NAVY, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '48px', fontWeight: 300 }}>Garden Party Formal</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '48px' }}>
            {swatches.map((s) => (
              <div key={s.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: s.hex, border: '1px solid rgba(26,39,68,0.1)' }} />
                <span style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', fontSize: '12px', color: NAVY, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.name}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: NAVY + '99', fontSize: '16px', lineHeight: 1.8, fontStyle: 'italic', letterSpacing: '0.02em' }}>
            Think floral prints, linen suits, sundresses. Florals encouraged. Navy, blush, sage, and coral are all very much on theme. Please no white or black tie.
          </p>
        </div>
      </section>

      {/* âââ THINGS TO DO âââ */}
      <section id="things-to-do" style={{ padding: '100px 24px', background: NAVY }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ ...sectionSubline, color: SALMON }}>Insider Tips</p>
          <h2 style={{ ...sectionHeader, color: '#F5F0E8' }}>Things To Do</h2>
          <p style={{
            fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif',
            color: 'rgba(245,240,232,0.6)',
            fontSize: '15px',
            letterSpacing: '0.03em',
            lineHeight: 1.6,
            marginBottom: '16px',
            maxWidth: 480,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Here are some of our favorite spots in Cape May!
          </p>
          <Divider color={SALMON} />
          <div style={{ columns: '1', columnGap: '24px', textAlign: 'left' }} className="sm:columns-2 lg:columns-3">
            {thingsToDo.map((item, j) => (
              <motion.div
                key={item.name}
                style={{ background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.08)', padding: '24px 28px', marginBottom: '24px', breakInside: 'avoid' }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: j * 0.04 }}
              >
                <h4 style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: '#F5F0E8', fontSize: '17px', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.02em' }}>{item.name}</h4>
                <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: 'rgba(245,240,232,0.45)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '8px' }}>{item.address}</p>
                <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: 'rgba(245,240,232,0.7)', fontSize: '14px', lineHeight: 1.5 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* âââ FAQ âââ */}
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

      {/* âââ REGISTRY âââ */}
      <section id="registry" style={{ padding: '100px 24px', background: CREAM }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionSubline}>Gifts</p>
          <h2 style={sectionHeader}>Registry</h2>
          <Divider />
          <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: NAVY + '99', fontSize: '16px', lineHeight: 1.8, marginBottom: '48px', letterSpacing: '0.02em' }}>
            Your presence is truly the greatest gift. For those who have asked, we&apos;ve registered at the following:
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Crate & Barrel', 'Zola'].map((reg) => (
              <a
                key={reg}
                href="#"
                style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', letterSpacing: '0.2em', padding: '16px 40px', border: '1px solid ' + NAVY, color: NAVY, fontSize: '13px', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#F5F0E8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = NAVY; }}
              >
                {reg} &rarr;
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* âââ FOOTER âââ */}
      <footer style={{ padding: '60px 24px', background: NAVY, textAlign: 'center' }}>
        <svg width="60" height="30" viewBox="0 0 160 80" style={{ marginBottom: '20px' }}>
          <ellipse cx="80" cy="40" rx="76" ry="36" stroke="#E8DFC8" strokeWidth="1.5" fill="none" />
          <text x="80" y="30" textAnchor="middle" fill="#E8DFC8" fontSize="12" fontFamily="Black Editorial Script, cursive">The</text>
          <text x="80" y="54" textAnchor="middle" fill="#E8DFC8" fontSize="26" fontFamily="Black Editorial Script, cursive" fontWeight="700">Garcias</text>
        </svg>
        <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: 'rgba(245,240,232,0.5)', fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          The Garcias &middot; June 18, 2027 &middot; Cape May, NJ
        </p>
        <p style={{ fontFamily: 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif', color: 'rgba(245,240,232,0.3)', fontSize: '11px', letterSpacing: '0.15em' }}>
          Made with love &hearts;
        </p>
      </footer>

      <MusicPlayer />
    </div>
  );
}
