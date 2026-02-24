'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TRACKS = [
  { src: '/audio/leon-bridges.mp3',   label: "Leon Bridges â Coming Home" },
  { src: '/audio/sam-cooke.mp3',      label: "Sam Cooke â Bring It On Home" },
  { src: '/audio/frankie-valli.mp3',  label: "Frankie Valli â Can't Take My Eyes Off You" },
];

export default function MusicPlayer() {
  const [trackIdx, setTrackIdx]   = useState(() => Math.floor(Math.random() * TRACKS.length));
  const [playing,  setPlaying]    = useState(false);
  const [volume,   setVolume]     = useState(0.4);
  const [unmuted,  setUnmuted]    = useState(false);

  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const volumeRef  = useRef(0.4);
  const unmutedRef = useRef(false);
  const idxRef     = useRef(trackIdx);

  // helpers that stay stable across renders
  const loadTrack = (idx: number, autoplay: boolean) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(TRACKS[idx].src);
    audio.volume = unmutedRef.current ? volumeRef.current : 0;
    audioRef.current = audio;
    idxRef.current = idx;
    audio.addEventListener('ended', () => {
      const next = (idxRef.current + Math.floor(Math.random() * (TRACKS.length - 1)) + 1) % TRACKS.length;
      idxRef.current = next;
      setTrackIdx(next);
      loadTrack(next, true);
    });
    if (autoplay) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  // mount: pick random track, autoplay muted
  useEffect(() => {
    const idx = Math.floor(Math.random() * TRACKS.length);
    setTrackIdx(idx);
    idxRef.current = idx;
    const audio = new Audio(TRACKS[idx].src);
    audio.volume = 0;
    audioRef.current = audio;

    audio.play()
      .then(() => {
        setPlaying(true);
        const onInteract = () => {
          unmutedRef.current = true;
          setUnmuted(true);
          if (audioRef.current) audioRef.current.volume = volumeRef.current;
        };
        ['click', 'touchstart', 'keydown'].forEach(e =>
          document.addEventListener(e, onInteract, { once: true, passive: true })
        );
      })
      .catch(() => {});

    audio.addEventListener('ended', () => {
      const next = (idxRef.current + Math.floor(Math.random() * (TRACKS.length - 1)) + 1) % TRACKS.length;
      idxRef.current = next;
      setTrackIdx(next);
      loadTrack(next, true);
    });

    return () => { audio.pause(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (!unmutedRef.current) {
        unmutedRef.current = true;
        setUnmuted(true);
        audio.volume = volumeRef.current;
      }
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const prev = () => {
    const idx = (idxRef.current - 1 + TRACKS.length) % TRACKS.length;
    setTrackIdx(idx);
    loadTrack(idx, true);
  };

  const next = () => {
    const idx = (idxRef.current + Math.floor(Math.random() * (TRACKS.length - 1)) + 1) % TRACKS.length;
    setTrackIdx(idx);
    loadTrack(idx, true);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    volumeRef.current = v;
    setVolume(v);
    unmutedRef.current = true;
    setUnmuted(true);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const btn: React.CSSProperties = {
    background: 'none', border: 'none', color: '#E8DFC8',
    cursor: 'pointer', padding: '2px 6px', fontSize: 15,
    lineHeight: 1, opacity: 0.9,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 50,
        background: 'rgba(26,39,68,0.9)',
        backdropFilter: 'blur(14px)',
        borderRadius: 14,
        padding: '11px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 248,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        border: '1px solid rgba(232,223,200,0.1)',
      }}
    >
      {/* Track name / unmute hint */}
      <div style={{
        color: !unmuted ? '#E8896A' : '#E8DFC8',
        fontSize: 10,
        fontFamily: "'Helvetica Now Display','Arial Narrow','Helvetica Neue',sans-serif",
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 224,
      }}>
        {!unmuted ? 'â«  Tap anywhere to unmute' : 'â«  ' + TRACKS[trackIdx].label}
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={prev}       style={btn} aria-label="Previous">â®</button>
        <button onClick={togglePlay} style={{ ...btn, fontSize: 17, color: '#E8896A', padding: '2px 8px' }} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? 'â¸' : 'â¶'}
        </button>
        <button onClick={next}       style={btn} aria-label="Next">â­</button>
        <input
          type="range" min={0} max={1} step={0.02}
          value={unmuted ? volume : 0}
          onChange={handleVolume}
          style={{ flex: 1, accentColor: '#E8896A', cursor: 'pointer', marginLeft: 4 }}
          aria-label="Volume"
        />
      </div>
    </motion.div>
  );
}
