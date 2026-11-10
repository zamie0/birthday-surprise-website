import { birthday } from '../config/birthday';

/**
 * Tiny audio engine.
 * - Nothing plays until the first tap (browsers require a user gesture).
 * - If you set file paths in config, those are used.
 * - Otherwise sounds are synthesized with Web Audio (no files needed).
 */

type SfxName = keyof typeof birthday.audio.sfx;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let muted = readMuted();
let musicOn = false;
let musicEl: HTMLAudioElement | null = null;
let musicTimer: number | null = null;
/** True once the guest has opened the gift (music should be playing). */
let musicStarted = false;
const listeners = new Set<(m: boolean) => void>();

function readMuted() {
  try {
    return localStorage.getItem('habil-muted') === '1';
  } catch {
    return false;
  }
}

function ensureCtx() {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  }
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(ctx.destination);
  musicGain = ctx.createGain();
  musicGain.gain.value = birthday.audio.musicVolume * 1.6;
  musicGain.connect(master);
  return ctx;
}

/**
 * iOS: Web Audio is silenced by the ring/silent switch unless the page's
 * audio session is "playback". Use the Audio Session API when available,
 * otherwise play a silent <audio> element, which switches the session.
 */
type NavWithSession = Navigator & { audioSession?: { type: string } };
let silentEl: HTMLAudioElement | null = null;
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';

export function restorePlayback() {
  const nav = navigator as NavWithSession;
  try {
    if (nav.audioSession) nav.audioSession.type = 'playback';
  } catch {
    /* ignore */
  }
  if (!nav.audioSession) {
    try {
      if (!silentEl) {
        silentEl = new Audio(SILENT_WAV);
        silentEl.loop = true;
        silentEl.setAttribute('playsinline', '');
      }
      void silentEl.play().catch(() => {});
    } catch {
      /* ignore */
    }
  }
  if (ctx && ctx.state !== 'running') void ctx.resume().catch(() => {});
}

export function isMuted() {
  return muted;
}

export function onMuteChange(fn: (m: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setMuted(m: boolean) {
  muted = m;
  try {
    localStorage.setItem('habil-muted', m ? '1' : '0');
  } catch {
    /* ignore */
  }
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05);
  if (musicEl) musicEl.muted = m;
  if (!m) {
    // Unmuting is a user gesture: make sure audio is actually running.
    restorePlayback();
    if (musicStarted) startMusic();
  }
  listeners.forEach((l) => l(m));
}

// ── synth building blocks ─────────────────────────────────────

function tone(freq: number, start: number, dur: number, vol = 0.2, type: OscillatorType = 'sine', dest?: AudioNode) {
  if (!ctx || !master) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(dest ?? master);
  o.start(start);
  o.stop(start + dur + 0.05);
}

function noise(start: number, dur: number, vol: number, filterFrom: number, filterTo: number, q = 1) {
  if (!ctx || !master) return;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = q;
  f.frequency.setValueAtTime(filterFrom, start);
  f.frequency.exponentialRampToValueAtTime(filterTo, start + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + dur * 0.15);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(f).connect(g).connect(master);
  src.start(start);
}

const N = (n: string) => {
  const map: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const m = n.match(/^([A-G])(#?)(\d)$/)!;
  const midi = 12 * (Number(m[3]) + 1) + map[m[1]] + (m[2] ? 1 : 0);
  return 440 * Math.pow(2, (midi - 69) / 12);
};

const synth: Record<SfxName, () => void> = {
  chime() {
    const t = ctx!.currentTime;
    ['E5', 'G5', 'B5', 'E6'].forEach((n, i) => tone(N(n), t + i * 0.07, 0.9, 0.12, 'sine'));
  },
  pop() {
    const t = ctx!.currentTime;
    if (!ctx || !master) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(700, t);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.12);
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.2);
  },
  open() {
    const t = ctx!.currentTime;
    noise(t, 0.45, 0.25, 600, 4000, 0.8);
    ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => tone(N(n), t + 0.15 + i * 0.06, 0.8, 0.1, 'triangle'));
  },
  fanfare() {
    const t = ctx!.currentTime;
    const seq: [string, number][] = [
      ['G4', 0],
      ['C5', 0.12],
      ['E5', 0.24],
      ['G5', 0.36],
      ['E5', 0.56],
      ['G5', 0.68],
    ];
    seq.forEach(([n, d]) => tone(N(n), t + d, 0.5, 0.13, 'triangle'));
    ['C5', 'E5', 'G5', 'C6'].forEach((n) => tone(N(n), t + 0.85, 1.6, 0.09, 'triangle'));
    noise(t + 0.82, 0.5, 0.12, 3000, 9000, 0.5);
  },
  blow() {
    const t = ctx!.currentTime;
    noise(t, 0.6, 0.22, 900, 250, 0.6);
  },
};

/** '/audio/x.mp3' would skip the GitHub Pages sub-folder; make it relative. */
const rel = (p: string) => p.replace(/^\/+/, '');

const sfxEls: Partial<Record<SfxName, HTMLAudioElement>> = {};

export function sfx(name: SfxName) {
  if (muted) return;
  const path = birthday.audio.sfx[name];
  if (path) {
    let el = sfxEls[name];
    if (!el) {
      el = new Audio(rel(path));
      sfxEls[name] = el;
    }
    el.currentTime = 0;
    el.play().catch(() => {
      if (ensureCtx()) synth[name]();
    });
    return;
  }
  if (ensureCtx()) synth[name]();
}

// ── music ─────────────────────────────────────────────────────

// "Happy Birthday" (public domain melody), music-box style. [note, beats]
const MELODY: [string, number][] = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
];
const BASS = ['C3', 'G2', 'G2', 'C3', 'C3', 'F2', 'C3', 'C3'];

function scheduleMusicLoop() {
  if (!ctx || !musicGain || !musicOn) return;
  const beat = 60 / 84;
  let t = ctx.currentTime + 0.1;
  const start = t;
  for (const [n, b] of MELODY) {
    tone(N(n), t, Math.max(0.9, b * beat * 1.4), 0.32, 'sine', musicGain);
    tone(N(n) * 2, t, 0.5, 0.05, 'sine', musicGain); // sparkle harmonic
    t += b * beat;
  }
  const total = t - start;
  const bar = total / BASS.length;
  BASS.forEach((n, i) => tone(N(n), start + i * bar, bar * 1.2, 0.12, 'triangle', musicGain!));
  const rest = beat * 3;
  musicTimer = window.setTimeout(scheduleMusicLoop, (total + rest) * 1000 - 150);
}

export function startMusic() {
  musicStarted = true;
  restorePlayback();
  if (musicOn) return;
  musicOn = true;
  try {
    sessionStorage.setItem('habil-music', '1');
  } catch {
    /* ignore */
  }
  const src = birthday.audio.music;
  if (src) {
    musicEl = new Audio(rel(src));
    musicEl.loop = true;
    musicEl.volume = birthday.audio.musicVolume;
    musicEl.muted = muted;
    musicEl.setAttribute('playsinline', '');
    musicEl.play().catch(() => {
      musicEl = null;
      if (ensureCtx()) scheduleMusicLoop();
    });
    musicEl.addEventListener('error', () => {
      musicEl = null;
      if (ensureCtx() && musicOn && musicTimer === null) scheduleMusicLoop();
    });
    return;
  }
  if (ensureCtx()) scheduleMusicLoop();
}

export function stopMusic() {
  musicOn = false;
  if (musicTimer !== null) clearTimeout(musicTimer);
  musicTimer = null;
  if (musicEl) {
    musicEl.pause();
    musicEl = null;
  }
}

/** Call from a tap handler so the AudioContext is unlocked on iOS. */
export function unlockAudio() {
  ensureCtx();
  restorePlayback();
}

// If the page was reloaded after the gift was opened (stage is restored from
// sessionStorage), restart the music on the next tap anywhere.
if (typeof window !== 'undefined') {
  let wanted = false;
  try {
    wanted = sessionStorage.getItem('habil-music') === '1' || Number(sessionStorage.getItem('habil-stage')) > 0;
  } catch {
    /* ignore */
  }
  const onGesture = () => {
    unlockAudio();
    if (wanted && !musicOn) startMusic();
  };
  window.addEventListener('pointerdown', onGesture, { passive: true });
  window.addEventListener('keydown', onGesture);
  // Browsers suspend audio in the background / after interruptions (calls, Siri).
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && ctx && ctx.state !== 'running') {
      void ctx.resume().catch(() => {});
    }
  });
}
