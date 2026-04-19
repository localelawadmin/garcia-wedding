'use client';

// garcia-wedding/app/components/Navbar.tsx
// Minimal, editorial navigation — inspired by Adovasio restraint.
// Uses GarciaLogo — NOTE: do NOT pass a 'color' prop to GarciaLogo.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GarciaLogo from './GarciaLogo';

const NAV_LINKS = [
  { label: 'Schedule', href: '#schedule' },
  { label: 'Travel', href: '#travel' },
  { label: 'Wedding Party', href: '#wedding-party' },
  { label: 'Things To Do', href: '#things-to-do' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Registry', href: '#registry' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: scrolled ? '12px 40px' : '20px 40px',
          background: scrolled ? 'rgba(245,240,232,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(26,39,68,0.06)' : '1px solid transparent',
          transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <GarciaLogo width={110} height={44} />
        </motion.div>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '36px' }} className="hidden md:flex">
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "'Helvetica Now Display','Arial Narrow','Helvetica Neue',sans-serif",
                fontStretch: 'condensed',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#1A2744',
                textDecoration: 'none',
                opacity: 0.6,
                transition: 'opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                position: 'relative',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.05 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            zIndex: 110,
          }}
          aria-label="Toggle menu"
        >
          <motion.div
            style={{ width: '22px', height: '1.5px', background: '#1A2744', transformOrigin: 'center' }}
            animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            style={{ width: '22px', height: '1.5px', background: '#1A2744' }}
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            style={{ width: '22px', height: '1.5px', background: '#1A2744', transformOrigin: 'center' }}
            animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
              background: '#F5F0E8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Black Editorial Script', cursive",
                  fontSize: '36px',
                  color: '#1A2744',
                  textDecoration: 'none',
                  lineHeight: 1.2,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C05A68'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#1A2744'; }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
