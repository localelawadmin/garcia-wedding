'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ width: 320 }}
          >
            <iframe
              src="https://open.spotify.com/embed/playlist/1QlhR6tG9oAC2Xk557xV6P?utm_source=generator&theme=0"
              width="320"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Wedding Playlist"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg pulse-glow"
        style={{ background: 'linear-gradient(135deg, #C05A68, #E8896A)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle music player"
      >
        {open ? '✕' : '♪'}
      </motion.button>
    </div>
  );
}
