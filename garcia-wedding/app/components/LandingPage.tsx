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
const LANDER_WAVY = "M 454.70 300.00 L 455.01 306.98 L 455.92 314.02 L 457.34 321.19 L 459.14 328.54 L 461.17 336.07 L 463.22 343.80 L 465.09 351.69 L 466.59 359.67 L 467.53 367.68 L 467.75 375.61 L 467.16 383.37 L 465.69 390.85 L 463.33 397.98 L 460.13 404.69 L 456.18 410.94 L 451.62 416.73 L 446.62 422.10 L 441.37 427.12 L 436.04 431.88 L 430.83 436.50 L 425.88 441.13 L 421.33 445.90 L 417.26 450.93 L 413.70 456.35 L 410.64 462.22 L 408.03 468.58 L 405.78 475.42 L 403.75 482.67 L 401.81 490.25 L 399.81 497.99 L 397.58 505.73 L 395.00 513.28 L 391.96 520.44 L 388.38 527.02 L 384.22 532.87 L 379.48 537.85 L 374.19 541.90 L 368.42 545.00 L 362.26 547.18 L 355.83 548.55 L 349.23 549.25 L 342.60 549.48 L 336.04 549.45 L 329.62 549.40 L 323.43 549.54 L 317.48 550.08 L 311.80 551.19 L 306.35 552.98 L 301.09 555.50 L 295.96 558.75 L 290.89 562.64 L 285.81 567.03 L 280.65 571.75 L 275.35 576.55 L 269.88 581.20 L 264.21 585.43 L 258.36 589.01 L 252.34 591.72 L 246.20 593.42 L 240.00 594.00 L 233.80 593.42 L 227.66 591.72 L 221.64 589.01 L 215.79 585.43 L 210.12 581.20 L 204.65 576.55 L 199.35 571.75 L 194.19 567.03 L 189.11 562.64 L 184.04 558.75 L 178.91 555.50 L 173.65 552.98 L 168.20 551.19 L 162.52 550.08 L 156.57 549.54 L 150.38 549.40 L 143.96 549.45 L 137.40 549.48 L 130.77 549.25 L 124.18 548.55 L 117.74 547.18 L 111.58 545.00 L 105.81 541.90 L 100.52 537.85 L 95.78 532.87 L 91.62 527.02 L 88.04 520.44 L 85.00 513.28 L 82.42 505.73 L 80.19 497.99 L 78.19 490.25 L 76.25 482.67 L 74.22 475.42 L 71.97 468.58 L 69.36 462.22 L 66.30 456.35 L 62.74 450.93 L 58.67 445.90 L 54.12 441.13 L 49.17 436.50 L 43.96 431.88 L 38.63 427.12 L 33.38 422.10 L 28.38 416.73 L 23.82 410.94 L 19.87 404.69 L 16.67 397.98 L 14.31 390.85 L 12.84 383.37 L 12.25 375.61 L 12.47 367.68 L 13.41 359.67 L 14.91 351.69 L 16.78 343.80 L 18.83 336.07 L 20.86 328.54 L 22.66 321.19 L 24.08 314.02 L 24.99 306.98 L 25.30 300.00 L 24.99 293.02 L 24.08 285.98 L 22.66 278.81 L 20.86 271.46 L 18.83 263.93 L 16.78 256.20 L 14.91 248.31 L 13.41 240.33 L 12.47 232.32 L 12.25 224.39 L 12.84 216.63 L 14.31 209.15 L 16.67 202.02 L 19.87 195.31 L 23.82 189.06 L 28.38 183.27 L 33.38 177.90 L 38.63 172.88 L 43.96 168.12 L 49.17 163.50 L 54.12 158.87 L 58.67 154.10 L 62.74 149.07 L 66.30 143.65 L 69.36 137.78 L 71.97 131.42 L 74.22 124.58 L 76.25 117.33 L 78.19 109.75 L 80.19 102.01 L 82.42 94.27 L 85.00 86.72 L 88.04 79.56 L 91.62 72.98 L 95.78 67.13 L 100.52 62.15 L 105.81 58.10 L 111.58 55.00 L 117.74 52.82 L 124.17 51.45 L 130.77 50.75 L 137.40 50.52 L 143.96 50.55 L 150.38 50.60 L 156.57 50.46 L 162.52 49.92 L 168.20 48.81 L 173.65 47.02 L 178.91 44.50 L 184.04 41.25 L 189.11 37.36 L 194.19 32.97 L 199.35 28.25 L 204.65 23.45 L 210.12 18.80 L 215.79 14.57 L 221.64 10.99 L 227.66 8.28 L 233.80 6.58 L 240.00 6.00 L 246.20 6.58 L 252.34 8.28 L 258.36 10.99 L 264.21 14.57 L 269.88 18.80 L 275.35 23.45 L 280.65 28.25 L 285.81 32.97 L 290.89 37.36 L 295.96 41.25 L 301.09 44.50 L 306.35 47.02 L 311.80 48.81 L 317.48 49.92 L 323.43 50.46 L 329.62 50.60 L 336.04 50.55 L 342.60 50.52 L 349.23 50.75 L 355.83 51.45 L 362.26 52.82 L 368.42 55.00 L 374.19 58.10 L 379.48 62.15 L 384.22 67.13 L 388.38 72.98 L 391.96 79.56 L 395.00 86.72 L 397.58 94.27 L 399.81 102.01 L 401.81 109.75 L 403.75 117.33 L 405.78 124.58 L 408.03 131.42 L 410.64 137.78 L 413.70 143.65 L 417.26 149.07 L 421.33 154.10 L 425.88 158.87 L 430.83 163.50 L 436.04 168.12 L 441.37 172.88 L 446.62 177.90 L 451.62 183.27 L 456.18 189.06 L 460.13 195.31 L 463.33 202.02 L 465.69 209.15 L 467.16 216.63 L 467.75 224.39 L 467.53 232.32 L 466.59 240.33 L 465.09 248.31 L 463.22 256.20 L 461.17 263.93 L 459.14 271.46 L 457.34 278.81 L 455.92 285.98 L 455.01 293.02 Z";

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
      style={{ position: 'fixed', inset: 0, background: '#364C63', overflow: 'hidden' }}
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
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(79, 110, 142, .42)', backdropFilter: 'saturate(180%)', WebkitBackdropFilter: 'saturate(180%)' }} />

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: .25, mixBlendMode: 'overlay',
        backgroundImage: GRAIN_SVG,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at center, rgba(54,76,99,0) 30%, rgba(54,76,99,.3) 80%, rgba(54,76,99,.6) 100%)',
      }} />

      {/* SVG defs for tinting the HG lockup to deep-dark on the cream card */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="lander-tint-deep-dark" colorInterpolationFilters="sRGB">
            <feFlood floodColor="#4E5B37" />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Content — cream oval card with initials + password */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#4E5B37', padding: '0 24px',
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
            color: '#4E5B37',
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
            <path d={LANDER_WAVY} fill="#FDFDFC" stroke="#4E5B37" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <path d={LANDER_WAVY} fill="none" stroke="#DEE9F2" strokeWidth={1} vectorEffect="non-scaling-stroke" transform="translate(240 300) scale(0.94) translate(-240 -300)" />
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
            initial={{ opacity: 0, y: -8, x: -8 }}
            animate={{ opacity: 1, y: 0, x: -8 }}
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
                border: error ? '1px solid #c05a68' : '1px solid #4E5B37',
                color: '#4E5B37',
                padding: '11px 18px',
                width: '100%',
                maxWidth: 220,
                textAlign: 'center',
                fontSize: 16,
                letterSpacing: '0.2em',
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
                border: '1px solid #4E5B37',
                color: '#4E5B37',
                padding: '10px 28px',
                fontSize: 10,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 400,
                transition: 'all .25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#4E5B37'; e.currentTarget.style.color = '#FDFDFC'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4E5B37'; }}
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
