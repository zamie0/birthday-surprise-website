import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { StageProps } from '../App';
import { birthday } from '../config/birthday';
import { Button, rise } from '../components/ui';
import { Balloon, Heart } from '../components/Decor';
import { Portal } from '../components/Portal';
import { sfx } from '../lib/audio';
import { bigCelebration, heartBurst } from '../lib/fx';

export function Final({ restart }: StageProps) {
  const f = birthday.final;
  const [finale, setFinale] = useState(false);

  return (
    <section className="stage-pad relative mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-7 text-center">
      <motion.h2 variants={rise} initial="hidden" animate="show" custom={0} className="font-display text-[2.4rem] font-black italic leading-tight text-[#3a2740] sm:text-6xl">
        {f.heading}
      </motion.h2>

      <motion.article
        className="paper relative w-full rounded-[2rem] border border-[#ecd3a0] px-6 py-8 text-left shadow-[0_30px_60px_-30px_rgba(156,58,92,0.45)] sm:px-10"
        initial={{ opacity: 0, y: 40, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute -top-5 right-8 grid h-12 w-12 rotate-12 place-items-center rounded-full bg-gradient-to-br from-[#e0718f] to-[#9c3a5c] shadow-lg" aria-hidden>
          <Heart size={22} color="#fff1cf" />
        </div>
        {f.message.map((p, i) => (
          <motion.p key={i} variants={rise} initial="hidden" animate="show" custom={i + 4} className={i === f.message.length - 1 ? 'mb-0 font-display text-xl font-bold text-[#9c3a5c]' : 'mb-4 text-[1.07rem] leading-relaxed text-[#3a2740]'}>
            {p}
          </motion.p>
        ))}
        <motion.p variants={rise} initial="hidden" animate="show" custom={9} className="mt-6 text-right font-hand text-3xl text-[#9c3a5c]">
          {birthday.signature}
        </motion.p>
      </motion.article>

      <motion.div variants={rise} initial="hidden" animate="show" custom={11}>
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <Button
            variant="rose"
            className="text-lg"
            onClick={() => {
              setFinale(true);
              sfx('fanfare');
            }}
          >
            {f.button}
          </Button>
        </motion.div>
      </motion.div>

      <Portal>
        <AnimatePresence>{finale && <Finale onClose={() => setFinale(false)} onReplay={restart} />}</AnimatePresence>
      </Portal>
    </section>
  );
}

const BALLOONS = ['#f4a7bb', '#d6c3f3', '#ecd3a0', '#f9cdd8', '#bfa6ea', '#f6b8c8'];

function Finale({ onClose, onReplay }: { onClose: () => void; onReplay: () => void }) {
  const f = birthday.final;
  const title = f.finaleTitle;

  useEffect(() => {
    bigCelebration(3200);
    const t = setTimeout(() => heartBurst(0.5, 0.9), 1200);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-[radial-gradient(ellipse_at_center,#fff6ea_0%,#fbd7e1_45%,#d9c9f5_100%)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* balloons filling the sky */}
      {Array.from({ length: 14 }, (_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute"
          style={{ left: `${(i * 37) % 96}%` }}
          initial={{ y: '110vh' }}
          animate={{ y: '-130vh', x: [0, i % 2 ? 25 : -25, 0] }}
          transition={{ duration: 7 + (i % 5), delay: (i % 7) * 0.35, repeat: Infinity, ease: 'linear', x: { duration: 3, repeat: Infinity } }}
          aria-hidden
        >
          <Balloon color={BALLOONS[i % BALLOONS.length]} size={40 + (i % 4) * 10} />
        </motion.div>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`h${i}`}
          className="pointer-events-none absolute"
          style={{ left: `${(i * 53 + 7) % 94}%`, top: `${(i * 29 + 11) % 90}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8], y: [0, -20, 0] }}
          transition={{ delay: 0.4 + i * 0.12, duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
          aria-hidden
        >
          <Heart size={16 + (i % 3) * 8} color={i % 2 ? '#e0718f' : '#a98fdc'} />
        </motion.div>
      ))}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/70 text-[#8f6524] shadow"
        style={{ top: 'calc(var(--safe-top) + 0.75rem)' }}
      >
        <X size={20} />
      </button>

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-5 text-center" style={{ paddingBottom: 'calc(var(--safe-bottom) + 1rem)' }}>
        <h2 className="flex max-w-[22rem] flex-wrap justify-center gap-x-3 font-display text-[2rem] font-black leading-[1.05] text-[#9c3a5c] min-[380px]:text-[2.7rem] sm:max-w-2xl sm:text-6xl">
          {title.split(' ').map((word, wi) => (
            <span key={wi} className="inline-flex">
              {word.split('').map((ch, ci) => (
                <motion.span
                  key={ci}
                  className="inline-block"
                  initial={{ y: -80, opacity: 0, rotate: -20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2 + (wi * 6 + ci) * 0.05, type: 'spring', stiffness: 300, damping: 12 }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h2>

        <motion.div
          className="font-display text-[clamp(6rem,22dvh,9rem)] font-black leading-none sm:text-[13rem]"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: [0, 1.15, 1], rotate: 0 }}
          transition={{ delay: 1, duration: 0.9 }}
          style={{ filter: 'drop-shadow(0 12px 24px rgba(185,134,52,0.4))' }}
        >
          <motion.span className="foil inline-block" animate={{ rotate: [-3, 3, -3], y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            {birthday.age}
          </motion.span>
        </motion.div>

        <motion.div className="flex w-full max-w-xs flex-col gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
          <Button
            onClick={() => {
              bigCelebration(2000);
              heartBurst(0.5, 0.8);
              sfx('fanfare');
            }}
          >
            {f.againButton}
          </Button>
          <Button variant="ghost" onClick={onReplay} className="whitespace-nowrap px-4 text-[0.95rem]">
            {f.replayButton}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
