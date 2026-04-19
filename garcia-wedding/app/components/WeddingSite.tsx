'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';

/* ═══════════════════════════════════════════════════
   DATA — unchanged from original
   ═══════════════════════════════════════════════════ */

const PHOTOS = [
  { url: 'https://picsum.photos/seed/beach1/800/1100', rotate: -3 },
  { url: 'https://picsum.photos/seed/flowers2/900/700', rotate: 2 },
  { url: 'https://picsum.photos/seed/golden3/800/800', rotate: -1.5 },
  { url: 'https://picsum.photos/seed/sunset4/800/1100', rotate: 3 },
  { url: 'https://picsum.photos/seed/ocean5/900/680', rotate: -2 },
];

interface ScheduleEvent {
  name: string;
  time: string;
  location?: string;
  address?: string;
  attire?: string;
  note?: string;
}

interface ScheduleBlock {
  day: string;
  events: ScheduleEvent[];
}

const schedule: ScheduleBlock[] = [
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

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════ */

const CREAM = '#F5F0E8';
const NAVY = '#1A2744';
const ROSE = '#C05A68';
const SALMON = '#E8896A';

const FONT_SCRIPT = 'Black Editorial Script, cursive';
const FONT_SANS = 'Helvetica Now Display, Arial Narrow, Helvetica Neue, sans-serif';

/* ═══════════════════════════════════════════════════
   ANIMATION UTILITIES
   ═══════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Stagger children reveal
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE },
  },
};

const lineGrow = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

/* ═══════════════════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════════════════ */

function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const target = 100;
    const duration = 2200; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 600);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: NAVY,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.p
        style={{
          fontFamily: FONT_SANS,
          fontSize: '11px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: SALMON,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        June 18, 2027
      </motion.p>

      <motion.h1
        style={{
          fontFamily: FONT_SCRIPT,
          fontSize: 'clamp(48px, 8vw, 96px)',
          color: CREAM,
          lineHeight: 1,
          textAlign: 'center',
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
      >
        H &amp; G
      </motion.h1>

      <motion.div
        style={{
          width: '120px',
          height: '1px',
          background: CREAM + '30',
          position: 'relative',
          overflow: 'hidden',
          marginTop: '8px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          style={{
            height: '100%',
            background: SALMON,
            transformOrigin: 'left',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: count / 100 }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      <motion.span
        style={{
          fontFamily: FONT_SANS,
          fontSize: '13px',
          letterSpacing: '0.15em',
          color: CREAM + '60',
          fontVariantNumeric: 'tabular-nums',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {count}
      </motion.span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   REVEAL WRAPPERS
   ═══════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, ease: EASE, delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealImage({ src, alt, style, delay = 0 }: { src: string; alt: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div
      style={{ overflow: 'hidden', ...style }}
      variants={{
        hidden: { clipPath: 'inset(100% 0 0 0)' },
        visible: {
          clipPath: 'inset(0% 0 0 0)',
          transition: { duration: 1.2, ease: EASE, delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
        variants={{
          hidden: { scale: 1.15 },
          visible: {
            scale: 1,
            transition: { duration: 1.6, ease: EASE, delay },
          },
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION HEADER COMPONENT
   ═══════════════════════════════════════════════════ */

function SectionHeader({
  subline,
  headline,
  description,
  dark = false,
}: {
  subline: string;
  headline: string;
  description?: string;
  dark?: boolean;
}) {
  const textColor = dark ? CREAM : NAVY;
  const subColor = dark ? SALMON : ROSE;
  const descColor = dark ? CREAM + '99' : NAVY + '88';

  return (
    <motion.div
      style={{ textAlign: 'center', marginBottom: '80px' }}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <motion.p
        variants={fadeUp}
        style={{
          fontFamily: FONT_SANS,
          fontSize: '11px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: subColor,
          marginBottom: '24px',
        }}
      >
        {subline}
      </motion.p>
      <motion.h2
        variants={fadeUpSlow}
        style={{
          fontFamily: FONT_SCRIPT,
          fontSize: 'clamp(48px, 7vw, 88px)',
          color: textColor,
          lineHeight: 1,
          marginBottom: description ? '32px' : '0',
        }}
      >
        {headline}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: FONT_SANS,
            fontSize: '16px',
            color: descColor,
            letterSpacing: '0.03em',
            lineHeight: 1.8,
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >
          {description}
        </motion.p>
      )}
      <motion.div
        variants={lineGrow}
        style={{
          width: '60px',
          height: '1px',
          background: subColor,
          margin: '40px auto 0',
          opacity: 0.5,
          transformOrigin: 'center',
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ ITEM
   ═══════════════════════════════════════════════════ */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid ' + NAVY + '15' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '28px 0',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        <span style={{
          fontFamily: FONT_SANS,
          color: NAVY,
          fontSize: '20px',
          letterSpacing: '0.02em',
          fontWeight: 400,
          lineHeight: 1.4,
        }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{
            color: ROSE,
            fontSize: '28px',
            lineHeight: 1,
            marginLeft: '24px',
            flexShrink: 0,
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              paddingBottom: '28px',
              fontFamily: FONT_SANS,
              color: NAVY + 'aa',
              fontSize: '16px',
              lineHeight: 1.8,
              letterSpacing: '0.015em',
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PERSON CARD (Wedding Party)
   ═══════════════════════════════════════════════════ */

function PersonCard({ name, role, index }: { name: string; role: string; index: number }) {
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '20px',
      }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: EASE, delay: index * 0.06 },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{
        width: 88,
        height: 88,
        borderRadius: '50%',
        background: NAVY + '06',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        border: '1px solid ' + NAVY + '10',
        transition: 'border-color 0.3s',
      }}>
        {role.includes('Maid') || role.includes('Bridesmaid') || role.includes('Flower') ? '\u2727' : '\u2726'}
      </div>
      <h4 style={{
        fontFamily: FONT_SCRIPT,
        color: NAVY,
        fontSize: '24px',
        lineHeight: 1.2,
        textAlign: 'center',
      }}>{name}</h4>
      <p style={{
        fontFamily: FONT_SANS,
        color: ROSE,
        fontSize: '10px',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
      }}>{role}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

export default function WeddingSite() {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      {/* Preloader */}
      <AnimatePresence mode="wait">
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <div style={{ background: CREAM, overflowX: 'hidden' }}>
        <Navbar />

        {/* ─── HERO ─── */}
        <section
          ref={heroRef}
          id="hero"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 24px 80px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div style={{ y: heroY, opacity: heroOpacity, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Date */}
            <motion.p
              style={{
                fontFamily: FONT_SANS,
                fontSize: '11px',
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: ROSE,
                marginBottom: '32px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            >
              June 18, 2027 &middot; Cape May, NJ
            </motion.p>

            {/* Names */}
            <motion.h1
              style={{
                fontFamily: FONT_SCRIPT,
                fontSize: 'clamp(72px, 12vw, 160px)',
                color: NAVY,
                lineHeight: 0.9,
                textAlign: 'center',
                marginBottom: '64px',
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            >
              Haley &amp; George
            </motion.h1>

            {/* Editorial Photo Grid */}
            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                maxWidth: '820px',
                width: '100%',
                padding: '0 24px',
              }}
              className="hero-photos"
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <RevealImage
                src={PHOTOS[0].url}
                alt="Wedding photo"
                style={{ aspectRatio: '3/4', marginTop: '40px' }}
                delay={0.7}
              />
              <RevealImage
                src={PHOTOS[1].url}
                alt="Wedding photo"
                style={{ aspectRatio: '4/5' }}
                delay={0.9}
              />
              <RevealImage
                src={PHOTOS[2].url}
                alt="Wedding photo"
                style={{ aspectRatio: '3/4', marginTop: '60px' }}
                delay={1.1}
              />
            </motion.div>

            {/* Location line */}
            <motion.div
              style={{ marginTop: '64px', display: 'flex', alignItems: 'center', gap: '20px' }}
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div style={{ width: 48, height: '1px', background: ROSE + '60' }} />
              <p style={{
                fontFamily: FONT_SANS,
                color: ROSE,
                fontSize: '11px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
              }}>
                Cape May, New Jersey
              </p>
              <div style={{ width: 48, height: '1px', background: ROSE + '60' }} />
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <div style={{ width: '1px', height: '48px', background: NAVY + '25' }} />
          </motion.div>
        </section>

        {/* ─── SCHEDULE ─── */}
        <section id="schedule" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: NAVY }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <SectionHeader
              subline="The Weekend"
              headline="Schedule"
              description="We can't wait to celebrate with you! Here's what the weekend looks like."
              dark
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
              {schedule.map((block, bi) => (
                <Reveal key={bi} delay={bi * 0.1}>
                  <h3 style={{
                    fontFamily: FONT_SCRIPT,
                    color: CREAM,
                    fontSize: 'clamp(28px, 4vw, 38px)',
                    marginBottom: '32px',
                    textAlign: 'center',
                  }}>{block.day}</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {block.events.map((ev, ei) => (
                      <motion.div
                        key={ei}
                        style={{
                          background: CREAM + '06',
                          border: '1px solid ' + CREAM + '10',
                          padding: 'clamp(24px, 4vw, 36px) clamp(24px, 4vw, 40px)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          transition: 'background 0.4s, border-color 0.4s',
                        }}
                        whileHover={{
                          backgroundColor: CREAM + '0d',
                          borderColor: CREAM + '20',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px' }}>
                          <h4 style={{
                            fontFamily: FONT_SANS,
                            color: CREAM,
                            fontSize: '20px',
                            fontWeight: 500,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}>{ev.name}</h4>
                          <span style={{
                            fontFamily: FONT_SANS,
                            color: SALMON,
                            fontSize: '13px',
                            letterSpacing: '0.15em',
                          }}>{ev.time}</span>
                        </div>
                        {ev.location && (
                          <p style={{
                            fontFamily: FONT_SANS,
                            color: CREAM + 'b3',
                            fontSize: '15px',
                            letterSpacing: '0.02em',
                            lineHeight: 1.6,
                          }}>{ev.location}</p>
                        )}
                        {ev.address && (
                          <p style={{
                            fontFamily: FONT_SANS,
                            color: CREAM + '66',
                            fontSize: '13px',
                            letterSpacing: '0.02em',
                          }}>{ev.address}</p>
                        )}
                        {ev.attire && (
                          <p style={{
                            fontFamily: FONT_SANS,
                            color: SALMON,
                            fontSize: '11px',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            marginTop: '4px',
                          }}>Attire: {ev.attire}</p>
                        )}
                        {ev.note && (
                          <p style={{
                            fontFamily: FONT_SANS,
                            color: CREAM + '80',
                            fontSize: '15px',
                            fontStyle: 'italic',
                            lineHeight: 1.7,
                            marginTop: '4px',
                          }}>{ev.note}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TRAVEL / ACCOMMODATIONS ─── */}
        <section id="travel" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: CREAM }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <SectionHeader subline="Where to Stay" headline="Travel" />

            {/* Hotels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}>
              {hotels.map((hotel, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <motion.div
                    style={{
                      background: '#fff',
                      padding: '48px 36px',
                      border: '1px solid ' + NAVY + '08',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      height: '100%',
                      transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    whileHover={{
                      y: -6,
                      boxShadow: '0 24px 64px rgba(26,39,68,0.08)',
                    }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <div style={{ width: 40, height: '1px', background: ROSE + '80' }} />
                    <h3 style={{
                      fontFamily: FONT_SCRIPT,
                      color: NAVY,
                      fontSize: '32px',
                      lineHeight: 1.2,
                    }}>{hotel.name}</h3>
                    <p style={{
                      fontFamily: FONT_SANS,
                      color: NAVY + '70',
                      fontSize: '14px',
                      letterSpacing: '0.02em',
                      lineHeight: 1.6,
                    }}>{hotel.address}</p>
                    {hotel.note && (
                      <p style={{
                        fontFamily: FONT_SANS,
                        color: SALMON,
                        fontSize: '14px',
                        letterSpacing: '0.02em',
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                      }}>{hotel.note}</p>
                    )}
                  </motion.div>
                </Reveal>
              ))}
            </div>

            {/* Getting Here */}
            <div style={{ marginTop: 'clamp(80px, 10vw, 140px)' }}>
              <Reveal>
                <p style={{
                  fontFamily: FONT_SANS,
                  fontSize: '11px',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: ROSE,
                  marginBottom: '24px',
                  textAlign: 'center',
                }}>Getting Here</p>
              </Reveal>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '64px',
                marginTop: '40px',
              }}>
                {[
                  { icon: '\u2708\uFE0F', title: 'Flying', content: 'Philadelphia (PHL, ~90 min), Atlantic City (ACY, ~45 min), Newark (EWR, ~2.5 hrs).' },
                  { icon: '\uD83D\uDE97', title: 'Driving', content: 'Take the NJ Parkway to Exit 0. Cape May is at the very southern tip. Parking is available near the venue.' },
                  { icon: '\uD83D\uDEB2', title: 'Getting Around', content: 'Cape May is a walkable, bikeable town. Many guests rent bikes \u2014 highly recommended.' },
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 0.15}>
                    <div style={{ fontSize: '32px', marginBottom: '20px' }}>{item.icon}</div>
                    <div style={{ width: 32, height: '1px', background: ROSE + '60', marginBottom: '20px' }} />
                    <h3 style={{
                      fontFamily: FONT_SCRIPT,
                      color: NAVY,
                      fontSize: '30px',
                      marginBottom: '16px',
                    }}>{item.title}</h3>
                    <p style={{
                      fontFamily: FONT_SANS,
                      color: NAVY + '77',
                      fontSize: '16px',
                      lineHeight: 1.8,
                      letterSpacing: '0.015em',
                    }}>{item.content}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── EDITORIAL PHOTO BREAK ─── */}
        <section style={{ padding: '0 24px', background: CREAM }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            minHeight: '50vh',
          }} className="photo-break">
            <RevealImage
              src={PHOTOS[3].url}
              alt="Wedding moment"
              style={{ aspectRatio: '4/5' }}
              delay={0}
            />
            <RevealImage
              src={PHOTOS[4].url}
              alt="Wedding moment"
              style={{ aspectRatio: '4/5', marginTop: '80px' }}
              delay={0.2}
            />
          </div>
        </section>

        {/* ─── WEDDING PARTY ─── */}
        <section id="wedding-party" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: '#fff' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <SectionHeader subline="Our People" headline="Wedding Party" />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '80px',
            }}>
              {/* Bride's Side */}
              <div>
                <Reveal>
                  <p style={{
                    fontFamily: FONT_SCRIPT,
                    color: ROSE,
                    fontSize: '28px',
                    marginBottom: '48px',
                    textAlign: 'center',
                  }}>The Bride&apos;s Side</p>
                </Reveal>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '36px',
                }}>
                  {bridesParty.map((person, i) => (
                    <PersonCard key={person.name} name={person.name} role={person.role} index={i} />
                  ))}
                </div>
              </div>

              {/* Groom's Side */}
              <div>
                <Reveal>
                  <p style={{
                    fontFamily: FONT_SCRIPT,
                    color: ROSE,
                    fontSize: '28px',
                    marginBottom: '48px',
                    textAlign: 'center',
                  }}>The Groom&apos;s Side</p>
                </Reveal>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '36px',
                }}>
                  {groomsParty.map((person, i) => (
                    <PersonCard key={person.name} name={person.name} role={person.role} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DRESS CODE ─── */}
        <section id="dress-code" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: CREAM }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
            <SectionHeader subline="What to Wear" headline="Dress Code" />

            <Reveal>
              <p style={{
                fontFamily: FONT_SANS,
                fontSize: '24px',
                color: NAVY,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '56px',
                fontWeight: 300,
              }}>Garden Party Formal</p>
            </Reveal>

            <motion.div
              style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '56px' }}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {swatches.map((s) => (
                <motion.div
                  key={s.hex}
                  variants={fadeUp}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: s.hex,
                    border: '1px solid ' + NAVY + '0d',
                    transition: 'transform 0.3s',
                  }} />
                  <span style={{
                    fontFamily: FONT_SANS,
                    fontSize: '10px',
                    color: NAVY,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}>{s.name}</span>
                </motion.div>
              ))}
            </motion.div>

            <Reveal>
              <p style={{
                fontFamily: FONT_SANS,
                color: NAVY + '88',
                fontSize: '17px',
                lineHeight: 2,
                fontStyle: 'italic',
                letterSpacing: '0.015em',
              }}>
                Think floral prints, linen suits, sundresses. Florals encouraged. Navy, blush, sage, and coral are all very much on theme. Please no white or black tie.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── THINGS TO DO ─── */}
        <section id="things-to-do" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: NAVY }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <SectionHeader
              subline="Insider Tips"
              headline="Things To Do"
              description="Here are some of our favorite spots in Cape May!"
              dark
            />

            <div style={{ columns: '1', columnGap: '24px' }} className="sm:columns-2 lg:columns-3">
              {thingsToDo.map((item, j) => (
                <Reveal key={item.name} delay={j * 0.03}>
                  <motion.div
                    style={{
                      background: CREAM + '06',
                      border: '1px solid ' + CREAM + '0a',
                      padding: '28px 32px',
                      marginBottom: '24px',
                      breakInside: 'avoid',
                      transition: 'background 0.4s, border-color 0.4s',
                    }}
                    whileHover={{
                      backgroundColor: CREAM + '0f',
                      borderColor: CREAM + '20',
                    }}
                  >
                    <h4 style={{
                      fontFamily: FONT_SANS,
                      color: CREAM,
                      fontSize: '18px',
                      fontWeight: 600,
                      marginBottom: '8px',
                      letterSpacing: '0.015em',
                    }}>{item.name}</h4>
                    <p style={{
                      fontFamily: FONT_SANS,
                      color: CREAM + '55',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                    }}>{item.address}</p>
                    <p style={{
                      fontFamily: FONT_SANS,
                      color: CREAM + 'b3',
                      fontSize: '15px',
                      lineHeight: 1.7,
                    }}>{item.desc}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: '#fff' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <SectionHeader subline="Good Questions" headline="FAQ" />
            <div>
              {faqs.map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <FAQItem q={item.q} a={item.a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── REGISTRY ─── */}
        <section id="registry" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: CREAM }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <SectionHeader subline="Gifts" headline="Registry" />
            <Reveal>
              <p style={{
                fontFamily: FONT_SANS,
                color: NAVY + '88',
                fontSize: '17px',
                lineHeight: 2,
                marginBottom: '56px',
                letterSpacing: '0.015em',
              }}>
                Your presence is truly the greatest gift. For those who have asked, we&apos;ve registered at the following:
              </p>
            </Reveal>
            <motion.div
              style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {['Crate & Barrel', 'Zola'].map((reg) => (
                <motion.a
                  key={reg}
                  href="#"
                  variants={fadeUp}
                  style={{
                    fontFamily: FONT_SANS,
                    letterSpacing: '0.2em',
                    padding: '18px 48px',
                    border: '1px solid ' + NAVY,
                    color: NAVY,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  whileHover={{
                    backgroundColor: NAVY,
                    color: CREAM,
                  }}
                >
                  {reg} &rarr;
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{
          padding: '80px 24px',
          background: NAVY,
          textAlign: 'center',
        }}>
          <Reveal>
            <svg width="60" height="30" viewBox="0 0 160 80" style={{ marginBottom: '24px' }}>
              <ellipse cx="80" cy="40" rx="76" ry="36" stroke={CREAM + '40'} strokeWidth="1.5" fill="none" />
              <text x="80" y="30" textAnchor="middle" fill={CREAM + '80'} fontSize="12" fontFamily={FONT_SCRIPT}>The</text>
              <text x="80" y="54" textAnchor="middle" fill={CREAM + '80'} fontSize="26" fontFamily={FONT_SCRIPT} fontWeight="700">Garcias</text>
            </svg>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{
              fontFamily: FONT_SANS,
              color: CREAM + '50',
              fontSize: '11px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              The Garcias &middot; June 18, 2027 &middot; Cape May, NJ
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{
              fontFamily: FONT_SANS,
              color: CREAM + '30',
              fontSize: '11px',
              letterSpacing: '0.15em',
            }}>
              Made with love &hearts;
            </p>
          </Reveal>
        </footer>

        <MusicPlayer />
      </div>
    </>
  );
}
