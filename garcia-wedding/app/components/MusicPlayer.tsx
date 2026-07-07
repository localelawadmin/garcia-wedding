'use client';

import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { src: '/audio/leon-bridges.mp3',  label: 'Coming Home' },
  { src: '/audio/sam-cooke.mp3',     label: 'Bring It On Home' },
  { src: '/audio/frankie-valli.mp3', label: "Can't Take My Eyes Off You" },
];

const CREAM = '#FDFDFC';

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

  const spinning = playing;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed', bottom: 22, right: 22, zIndex: 200,
        display: 'flex', alignItems: 'flex-end', gap: 12,
      }}
    >
      {/* Control panel — unfurls to the LEFT on hover */}
      <div
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 9,
          maxWidth: hover ? 'min(300px, calc(100vw - 96px))' : 0,
          opacity: hover ? 1 : 0,
          overflow: 'hidden',
          padding: hover ? '12px 16px' : '12px 0',
          background: 'rgba(78, 91, 55, .65)',
          border: `1px solid ${hover ? 'rgba(253,253,252,.32)' : 'transparent'}`,
          borderRadius: 16,
          backdropFilter: 'blur(14px) saturate(180%)',
          WebkitBackdropFilter: 'blur(14px) saturate(180%)',
          color: CREAM,
          transition: 'max-width .4s ease, opacity .3s ease, padding .4s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, minWidth: 0 }}>
          <span style={{ fontSize: 8.5, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: .55, fontWeight: 400, whiteSpace: 'nowrap' }}>
            Now Playing
          </span>
          <span className="heading" style={{ fontSize: 14, lineHeight: 1.15, fontWeight: 400, textAlign: 'right' }}>
            {TRACKS[trackIdx].label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <button onClick={goPrev} aria-label="Previous" type="button" style={iconBtn}
            onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4E5B37'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}>
            <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M9 2 L9 10 L4 6 Z M3 2 L4 2 L4 10 L3 10 Z"/></svg>
          </button>
          <button onClick={togglePlay} aria-label={playing && !muted ? 'Pause' : 'Play'} type="button" style={iconBtn}
            onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4E5B37'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}>
            {playing && !muted ? (
              <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><rect x="3" y="2" width="2" height="8"/><rect x="7" y="2" width="2" height="8"/></svg>
            ) : (
              <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2 L10 6 L3 10 Z" /></svg>
            )}
          </button>
          <button onClick={goNext} aria-label="Next" type="button" style={iconBtn}
            onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4E5B37'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}>
            <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2 L8 6 L3 10 Z M8 2 L9 2 L9 10 L8 10 Z"/></svg>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} type="button" style={iconBtn}
            onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4E5B37'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}>
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
          <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={handleVolume} aria-label="Volume" className="vol-slider" />
        </div>
      </div>

      {/* Spinning record — HG label in the center; click toggles play */}
      <div
        onClick={togglePlay}
        role="button"
        tabIndex={0}
        aria-label={playing && !muted ? 'Pause' : 'Play'}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePlay(); } }}
        style={{ position: 'relative', width: 56, height: 56, flexShrink: 0, cursor: 'pointer' }}
      >
        <div
          style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: 'repeating-radial-gradient(circle at 50% 50%, #3b4528 0 1.4px, #4E5B37 1.4px 3px)',
            boxShadow: '0 6px 16px rgba(40,48,28,.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'mp-spin 3.4s linear infinite',
            animationPlayState: spinning ? 'running' : 'paused',
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%', background: CREAM,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 0.5px rgba(78,91,55,.35)',
          }}>
            <img src="/photos/agenda/hg-monogram.png" alt="" style={{ width: 17, height: 'auto', display: 'block' }} />
          </div>
        </div>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,.16), transparent 46%)',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
          border: '1px solid rgba(40,48,28,.5)',
        }} />
      </div>
    </div>
  );
}
