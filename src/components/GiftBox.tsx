import { motion } from 'framer-motion';

type Props = {
  open?: boolean;
  variant?: 'classic' | 'royal';
  size?: number;
  shake?: number; // increment to trigger a shake
  crown?: boolean;
};

const palettes = {
  classic: { box: ['#ffd9e2', '#f2a3b8'], side: '#e58aa3', ribbon: ['#f6dfab', '#c99a4b'], dots: '#fff4f6' },
  royal: { box: ['#8d6ad1', '#4a2d7d'], side: '#3d2468', ribbon: ['#fff1cf', '#c99a4b'], dots: '#f3dba9' },
};

export function GiftBox({ open = false, variant = 'classic', size = 220, shake = 0, crown = false }: Props) {
  const p = palettes[variant];
  const id = variant;
  return (
    <motion.div
      key={shake}
      animate={shake ? { rotate: [0, -7, 7, -5, 5, 0], scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 0.45 }}
      style={{ width: size, height: size }}
      className="relative"
    >
      {/* inner glow that escapes when opened */}
      <motion.div
        className="absolute left-1/2 top-[44%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff6d8_0%,rgba(255,226,160,0.7)_35%,transparent_70%)]"
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1.5 : 0.4 }}
        transition={{ duration: 0.6 }}
      />
      <svg viewBox="0 0 200 200" width={size} height={size} className="relative overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`box-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.box[0]} />
            <stop offset="1" stopColor={p.box[1]} />
          </linearGradient>
          <linearGradient id={`rib-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.ribbon[0]} />
            <stop offset="1" stopColor={p.ribbon[1]} />
          </linearGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="100" cy="192" rx="72" ry="7" fill="#000" opacity="0.15" />

        {/* body */}
        <rect x="32" y="98" width="136" height="92" rx="8" fill={`url(#box-${id})`} />
        <rect x="32" y="98" width="136" height="12" fill={p.side} opacity="0.5" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={48 + (i % 3) * 22 + (i > 2 ? 72 : 0)} cy={i % 2 ? 160 : 132} r="3" fill={p.dots} opacity="0.7" />
        ))}
        {variant === 'royal' &&
          [
            [52, 150],
            [146, 128],
            [140, 172],
          ].map(([x, y], i) => (
            <path key={i} transform={`translate(${x} ${y}) scale(0.5)`} d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3Z" fill="#f3dba9" />
          ))}
        <rect x="91" y="98" width="18" height="92" fill={`url(#rib-${id})`} />

        {/* lid + bow */}
        <motion.g
          initial={false}
          animate={open ? { y: -95, x: 26, rotate: 24, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
          transition={open ? { duration: 0.9, ease: [0.2, 0.9, 0.3, 1] } : { duration: 0.3 }}
          style={{ transformOrigin: '100px 86px' }}
        >
          <rect x="24" y="74" width="152" height="30" rx="6" fill={`url(#box-${id})`} />
          <rect x="24" y="96" width="152" height="8" rx="3" fill={p.side} opacity="0.45" />
          <rect x="91" y="74" width="18" height="30" fill={`url(#rib-${id})`} />
          {/* bow loops */}
          <path d="M100 74 C 70 40, 48 58, 62 74 C 72 82, 92 78, 100 74 Z" fill={`url(#rib-${id})`} />
          <path d="M100 74 C 130 40, 152 58, 138 74 C 128 82, 108 78, 100 74 Z" fill={`url(#rib-${id})`} />
          <path d="M100 74 C 92 86, 84 98, 78 104" stroke={p.ribbon[1]} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M100 74 C 108 86, 116 98, 122 104" stroke={p.ribbon[1]} strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="100" cy="74" r="9" fill={p.ribbon[1]} />
          <circle cx="97" cy="71" r="3" fill="#fff" opacity="0.6" />
          {crown && (
            <path d="M80 44 L86 26 L94 38 L100 22 L106 38 L114 26 L120 44 Z" fill="#f3dba9" stroke="#c99a4b" strokeWidth="2" />
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
