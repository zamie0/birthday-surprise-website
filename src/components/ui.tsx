import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = HTMLMotionProps<'button'> & {
  variant?: 'gold' | 'rose' | 'ghost' | 'night';
  children: ReactNode;
};

const styles: Record<NonNullable<Props['variant']>, string> = {
  gold: 'bg-gradient-to-br from-[#f3dba9] via-[#dcb26a] to-[#b98634] text-[#3a2410] shadow-[0_10px_30px_-10px_rgba(185,134,52,0.9),inset_0_1px_0_rgba(255,255,255,0.6)]',
  rose: 'bg-gradient-to-br from-[#f7a8bd] via-[#e0718f] to-[#c4517a] text-white shadow-[0_10px_30px_-10px_rgba(196,81,122,0.9),inset_0_1px_0_rgba(255,255,255,0.45)]',
  ghost: 'bg-white/70 text-ink border border-[#e8d6b4] backdrop-blur-sm',
  night: 'bg-white/10 text-white border border-white/25 backdrop-blur-sm',
};

export function Button({ variant = 'gold', className = '', children, ...rest }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 py-3 text-[1.05rem] font-bold tracking-wide ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/** Fades & lifts children in sequence. */
export const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

const EMOJI = /(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)/u;

/** Gold/rose foil text that keeps emoji in full colour. */
export function Foil({ text, tone = 'gold', className = '' }: { text: string; tone?: 'gold' | 'rose'; className?: string }) {
  const parts = text.split(EMOJI).filter(Boolean);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        EMOJI.test(p) ? (
          <span key={i} className="inline-block">{p}</span>
        ) : (
          <span key={i} className={tone === 'gold' ? 'foil' : 'foil-rose'}>{p}</span>
        ),
      )}
    </span>
  );
}
