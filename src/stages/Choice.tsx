import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import type { StageProps } from '../App';
import { birthday } from '../config/birthday';
import { Button, rise } from '../components/ui';
import { sfx } from '../lib/audio';
import { burst } from '../lib/fx';

export function Choice({ next }: StageProps) {
  const ch = birthday.choice;
  const [opened, setOpened] = useState(false);
  const [othersShown, setOthersShown] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [wiggle, setWiggle] = useState<Record<string, number>>({});
  const wrong = useRef(0);
  const toastTimer = useRef<number>(0);

  const tap = (letter: string, e: React.MouseEvent) => {
    if (letter === ch.chosen) {
      if (opened) return;
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      sfx('open');
      setOpened(true);
      setToast(null);
      setTimeout(() => burst((r.left + r.width / 2) / window.innerWidth, (r.top + r.height / 2) / window.innerHeight, 70), 250);
      setTimeout(() => setOthersShown(true), 1000);
      setTimeout(() => {
        setReady(true);
        sfx('chime');
      }, 1600);
      return;
    }
    if (opened) return;
    sfx('pop');
    setWiggle((w) => ({ ...w, [letter]: (w[letter] ?? 0) + 1 }));
    setToast(ch.wrongTapLines[wrong.current % ch.wrongTapLines.length]);
    wrong.current++;
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <section className="stage-pad relative mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 text-center">
      <motion.h2 variants={rise} initial="hidden" animate="show" custom={0} className="font-display text-[1.85rem] font-black leading-tight text-[#3a2740] sm:text-[2.6rem]">
        {ch.question}
      </motion.h2>

      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
        className="font-hand text-[1.9rem] leading-none text-[#9c3a5c]"
      >
        {opened ? <span className="font-display text-2xl font-black not-italic">YOU CHOSE {ch.chosen}! 🎉</span> : ch.hint}
      </motion.p>

      <div className="grid w-full max-w-[420px] grid-cols-2 gap-4" style={{ perspective: 1000 }}>
        {ch.options.map((o, i) => {
          const isChosen = o.letter === ch.chosen;
          const flipped = isChosen ? opened : othersShown;
          return (
            <motion.button
              key={o.letter}
              type="button"
              onClick={(e) => tap(o.letter, e)}
              aria-label={flipped ? `${o.letter}: ${o.label}` : `Mystery card ${o.letter}`}
              className="relative aspect-[1/1.08] w-full"
              initial={{ opacity: 0, y: 40, rotate: i % 2 ? 4 : -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 120, damping: 14 }}
            >
              <motion.div
                key={wiggle[o.letter] ?? 0}
                className="h-full w-full"
                animate={wiggle[o.letter] ? { x: [0, -10, 10, -7, 7, 0] } : isChosen && !opened ? { y: [0, -8, 0], rotate: [0, -2, 2, 0] } : {}}
                transition={wiggle[o.letter] ? { duration: 0.45 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="relative h-full w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: flipped ? 180 : 0, scale: isChosen && opened ? 1.04 : 1 }}
                  transition={{ duration: 0.8, ease: [0.3, 1.3, 0.5, 1] }}
                >
                  {/* front — mystery */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border-2 ${
                      isChosen ? 'glow-ring border-[#e9c57e] bg-gradient-to-br from-[#fff3d6] via-[#fde3ea] to-[#f3dba9]' : 'border-white bg-gradient-to-br from-[#fdf0f3] to-[#ece4fa] shadow-[0_14px_30px_-16px_rgba(58,39,64,0.4)]'
                    }`}
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    {/* ribbon cross */}
                    <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 bg-gradient-to-b from-[#f3dba9] to-[#c99a4b] opacity-70" />
                    <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 bg-gradient-to-r from-[#f3dba9] to-[#c99a4b] opacity-70" />
                    <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-white/90 font-display text-4xl max-[360px]:h-14 max-[360px]:w-14 max-[360px]:text-3xl font-black text-[#9c3a5c] shadow-md">{o.letter}</span>
                    <span className="relative text-3xl">🎁</span>
                    {isChosen && !opened && (
                      <span className="absolute bottom-2 rounded-full bg-[#9c3a5c] px-3 py-0.5 text-xs font-bold text-white shadow">tap me ✨</span>
                    )}
                  </div>
                  {/* back — revealed */}
                  {o.image ? (
                    <div
                      className={`absolute inset-0 overflow-hidden rounded-3xl border-2 bg-[#3a2740] ${
                        isChosen ? 'border-[#e9c57e] shadow-[0_18px_40px_-12px_rgba(201,154,75,0.75)]' : 'border-white/70 opacity-80 grayscale-[55%]'
                      }`}
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <img src={o.image} alt="" loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1d1130]/90 via-[#1d1130]/35 to-transparent" />
                      <span className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 font-display text-base font-black text-[#9c3a5c] shadow">{o.letter}</span>
                      {isChosen && (
                        <span className="absolute right-2 top-2 rounded-full bg-[#c99a4b] px-2.5 py-0.5 text-xs font-bold text-white shadow">your pick ✓</span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 p-2.5 text-white">
                        <span className={`font-display font-extrabold leading-tight drop-shadow ${isChosen ? 'text-xl' : 'text-base'}`}>
                          {o.emoji} {o.label}
                        </span>
                        {!isChosen && <span className="font-hand text-lg leading-none text-[#fff1cf]">{ch.notChosenLabel}</span>}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-3xl border-2 p-3 ${
                        isChosen ? 'border-[#e9c57e] bg-gradient-to-br from-[#fffaf0] to-[#fde3ea] shadow-[0_18px_40px_-12px_rgba(201,154,75,0.75)]' : 'border-white/70 bg-white/60 opacity-75 grayscale-[40%]'
                      }`}
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <span className="font-display text-lg font-black text-[#8f6524]">{o.letter}</span>
                      <span className={isChosen ? 'text-5xl' : 'text-3xl'}>{o.emoji}</span>
                      <span className={`font-display font-extrabold leading-tight text-[#3a2740] ${isChosen ? 'text-xl' : 'text-base'}`}>{o.label}</span>
                      {isChosen ? (
                        <span className="mt-1 rounded-full bg-[#c99a4b] px-3 py-0.5 text-xs font-bold text-white">your pick ✓</span>
                      ) : (
                        <span className="font-hand text-lg text-[#6b5570]">{ch.notChosenLabel}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex min-h-16 items-center" aria-live="polite">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div key={toast} className="rounded-full bg-[#3a2740] px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-lg" initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }}>
              {toast}
            </motion.div>
          )}
          {ready && (
            <motion.div key="next" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <Button variant="rose" onClick={next} className="text-lg">
                {ch.nextButton}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {othersShown && ch.options.some((o) => o.credit) && (
        <details className="-mt-2 max-w-[420px] text-[0.7rem] leading-snug text-[#6b5570]/80">
          <summary className="cursor-pointer list-none underline decoration-dotted underline-offset-2">📷 Photo credits</summary>
          <p className="mt-1">
            {ch.options
              .filter((o) => o.credit)
              .map((o, i) => (
                <span key={o.letter}>
                  {i > 0 && ' · '}
                  {o.letter}:{' '}
                  <a href={o.credit!.url} target="_blank" rel="noreferrer" className="underline">
                    {o.credit!.author}
                  </a>{' '}
                  ({o.credit!.license}, Wikimedia Commons)
                </span>
              ))}
          </p>
        </details>
      )}
    </section>
  );
}
