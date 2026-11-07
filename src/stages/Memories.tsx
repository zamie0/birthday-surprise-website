import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { StageProps } from '../App';
import { birthday, type Photo } from '../config/birthday';
import { Button, rise } from '../components/ui';
import { Heart, Sparkle } from '../components/Decor';
import { Portal } from '../components/Portal';

const sizing: Record<Photo['orientation'], { card: string; aspect: string }> = {
  portrait: { card: 'w-[70vw] max-w-[290px]', aspect: 'aspect-[4/5]' },
  landscape: { card: 'w-[84vw] max-w-[400px]', aspect: 'aspect-[4/3]' },
  square: { card: 'w-[76vw] max-w-[330px]', aspect: 'aspect-square' },
};

const tapeColors = ['bg-[#f8c9d4]/85', 'bg-[#dccff5]/90', 'bg-[#ecd3a0]/85'];

export function Memories({ next }: StageProps) {
  const m = birthday.memories;
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  // Track which card is centred for the dots.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const h = c as HTMLElement;
        const d = Math.abs(h.offsetLeft + h.offsetWidth / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = scroller.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-dvh flex-col items-center gap-6 pb-[calc(var(--safe-bottom)+5rem)] pt-[calc(var(--safe-top)+5rem)] text-center">
      <div className="flex max-w-md flex-col items-center gap-3 px-6">
        <motion.h2 variants={rise} initial="hidden" animate="show" custom={0} className="font-display text-[2rem] font-black leading-tight text-[#3a2740] sm:text-5xl">
          {m.heading}
        </motion.h2>
        <motion.p variants={rise} initial="hidden" animate="show" custom={1} className="font-hand text-2xl leading-snug text-[#9c3a5c]">
          {m.subheading}
        </motion.p>
      </div>

      {/* swipeable scrapbook */}
      <div className="relative w-full">
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory items-center gap-5 overflow-x-auto overscroll-x-contain px-[12vw] py-8 sm:px-[calc(50vw-200px)]"
          role="list"
          aria-label="Photo memories — swipe to browse"
        >
          {m.photos.map((p, i) => {
            const s = sizing[p.orientation] ?? sizing.portrait;
            const rot = [-3, 2.5, -1.5, 3, -2.5, 1.5][i % 6];
            return (
              <motion.figure
                key={p.src + i}
                role="listitem"
                className={`relative shrink-0 snap-center ${s.card}`}
                initial={{ opacity: 0, y: 40, rotate: rot * 3 }}
                animate={{ opacity: 1, y: 0, rotate: rot }}
                transition={{ delay: 0.3 + Math.min(i, 4) * 0.12, type: 'spring', stiffness: 90, damping: 14 }}
              >
                <div className={`absolute -top-3 left-1/2 z-10 h-7 w-24 -translate-x-1/2 ${i % 2 ? 'rotate-[4deg]' : 'rotate-[-4deg]'} rounded-[3px] ${tapeColors[i % 3]} shadow-sm`} aria-hidden />
                <div className="rounded-[6px] bg-white p-3 pb-2 shadow-[0_20px_40px_-18px_rgba(58,39,64,0.45)]">
                  <button
                    type="button"
                    className={`relative block w-full overflow-hidden rounded-[3px] ${s.aspect}`}
                    onClick={() => loaded[i] && setLightbox(i)}
                    aria-label={loaded[i] ? `Open photo: ${p.caption || `memory ${i + 1}`}` : `Photo placeholder ${i + 1}`}
                  >
                    <Placeholder n={i + 1} src={p.src} />
                    <img
                      src={p.src}
                      alt={p.caption || `Memory ${i + 1}`}
                      loading="lazy"
                      draggable={false}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded[i] ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setLoaded((l) => ({ ...l, [i]: true }))}
                      onError={() => setLoaded((l) => ({ ...l, [i]: false }))}
                    />
                  </button>
                  <figcaption className="min-h-[2.5rem] px-1 pt-2 font-hand text-[1.45rem] leading-tight text-[#3a2740]">{p.caption}</figcaption>
                </div>
              </motion.figure>
            );
          })}
        </div>

        <div className="mt-1 flex items-center justify-center gap-3">
          <ArrowBtn label="Previous photo" onClick={() => scrollTo(Math.max(0, active - 1))} disabled={active === 0}>
            <ChevronLeft size={22} />
          </ArrowBtn>
          <div className="flex items-center gap-1.5" aria-hidden>
            {m.photos.map((_, i) => (
              <span key={i} className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-[#c99a4b]' : 'w-2 bg-[#e8d6b4]'}`} />
            ))}
          </div>
          <ArrowBtn label="Next photo" onClick={() => scrollTo(Math.min(m.photos.length - 1, active + 1))} disabled={active === m.photos.length - 1}>
            <ChevronRight size={22} />
          </ArrowBtn>
        </div>
        <p className="mt-2 text-sm text-[#6b5570]">← swipe through our memories →</p>
      </div>

      <motion.div variants={rise} initial="hidden" animate="show" custom={6} className="px-6">
        <Button onClick={next}>{m.nextButton}</Button>
      </motion.div>

      <Portal>
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1130]/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
          >
            <button type="button" aria-label="Close photo" className="absolute right-4 top-[calc(var(--safe-top)+1rem)] grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white" onClick={() => setLightbox(null)}>
              <X />
            </button>
            <motion.figure className="flex max-h-full flex-col items-center gap-3" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <img src={m.photos[lightbox].src} alt={m.photos[lightbox].caption || ''} className="max-h-[75dvh] max-w-full rounded-lg object-contain shadow-2xl" />
              {m.photos[lightbox].caption && <figcaption className="font-hand text-2xl text-[#fff1cf]">{m.photos[lightbox].caption}</figcaption>}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </section>
  );
}

function ArrowBtn({ children, label, onClick, disabled }: { children: React.ReactNode; label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-[#8f6524] shadow-sm ring-1 ring-[#ecd3a0] transition active:scale-90 disabled:opacity-35"
    >
      {children}
    </button>
  );
}

const placeholderBgs = [
  'from-[#fde3ea] via-[#fff3ec] to-[#efe6fa]',
  'from-[#efe6fa] via-[#fdf1e3] to-[#fde3ea]',
  'from-[#fff1d9] via-[#fde3ea] to-[#e9defa]',
];

function Placeholder({ n, src }: { n: number; src: string }) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${placeholderBgs[n % 3]} p-3`}>
      <Heart className="absolute left-4 top-4 rotate-[-12deg] opacity-60" size={18} color="#f0a3b8" />
      <Sparkle className="absolute bottom-5 right-5 opacity-80" size={16} color="#d9b46c" />
      <Heart className="absolute bottom-8 left-6 rotate-[10deg] opacity-50" size={12} color="#c8b3ee" />
      <div className="grid h-14 w-14 place-items-center rounded-full bg-white/70 text-[#c99a4b] shadow-inner">
        <Camera size={26} />
      </div>
      <span className="font-display text-lg font-bold italic text-[#9c3a5c]">Memory #{n}</span>
      <span className="rounded-full bg-white/60 px-2 py-0.5 font-mono text-[0.65rem] text-[#6b5570]">public{src}</span>
    </div>
  );
}
