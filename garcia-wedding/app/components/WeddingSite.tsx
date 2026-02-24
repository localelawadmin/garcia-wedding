'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';

// Photo carousel images from picsum
const PHOTOS = [
  { url: 'https://picsum.photos/seed/beach1/400/500', rotate: -6, aspect: 'portrait' },
  { url: 'https://picsum.photos/seed/flowers2/500/400', rotate: 3, aspect: 'landscape' },
  { url: 'https://picsum.photos/seed/golden3/400/400', rotate: -2, aspect: 'square' },
  { url: 'https://picsum.photos/seed/sunset4/400/500', rotate: 5, aspect: 'portrait' },
  { url: 'https://picsum.photos/seed/ocean5/500/380', rotate: -4, aspect: 'landscape' },
];

const agenda = [
  { day: 'Friday, June 17', event: 'Rehearsal Dinner', time: '7:00 PM', location: 'Location TBD' },
  { day: 'Saturday, June 18', event: 'Ceremony', time: '5:00 PM', location: 'Our Lady Star of the Sea Church, Cape May NJ' },
  { day: 'Saturday, June 18', event: 'Cocktail Hour', time: '6:00 PM', location: 'The Venue, Cape May NJ' },
  { day: 'Saturday, June 18', event: 'Reception', time: '7:00 PM', location: 'The Venue, Cape May NJ' },
  { day: 'Sunday, June 19', event: 'Farewell Brunch', time: '11:00 AM', location: 'Location TBD' },
];

const hotels = [
  { name: 'Congress Hall', desc: "Cape May's iconic grand hotel. Book early — fills up fast." },
  { name: 'The Virginia Hotel', desc: 'Boutique charm steps from the beach.' },
  { name: 'Cape May Holiday Inn', desc: 'Great value, easy parking, close to venue.' },
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
    { name: 'Beach Ave', desc: "The classic Cape May boardwalk strip." },
  ]},
  { category: 'Things To Do', items: [
    { name: 'Cape May Whale Watch', desc: 'See whales and dolphins up close.' },
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

function PhotoCarousel() {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % PHOTOS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getVisible = () => {
    const prev = (current - 1 + PHOTOS.length) % PHOTOS.length;
    const next = (current + 1) % PHOTOS.length;
    return [prev, current, next];
  };

  const [prev, curr, next] = getVisible();

  return (
    <div className="relative flex items-center justify-center gap-4 py-8" style={{ minHeight: 320 }}>
      {/* Desktop: 3 photos */}
      <div className="hidden md:flex items-center justify-center gap-6">
        {[prev, curr, next].map((idx, i) => (
          <motion.div
            key={`${idx}-${i}`}
            className="bg-white p-3 shadow-lg"
            style={{
              rotate: PHOTOS[idx].rotate,
              zIndex: i === 1 ? 10 : 5,
              scale: i === 1 ? 1.08 : 0.92,
            }}
            animate={{ rotate: PHOTOS[idx].rotate, scale: i === 1 ? 1.08 : 0.92 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={PHOTOS[idx].url}
              alt="Wedding photo"
              className="object-cover"
              style={{
                width: i === 1 ? 200 : 160,
                height: i === 1 ? (PHOTOS[idx].aspect === 'landscape' ? 150 : 220) : (PHOTOS[idx].aspect === 'landscape' ? 120 : 180),
              }}
            />
          </motion.div>
        ))}
      </div>
      {/* Mobile: 1 photo */}
      <div className="md:hidden flex items-center justify-center">
        <motion.div
          key={current}
          className="bg-white p-3 shadow-lg"
          style={{ rotate: PHOTOS[current].rotate }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={PHOTOS[current].url}
            alt="Wedding photo"
            className="object-cover"
            style={{ width: 220, height: 260 }}
          />
        </motion.div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-navy/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="text-navy text-lg tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className="text-rose text-2xl font-light ml-4 flex-shrink-0"
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
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-navy/80 text-base tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WeddingSite() {
  return (
    <div className="relative">
      <Navbar />

      {/* HERO */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center pt-16 relative overflow-hidden"
        style={{
          background: `repeating-linear-gradient(
            to right,
            #E8DFC8 0px,
            #E8DFC8 38px,
            #F2C4BA22 38px,
            #F2C4BA22 52px
          )`,
        }}
      >
        <motion.h1
          className="text-6xl md:text-8xl text-navy mb-8"
          style={{ fontFamily: 'Dancing Script, cursive' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Haley &amp; George
        </motion.h1>
        <PhotoCarousel />
        <motion.p
          className="mt-6 text-rose text-xl md:text-2xl tracking-widest uppercase"
          style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.3em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          6.18.2027 · Cape May, NJ
        </motion.p>
      </section>

      {/* WEEKEND AGENDA */}
      <section id="weekend-agenda" className="py-20 px-4" style={{ background: '#E8DFC8' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl text-navy text-center mb-16" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Weekend Agenda
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-rose/30 hidden sm:block" />
            <div className="flex flex-col gap-10">
              {agenda.map((item, i) => (
                <motion.div
                  key={i}
                  className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {/* Dot */}
                  <div className="hidden sm:block absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-rose -translate-x-1.5 -translate-y-1" />
                  <div className={`sm:w-1/2 ${i % 2 === 0 ? 'sm:text-right sm:pr-12 md:pr-16' : 'sm:ml-auto sm:pl-12 md:pl-16'}`}>
                    <p className="text-rose text-base tracking-widest uppercase mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>
                      {item.day}
                    </p>
                    <h3 className="text-3xl text-navy" style={{ fontFamily: 'Dancing Script, cursive' }}>
                      {item.event}
                    </h3>
                    <p className="text-navy/70 text-base tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      {item.time} · {item.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACCOMMODATIONS */}
      <section id="accommodations" className="py-20 px-4" style={{ background: '#F2C4BA' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl text-navy text-center mb-16" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Accommodations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotels.map((hotel, i) => (
              <motion.div
                key={i}
                className="bg-cream border border-navy/20 p-6 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3 className="text-2xl text-navy" style={{ fontFamily: 'Dancing Script, cursive' }}>
                  {hotel.name}
                </h3>
                <p className="text-navy/70 text-base flex-grow" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {hotel.desc}
                </p>
                <button
                  className="mt-2 border border-navy text-navy px-4 py-2 text-sm tracking-widest uppercase hover:bg-navy hover:text-cream transition-colors"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  View Hotel →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DRESS CODE */}
      <section id="dress-code" className="py-20 px-4" style={{ background: '#E8DFC8' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl text-navy mb-4" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Dress Code
          </h2>
          <p className="text-3xl text-navy tracking-widest uppercase mb-10" style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.25em' }}>
            Garden Party Formal
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-10">
            {swatches.map((s) => (
              <div key={s.hex} className="flex flex-col items-center gap-2">
                <div
                  className="w-14 h-14 rounded-full border-2 border-navy/20 shadow-sm"
                  style={{ background: s.hex }}
                />
                <span className="text-xs text-navy/60 tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {s.hex}
                </span>
                <span className="text-xs text-navy tracking-wide uppercase" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-navy/70 italic text-lg" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Think floral prints, linen suits, sundresses. Florals encouraged. Navy, blush, sage, and coral are all very much on theme. Please no white or black tie.
          </p>
        </div>
      </section>

      {/* TRAVEL GUIDE */}
      <section id="travel-guide" className="py-20 px-4" style={{ background: '#1A2744' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl text-cream text-center mb-16" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Travel Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✈️',
                title: 'Flying',
                content: 'Nearest airports: Philadelphia (PHL, ~90 min), Atlantic City (ACY, ~45 min), Newark (EWR, ~2.5 hrs)'
              },
              {
                icon: '🚗',
                title: 'Driving',
                content: 'Cape May is at the southern tip of the NJ Parkway. Take Exit 0. Parking available near venue.'
              },
              {
                icon: '🚲',
                title: 'Getting Around',
                content: "Cape May is a walkable, bikeable town. Ride shares available. Many guests rent bikes for the weekend — highly recommended."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-cream"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl mb-3 text-salmon" style={{ fontFamily: 'Dancing Script, cursive' }}>
                  {item.title}
                </h3>
                <p className="text-cream/80 text-base tracking-wide leading-relaxed" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL KNOWLEDGE */}
      <section id="local-knowledge" className="py-20 px-4" style={{ background: '#F2C4BA' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl text-navy text-center mb-16" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Local Knowledge
          </h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {localKnowledge.map((cat) =>
              cat.items.map((item, j) => (
                <motion.div
                  key={item.name}
                  className="bg-cream border border-navy/10 p-5 break-inside-avoid"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: j * 0.05 }}
                >
                  <span className="text-xs text-rose tracking-widest uppercase mb-2 block" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600 }}>
                    {cat.category}
                  </span>
                  <h4 className="text-navy text-lg font-semibold mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700 }}>
                    {item.name}
                  </h4>
                  <p className="text-navy/70 text-sm" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4" style={{ background: '#E8DFC8' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-6xl text-navy text-center mb-16" style={{ fontFamily: 'Dancing Script, cursive' }}>
            FAQ
          </h2>
          <div>
            {faqs.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRY */}
      <section id="registry" className="py-20 px-4" style={{ background: '#ABBE9C' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl text-navy mb-6" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Registry
          </h2>
          <p className="text-navy/80 text-lg mb-12 leading-relaxed" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Your presence is truly the greatest gift. For those who have asked, we've registered at the following:
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {[
              { name: 'Crate & Barrel' },
              { name: 'Zola' },
            ].map((reg) => (
              <div key={reg.name} className="bg-cream border border-navy/20 p-8 flex flex-col items-center gap-4 flex-1">
                <h3 className="text-2xl text-navy" style={{ fontFamily: 'Dancing Script, cursive' }}>
                  {reg.name}
                </h3>
                <a
                  href="#"
                  className="border border-navy text-navy px-6 py-2 text-sm tracking-widest uppercase hover:bg-navy hover:text-cream transition-colors"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  View Registry →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 text-center" style={{ background: '#1A2744' }}>
        <div className="flex justify-center mb-4">
          <svg width="60" height="30" viewBox="0 0 160 80">
            <ellipse cx="80" cy="40" rx="76" ry="36" stroke="#E8DFC8" strokeWidth="2" fill="none" />
            <text x="80" y="30" textAnchor="middle" fill="#E8DFC8" fontSize="12" fontFamily="Dancing Script, cursive">The</text>
            <text x="80" y="54" textAnchor="middle" fill="#E8DFC8" fontSize="26" fontFamily="Dancing Script, cursive" fontWeight="700">Garcias</text>
          </svg>
        </div>
        <p className="text-cream/80 text-base tracking-widest" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          The Garcias · June 18, 2027 · Cape May, NJ
        </p>
        <p className="text-cream/50 text-sm mt-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Made with love ♥
        </p>
      </footer>

      {/* Floating music player */}
      <MusicPlayer />
    </div>
  );
}
