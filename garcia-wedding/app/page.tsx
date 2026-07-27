'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import WeddingSite from './components/WeddingSite';
import HGIntro from './components/HGIntro';

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [intro, setIntro] = useState(false);      // runs only right after the password
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('garcia-auth') === 'true';
    setAuthenticated(auth);
    if (auth) setRevealed(true);                  // already in this session: no intro
  }, []);

  if (authenticated === null) return null;

  return (
    <>
      {/* solid olive field sits behind the lander so the slide-up reveals colour, not the site */}
      {(!revealed || intro) && (
        <div style={{ position: 'fixed', inset: 0, background: '#4E5B37', zIndex: 250 }} aria-hidden="true" />
      )}

      {authenticated && (
        <div style={{
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.1s cubic-bezier(.22,1,.36,1)',
        }}>
          <WeddingSite />
        </div>
      )}

      {intro && <HGIntro onDone={() => { setIntro(false); setRevealed(true); }} />}

      <AnimatePresence>
        {!authenticated && (
          <motion.div
            key="landing"
            style={{ position: 'relative', zIndex: 400 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }}
          >
            <LandingPage
              onSuccess={() => { setIntro(true); setAuthenticated(true); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
