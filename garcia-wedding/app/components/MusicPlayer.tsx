'use client';

import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { src: '/audio/leon-bridges.mp3',  label: 'Coming Home' },
  { src: '/audio/sam-cooke.mp3',     label: 'Bring It On Home' },
  { src: '/audio/frankie-valli.mp3', label: "Can't Take My Eyes Off You" },
];

export default function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idxRef   = useRef(0);

  useEffect(() => {
    const startIdx = Math.floor(Math.random() * TRACKS.length);
    setTrackIdx(startIdx);
    idxRef.current = startIdx;
    const audio = new Audio(TRACKS[startIdx].src);
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    audio.addEventListener('ended', () => advance());
    return () => { audio.pause(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = () => {
    const next = (idxRef.current + Math.floor(Math.random() * (TRACKS.length - 1)) + 1) % TRACKS.length;
    setTrackIdx(next);
    idxRef.current = next;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(TRACKS[next].src);
    audio.volume = audioRef.current?.volume ?? 0.4;
    audioRef.current = audio;
    audio.addEventListener('ended', advance);
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const togglePlay = () => {
    const a = audioRef.current; if (!a) return;
    if (a.paused) {
      if (a.volume === 0) a.volume = 0.4;
      a.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', bottom: 22, right: 22,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '7px 18px 7px 12px',
        background: 'rgba(0,0,0,.5)',
        border: '1px solid rgba(242,239,233,.35)',
        borderRadius: 999,
        color: '#f2efe9',
        backdropFilter: 'blur(10px)',
        zIndex: 200,
      }}
    >
      <button
        onClick={togglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
        type="button"
        style={{
          width: 22, height: 22, borderRadius: '50%',
          border: '1px solid rgba(242,239,233,.55)',
          background: 'transparent',
          color: '#f2efe9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, cursor: 'pointer',
          transition: 'all .25s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f2efe9'; e.currentTarget.style.color = '#0a0a0a'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f2efe9'; }}
      >
        {playing ? (
          <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><rect x="3" y="2" width="2" height="8"/><rect x="7" y="2" width="2" height="8"/></svg>
        ) : (
          <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2 L10 6 L3 10 Z" /></svg>
        )}
      </button>
      <span style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', opacity: .55, fontWeight: 300 }}>
        Now Playing
      </span>
      <span style={{ width: 1, height: 12, background: 'rgba(242,239,233,.3)' }} />
      <span
        onClick={advance}
        style={{
          fontFamily: "'Montmartre','Cormorant Garamond',Georgia,serif",
          fontStyle: 'italic',
          fontSize: 13,
          lineHeight: 1,
          fontWeight: 400,
          cursor: 'pointer',
        }}
        title="Next track"
      >
        {TRACKS[trackIdx].label}
      </span>
    </div>
  );
}
