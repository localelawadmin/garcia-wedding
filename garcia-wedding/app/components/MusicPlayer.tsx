'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/wedding.mp3');
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    audio.play()
      .then(() => {
        setPlaying(true);
        const onInteract = () => {
          setMuted(false);
          let v = 0;
          const tick = setInterval(() => {
            v = Math.min(v + 0.05, 0.4);
            audio.volume = v;
            if (v >= 0.4) clearInterval(tick);
          }, 60);
        };
        ['click', 'touchstart', 'keydown'].forEach(e =>
          document.addEventListener(e, onInteract, { once: true, passive: true })
        );
      })
      .catch(() => {});

    return () => { audio.pause(); };
  }, []);

  const toggleSpotify = () => setOpen(p => !p);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

      <AnimatePresence>
        {playing && muted && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 2, duration: 0.5 }}
            style={{
              background: 'rgba(26,39,68,0.85)', color: '#E8DFC8',
              fontSize: 10, letterSpacing: '0.14em', padding: '5px 13px',
              borderRadius: 20, backdropFilter: 'blur(6px)',
              fontFamily: "'Helvetica Now Display','Arial Narrow','Helvetica Neue',sans-serif",
              textTransform: 'uppercase' as const, pointerEvents: 'none', whiteSpace: 'nowrap' as const,
            }}
          >
            ♫ Tap to unmute
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}
          >
            <iframe
              src="https://open.spotify.com/embed/playlist/1QlhR6tG9oAC2Xk557xV6P?utm_source=generator&theme=0"
              width="320" height="152" frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy" title="Wedding Playlist"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleSpotify}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        style={{
          width: 54, height: 54, borderRadius: '50%',
          background: 'linear-gradient(135deg, #C05A68, #E8896A)',
          color: '#fff', fontSize: 20, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(192,90,104,0.4)',
          position: 'relative' as const,
        }}
        aria-label="Toggle music"
      >
        {open ? '✕' : '♪'}
        {muted && playing && (
          <span style={{
            position: 'absolute', top: 2, right: 2, width: 10, height: 10,
            borderRadius: '50%', background: '#fff', border: '2px solid #E8896A',
          }} />
        )}
      </motion.button>
    </div>
  );
}
