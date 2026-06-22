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

  const correct = (process.env.NEXT_PUBLIC_PASSWORD || 'ExitZero').toLowerCase();

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
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(76, 100, 122, .42)', backdropFilter: 'saturate(180%)', WebkitBackdropFilter: 'saturate(180%)' }} />

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: .25, mixBlendMode: 'overlay',
        backgroundImage: GRAIN_SVG,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at center, rgba(76,100,122,0) 30%, rgba(76,100,122,.3) 80%, rgba(76,100,122,.6) 100%)',
      }} />

      {/* SVG defs for tinting the HG lockup to deep-dark on the cream card */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="lander-tint-deep-dark" colorInterpolationFilters="sRGB">
            <feFlood floodColor="#4c647a" />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Content — cream oval card with initials + password */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#4c647a', padding: '0 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            width: 'clamp(300px, 36vw, 380px)',
            height: 'clamp(380px, 44vw, 480px)',
            background: '#f2efe9',
            borderRadius: '50%',
            boxShadow: '0 30px 80px rgba(0,0,0,.4), 0 6px 18px rgba(0,0,0,.18)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 22,
            padding: 'clamp(56px, 6vw, 76px) clamp(34px, 5vw, 48px)',
            textAlign: 'center',
            color: '#4c647a',
          }}
        >
          <motion.img
            src="/photos/agenda/hg.png"
            alt="Haley & George"
            width={150}
            style={{
              width: 'clamp(120px, 14vw, 160px)', height: 'auto', display: 'block',
              filter: 'url(#lander-tint-deep-dark)',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', width: '100%' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Password"
              className={shake ? 'shake' : ''}
              style={{
                background: 'transparent',
                border: error ? '1px solid #c05a68' : '1px solid #4c647a',
                color: '#4c647a',
                padding: '11px 18px',
                width: '100%',
                maxWidth: 220,
                textAlign: 'center',
                fontSize: 11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                outline: 'none',
                fontFamily: 'inherit',
                fontWeight: 400,
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                background: 'transparent',
                border: '1px solid #4c647a',
                color: '#4c647a',
                padding: '10px 28px',
                fontSize: 10,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 400,
                transition: 'all .25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#4c647a'; e.currentTarget.style.color = '#f2efe9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4c647a'; }}
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
                    color: '#c05a68', fontSize: 9, letterSpacing: '0.3em',
                    textTransform: 'uppercase', fontWeight: 400,
                  }}
                >
                  Try again
                </motion.span>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
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
