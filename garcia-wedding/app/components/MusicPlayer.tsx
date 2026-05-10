'use client';

import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { src: '/audio/leon-bridges.mp3',  label: 'Coming Home' },
  { src: '/audio/sam-cooke.mp3',     label: 'Bring It On Home' },
  { src: '/audio/frankie-valli.mp3', label: "Can't Take My Eyes Off You" },
];

const CREAM = '#f2efe9';

export default function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume]   = useState(0.4);
  const [muted, setMuted]     = useState(true);
  const [hover, setHover]     = useState(false);

  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const idxRef    = useRef(0);
  const volRef    = useRef(0.4);
  const mutedRef  = useRef(true);

  useEffect(() => {
    const startIdx = Math.floor(Math.random() * TRACKS.length);
    setTrackIdx(startIdx);
    idxRef.current = startIdx;
    const audio = new Audio(TRACKS[startIdx].src);
    audio.volume = 0.4;
    audioRef.current = audio;
    setMuted(false);
    mutedRef.current = false;
    audio.addEventListener('ended', goNext);

    // Music kicks in on first user interaction with the site (post-password).
    // MusicPlayer only mounts inside WeddingSite, so this only arms post-auth.
    let fired = false;
    const fire = () => {
      if (fired || !audioRef.current) return;
      fired = true;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      cleanup();
    };
    const cleanup = () => {
      document.removeEventListener('pointerdown', fire);
      document.removeEventListener('wheel', fire);
      document.removeEventListener('touchstart', fire);
      document.removeEventListener('keydown', fire);
      document.removeEventListener('scroll', fire, true);
    };
    document.addEventListener('pointerdown', fire);
    document.addEventListener('wheel', fire);
    document.addEventListener('touchstart', fire);
    document.addEventListener('keydown', fire);
    document.addEventListener('scroll', fire, true);

    return () => {
      audio.pause();
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTrack = (idx: number) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(TRACKS[idx].src);
    audio.muted = mutedRef.current;
    audio.volume = volRef.current;
    audioRef.current = audio;
    idxRef.current = idx;
    audio.addEventListener('ended', goNext);
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const goNext = () => {
    const next = (idxRef.current + Math.floor(Math.random() * (TRACKS.length - 1)) + 1) % TRACKS.length;
    setTrackIdx(next);
    loadTrack(next);
  };

  const goPrev = () => {
    const prev = (idxRef.current - 1 + TRACKS.length) % TRACKS.length;
    setTrackIdx(prev);
    loadTrack(prev);
  };

  const togglePlay = () => {
    const a = audioRef.current; if (!a) return;
    if (mutedRef.current) {
      mutedRef.current = false;
      setMuted(false);
      a.muted = false;
      a.volume = volRef.current;
    }
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const newMuted = !mutedRef.current;
    mutedRef.current = newMuted;
    setMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
      audioRef.current.volume = volRef.current;
      if (!newMuted && audioRef.current.paused) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    volRef.current = v;
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

  const iconBtn: React.CSSProperties = {
    width: 22, height: 22, borderRadius: '50%',
    border: '1px solid rgba(242, 239, 233, .45)',
    background: 'transparent', color: CREAM,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0, cursor: 'pointer', transition: 'all .25s',
    flexShrink: 0,
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed', bottom: 22, right: 22,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 18px 7px 12px',
        background: 'rgba(76, 100, 122, .65)',
        border: '1px solid rgba(242, 239, 233, .45)',
        borderRadius: 999,
        color: CREAM,
        backdropFilter: 'blur(14px) saturate(180%)',
        WebkitBackdropFilter: 'blur(14px) saturate(180%)',
        zIndex: 200,
        transition: 'padding .3s ease, gap .3s ease',
      }}
    >
      {/* Expanded controls — appear on hover (LEFT of play, so play stays put) */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          maxWidth: hover ? 220 : 0,
          opacity: hover ? 1 : 0,
          overflow: 'hidden',
          marginRight: hover ? 0 : -10,
          transition: 'max-width .35s ease, opacity .25s ease, margin-right .35s ease',
        }}
      >
        <input
          type="range" min={0} max={1} step={0.02}
          value={muted ? 0 : volume}
          onChange={handleVolume}
          aria-label="Volume"
          className="vol-slider"
        />

        <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} type="button"
          style={iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4c647a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}
        >
          {muted ? (
            <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M2 4 L4 4 L7 2 L7 10 L4 8 L2 8 Z" fill="currentColor" />
              <path d="M9 4 L11 6 M11 4 L9 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M2 4 L4 4 L7 2 L7 10 L4 8 L2 8 Z" fill="currentColor" />
              <path d="M9 4 Q10 6 9 8 M10.5 3 Q12 6 10.5 9" />
            </svg>
          )}
        </button>

        <button onClick={goNext} aria-label="Next" type="button"
          style={iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4c647a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}
        >
          <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2 L8 6 L3 10 Z M8 2 L9 2 L9 10 L8 10 Z"/></svg>
        </button>

        <button onClick={goPrev} aria-label="Previous" type="button"
          style={iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4c647a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}
        >
          <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M9 2 L9 10 L4 6 Z M3 2 L4 2 L4 10 L3 10 Z"/></svg>
        </button>

        <span style={{ width: 1, height: 12, background: 'rgba(242,239,233,.3)', flexShrink: 0 }} />
      </div>

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        aria-label={playing && !muted ? 'Pause' : 'Play'}
        type="button"
        style={iconBtn}
        onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4c647a'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}
      >
        {playing && !muted ? (
          <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><rect x="3" y="2" width="2" height="8"/><rect x="7" y="2" width="2" height="8"/></svg>
        ) : (
          <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2 L10 6 L3 10 Z" /></svg>
        )}
      </button>

      <span style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', opacity: .55, fontWeight: 400 }}>
        Now Playing
      </span>
      <span style={{ width: 1, height: 12, background: 'rgba(242,239,233,.3)' }} />
      <span
        className="heading"
        style={{ fontSize: 14, lineHeight: 1, fontWeight: 400, whiteSpace: 'nowrap' }}
      >
        {TRACKS[trackIdx].label}
      </span>
    </div>
  );
}
