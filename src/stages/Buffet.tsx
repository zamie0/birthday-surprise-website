import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MapPin, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { StageProps } from '../App';
import { birthday } from '../config/birthday';
import { Button, Foil } from '../components/ui';
import { sfx } from '../lib/audio';
import { bigCelebration } from '../lib/fx';

export function Buffet({ next }: StageProps) {
  const b = birthday.buffet;
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const f = reduce ? 0.4 : 1;
    const ts = [
      setTimeout(() => setStep(1), 1100 * f),
      setTimeout(() => {
        setStep(2);
        sfx('fanfare');
        bigCelebration(1800);
      }, 2900 * f),
      setTimeout(() => setStep(3), 3800 * f),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <section className="stage-pad relative mx-auto flex min-h-dvh max-w-xl flex-col items-center gap-5 text-center">
      <motion.p
        className="font-display text-[2.4rem] font-black leading-none text-[#9c3a5c] sm:text-6xl"
        initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        {b.youChose}
      </motion.p>

      <div className="min-h-[2.5rem]">
        {step >= 1 && (
          <motion.p className="font-hand text-3xl text-[#6b5570]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {b.intro}
            {step === 1 && (
              <span className="ml-1 inline-flex gap-1" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="inline-block" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}>
                    🥁
                  </motion.span>
                ))}
              </span>
            )}
          </motion.p>
        )}
      </div>

      {step >= 2 && (
        <motion.h2
          className="font-display text-[2.35rem] font-black leading-[1.05] min-[380px]:text-[2.7rem] sm:text-6xl"
          initial={{ scale: 2.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15 }}
        >
          <Foil text={b.headline} tone="rose" />
        </motion.h2>
      )}

      {step >= 3 && (
        <>
          {/* restaurant card */}
          <motion.div
            className="relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2e1a24] via-[#3f2029] to-[#24131d] px-6 pb-7 pt-4 text-[#fff1cf] shadow-[0_30px_60px_-25px_rgba(63,32,41,0.9)]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -bottom-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-[#ff8a3d]/30 blur-3xl" aria-hidden />
            <GrillArt />
            <p className="relative mt-1 text-[0.7rem] font-bold uppercase tracking-[0.35em] text-[#ecd3a0]/80">Your birthday buffet at</p>
            <h3 className="foil relative mt-1 font-display text-[2.1rem] font-black leading-tight">{b.restaurant}</h3>
            <div className="relative mx-auto my-3 flex items-center justify-center gap-3 text-[#ecd3a0]/70" aria-hidden>
              <span className="h-px w-10 bg-current" />✦<span className="h-px w-10 bg-current" />
            </div>
            <p className="relative inline-flex items-center gap-1.5 font-display text-xl italic">
              <MapPin size={18} className="text-[#ecd3a0]" /> {b.venue}
            </p>
            <p className="relative mt-4 font-hand text-2xl leading-snug text-white/90">{b.message}</p>
          </motion.div>

          {/* voucher */}
          <motion.div
            className="ticket-notch relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#fffaf0] to-[#fdebd9] text-[#3a2740] shadow-[0_24px_50px_-24px_rgba(156,58,92,0.55)]"
            style={{ '--notch': '72%' } as React.CSSProperties}
            initial={{ opacity: 0, y: 40, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 90, damping: 12 }}
          >
            <div className="px-6 pb-5 pt-6">
              <div className="flex items-center justify-center gap-2 text-[#c99a4b]">
                <UtensilsCrossed size={18} />
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em]">{b.voucherTitle}</span>
                <UtensilsCrossed size={18} />
              </div>
              <p className="mt-3 font-display text-2xl font-black text-[#9c3a5c]">1 × Buffet Date 🍖🔥</p>
              <p className="mt-1 text-sm text-[#6b5570]">{b.restaurant} · {b.venue}</p>
            </div>
            <div className="mx-6 border-t-2 border-dashed border-[#e8d6b4]" />
            <div className="flex items-center justify-between px-6 py-4 text-left">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#8f6524]">Issued to</p>
                <p className="font-display text-lg font-extrabold">{birthday.name} 🎂</p>
              </div>
              <p className="max-w-[55%] text-right font-hand text-lg leading-tight text-[#9c3a5c]">{b.voucherNote}</p>
            </div>
          </motion.div>

          <motion.div className="w-full max-w-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <button
              type="button"
              onClick={() => {
                setDetails((d) => !d);
                sfx('pop');
              }}
              aria-expanded={details}
              className="mx-auto flex min-h-12 items-center gap-2 rounded-full border border-[#ecd3a0] bg-white/70 px-5 font-semibold text-[#8f6524] backdrop-blur-sm"
            >
              {details ? 'Hide details' : b.detailsButton}
              <motion.span animate={{ rotate: details ? 180 : 0 }}>
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {details && (
                <motion.dl
                  className="mt-3 overflow-hidden rounded-2xl bg-white/80 text-left shadow-sm backdrop-blur-sm"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {b.details.map((d) => (
                    <div key={d.label} className="flex gap-3 border-b border-[#f3e6cf] px-5 py-3 last:border-0">
                      <dt className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-[#8f6524]">{d.label}</dt>
                      <dd className="text-[0.95rem] text-[#3a2740]">{d.value}</dd>
                    </div>
                  ))}
                </motion.dl>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
            <Button onClick={next}>{b.nextButton}</Button>
          </motion.div>
        </>
      )}
    </section>
  );
}

/** Original illustration: skewers sizzling over a grill. */
function GrillArt() {
  const flames = [60, 95, 130, 165, 200];
  return (
    <svg viewBox="0 0 260 120" className="relative mx-auto h-auto w-full max-w-[260px]" aria-hidden>
      {/* steam */}
      {[90, 130, 170].map((x, i) => (
        <motion.path
          key={x}
          d={`M${x} 40 q -8 -10 0 -20 q 8 -10 0 -20`}
          stroke="#fff1cf"
          strokeOpacity="0.5"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={{ y: [6, -6], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {/* flames */}
      {flames.map((x, i) => (
        <g key={x} className="flame" style={{ '--delay': `${i * -0.17}s`, transformBox: 'fill-box' } as React.CSSProperties}>
          <path d={`M${x} 78 C ${x + 14} 92, ${x + 12} 108, ${x} 110 C ${x - 12} 108, ${x - 14} 92, ${x} 78Z`} fill="#ff8a3d" opacity="0.9" />
          <path d={`M${x} 90 C ${x + 7} 98, ${x + 6} 108, ${x} 109 C ${x - 6} 108, ${x - 7} 98, ${x} 90Z`} fill="#ffd36b" />
        </g>
      ))}
      {/* grate */}
      <rect x="30" y="74" width="200" height="6" rx="3" fill="#8a6a5a" />
      {[50, 80, 110, 140, 170, 200].map((x) => (
        <rect key={x} x={x} y="70" width="4" height="14" rx="2" fill="#6b4e42" />
      ))}
      {/* skewers */}
      {[0, 1, 2].map((s) => {
        const y = 44 + s * 9;
        return (
          <g key={s} transform={`rotate(${-4 + s * 4} 130 ${y})`}>
            <rect x="38" y={y - 1.5} width="184" height="3" rx="1.5" fill="#d9c19a" />
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const cx = 62 + k * 28;
              const colors = ['#8a3a25', '#e0503a', '#7a2f20', '#f2b33d', '#8a3a25', '#4f8a3a'];
              return <rect key={k} x={cx - 10} y={y - 9} width="20" height="18" rx="6" fill={colors[(k + s) % colors.length]} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}
