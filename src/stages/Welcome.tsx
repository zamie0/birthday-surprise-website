import { motion } from 'framer-motion';
import { useState } from 'react';
import type { StageProps } from '../App';
import { birthday } from '../config/birthday';
import { Button, Foil } from '../components/ui';
import { GiftBox } from '../components/GiftBox';
import { Countdown } from '../components/Countdown';
import { sfx, startMusic, unlockAudio } from '../lib/audio';
import { burst, dayMode } from '../lib/fx';

export function Welcome({ next }: StageProps) {
  const [opening, setOpening] = useState(false);
  const [shake, setShake] = useState(0);
  const isToday = dayMode() === 'today';
  const w = birthday.welcome;

  const open = () => {
    if (opening) return;
    unlockAudio();
    startMusic();
    sfx('open');
    setOpening(true);
    setTimeout(() => burst(0.5, 0.45, 90), 350);
    setTimeout(next, 1500);
  };

  return (
    <section className="stage-pad relative flex min-h-dvh flex-col items-center justify-center gap-7 text-center text-white">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Countdown />
      </motion.div>

      <div className="flex flex-col items-center gap-3">
        <motion.h1
          className="font-display text-[2.6rem] font-extrabold italic leading-tight sm:text-6xl"
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Foil text={isToday ? w.birthdayModeTeaser : w.teaser} />
        </motion.h1>
        <motion.p
          className="max-w-xs text-lg leading-relaxed text-white/85 sm:max-w-md sm:text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {w.line}
        </motion.p>
      </div>

      <motion.button
        type="button"
        aria-label="Shake the gift"
        className="relative"
        initial={{ opacity: 0, y: 40, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.2, type: 'spring', stiffness: 160, damping: 14 }}
        onClick={() => {
          unlockAudio();
          sfx('pop');
          setShake((s) => s + 1);
        }}
      >
        <div className="absolute inset-0 -z-10 rounded-full bg-[#ecd3a0]/25 blur-3xl" />
        <motion.div animate={opening ? {} : { y: [0, -10, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
          <GiftBox open={opening} size={210} shake={shake} crown={isToday} />
        </motion.div>
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }} className="flex flex-col items-center gap-3">
        <Button onClick={open} disabled={opening} className="text-lg">
          {w.button}
        </Button>
        <span className="font-hand text-xl text-white/60">(psst... you can shake the box too)</span>
      </motion.div>
    </section>
  );
}
