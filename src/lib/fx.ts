import confetti from 'canvas-confetti';
import { birthday } from '../config/birthday';

const COLORS = ['#f8c9d4', '#e0718f', '#ecd3a0', '#c99a4b', '#dccff5', '#a98fdc', '#fffdf8'];
const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 60 } as const;

const small = typeof window !== 'undefined' && window.innerWidth < 640;
const k = small ? 0.6 : 1; // fewer particles on phones = smooth

export function burst(x = 0.5, y = 0.5, amount = 80) {
  confetti({ ...base, particleCount: Math.round(amount * k), spread: 80, startVelocity: 42, origin: { x, y }, scalar: 0.9 });
}

export function cannons() {
  confetti({ ...base, particleCount: Math.round(70 * k), angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, startVelocity: 60 });
  confetti({ ...base, particleCount: Math.round(70 * k), angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, startVelocity: 60 });
}

export function bigCelebration(duration = 2600) {
  const end = Date.now() + duration;
  const frame = () => {
    confetti({ ...base, particleCount: small ? 2 : 4, angle: 60, spread: 65, origin: { x: 0, y: 0.7 } });
    confetti({ ...base, particleCount: small ? 2 : 4, angle: 120, spread: 65, origin: { x: 1, y: 0.7 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
  burst(0.5, 0.45, 120);
}

let heart: confetti.Shape | null = null;
let star: confetti.Shape | null = null;
function shapes() {
  try {
    heart ??= confetti.shapeFromText({ text: '❤️', scalar: 2 });
    star ??= confetti.shapeFromText({ text: '✨', scalar: 2 });
  } catch {
    /* older browsers: fall back to default shapes */
  }
}

export function heartBurst(x = 0.5, y = 0.85) {
  shapes();
  confetti({
    ...base,
    particleCount: small ? 14 : 24,
    spread: 70,
    startVelocity: 30,
    origin: { x, y },
    scalar: 2,
    shapes: heart ? [heart] : undefined,
    flat: true,
  });
}

export function starShower() {
  shapes();
  confetti({
    ...base,
    particleCount: small ? 24 : 40,
    spread: 160,
    startVelocity: 25,
    gravity: 0.6,
    origin: { x: 0.5, y: 0.35 },
    scalar: 1.8,
    shapes: star ? [star] : undefined,
    flat: true,
  });
}

// ── date helpers ──────────────────────────────────────────────

export function birthdayTarget() {
  const [y, m, d] = birthday.birthdayDate.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0);
}

export type DayMode = 'before' | 'today' | 'after';

export function dayMode(now = new Date()): DayMode {
  const params = new URLSearchParams(window.location.search);
  if (params.get('birthday') === '1') return 'today'; // preview birthday mode
  const t = birthdayTarget();
  const end = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
  if (now < t) return 'before';
  if (now < end) return 'today';
  return 'after';
}
