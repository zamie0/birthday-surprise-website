import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, X } from 'lucide-react';
import type { StageProps } from '../App';
import { birthday } from '../config/birthday';
import { Button, rise } from '../components/ui';
import { Cake } from '../components/Cake';
import { Balloon } from '../components/Decor';
import { Portal } from '../components/Portal';
import { sfx } from '../lib/audio';
import { burst, cannons, starShower } from '../lib/fx';

type Phase = 'wish' | 'blowing' | 'done';

const blowLines = [
  'Big breath... 🌬️',
  'Ooh, a few went out! Keep going 💨',
  'Almost there, birthday boy! 😤',
  'Last few stubborn ones! 🔥',
];

export function Celebration({ next }: StageProps) {
  const c = birthday.celebration;
  const [lit, setLit] = useState<boolean[]>(() => Array(birthday.age).fill(true));
  const [phase, setPhase] = useState<Phase>('wish');
  const [blows, setBlows] = useState(0);
  const [eggTaps, setEggTaps] = useState(0);
  const [egg, setEgg] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [micError, setMicError] = useState('');
  const stopMic = useRef<() => void>(() => {});
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      cannons();
      sfx('fanfare');
    }, 300);
    return () => clearTimeout(t1);
  }, []);

  const remaining = lit.filter(Boolean).length;

  const blow = useCallback(
    (amount?: number) => {
      if (phase !== 'blowing') return;
      sfx('blow');
      setBlows((b) => b + 1);
      setLit((prev) => {
        const on = prev.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
        if (!on.length) return prev;
        const n = amount ?? Math.max(5, Math.ceil(on.length * (0.3 + Math.random() * 0.25)));
        const pick = new Set(on.sort(() => Math.random() - 0.5).slice(0, n));
        return prev.map((v, i) => (pick.has(i) ? false : v));
      });
    },
    [phase],
  );

  useEffect(() => {
    if (phase === 'blowing' && remaining === 0) {
      stopMic.current();
      setPhase('done');
      setTimeout(() => {
        burst(0.5, 0.4, 130);
        starShower();
        sfx('chime');
      }, 350);
      setTimeout(() => messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 1300);
    }
  }, [remaining, phase]);

  useEffect(() => () => stopMic.current(), []);

  const startMic = async () => {
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ac = new AC();
      const src = ac.createMediaStreamSource(stream);
      const an = ac.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const data = new Uint8Array(an.fftSize);
      let raf = 0;
      let last = 0;
      const loop = (t: number) => {
        an.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / data.length);
        if (rms > 0.18 && t - last > 350) {
          last = t;
          blow(4);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      setMicOn(true);
      stopMic.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((tr) => tr.stop());
        void ac.close();
        setMicOn(false);
      };
    } catch {
      setMicError('No mic? No problem — just tap the button 😄');
    }
  };

  const tapTwentyFive = () => {
    const n = eggTaps + 1;
    setEggTaps(n);
    sfx('pop');
    if (n >= 5) {
      setEgg(true);
      setEggTaps(0);
      starShower();
    }
  };

  return (
    <section className="stage-pad relative mx-auto flex min-h-dvh max-w-xl flex-col items-center gap-6 text-center">
      {/* side balloons that pop in */}
      <motion.div className="pointer-events-none absolute left-1 top-24 sm:-left-10" initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 60 }}>
        <Balloon color="#f4a7bb" size={44} className="float-y" />
      </motion.div>
      <motion.div className="pointer-events-none absolute right-1 top-32 sm:-right-10" initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, type: 'spring', stiffness: 60 }}>
        <Balloon color="#c8b3ee" size={38} className="float-y" />
      </motion.div>

      <motion.p variants={rise} initial="hidden" animate="show" custom={0} className="text-xs font-bold uppercase tracking-[0.3em] text-[#8f6524]">
        {birthday.birthdayDateLabel}
      </motion.p>

      <motion.h1
        className="font-display text-[1.9rem] font-black leading-[1.1] text-[#3a2740] min-[380px]:text-[2.2rem] sm:text-5xl"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 12, delay: 0.15 }}
      >
        {c.title}
      </motion.h1>

      {/* the big animated 25 (secret: tap it 5 times) */}
      <motion.button
        type="button"
        onClick={tapTwentyFive}
        aria-label={`${birthday.age}`}
        className="relative -my-2 select-none"
        initial={{ opacity: 0, rotate: -15, scale: 0.3 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 9, delay: 0.5 }}
        whileTap={{ scale: 0.9, rotate: -4 }}
      >
        <motion.span
          className="foil block font-display text-[7.5rem] font-black leading-none sm:text-[10rem]"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 8px 18px rgba(185,134,52,0.35))' }}
        >
          {birthday.age}
        </motion.span>
        {eggTaps > 0 && eggTaps < 5 && (
          <span className="absolute -right-3 top-2 rounded-full bg-[#e0718f] px-2 text-xs font-bold text-white">{5 - eggTaps}</span>
        )}
      </motion.button>

      {/* cake */}
      <motion.div
        className="relative w-full max-w-[340px]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        onClick={() => blow()}
      >
        <div className="absolute inset-x-6 top-6 h-24 rounded-full bg-[#ffd98a]/40 blur-2xl transition-opacity duration-700" style={{ opacity: remaining / birthday.age }} />
        <Cake lit={lit} />
      </motion.div>

      <div className="flex min-h-[9rem] w-full flex-col items-center gap-3" aria-live="polite">
        <AnimatePresence mode="wait">
          {phase === 'wish' && (
            <motion.div key="wish" className="flex flex-col items-center gap-4" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: 1.1 } }} exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}>
              <p className="font-hand text-3xl text-[#9c3a5c]">{c.wishPrompt}</p>
              <Button
                variant="rose"
                onClick={() => {
                  sfx('chime');
                  setPhase('blowing');
                }}
              >
                {c.wishButton}
              </Button>
            </motion.div>
          )}

          {phase === 'blowing' && (
            <motion.div key="blow" className="flex flex-col items-center gap-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <p className="font-hand text-2xl text-[#6b5570]">
                {blowLines[Math.min(blows, blowLines.length - 1)]} <span className="font-sans text-base font-bold text-[#9c3a5c]">({remaining} left)</span>
              </p>
              <Button onClick={() => blow()} className="px-9">
                {c.blowButton}
              </Button>
              {'mediaDevices' in navigator && (
                <button
                  type="button"
                  onClick={() => (micOn ? stopMic.current() : startMic())}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#8f6524] underline decoration-[#ecd3a0] decoration-2 underline-offset-4"
                >
                  <Mic size={16} /> {micOn ? 'Listening... blow now! (tap to stop)' : c.micButton}
                </button>
              )}
              {micError && <p className="text-sm text-[#6b5570]">{micError}</p>}
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.p key="done" className="font-display text-2xl font-bold italic text-[#9c3a5c]" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              {c.afterBlow}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* the sweet message */}
      {phase === 'done' && (
        <motion.div
          ref={messageRef}
          className="paper relative w-full scroll-mt-24 rounded-[2rem] border border-[#ecd3a0] p-6 text-left shadow-[0_30px_60px_-30px_rgba(156,58,92,0.45)] sm:p-9"
          initial={{ opacity: 0, y: 60, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -top-4 left-1/2 h-8 w-28 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-[#f8c9d4]/80" aria-hidden />
          {c.message.map((p, i) => (
            <motion.p
              key={i}
              variants={rise}
              initial="hidden"
              animate="show"
              custom={i + 8}
              className={i === 0 ? 'mb-4 font-display text-2xl font-extrabold text-[#9c3a5c]' : 'mb-3 text-[1.05rem] leading-relaxed text-[#3a2740] last:mb-0 last:font-hand last:text-2xl last:text-[#9c3a5c]'}
            >
              {p}
            </motion.p>
          ))}
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
          <Button onClick={next}>{c.nextButton}</Button>
        </motion.div>
      )}

      {/* easter egg */}
      <Portal>
      <AnimatePresence>
        {egg && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#1d1130]/60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEgg(false)}
            role="dialog"
            aria-modal="true"
            aria-label={birthday.easterEgg.title}
          >
            <motion.div
              className="paper relative w-full max-w-sm rounded-3xl p-7 text-center shadow-2xl"
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" onClick={() => setEgg(false)} aria-label="Close" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-[#6b5570]">
                <X size={20} />
              </button>
              <div className="mb-2 text-5xl">🥚✨</div>
              <h2 className="mb-3 font-display text-2xl font-extrabold text-[#9c3a5c]">{birthday.easterEgg.title}</h2>
              <p className="leading-relaxed text-[#3a2740]">{birthday.easterEgg.message}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </section>
  );
}
