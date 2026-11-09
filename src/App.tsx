import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Cake as CakeIcon, Camera, Gift, Heart, RotateCcw, Ticket, UtensilsCrossed, Volume2, VolumeX, Puzzle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { birthday } from './config/birthday';
import { Decor } from './components/Decor';
import { isMuted, onMuteChange, setMuted } from './lib/audio';
import { Welcome } from './stages/Welcome';
import { Celebration } from './stages/Celebration';
import { Memories } from './stages/Memories';
import { Choice } from './stages/Choice';
import { Buffet } from './stages/Buffet';
import { Bonus } from './stages/Bonus';
import { Final } from './stages/Final';

export type StageProps = { next: () => void; restart: () => void };

const STAGES = [
  { key: 'welcome', label: 'Surprise', icon: Gift, theme: 'night', C: Welcome },
  { key: 'celebrate', label: 'Cake', icon: CakeIcon, theme: 'day', C: Celebration },
  { key: 'memories', label: 'Memories', icon: Camera, theme: 'day', C: Memories },
  { key: 'choice', label: 'A·B·C·D', icon: Puzzle, theme: 'day', C: Choice },
  { key: 'buffet', label: 'Buffet', icon: UtensilsCrossed, theme: 'day', C: Buffet },
  { key: 'bonus', label: 'Bonus', icon: Ticket, theme: 'night', C: Bonus },
  { key: 'final', label: 'Finale', icon: Heart, theme: 'day', C: Final },
] as const;

function readNum(k: string) {
  try {
    const v = Number(sessionStorage.getItem(k));
    return Number.isFinite(v) && v >= 0 && v < STAGES.length ? v : 0;
  } catch {
    return 0;
  }
}
function writeNum(k: string, v: number) {
  try {
    sessionStorage.setItem(k, String(v));
  } catch {
    /* private mode */
  }
}

export default function App() {
  const [stage, setStage] = useState(() => readNum('habil-stage'));
  const [maxStage, setMaxStage] = useState(() => Math.max(readNum('habil-max'), readNum('habil-stage')));
  const [muted, setMutedState] = useState(isMuted());
  const [loading, setLoading] = useState(() => {
    try {
      return sessionStorage.getItem('habil-loaded') !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => onMuteChange(setMutedState), []);
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      setLoading(false);
      try {
        sessionStorage.setItem('habil-loaded', '1');
      } catch {
        /* ignore */
      }
    }, 1700);
    return () => clearTimeout(t);
  }, [loading]);

  const go = useCallback((i: number) => {
    setStage(i);
    writeNum('habil-stage', i);
    setMaxStage((m) => {
      const nm = Math.max(m, i);
      writeNum('habil-max', nm);
      return nm;
    });
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const next = useCallback(() => go(Math.min(stage + 1, STAGES.length - 1)), [go, stage]);
  const restart = useCallback(() => {
    setMaxStage(0);
    writeNum('habil-max', 0);
    go(0);
  }, [go]);

  const current = STAGES[stage];
  const theme = current.theme;
  const Stage = current.C;

  useEffect(() => {
    const c = theme === 'night' ? '#1d1130' : '#fdf3f1';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', c);
    document.documentElement.style.background = c;
    document.body.style.background = c;
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      {/* backgrounds cross-fade between night & day */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,#fffaf2_0%,#fdeef1_45%,#efe6fa_100%)]" />
      <motion.div
        className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,#4a2b6e_0%,#2a1840_45%,#160c25_100%)]"
        initial={false}
        animate={{ opacity: theme === 'night' ? 1 : 0 }}
        transition={{ duration: 1.1 }}
      />
      <Decor theme={theme} key={theme} />

      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>

      {/* top controls */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 px-3"
        style={{ paddingTop: 'calc(var(--safe-top) + 0.75rem)', paddingLeft: 'max(0.75rem, var(--safe-left))', paddingRight: 'max(0.75rem, var(--safe-right))' }}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(var(--safe-top)+5.5rem)] bg-gradient-to-b transition-colors duration-700 ${
            theme === 'night' ? 'from-[#1d1130]/85 via-[#1d1130]/50' : 'from-[#fdf3f1]/90 via-[#fdf3f1]/55'
          } to-transparent`}
          aria-hidden
        />
        <IconButton label="Start over" onClick={restart} night={theme === 'night'} hidden={stage === 0}>
          <RotateCcw size={20} />
        </IconButton>

        {stage > 0 ? (
          <nav aria-label="Surprise progress" className="flex items-center gap-0.5 rounded-full bg-white/85 px-1.5 py-1.5 min-[360px]:gap-1 min-[360px]:px-2 shadow-sm">
            {STAGES.map((s, i) => {
              const Icon = s.icon;
              const done = i < stage;
              const active = i === stage;
              const reachable = i <= maxStage;
              return (
                <button
                  key={s.key}
                  type="button"
                  disabled={!reachable}
                  onClick={() => reachable && go(i)}
                  aria-label={`${s.label}${active ? ' (current)' : ''}`}
                  aria-current={active ? 'step' : undefined}
                  className={`grid h-6 w-6 place-items-center min-[360px]:h-7 min-[360px]:w-7 rounded-full transition-all duration-300 ${
                    active
                      ? 'scale-110 bg-gradient-to-br from-[#f3dba9] to-[#c99a4b] text-[#3a2410] shadow'
                      : done
                        ? 'bg-[#f8c9d4] text-[#9c3a5c]'
                        : reachable
                          ? 'bg-white/80 text-[#8f6524]'
                          : 'bg-white/40 text-[#b9a7b8]'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.4} />
                </button>
              );
            })}
          </nav>
        ) : (
          <span />
        )}

        <IconButton label={muted ? 'Turn sound on' : 'Mute sound'} onClick={() => setMuted(!muted)} night={theme === 'night'}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </IconButton>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {!loading && <Stage next={next} restart={restart} />}
          </motion.div>
        </AnimatePresence>
      </main>

    </MotionConfig>
  );
}

function IconButton({
  children,
  label,
  onClick,
  night,
  hidden,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  night: boolean;
  hidden?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full shadow-sm transition active:scale-90 ${
        night ? 'bg-[#3a2458]/85 text-[#fff1cf] ring-1 ring-white/20' : 'bg-white/85 text-[#8f6524] ring-1 ring-[#ecd3a0]'
      } ${hidden ? 'invisible' : ''}`}
    >
      {children}
    </button>
  );
}

function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-[#1d1130]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.svg
          width="84"
          height="84"
          viewBox="0 0 84 84"
          animate={{ rotate: [0, -8, 8, 0], y: [0, -6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          <rect x="14" y="36" width="56" height="40" rx="5" fill="#f2a3b8" />
          <rect x="10" y="26" width="64" height="14" rx="4" fill="#ffd9e2" />
          <rect x="37" y="26" width="10" height="50" fill="#e0b56c" />
          <path d="M42 26 C30 8 18 18 26 26Z M42 26 C54 8 66 18 58 26Z" fill="#e0b56c" />
        </motion.svg>
        <div className="flex items-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-[#ecd3a0]"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
        <p className="font-hand text-2xl text-[#fff1cf]">{birthday.welcome.loadingText}</p>
      </div>
    </motion.div>
  );
}
