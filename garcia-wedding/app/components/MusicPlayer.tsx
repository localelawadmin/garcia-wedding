'use client';

import { useState, useEffect, useRef } from 'react';
import { useHGRadio } from './useHGRadio';

const CREAM = '#FDFDFC';
// right-hand slack so the last glyph's italic lean is not shaved by the clip edge
const MQ_PAD = 7;

// The record, the drawer and the marquee. All audio behaviour lives in useHGRadio.
export default function MusicPlayer() {
  const { track, trackIdx, playing, muted, volume, toggle, next, prev, toggleMute, setVolume } = useHGRadio();
  const [hover, setHover]     = useState(false);
  const [pinned, setPinned]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [mq, setMq]           = useState<{ on: boolean; shift: number; dur: number }>({ on: false, shift: 0, dur: 0 });
  const drawerOpen = hover || pinned;

  const boxRef    = useRef<HTMLDivElement | null>(null);
  const textRef   = useRef<HTMLSpanElement | null>(null);
  const discRef   = useRef<HTMLDivElement | null>(null);

  // The 'tap the record' prompt collapses to a chevron once the guest scrolls past the hero
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio < 0.5) { setRevealed(true); io.disconnect(); } }, { threshold: [0, 0.5, 1] });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const txt = textRef.current;
    if (!txt || !drawerOpen) return;
    const measure = () => {
      const box = boxRef.current;
      if (!box) return;
      // scrollWidth includes the italic-slack padding, so subtract it before asking
      // whether the text itself overflows — otherwise a title that fits exactly still
      // wiggles a few pixels. Travel, though, does include the padding, so the last
      // glyph clears the edge completely.
      const textW = txt.scrollWidth - MQ_PAD;
      if (textW > box.clientWidth) {
        const overflow = txt.scrollWidth - box.clientWidth;
        setMq({ on: true, shift: overflow, dur: Math.max(4.5, overflow / 16) });
      } else {
        setMq({ on: false, shift: 0, dur: 0 });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(txt);
    if (boxRef.current) ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, [trackIdx, drawerOpen]);

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

  const togglePlay = () => { setRevealed(true); toggle(); };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value));
  const goNext = next;
  const goPrev = prev;

  // Safari does not honour flex centring applied directly to a <button>, so every
  // icon gets wrapped in a span that does the centring instead.
  const ctr: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', height: '100%', lineHeight: 0,
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
  const nowText = track.artist ? `${track.label} · ${track.artist}` : track.label;

  const tbtn = (onClick: () => void, label: string, svg: React.ReactNode) => (
    <button onClick={onClick} aria-label={label} type="button" className="mp-btn" style={iconBtn}>
      <span style={ctr}>{svg}</span>
    </button>
  );
  const mIconBtn: React.CSSProperties = { ...iconBtn, width: 26, height: 26 };
  const mtbtn = (onClick: () => void, label: string, svg: React.ReactNode) => (
    <button onClick={onClick} aria-label={label} type="button" className="mp-btn" style={mIconBtn}>
      <span style={ctr}>{svg}</span>
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
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                    color: CREAM,
          transition: 'max-width .42s ease, opacity .3s ease, padding .42s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Song info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, minWidth: 0 }}>
            <span style={{ fontSize: 8.5, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: .55, fontWeight: 400, whiteSpace: 'nowrap' }}>Now Playing</span>
            <div ref={boxRef} className="mp-info-box" style={{ overflow: 'hidden', width: 168, flexShrink: 0 }}>
              <div style={(mq.on && drawerOpen
                ? { display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
                    animation: `mp-pingpong ${mq.dur}s ease-in-out infinite alternate`,
                    '--mq-shift': `-${mq.shift}px` }
                : { display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }) as React.CSSProperties}>
                {/* paddingRight buys room for the final glyph's italic lean, which the
                    clip edge would otherwise shave. scrollWidth counts it, so the
                    travel distance accounts for it too. */}
                <span ref={textRef} className="heading" style={{ fontSize: 14, lineHeight: 1.15, fontWeight: 400, paddingRight: MQ_PAD }}>{nowText}</span>
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

          <button className="mp-close mp-btn" onClick={() => { setPinned(false); setHover(false); }} aria-label="Close player" type="button"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', border: '1px solid rgba(253,253,252,.4)', background: 'transparent', color: CREAM, cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <span style={ctr}>
              <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ display: 'block' }}><path d="M3 3 L9 9 M9 3 L3 9"/></svg>
            </span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {!drawerOpen && (
        <div className="mp-prompt" style={{
          display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'flex-end',
          width: revealed ? 24 : 104, height: 30, flexShrink: 0, transition: 'width .45s ease',
        }}>
          <span aria-hidden={revealed} style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            opacity: revealed ? 0 : 0.85, transition: 'opacity .35s ease',
            whiteSpace: 'nowrap', textAlign: 'right', lineHeight: 1.3,
            fontSize: 9.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: CREAM, pointerEvents: 'none',
          }}>Tap the record<br />to play HG&nbsp;Radio</span>
          <button type="button" aria-label="Open player controls" onClick={() => setPinned(true)} className="mp-btn" style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            opacity: revealed ? 1 : 0, pointerEvents: revealed ? 'auto' : 'none', transition: 'opacity .35s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(253,253,252,.4)',
            background: 'rgba(78, 91, 55, .55)', color: CREAM, cursor: 'pointer', padding: 0,
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          }}>
            <span style={ctr}>
              {/* 12px svg against a 12-unit viewBox: 1:1, so the path lands on whole
                  pixels and the glyph is exactly centred at any device pixel ratio.
                  An earlier optical nudge here left it half a pixel right of centre. */}
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><path d="M8 2 L4 6 L8 10"/></svg>
            </span>
          </button>
        </div>
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
            <img src="/photos/agenda/hg-monogram.png" alt="" style={{ width: 24, height: 'auto', display: 'block' }} />
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
