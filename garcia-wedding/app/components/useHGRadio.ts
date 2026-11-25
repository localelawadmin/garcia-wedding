'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type Track = { src: string; label: string; artist: string };

export const TRACKS: Track[] = [
  { src: '/audio/leon-bridges.mp3',                            label: 'Coming Home',                          artist: 'Leon Bridges' },
  { src: '/audio/sam-cooke.mp3',                               label: 'Bring It On Home',                     artist: 'Sam Cooke' },
  { src: '/audio/frankie-valli.m4a',                           label: "Can't Take My Eyes Off You",           artist: 'Frankie Valli' },
  { src: '/audio/nat-king-cole-love.m4a',                      label: 'L-O-V-E',                              artist: 'Nat King Cole' },
  { src: '/audio/natalie-cole-this-will-be.m4a',               label: 'This Will Be (An Everlasting Love)',   artist: 'Natalie Cole' },
  { src: '/audio/van-morrison-crazy-love.mp3',                 label: 'Crazy Love',                           artist: 'Van Morrison' },
  { src: '/audio/stevie-wonder-isnt-she-lovely.m4a',           label: "Isn't She Lovely",                     artist: 'Stevie Wonder' },
  { src: '/audio/james-taylor-how-sweet-it-is.m4a',            label: 'How Sweet It Is (To Be Loved by You)', artist: 'James Taylor' },
  { src: '/audio/elvis-presley-cant-help-falling-in-love.m4a', label: "Can't Help Falling in Love",           artist: 'Elvis Presley' },
  { src: '/audio/luther-vandross-so-amazing.mp3',              label: 'So Amazing',                           artist: 'Luther Vandross' },
  { src: '/audio/perry-como-more.mp3',                         label: 'More',                                 artist: 'Perry Como' },
];

const START_VOLUME = 0.25;

// Fisher-Yates over every track: a shuffled "bag", so nothing repeats until all have played.
const shuffleBag = (avoidFirst?: number) => {
  const a = TRACKS.map((_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // never the same song twice across the reshuffle seam
  if (avoidFirst !== undefined && a.length > 1 && a[0] === avoidFirst) [a[0], a[1]] = [a[1], a[0]];
  return a;
};

/**
 * The audio engine behind HG Radio, kept apart from the record-and-drawer UI.
 *
 * Design notes:
 * - One <audio> element for the whole session. `preload="none"` until someone actually
 *   plays: before, the first track (~3 MB) started downloading the moment the password
 *   was accepted, including on phones where nobody had touched the record.
 * - `playing` is driven by the element's own play/pause events rather than set by hand,
 *   so it stays true to reality when the OS pauses us (a phone call, Bluetooth drop,
 *   lock-screen pause).
 * - Volume runs through a Web Audio gain node because iOS ignores `element.volume`, and
 *   without it the 25% start would be full volume on iPhones. Routing through Web Audio
 *   puts the page in iOS's "ambient" audio session, which the silent switch mutes — so
 *   the session is promoted to "playback" first, where supported (iOS 17+).
 * - Lock-screen / Control Center controls via the Media Session API.
 * - A track that fails to load is skipped instead of leaving the player stuck silent.
 */
export function useHGRadio() {
  const [bag, setBag] = useState<number[]>(() => TRACKS.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(START_VOLUME);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const wantRef = useRef(false);          // the guest wants music; resume after interruptions
  const failRef = useRef(0);              // consecutive load failures, to stop skip-looping
  const stateRef = useRef({ bag, pos, muted, volume });
  useEffect(() => { stateRef.current = { bag, pos, muted, volume }; }, [bag, pos, muted, volume]);

  const trackIdx = bag[pos];

  const applyGain = useCallback(() => {
    const { muted: m, volume: v } = stateRef.current;
    const level = m ? 0 : v;
    if (gainRef.current) gainRef.current.gain.value = level;
    else if (audioRef.current) audioRef.current.volume = level;
  }, []);

  // Built lazily inside a user gesture — browsers refuse to start an AudioContext otherwise.
  const ensureGraph = useCallback(() => {
    const a = audioRef.current;
    if (ctxRef.current || !a) return;
    try {
      const nav = navigator as Navigator & { audioSession?: { type: string } };
      if (nav.audioSession) nav.audioSession.type = 'playback';
      const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
      const Ctx = W.AudioContext || W.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      ctx.createMediaElementSource(a).connect(gain);
      a.volume = 1;
      ctxRef.current = ctx;
      gainRef.current = gain;
    } catch { /* element.volume fallback */ }
    applyGain();
  }, [applyGain]);

  const play = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    wantRef.current = true;
    a.preload = 'auto';
    ensureGraph();
    const start = () => { a.play().catch(() => {}); };
    const ctx = ctxRef.current;
    if (ctx && ctx.state === 'suspended') ctx.resume().then(start, start);
    else start();
  }, [ensureGraph]);

  const pause = useCallback(() => {
    wantRef.current = false;
    audioRef.current?.pause();
  }, []);

  const loadAndPlay = useCallback((nextBag: number[], nextPos: number) => {
    const a = audioRef.current; if (!a) return;
    setBag(nextBag); setPos(nextPos);
    stateRef.current = { ...stateRef.current, bag: nextBag, pos: nextPos };
    a.src = TRACKS[nextBag[nextPos]].src;
    play();
  }, [play]);

  const next = useCallback(() => {
    const { bag: b, pos: p } = stateRef.current;
    if (p + 1 < b.length) loadAndPlay(b, p + 1);
    else loadAndPlay(shuffleBag(b[p]), 0);
  }, [loadAndPlay]);

  const prev = useCallback(() => {
    const { bag: b, pos: p } = stateRef.current;
    const a = audioRef.current;
    // like every music app: a few seconds in, "back" restarts the song
    if (a && a.currentTime > 4) { a.currentTime = 0; play(); return; }
    loadAndPlay(b, Math.max(0, p - 1));
  }, [loadAndPlay, play]);

  const toggle = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    // Playing but muted: the button shows "play", so unmute rather than pause.
    if (!a.paused && stateRef.current.muted) {
      setMuted(false); stateRef.current.muted = false; applyGain(); return;
    }
    if (stateRef.current.muted) { setMuted(false); stateRef.current.muted = false; }
    if (a.paused) play(); else pause();
    applyGain();
  }, [play, pause, applyGain]);

  const toggleMute = useCallback(() => {
    const m = !stateRef.current.muted;
    setMuted(m); stateRef.current.muted = m; applyGain();
    if (!m && audioRef.current?.paused) play();
  }, [applyGain, play]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v); stateRef.current.volume = v;
    if (v > 0 && stateRef.current.muted) { setMuted(false); stateRef.current.muted = false; }
    applyGain();
    if (v > 0 && audioRef.current?.paused) play();
  }, [applyGain, play]);

  // One element for the session.
  useEffect(() => {
    const first = shuffleBag();
    setBag(first); setPos(0);
    stateRef.current = { ...stateRef.current, bag: first, pos: 0 };
    const a = new Audio();
    a.preload = 'none';
    a.src = TRACKS[first[0]].src;
    a.volume = START_VOLUME;
    audioRef.current = a;

    const onPlay = () => { setPlaying(true); failRef.current = 0; };
    const onPause = () => setPlaying(false);
    const onEnded = () => next();
    const onError = () => {
      // skip a broken file, but give up after a full lap of failures (e.g. offline)
      if (wantRef.current && ++failRef.current < TRACKS.length) next();
    };
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnded);
    a.addEventListener('error', onError);
    return () => {
      a.pause();
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onError);
      a.removeAttribute('src'); a.load();
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null; gainRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Desktop: music starts on the first interaction after the password. Touch devices
  // wait for the record to be tapped — a scroll on a phone shouldn't start a song.
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const events = ['pointerdown', 'wheel', 'keydown'] as const;
    const fire = () => { play(); cleanup(); };
    const cleanup = () => {
      events.forEach(ev => document.removeEventListener(ev, fire));
      document.removeEventListener('scroll', fire, true);
    };
    events.forEach(ev => document.addEventListener(ev, fire));
    document.addEventListener('scroll', fire, true);
    return cleanup;
  }, [play]);

  // iOS pauses us when the tab backgrounds or another app takes audio; if the guest
  // still wants music, pick it back up on return or on their next tap.
  useEffect(() => {
    const resume = () => {
      const a = audioRef.current;
      if (wantRef.current && a && a.paused && document.visibilityState === 'visible') play();
    };
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('pointerdown', resume);
    return () => {
      document.removeEventListener('visibilitychange', resume);
      document.removeEventListener('pointerdown', resume);
    };
  }, [play]);

  // Lock screen / Control Center / headphone buttons.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const t = TRACKS[trackIdx];
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.label, artist: t.artist, album: 'HG Radio',
        artwork: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
      });
    } catch { /* older Safari */ }
  }, [trackIdx]);
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    const set = (a: MediaSessionAction, h: (() => void) | null) => { try { ms.setActionHandler(a, h); } catch {} };
    set('play', play); set('pause', pause); set('nexttrack', next); set('previoustrack', prev);
    return () => { (['play', 'pause', 'nexttrack', 'previoustrack'] as MediaSessionAction[]).forEach(a => set(a, null)); };
  }, [play, pause, next, prev]);
  useEffect(() => {
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }, [playing]);

  return { track: TRACKS[trackIdx], trackIdx, playing, muted, volume, toggle, next, prev, toggleMute, setVolume };
}
