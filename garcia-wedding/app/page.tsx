'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import WeddingSite from './components/WeddingSite';

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session storage for auth flag
    const auth = sessionStorage.getItem('garcia-auth');
    setAuthenticated(auth === 'true');
  }, []);

  // Don't render until we know auth state
  if (authenticated === null) return null;

  return (
    <AnimatePresence mode="wait">
      {!authenticated ? (
        <motion.div key="landing" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <LandingPage onSuccess={() => setAuthenticated(true)} />
        </motion.div>
      ) : (
        <motion.div key="site" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <WeddingSite />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
