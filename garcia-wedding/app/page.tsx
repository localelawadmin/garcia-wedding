'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import WeddingSite from './components/WeddingSite';
import HGReveal from './components/HGReveal';

type Phase = 'lander' | 'green' | 'move' | 'reveal' | 'done';

type UmamiProps = Record<string, unknown>;
declare global {
  interface Window {
    umami?: { track: (fn: (props: UmamiProps) => UmamiProps) => void };
  }
}

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>('lander');

  useEffect(() => {
    const auth = sessionStorage.getItem('garcia-auth') === 'true';
    setAuthenticated(auth);
    if (auth) setPhase('done');          // already in this session: straight to the site
  }, []);

  // The site never changes URL, so report the wedding site to Umami as its own
  // virtual page. "/" is everyone who arrives, "/welcome" is everyone who got past
  // the password — the two are directly comparable as a funnel.
  useEffect(() => {
    if (!authenticated) return;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const send = () => {
      // the tracker is loaded afterInteractive, so it may not be up yet
      if (window.umami?.track) {
        window.umami.track(props => ({ ...props, url: '/welcome', title: 'Wedding Site' }));
        return;
      }
      if (tries++ < 40) timer = setTimeout(send, 150);   // give up after ~6s
    };
    send();
    return () => clearTimeout(timer);
  }, [authenticated]);

  // password accepted -> hold the monogram, turn the page olive, then move it
  const onSuccess = useCallback(() => {
    setAuthenticated(true);
    setPhase('green');
    setTimeout(() => setPhase('move'), 1900);   // let the lander finish dissolving first
  }, []);

  const onArrived = useCallback(() => {
    setPhase('reveal');
    setTimeout(() => setPhase('done'), 1100);
  }, []);

  if (authenticated === null) return null;
  const showSite = authenticated;
  const siteVisible = phase === 'reveal' || phase === 'done';

  return (
    <>
      {showSite && (
        <div style={{
          opacity: siteVisible ? 1 : 0,
          transition: 'opacity 1s cubic-bezier(.22,1,.36,1)',
        }}>
          <WeddingSite />
        </div>
      )}

      <AnimatePresence>
        {!authenticated && (
          <motion.div
            key="landing"
            style={{ position: 'relative', zIndex: 280 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.15, ease: [0.33, 0, 0.2, 1] }}
          >
            <LandingPage onSuccess={onSuccess} />
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== 'done' && (
        <HGReveal phase={phase as Exclude<Phase, 'done'>} onArrived={onArrived} />
      )}
    </>
  );
}
