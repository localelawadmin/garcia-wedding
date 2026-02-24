'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GarciaLogo from './GarciaLogo';

interface LandingPageProps {
  onSuccess: () => void;
}

export default function LandingPage({ onSuccess }: LandingPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [videoFading, setVideoFading] = useState(false);

  const correctPassword = process.env.NEXT_PUBLIC_PASSWORD || 'hdg3';

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      setVideoFading(true);
      await new Promise(r => setTimeout(r, 600));
      setTransitioning(true);
      sessionStorage.setItem('garcia-auth', 'true');
      await new Promise(r => setTimeout(r, 1800));
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
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #B8C8E0 0%, #C8D8C0 50%, #ABBE9C 100%)' }}
      animate={transitioning ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, delay: transitioning ? 0.8 : 0 }}
    >
      {/* Logo */}
      <motion.div
        className="mb-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <GarciaLogo width={180} height={90} color="#1A2744" />
      </motion.div>

      {/* Oval video frame */}
      <motion.div
        className="relative z-10"
        style={{ width: 280, height: 360 }}
        animate={
          transitioning
            ? { scale: 3.5, y: 180, opacity: 0 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <svg
          viewBox="0 0 280 360"
          width="280"
          height="360"
          style={{ filter: 'drop-shadow(0 12px 40px rgba(26,39,68,0.35))' }}
          overflow="visible"
        >
          <defs>
            <clipPath id="oval-clip">
              <ellipse cx="140" cy="180" rx="136" ry="172" />
            </clipPath>
          </defs>

          {/* Video inside oval */}
          <foreignObject x="4" y="8" width="272" height="344" clipPath="url(#oval-clip)">
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: '#000',
              }}
            >
              <motion.div
                style={{ width: '100%', height: '100%' }}
                animate={videoFading ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <iframe
                  src="https://www.youtube.com/embed/he6_qMIM3wY?autoplay=1&mute=1&loop=1&playlist=he6_qMIM3wY&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                  style={{
                    width: '180%',
                    height: '180%',
                    marginLeft: '-40%',
                    marginTop: '-40%',
                    border: 'none',
                    pointerEvents: 'none',
                  }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </motion.div>
            </div>
          </foreignObject>

          {/* Oval border */}
          <ellipse
            cx="140"
            cy="180"
            rx="136"
            ry="172"
            fill="none"
            stroke="#1A2744"
            strokeWidth="2.5"
          />
          {/* Inner oval ring for elegance */}
          <ellipse
            cx="140"
            cy="180"
            rx="130"
            ry="166"
            fill="none"
            stroke="#1A2744"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
        </svg>
      </motion.div>

      {/* Password form */}
      <motion.div
        className="mt-8 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={transitioning ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className={shake ? 'shake' : ''}
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: '0.2em',
              minWidth: 240,
              padding: '12px 24px',
              background: 'rgba(232,223,200,0.9)',
              border: error ? '1.5px solid #C05A68' : '1.5px solid #1A2744',
              color: '#1A2744',
              textAlign: 'center',
              fontSize: '16px',
              outline: 'none',
              backdropFilter: 'blur(4px)',
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: '0.25em',
              padding: '12px 36px',
              background: '#1A2744',
              color: '#E8DFC8',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase' as const,
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#C05A68')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A2744')}
          >
            Enter →
          </button>
        </form>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#C05A68',
                fontSize: '13px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
              }}
            >
              Incorrect password
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
