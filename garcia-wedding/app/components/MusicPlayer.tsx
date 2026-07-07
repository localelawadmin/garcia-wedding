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
  const [volume, setVolume]   = useState(0.1);
  const [muted, setMuted]     = useState(true);
  const [hover, setHover]     = useState(false);
  const [pinned, setPinned]   = useState(false);
  const [mq, setMq]           = useState<{ on: boolean; shift: number; dur: number }>({ on: false, shift: 0, dur: 0 });

  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const idxRef    = useRef(0);
  const volRef    = useRef(0.1);
  const mutedRef  = useRef(true);
  const boxRef    = useRef<HTMLDivElement | null>(null);
  const textRef   = useRef<HTMLSpanElement | null>(null);
  const discRef   = useRef<HTMLDivElement | null>(null);
  const ctxRef    = useRef<AudioContext | null>(null);
  const gainRef   = useRef<GainNode | null>(null);
  const wantRef   = useRef(false);

  // Web Audio gain so we can start genuinely quiet even on iOS (element.volume is ignored there).
  const setGain = () => {
    const v = mutedRef.current ? 0 : volRef.current;
    if (gainRef.current) gainRef.current.gain.value = v;
    else if (audioRef.current) audioRef.current.volume = v;
  };
  const setupGraph = () => {
    if (ctxRef.current || !audioRef.current) return;
    try {
      const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
      const Ctx = W.AudioContext || W.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = mutedRef.current ? 0 : volRef.current;
      gain.connect(ctx.destination);
      ctx.createMediaElementSource(audioRef.current).connect(gain);
      audioRef.current.volume = 1;
      ctxRef.current = ctx;
      gainRef.current = gain;
    } catch { /* keep element.volume fallback */ }
  };
  const play = () => {
    const a = audioRef.current; if (!a) return;
    wantRef.current = true;
    const start = () => a.play().then(() => setPlaying(true)).catch(() => {});
    const ctx = ctxRef.current;
    if (ctx && ctx.state === 'suspended') ctx.resume().then(start).catch(start);
    else start();
  };

  // Keep the music alive on mobile — iOS may pause it (backgrounding, interruptions).
  // If it should be playing but got paused, resume on return-to-tab or the next tap.
  useEffect(() => {
    const resume = () => {
      const a = audioRef.current;
      if (wantRef.current && a && a.paused) {
        ctxRef.current?.resume?.().catch(() => {});
        a.play().then(() => setPlaying(true)).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('pointerdown', resume);
    document.addEventListener('touchstart', resume);
    return () => {
      document.removeEventListener('visibilitychange', resume);
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('touchstart', resume);
    };
  }, []);

  useEffect(() => {
    const startIdx = Math.floor(Math.random() * TRACKS.length);
    setTrackIdx(startIdx);
    idxRef.current = startIdx;
    const audio = new Audio(TRACKS[startIdx].src);
    audio.volume = volRef.current;
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
      setupGraph();
      setGain();
      play();
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

  // Record decelerates to a stop when paused, resumes seamlessly (no harsh freeze)
  useEffect(() => {
    const d = discRef.current; if (!d) return;
    const readDeg = () => {
      const t = getComputedStyle(d).transform;
      const m = t && t.startsWith('matrix') ? t.slice(7, -1).split(',').map(parseFloat) : null;
      return m ? Math.atan2(m[1], m[0]) * 180 / Math.PI : 0;
    };
    if (playing) {
      const deg = ((readDeg() % 360) + 360) % 360;
      d.style.transition = 'none';
      d.style.transform = 'none';
      d.style.animation = 'mp-spin 3.4s linear infinite';
      d.style.animationDelay = `${-(deg / 360) * 3.4}s`;
    } else {
      const deg = readDeg();
      d.style.animation = 'none';
      d.style.animationDelay = '0s';
      d.style.transform = `rotate(${deg}deg)`;
      void d.offsetHeight;
      d.style.transition = 'transform 1.05s cubic-bezier(0.16, 0.5, 0.2, 1)';
      d.style.transform = `rotate(${deg + 32}deg)`;
    }
  }, [playing]);

  const loadTrack = (idx: number) => {
    const a = audioRef.current; if (!a) return;
    a.pause();
    a.src = TRACKS[idx].src;
    idxRef.current = idx;
    setGain();
    play();
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
    }
    setGain();
    if (a.paused) {
      play();
    } else {
      a.pause();
      setPlaying(false);
      wantRef.current = false;
    }
  };

  const toggleMute = () => {
    const newMuted = !mutedRef.current;
    mutedRef.current = newMuted;
    setMuted(newMuted);
    setGain();
    if (!newMuted && audioRef.current?.paused) play();
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    volRef.current = v;
    setVolume(v);
    if (v > 0 && mutedRef.current) { mutedRef.current = false; setMuted(false); }
    setGain();
    if (v > 0 && audioRef.current?.paused) play();
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
  const drawerOpen = hover || pinned;
  const track = TRACKS[trackIdx];
  const nowText = track.artist ? `${track.label} · ${track.artist}` : track.label;

  const tbtn = (onClick: () => void, label: string, svg: React.ReactNode) => (
    <button onClick={onClick} aria-label={label} type="button" style={iconBtn}
      onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4E5B37'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}>
      {svg}
    </button>
  );
  const mIconBtn: React.CSSProperties = { ...iconBtn, width: 26, height: 26 };
  const mtbtn = (onClick: () => void, label: string, svg: React.ReactNode) => (
    <button onClick={onClick} aria-label={label} type="button" style={mIconBtn}
      onMouseEnter={e => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = '#4E5B37'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; }}>
      {svg}
    </button>
  );
  const ICN = {
    prev: (z: number) => <svg viewBox="0 0 12 12" width={z} height={z} fill="currentColor"><path d="M9 2 L9 10 L4 6 Z M3 2 L4 2 L4 10 L3 10 Z"/></svg>,
    next: (z: number) => <svg viewBox="0 0 12 12" width={z} height={z} fill="currentColor"><path d="M3 2 L8 6 L3 10 Z M8 2 L9 2 L9 10 L8 10 Z"/></svg>,
    play: (z: number) => <svg viewBox="0 0 12 12" width={z} height={z} fill="currentColor"><path d="M3 2 L10 6 L3 10 Z" /></svg>,
    pause: (z: number) => <svg viewBox="0 0 12 12" width={z} height={z} fill="currentColor"><rect x="3" y="2" width="2" height="8"/><rect x="7" y="2" width="2" height="8"/></svg>,
    muted: (z: number) => <svg viewBox="0 0 12 12" width={z} height={z} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M2 4 L4 4 L7 2 L7 10 L4 8 L2 8 Z" fill="currentColor" /><path d="M9 4 L11 6 M11 4 L9 6" /></svg>,
    unmuted: (z: number) => <svg viewBox="0 0 12 12" width={z} height={z} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M2 4 L4 4 L7 2 L7 10 L4 8 L2 8 Z" fill="currentColor" /><path d="M9 4 Q10 6 9 8 M10.5 3 Q12 6 10.5 9" /></svg>,
  };

  return (
    <div
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true); }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') setHover(false); }}
      style={{
        position: 'fixed', bottom: 22, right: 22, zIndex: 200,
        display: 'flex', alignItems: 'flex-end', gap: 14,
      }}
    >
      {/* Control panel — unfurls to the LEFT on hover */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          maxWidth: drawerOpen ? 'min(340px, calc(100vw - 88px))' : 0,
          opacity: drawerOpen ? 1 : 0,
          overflow: 'hidden',
          padding: drawerOpen ? '9px 16px' : '9px 0',
          background: 'rgba(78, 91, 55, .68)',
          border: `1px solid ${drawerOpen ? 'rgba(253,253,252,.30)' : 'transparent'}`,
          borderRadius: 16,
          backdropFilter: 'blur(14px) saturate(180%)',
          WebkitBackdropFilter: 'blur(14px) saturate(180%)',
          color: CREAM,
          transition: 'max-width .42s ease, opacity .3s ease, padding .42s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Song info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, minWidth: 0 }}>
            <span style={{ fontSize: 8.5, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: .55, fontWeight: 400, whiteSpace: 'nowrap' }}>Now Playing</span>
            <div ref={boxRef} className="mp-info-box" style={{ overflow: 'hidden', minWidth: 0, maxWidth: 168 }}>
              <div style={(mq.on
                ? { display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', animation: `mp-marquee ${mq.dur}s linear infinite`, '--mq-shift': `-${mq.shift}px` }
                : { display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }) as React.CSSProperties}>
                <span ref={textRef} className="heading" style={{ fontSize: 14, lineHeight: 1.15, fontWeight: 400 }}>{nowText}</span>
                {mq.on && <span aria-hidden="true" style={{ padding: '0 12px', opacity: .5, fontSize: 9, lineHeight: 1 }}>•</span>}
                {mq.on && <span aria-hidden="true" className="heading" style={{ fontSize: 14, lineHeight: 1.15, fontWeight: 400 }}>{nowText}</span>}
                {mq.on && <span aria-hidden="true" style={{ padding: '0 12px', opacity: .5, fontSize: 9, lineHeight: 1 }}>•</span>}
              </div>
            </div>
          </div>

          {/* Desktop controls: transport row + volume row */}
          <div className="mp-ctrl-desktop" style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 92 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {tbtn(goPrev, 'Previous', ICN.prev(8))}
              {tbtn(togglePlay, playing && !muted ? 'Pause' : 'Play', playing && !muted ? ICN.pause(8) : ICN.play(8))}
              {tbtn(goNext, 'Next', ICN.next(8))}
            </div>
            <div className="mp-vol-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {tbtn(toggleMute, muted ? 'Unmute' : 'Mute', muted ? ICN.muted(8) : ICN.unmuted(8))}
              <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={handleVolume} aria-label="Volume" className="vol-slider mp-slider" style={{ flex: 1, width: 'auto', minWidth: 0 }} />
            </div>
          </div>

          {/* Mobile controls: 2x2 (rev/fwd, vol/play-pause) — bigger */}
          <div className="mp-ctrl-mobile" style={{ display: 'none', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {mtbtn(goPrev, 'Previous', ICN.prev(10))}
            {mtbtn(goNext, 'Next', ICN.next(10))}
            {mtbtn(toggleMute, muted ? 'Unmute' : 'Mute', muted ? ICN.muted(10) : ICN.unmuted(10))}
            {mtbtn(togglePlay, playing && !muted ? 'Pause' : 'Play', playing && !muted ? ICN.pause(10) : ICN.play(10))}
          </div>

          <button className="mp-close" onClick={() => { setPinned(false); setHover(false); }} aria-label="Close player" type="button"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', border: '1px solid rgba(253,253,252,.4)', background: 'transparent', color: CREAM, cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3 L9 9 M9 3 L3 9"/></svg>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {!drawerOpen && (
        <button className="mp-open" type="button" aria-label="Open player controls" onClick={() => setPinned(true)}
          style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(253,253,252,.4)', background: 'rgba(78, 91, 55, .55)', color: CREAM, cursor: 'pointer', padding: 0, flexShrink: 0, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2 L4 6 L8 10"/></svg>
        </button>
      )}

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
          ref={discRef}
          style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: 'repeating-radial-gradient(circle at 50% 50%, #3b4528 0 1.4px, #4E5B37 1.4px 3px)',
            boxShadow: '0 6px 16px rgba(40,48,28,.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
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
    </div>
  );
}
