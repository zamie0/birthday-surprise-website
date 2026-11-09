import { AnimatePresence, motion, useAnimationControls, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { StageProps } from '../App';
import { birthday } from '../config/birthday';
import { Button } from '../components/ui';
import { GiftBox } from '../components/GiftBox';
import { Sparkle } from '../components/Decor';
import { Portal } from '../components/Portal';
import { sfx } from '../lib/audio';
import { burst, cannons, starShower } from '../lib/fx';

type Phase = 'intro' | 'box' | 'boom' | 'ticket';

export function Bonus({ next }: StageProps) {
  const bo = birthday.bonus;
  const [lineStep, setLineStep] = useState(0); // 1..4 = lines shown
  const [phase, setPhase] = useState<Phase>('intro');
  const [taps, setTaps] = useState(0);
  const shakeCtl = useAnimationControls();

  useEffect(() => {
    if (phase !== 'intro') return;
    const delays = [400, 2100, 4000, 5000, 5900];
    const ts = delays.map((d, i) =>
      setTimeout(() => {
        setLineStep((s) => Math.max(s, i + 1));
      }, d),
    );
    return () => ts.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (lineStep === 3) {
      sfx('pop');
      void shakeCtl.start({ x: [0, -12, 12, -8, 8, 0], transition: { duration: 0.45 } });
    }
    if (lineStep === 4) sfx('chime');
    if (lineStep >= 5 && phase === 'intro') setPhase('box');
  }, [lineStep, phase, shakeCtl]);

  const skipAhead = () => {
    if (phase === 'intro') setLineStep((s) => Math.min(5, s + 1));
  };

  const tapBox = () => {
    if (phase !== 'box') return;
    const n = taps + 1;
    setTaps(n);
    if (n < 3) {
      sfx('pop');
      return;
    }
    setPhase('boom');
    sfx('open');
    setTimeout(() => {
      sfx('fanfare');
      cannons();
      burst(0.5, 0.45, 140);
      starShower();
    }, 300);
    setTimeout(() => setPhase('ticket'), 1100);
    setTimeout(() => starShower(), 2200);
  };

  const showLines = phase === 'intro' || phase === 'box';

  return (
    <motion.section
      animate={shakeCtl}
      className="stage-pad relative mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-5 text-center text-white"
      onClick={skipAhead}
    >
      <AnimatePresence>
        {showLines && (
          <motion.div key="lines" className="flex flex-col items-center gap-4" exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}>
            {lineStep >= 1 && (
              <motion.p className="font-display text-3xl italic text-white/90" initial={{ opacity: 0, letterSpacing: '0.3em' }} animate={{ opacity: 1, letterSpacing: '0em' }} transition={{ duration: 1.2 }}>
                {bo.lines[0]}
              </motion.p>
            )}
            {lineStep >= 2 && (
              <motion.p className="max-w-xs text-xl leading-snug text-white/80 sm:max-w-md" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {bo.lines[1]}
              </motion.p>
            )}
            {lineStep >= 3 && (
              <motion.p className="font-display text-[3.4rem] font-black leading-none text-[#f8c9d4]" initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
                {bo.nope}
              </motion.p>
            )}
            {lineStep >= 4 && (
              <motion.p className="foil font-display text-[2rem] font-black tracking-wide min-[380px]:text-[2.3rem]" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {bo.oneMore}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'intro' && lineStep < 5 && <p className="absolute bottom-[calc(var(--safe-bottom)+4rem)] text-xs text-white/40">tap anywhere to hurry up 👀</p>}

      {/* the big gift */}
      {(phase === 'box' || phase === 'boom') && (
        <motion.div className="relative flex flex-col items-center gap-4" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 140, damping: 11 }}>
          <div className="rays absolute left-1/2 top-[45%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.25 + taps * 0.25 }} aria-hidden />
          <motion.div
            className="absolute left-1/2 top-[45%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ecd3a0] blur-3xl"
            animate={{ opacity: 0.25 + taps * 0.2, scale: 1 + taps * 0.15 }}
            aria-hidden
          />
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              tapBox();
            }}
            aria-label={`Open the bonus gift (tap ${3 - taps} more time${3 - taps === 1 ? '' : 's'})`}
            className="relative"
            animate={phase === 'box' ? { scale: 1 + taps * 0.07, y: [0, -6, 0] } : { scale: 1.25 }}
            transition={phase === 'box' ? { y: { duration: 1.2, repeat: Infinity }, scale: { type: 'spring', stiffness: 300 } } : { duration: 0.4 }}
          >
            <GiftBox variant="royal" size={230} shake={taps} open={phase === 'boom'} />
          </motion.button>
          {phase === 'box' && (
            <div className="relative flex flex-col items-center gap-2">
              <p className="font-hand text-2xl text-[#fff1cf]">{taps === 0 ? bo.tapHint : taps === 1 ? 'Harder! 💥' : 'One more!!! 😆'}</p>
              <div className="flex gap-2" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`h-3 w-3 rounded-full transition ${i < taps ? 'bg-[#f3dba9] shadow-[0_0_10px_#f3dba9]' : 'bg-white/25'}`} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* white flash */}
      <Portal>
      <AnimatePresence>
        {phase === 'boom' && (
          <motion.div className="pointer-events-none fixed inset-0 z-40 bg-[#fff6e0]" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.95, 0] }} transition={{ duration: 1.1, times: [0, 0.25, 1] }} />
        )}
      </AnimatePresence>
      </Portal>

      {phase === 'ticket' && (
        <div className="flex w-full flex-col items-center gap-6">
          <motion.p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f3dba9]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Sparkles className="mr-1 inline" size={16} /> surprise unlocked <Sparkles className="ml-1 inline" size={16} />
          </motion.p>
          <motion.h2
            className="font-display text-[2.1rem] font-black leading-[1.05] text-white min-[380px]:text-[2.4rem] sm:text-5xl"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            {bo.headline}
          </motion.h2>
          <motion.p className="foil font-display text-[1.65rem] font-black leading-tight min-[380px]:text-3xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            {bo.place}
          </motion.p>

          <ThemeParkTicket />

          {bo.lines2.map((l, i) => (
            <motion.p
              key={i}
              className={i === 0 ? 'max-w-sm text-lg leading-relaxed text-white/80' : 'max-w-sm font-hand text-[1.75rem] leading-snug text-[#f8c9d4]'}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.6 }}
            >
              {l}
            </motion.p>
          ))}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
            <Button onClick={next}>{bo.nextButton}</Button>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
}

function ThemeParkTicket() {
  const bo = birthday.bonus;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 150, damping: 15 });

  return (
    <motion.div
      className="w-full max-w-[360px]"
      style={{ perspective: 900 }}
      initial={{ y: 160, opacity: 0, rotate: -12, scale: 0.6 }}
      animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 70, damping: 11 }}
    >
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
          my.set(((e.clientY - r.top) / r.height) * 2 - 1);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry, '--notch': '74%' } as never}
        className="holo ticket-notch relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#f9d2de_0%,#e2d3fa_35%,#fff1cf_60%,#f6bfd0_100%)] text-left text-[#3a2740] shadow-[0_30px_80px_-20px_rgba(236,211,160,0.55)]"
      >
        {bo.ticketPhoto ? (
          <div className="relative h-44 overflow-hidden">
            <img src={bo.ticketPhoto} alt={`${bo.ticketPlace} roller coaster`} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
            {/* fade the photo into the ticket colours */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#f6d6e2]" />
            <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#9c3a5c] shadow">🎢 Kuala Lumpur</span>
          </div>
        ) : (
          /* decorative coaster track */
          <svg viewBox="0 0 360 120" className="absolute inset-x-0 top-0 h-28 w-full opacity-40" aria-hidden preserveAspectRatio="none">
            <path d="M0 95 C 60 20, 100 20, 140 80 S 230 120, 270 40 S 340 30, 360 70" stroke="#9c3a5c" strokeWidth="3" fill="none" />
            <path d="M0 103 C 60 28, 100 28, 140 88 S 230 128, 270 48 S 340 38, 360 78" stroke="#9c3a5c" strokeWidth="2" fill="none" strokeDasharray="2 6" />
          </svg>
        )}
        <Sparkle className="absolute right-5 top-5" size={22} color="#c99a4b" />
        <Sparkle className="absolute right-12 top-14" size={12} color="#fff1cf" />

        <div className={`relative px-6 pb-5 ${bo.ticketPhoto ? 'pt-3' : 'pt-7'}`}>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#8f6524]">{bo.ticketLabel}</p>
          <p className="mt-2 font-display text-[1.65rem] font-black leading-tight text-[#9c3a5c]">{bo.ticketPlace}</p>
          <p className="mt-2 text-[0.95rem] leading-snug text-[#3a2740]">🎢 {bo.ticketGoodFor}</p>
        </div>
        <div className="relative mx-6 border-t-2 border-dashed border-[#9c3a5c]/30" />
        <div className="relative flex items-end justify-between gap-3 px-6 pb-6 pt-4">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[#8f6524]">Lucky holder</p>
            <p className="font-display text-xl font-extrabold">{birthday.name} 🎂</p>
          </div>
          <div className="grid h-14 w-14 shrink-0 rotate-[-10deg] place-items-center rounded-full border-2 border-[#c99a4b] text-center font-display text-[0.6rem] font-black uppercase leading-tight text-[#8f6524]">
            B-day
            <br />
            {birthday.age}
            <br />
            edition
          </div>
        </div>
        <p className="relative bg-white/40 px-6 py-2 text-[0.68rem] text-[#6b5570]">
          {bo.ticketFinePrint}
          {bo.ticketPhoto && bo.ticketPhotoCredit && (
            <>
              {' '}
              Photo:{' '}
              <a href={bo.ticketPhotoCredit.url} target="_blank" rel="noreferrer" className="underline">
                {bo.ticketPhotoCredit.author}
              </a>
              , {bo.ticketPhotoCredit.license}, Wikimedia Commons.
            </>
          )}
        </p>
      </motion.div>
    </motion.div>
  );
}
