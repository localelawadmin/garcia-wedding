'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANDER_PHOTOS = [
  '/photos/walking-bw.jpg',
  '/photos/cheek-kiss-bw.jpg',
  '/photos/lift-bw.jpg',
  '/photos/proposal-bw-closeup.jpg',
  '/photos/pouring-champagne-bw.jpg',
  '/photos/bouquet-bw.jpg',
];

const CYCLE_MS = 2400;

interface Props { onSuccess: () => void; }

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")";

export default function LandingPage({ onSuccess }: Props) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [idx, setIdx] = useState(0);

  // Cycle B&W lander photos
  useEffectInterval(() => setIdx(i => (i + 1) % LANDER_PHOTOS.length), CYCLE_MS);

  const correct = (process.env.NEXT_PUBLIC_PASSWORD || 'hdg3').toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.toLowerCase() === correct) {
      setExiting(true);
      sessionStorage.setItem('garcia-auth', 'true');
      await new Promise(r => setTimeout(r, 900));
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, background: '#3f5953', overflow: 'hidden' }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Crossfading B&W photos */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {LANDER_PHOTOS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'blur(10px) brightness(.7) contrast(1.05) saturate(.65)',
              transform: 'scale(1.08)',
              opacity: i === idx ? 1 : 0,
              transition: 'opacity 1.4s ease',
            }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(63, 89, 83, .42)', backdropFilter: 'saturate(180%)', WebkitBackdropFilter: 'saturate(180%)' }} />

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: .25, mixBlendMode: 'overlay',
        backgroundImage: GRAIN_SVG,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at center, rgba(63,89,83,0) 30%, rgba(63,89,83,.3) 80%, rgba(63,89,83,.6) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 30,
        color: '#f2efe9', padding: '0 24px',
      }}>
        <motion.img
          src="/photos/agenda/hg.png"
          alt="Haley & George"
          width={160}
          height={160}
          style={{
            width: 160, height: 'auto', display: 'block',
            filter: 'brightness(0) invert(.95)',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.div
          style={{
            fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase',
            opacity: .8, fontWeight: 300,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Haley &nbsp;·&nbsp; George
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', marginTop: 6 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Enter password"
            className={shake ? 'shake' : ''}
            style={{
              background: 'rgba(255,255,255,.06)',
              border: error ? '1px solid #d9a3a3' : '1px solid rgba(242,239,233,.55)',
              color: '#f2efe9',
              padding: '13px 24px',
              minWidth: 280,
              textAlign: 'center',
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              outline: 'none',
              backdropFilter: 'blur(4px)',
              fontFamily: 'inherit',
              fontWeight: 300,
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              background: 'transparent',
              border: '1px solid rgba(242,239,233,.55)',
              color: '#f2efe9',
              padding: '11px 34px',
              fontSize: 10,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 300,
              transition: 'all .25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f2efe9'; e.currentTarget.style.color = '#0a0a0a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f2efe9'; }}
          >
            Enter →
          </button>
          <AnimatePresence>
            {error && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  color: '#e8a4a4', fontSize: 9, letterSpacing: '0.3em',
                  textTransform: 'uppercase', fontWeight: 300,
                }}
              >
                Try again
              </motion.span>
            )}
          </AnimatePresence>
        </motion.form>
      </div>

      {/* Hint */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase',
        color: 'rgba(242,239,233,.5)', fontWeight: 300,
      }}>
        The more you look, the more you find
      </div>
    </motion.div>
  );
}

// ─── small useEffect with interval helper ───────────
import { useEffect } from 'react';
function useEffectInterval(cb: () => void, ms: number) {
  useEffect(() => {
    const id = setInterval(cb, ms);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms]);
}
