'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRACKS = [
  { src: '/audio/leon-bridges.mp3',  label: 'Leon Bridges — Coming Home' },
  { src: '/audio/sam-cooke.mp3',     label: 'Sam Cooke — Bring It On Home' },
  { src: '/audio/frankie-valli.mp3', label: "Frankie Valli — Can't Take My Eyes Off You" },
];

const MARQUEE_STYLE = `
  @keyframes marquee-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

function MarqueeLabel({ text, active }: { text: string; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef     = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (containerRef.current && innerRef.current) {
      setOverflow(innerRef.current.scrollWidth > containerRef.current.clientWidth);
    }
  }, [text]);

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', maxWidth: 200, position: 'relative' }}>
      {overflow ? (
        <div style={{
          display: 'inline-flex', whiteSpace: 'nowrap',
          animation: 'marquee-scroll 10s linear infinite',
          animationDelay: '1.5s',
        }}>
          <span ref={innerRef} style={{ paddingRight: 48 }}>{text}</span>
          <span style={{ paddingRight: 48 }}>{text}</span>
        </div>
      ) : (
        <span ref={innerRef} style={{ whiteSpace: 'nowrap' }}>{text}</span>
      )}
    </div>
  );
}

export default function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying]   = useState(false);
  const [volume, setVolume]     = useState(0.4);
  const [muted, setMuted]       = useState(true);
  const [isOpen, setIsOpen]     = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(0.4);
  const mutedRef  = useRef(true);
  const idxRef    = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = MARQUEE_STYLE;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const loadTrack = (idx: number) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(TRACKS[idx].src);
    audio.volume = mutedRef.current ? 0 : volumeRef.current;
    audioRef.current = audio;
    idxRef.current = idx;
    audio.addEventListener('ended', () => {
      const next = (idxRef.current + Math.floor(Math.random() * (TRACKS.length - 1)) + 1) % TRACKS.length;
      idxRef.current = next;
      setTrackIdx(next);
      loadTrack(next);
    });
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  useEffect(() => {
    const idx = Math.floor(Math.random() * TRACKS.length);
    setTrackIdx(idx);
    idxRef.current = idx;
    const audio = new Audio(TRACKS[idx].src);
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => setPlaying(true)).catch(() => {});
    audio.addEventListener('ended', () => {
      const next = (idxRef.current + Math.floor(Math.random() * (TRACKS.length - 1)) + 1) % TRACKS.length;
      idxRef.current = next;
      setTrackIdx(next);
      loadTrack(next);
    });
    return () => { audio.pause(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (mutedRef.current) {
      mutedRef.current = false;
      setMuted(false);
      audio.volume = volumeRef.current;
    }
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const newMuted = !mutedRef.current;
    mutedRef.current = newMuted;
    setMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volumeRef.current;
      if (!newMuted && audioRef.current.paused) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }
  };

  const prev = () => {
    const idx = (idxRef.current - 1 + TRACKS.length) % TRACKS.length;
    setTrackIdx(idx);
    loadTrack(idx);
  };

  const next = () => {
    const idx = (idxRef.current + Math.floor(Math.random() * (TRACKS.length - 1)) + 1) % TRACKS.length;
    setTrackIdx(idx);
    loadTrack(idx);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    volumeRef.current = v;
    setVolume(v);
    if (v > 0 && mutedRef.current) {
      mutedRef.current = false;
      setMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = v;
        if (audioRef.current.paused) {
          audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
      }
    } else if (audioRef.current) {
      audioRef.current.volume = mutedRef.current ? 0 : v;
    }
  };

  const SALMON = '#E8896A';
  const BG = 'rgba(26,39,68,0.92)';
  const posY: React.CSSProperties = isMobile
    ? { top: 16, bottom: 'auto' }
    : { bottom: 24, top: 'auto' };

  const btn: React.CSSProperties = {
    background: 'none', border: 'none', color: '#E8DFC8',
    cursor: 'pointer', padding: '2px 6px', fontSize: 15, lineHeight: 1, opacity: 0.9,
  };

  const miniBtn: React.CSSProperties = {
    background: BG,
    borderRadius: '50%', width: 38, height: 38,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    fontSize: 17,
  };

  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed', right: 20, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        ...posY,
      }}>
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMute}
          title={muted ? 'Unmute music' : 'Mute music'}
          style={{
            ...miniBtn,
            border: `1.5px solid ${muted ? 'rgba(232,223,200,0.3)' : SALMON}`,
            color: muted ? '#aaa' : SALMON,
          }}
        >
          {muted ? '🔇' : '🔊'}
        </motion.button>
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.06 }}
          onClick={() => setIsOpen(true)}
          title="Open music player"
          style={{
            ...miniBtn,
            border: `1.5px solid ${SALMON}`,
            color: SALMON,
          }}
        >
          ♪
        </motion.button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="player"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          position: 'fixed', right: 20, zIndex: 100,
          background: BG,
          backdropFilter: 'blur(14px)',
          borderRadius: 14, padding: '11px 14px',
          display: 'flex', flexDirection: 'column', gap: 8,
          minWidth: 248,
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          border: '1px solid rgba(232,223,200,0.1)',
          ...posY,
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          title="Close player"
          style={{
            position: 'absolute', top: -10, right: -10,
            background: BG, border: '1.5px solid rgba(232,223,200,0.25)',
            borderRadius: '50%', width: 22, height: 22,
            color: '#aaa', fontSize: 14, lineHeight: 1,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>

        <div style={{
          color: muted ? SALMON : '#E8DFC8',
          fontSize: 10,
          fontFamily: "'Helvetica Now Display','Arial Narrow','Helvetica Neue',sans-serif",
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          <MarqueeLabel text={TRACKS[trackIdx].label} active={!muted} />
          {muted && (
            <div style={{ fontSize: 9, color: 'rgba(232,137,106,0.65)', marginTop: 3, letterSpacing: '0.06em' }}>
              click ▶ or 🔊 to unmute
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={prev}       style={btn} aria-label="Previous">⏮</button>
          <button onClick={togglePlay} style={{ ...btn, fontSize: 17, color: SALMON, padding: '2px 8px' }} aria-label={playing ? 'Pause' : 'Play'}>
            {playing && !muted ? '⏸' : '▶'}
          </button>
          <button onClick={next}       style={btn} aria-label="Next">⏭</button>
          <button onClick={toggleMute} style={{ ...btn, fontSize: 14, marginLeft: 2 }} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? '🔇' : '🔊'}
          </button>
          <input
            type="range" min={0} max={1} step={0.02}
            value={muted ? 0 : volume}
            onChange={handleVolume}
            style={{ flex: 1, accentColor: SALMON, cursor: 'pointer', marginLeft: 2 }}
            aria-label="Volume"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
