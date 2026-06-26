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

// Portrait wavy-oval path (10-lobe scallop, matches the invite/contact cards inside the site)
const LANDER_WAVY = "M 477.30 300.00 L 476.83 307.77 L 475.46 315.45 L 473.27 322.99 L 470.38 330.32 L 466.97 337.42 L 463.22 344.27 L 459.34 350.91 L 455.53 357.37 L 451.99 363.73 L 448.85 370.07 L 446.23 376.49 L 444.19 383.08 L 442.75 389.90 L 441.85 397.03 L 441.41 404.47 L 441.30 412.23 L 441.34 420.26 L 441.37 428.48 L 441.18 436.78 L 440.61 445.04 L 439.51 453.09 L 437.75 460.81 L 435.25 468.03 L 431.98 474.66 L 427.96 480.60 L 423.24 485.81 L 417.93 490.29 L 412.15 494.10 L 406.06 497.33 L 399.81 500.11 L 393.55 502.62 L 387.44 505.05 L 381.59 507.59 L 376.07 510.41 L 370.94 513.68 L 366.20 517.50 L 361.83 521.96 L 357.76 527.07 L 353.91 532.77 L 350.18 538.96 L 346.44 545.49 L 342.60 552.15 L 338.55 558.74 L 334.22 565.00 L 329.54 570.70 L 324.50 575.64 L 319.08 579.65 L 313.33 582.61 L 307.29 584.45 L 301.03 585.19 L 294.62 584.91 L 288.16 583.74 L 281.72 581.86 L 275.35 579.52 L 269.12 576.95 L 263.03 574.41 L 257.10 572.15 L 251.32 570.37 L 245.63 569.24 L 240.00 568.85 L 234.37 569.24 L 228.68 570.37 L 222.90 572.15 L 216.97 574.41 L 210.88 576.95 L 204.65 579.52 L 198.28 581.86 L 191.84 583.74 L 185.38 584.91 L 178.97 585.19 L 172.71 584.45 L 166.67 582.61 L 160.92 579.65 L 155.50 575.64 L 150.46 570.70 L 145.78 565.00 L 141.45 558.74 L 137.40 552.15 L 133.56 545.49 L 129.83 538.96 L 126.09 532.77 L 122.24 527.07 L 118.17 521.96 L 113.80 517.50 L 109.06 513.68 L 103.93 510.41 L 98.41 507.59 L 92.56 505.05 L 86.45 502.62 L 80.19 500.11 L 73.94 497.33 L 67.85 494.10 L 62.07 490.29 L 56.76 485.81 L 52.04 480.60 L 48.02 474.66 L 44.75 468.03 L 42.25 460.81 L 40.49 453.09 L 39.39 445.04 L 38.82 436.78 L 38.63 428.48 L 38.66 420.26 L 38.70 412.23 L 38.59 404.47 L 38.15 397.03 L 37.25 389.90 L 35.81 383.08 L 33.77 376.49 L 31.15 370.07 L 28.01 363.73 L 24.47 357.37 L 20.66 350.91 L 16.78 344.27 L 13.03 337.42 L 9.62 330.32 L 6.73 322.99 L 4.54 315.45 L 3.17 307.77 L 2.70 300.00 L 3.17 292.23 L 4.54 284.55 L 6.73 277.01 L 9.62 269.68 L 13.03 262.58 L 16.78 255.73 L 20.66 249.09 L 24.47 242.63 L 28.01 236.27 L 31.15 229.93 L 33.77 223.51 L 35.81 216.92 L 37.25 210.10 L 38.15 202.97 L 38.59 195.53 L 38.70 187.77 L 38.66 179.74 L 38.63 171.52 L 38.82 163.22 L 39.39 154.96 L 40.49 146.91 L 42.25 139.19 L 44.75 131.97 L 48.02 125.34 L 52.04 119.40 L 56.76 114.19 L 62.07 109.71 L 67.85 105.90 L 73.94 102.67 L 80.19 99.89 L 86.45 97.38 L 92.56 94.95 L 98.41 92.41 L 103.93 89.59 L 109.06 86.32 L 113.80 82.50 L 118.17 78.04 L 122.24 72.93 L 126.09 67.23 L 129.82 61.04 L 133.56 54.51 L 137.40 47.85 L 141.45 41.26 L 145.78 35.00 L 150.46 29.30 L 155.50 24.36 L 160.92 20.35 L 166.67 17.39 L 172.71 15.55 L 178.97 14.81 L 185.38 15.09 L 191.84 16.26 L 198.28 18.14 L 204.65 20.48 L 210.88 23.05 L 216.97 25.59 L 222.90 27.85 L 228.68 29.63 L 234.37 30.76 L 240.00 31.15 L 245.63 30.76 L 251.32 29.63 L 257.10 27.85 L 263.03 25.59 L 269.12 23.05 L 275.35 20.48 L 281.72 18.14 L 288.16 16.26 L 294.62 15.09 L 301.03 14.81 L 307.29 15.55 L 313.33 17.39 L 319.08 20.35 L 324.50 24.36 L 329.54 29.30 L 334.22 35.00 L 338.55 41.26 L 342.60 47.85 L 346.44 54.51 L 350.18 61.04 L 353.91 67.23 L 357.76 72.93 L 361.83 78.04 L 366.20 82.50 L 370.94 86.32 L 376.07 89.59 L 381.59 92.41 L 387.44 94.95 L 393.55 97.38 L 399.81 99.89 L 406.06 102.67 L 412.15 105.90 L 417.93 109.71 L 423.24 114.19 L 427.96 119.40 L 431.98 125.34 L 435.25 131.97 L 437.75 139.19 L 439.51 146.91 L 440.61 154.96 L 441.18 163.22 L 441.37 171.52 L 441.34 179.74 L 441.30 187.77 L 441.41 195.53 L 441.85 202.97 L 442.75 210.10 L 444.19 216.92 L 446.23 223.51 L 448.85 229.93 L 451.99 236.27 L 455.53 242.63 L 459.34 249.09 L 463.22 255.73 L 466.97 262.58 L 470.38 269.68 L 473.27 277.01 L 475.46 284.55 L 476.83 292.23 Z";

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
            aspectRatio: '480 / 600',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 22,
            padding: 'clamp(64px, 7vw, 86px) clamp(46px, 6vw, 60px)',
            textAlign: 'center',
            color: '#4c647a',
          }}
        >
          {/* Wavy oval — same scalloped shape as the invite/contact cards inside the site */}
          <svg
            viewBox="0 0 480 600"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 30px 60px rgba(0,0,0,.40)) drop-shadow(0 6px 18px rgba(0,0,0,.18))',
            }}
          >
            <path d={LANDER_WAVY} fill="#f2efe9" stroke="#4c647a" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </svg>
          <motion.img
            src="/photos/agenda/hg.png"
            alt="Haley & George"
            width={150}
            style={{
              position: 'relative', zIndex: 1,
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
            style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', width: '100%' }}
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
