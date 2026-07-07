'use client';

import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { src: '/audio/leon-bridges.mp3',  label: 'Coming Home',              artist: 'Leon Bridges' },
  { src: '/audio/sam-cooke.mp3',     label: 'Bring It On Home',         artist: 'Sam Cooke' },
  { src: '/audio/frankie-valli.mp3', label: "Can't Take My Eyes Off You", artist: 'Frankie Valli' },
];

const CREAM = '#FDFDFC';

export default function MusicPlayer() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume]   = useState(0.4);
  const [muted, setMuted]     = useState(true);
  const [hover, setHover]     = useState(false);
  const [mq, setMq]           = useState<{ on: boolean; shift: number; dur: number }>({ on: false, shift: 0, dur: 0 });

  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const idxRef    = useRef(0);
  const volRef    = useRef(0.4);
  const mutedRef  = useRef(true);
  const boxRef    = useRef<HTMLDivElement | null>(null);
  const textRef   = useRef<HTMLSpanElement | null>(null);

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

  // Marquee: the now-playing line always side-scrolls (iPod-style, seamless loop)
  useEffect(() => {
    const txt = textRef.current;
    if (!txt) return;
    const measure = () => {
      const tw = txt.scrollWidth;
      if (tw > 4) {
        const shift = tw + 34;
        setMq({ on: true, shift, dur: Math.max(6, shift / 32) });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(txt);
    return () => ro.disconnect();
  }, [trackIdx]);

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
  const track = TRACKS[trackIdx];
  const nowText = track.artist ? `${track.label} · ${track.artist}` : track.label;

  const tbtn = (onClick: () => void, label: string, svg: React.ReactNode) => (
    <button onClick={onClick} aria-label={label} type="button" style={iconBtn}
      onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4E5B37'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}>
      {svg}
    </button>
  );

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed', bottom: 22, right: 22, zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 14,
      }}
    >
      {/* Control panel — unfurls to the LEFT on hover */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          maxWidth: hover ? 'min(340px, calc(100vw - 88px))' : 0,
          opacity: hover ? 1 : 0,
          overflow: 'hidden',
          padding: hover ? '13px 18px' : '13px 0',
          background: 'rgba(78, 91, 55, .68)',
          border: `1px solid ${hover ? 'rgba(253,253,252,.30)' : 'transparent'}`,
          borderRadius: 16,
          backdropFilter: 'blur(14px) saturate(180%)',
          WebkitBackdropFilter: 'blur(14px) saturate(180%)',
          color: CREAM,
          transition: 'max-width .42s ease, opacity .3s ease, padding .42s ease',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 96px', columnGap: 16, rowGap: 9, alignItems: 'center' }}>
          <span style={{ fontSize: 8.5, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: .55, fontWeight: 400, whiteSpace: 'nowrap' }}>
            Now Playing
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {tbtn(goPrev, 'Previous', <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M9 2 L9 10 L4 6 Z M3 2 L4 2 L4 10 L3 10 Z"/></svg>)}
            {tbtn(togglePlay, playing && !muted ? 'Pause' : 'Play', playing && !muted
              ? <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><rect x="3" y="2" width="2" height="8"/><rect x="7" y="2" width="2" height="8"/></svg>
              : <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2 L10 6 L3 10 Z" /></svg>)}
            {tbtn(goNext, 'Next', <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2 L8 6 L3 10 Z M8 2 L9 2 L9 10 L8 10 Z"/></svg>)}
          </div>
          <div ref={boxRef} style={{ overflow: 'hidden', minWidth: 0, maxWidth: 168 }}>
            <div style={(mq.on
              ? { display: 'inline-flex', whiteSpace: 'nowrap', animation: `mp-marquee ${mq.dur}s linear infinite`, '--mq-shift': `-${mq.shift}px` }
              : { display: 'inline-flex', whiteSpace: 'nowrap' }) as React.CSSProperties}>
              <span ref={textRef} className="heading" style={{ fontSize: 14, lineHeight: 1.15, fontWeight: 400 }}>{nowText}</span>
              {mq.on && <span aria-hidden="true" style={{ padding: '0 14px', opacity: .5 }}>•</span>}
              {mq.on && <span aria-hidden="true" className="heading" style={{ fontSize: 14, lineHeight: 1.15, fontWeight: 400 }}>{nowText}</span>}
              {mq.on && <span aria-hidden="true" style={{ padding: '0 14px', opacity: .5 }}>•</span>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {tbtn(toggleMute, muted ? 'Unmute' : 'Mute', muted
              ? <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M2 4 L4 4 L7 2 L7 10 L4 8 L2 8 Z" fill="currentColor" /><path d="M9 4 L11 6 M11 4 L9 6" /></svg>
              : <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M2 4 L4 4 L7 2 L7 10 L4 8 L2 8 Z" fill="currentColor" /><path d="M9 4 Q10 6 9 8 M10.5 3 Q12 6 10.5 9" /></svg>)}
            <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={handleVolume} aria-label="Volume" className="vol-slider" style={{ flex: 1, width: 'auto', minWidth: 0 }} />
          </div>
        </div>
      </div>

      {/* Spinning record — HG label; pulse when playing; tonearm from top-right; click toggles play */}
      <div
        onClick={togglePlay}
        role="button"
        tabIndex={0}
        aria-label={playing && !muted ? 'Pause' : 'Play'}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePlay(); } }}
        style={{ position: 'relative', width: 56, height: 56, flexShrink: 0, cursor: 'pointer' }}
      >
        {spinning && (
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
            border: '1.5px solid rgba(174,184,133,.5)',
            animation: 'rec-pulse 2.4s ease-out infinite',
          }} />
        )}
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
            width: 30, height: 30, borderRadius: '50%', background: CREAM,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 0.5px rgba(78,91,55,.35)',
          }}>
            <img src="/photos/agenda/hg-monogram.png" alt="" style={{ width: 33, height: 'auto', display: 'block' }} />
          </div>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,.16), transparent 46%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none', border: '1px solid rgba(40,48,28,.5)' }} />
        <svg viewBox="0 0 64 60" aria-hidden="true" style={{ position: 'absolute', top: -10, right: -8, width: 64, height: 60, overflow: 'visible', pointerEvents: 'none' }}>
          <line x1="55" y1="11" x2="37" y2="26" stroke="#FDFDFC" strokeWidth="2.2" strokeLinecap="round" opacity="0.92" />
          <rect x="33.5" y="23" width="8" height="4.2" rx="1.6" fill="#FDFDFC" transform="rotate(40 37 26)" />
          <circle cx="55" cy="11" r="4.6" fill="#4E5B37" stroke="#FDFDFC" strokeWidth="1.1" />
          <circle cx="55" cy="11" r="1.5" fill="#FDFDFC" />
          <circle cx="59.5" cy="7.5" r="2.4" fill="#4E5B37" stroke="#FDFDFC" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
}
