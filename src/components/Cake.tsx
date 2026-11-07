import { AnimatePresence, motion } from 'framer-motion';

type Props = { lit: boolean[] };

/** Elegant two-tier cake with 25 slim candles (13 back row, 12 front row). */
export function Cake({ lit }: Props) {
  const n = lit.length;
  const back = Math.ceil(n / 2);
  const candles = lit.map((on, i) => {
    const isBack = i < back;
    const idx = isBack ? i : i - back;
    const count = isBack ? back : n - back;
    const span = isBack ? 120 : 112;
    const x = 150 - span / 2 + (span / Math.max(1, count - 1)) * idx;
    const baseY = isBack ? 106 : 117;
    const h = isBack ? 24 : 26;
    return { on, x, baseY, h, isBack, i };
  });

  return (
    <svg viewBox="0 0 300 260" className="h-auto w-full max-w-[340px] overflow-visible" role="img" aria-label={`Birthday cake with ${lit.filter(Boolean).length} of ${n} candles lit`}>
      <defs>
        <linearGradient id="tier1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6ee" />
          <stop offset="1" stopColor="#f6dccf" />
        </linearGradient>
        <linearGradient id="tier2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbd2dc" />
          <stop offset="1" stopColor="#efacbf" />
        </linearGradient>
        <linearGradient id="goldband" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b98634" />
          <stop offset="0.5" stopColor="#f3dba9" />
          <stop offset="1" stopColor="#b98634" />
        </linearGradient>
        <radialGradient id="flameGlow">
          <stop offset="0" stopColor="#fff4c2" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffcf6b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* plate */}
      <ellipse cx="150" cy="242" rx="132" ry="14" fill="#e9dccb" />
      <ellipse cx="150" cy="238" rx="128" ry="11" fill="#fffaf3" />

      {/* bottom tier */}
      <path d="M40 178 L40 232 Q150 252 260 232 L260 178 Z" fill="url(#tier2)" />
      <ellipse cx="150" cy="178" rx="110" ry="16" fill="#fde3ea" />
      {/* drips */}
      <path
        d="M40 178 Q44 196 50 186 Q56 200 64 188 Q72 204 82 190 Q92 198 100 191 Q112 208 122 193 Q134 200 146 194 Q158 210 170 194 Q180 202 192 191 Q202 206 214 190 Q224 198 234 187 Q246 202 252 186 Q258 194 260 178 Q150 196 40 178Z"
        fill="#fff6f8"
      />
      <rect x="40" y="214" width="220" height="5" fill="url(#goldband)" opacity="0.9" />
      {Array.from({ length: 11 }, (_, i) => (
        <circle key={i} cx={52 + i * 19.6} cy={228 + Math.sin(i) * 1.5} r="3" fill="#fff" opacity="0.85" />
      ))}

      {/* top tier */}
      <path d="M75 112 L75 168 Q150 184 225 168 L225 112 Z" fill="url(#tier1)" />
      <rect x="75" y="150" width="150" height="4" fill="url(#goldband)" />
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={i}
          transform={`translate(${88 + i * 20.5} 136)`}
          d="M0 -5 C-4 -11 -10 -6 -6 -1 L0 5 L6 -1 C10 -6 4 -11 0 -5Z"
          fill={i % 2 ? '#e8a1b5' : '#c8b3ee'}
          opacity="0.8"
        />
      ))}
      <ellipse cx="150" cy="112" rx="75" ry="13" fill="#fffaf5" />
      <path d="M75 112 Q80 124 86 116 Q94 128 104 118 Q114 126 124 118 Q136 130 148 119 Q160 128 172 118 Q182 126 194 117 Q204 128 214 116 Q220 122 225 112 Q150 126 75 112Z" fill="#fde3ea" />

      {/* candles — back row first so the front row overlaps it */}
      {candles.map((c) => (
        <g key={c.i} opacity={c.isBack ? 0.92 : 1}>
          <rect x={c.x - 2.5} y={c.baseY - c.h} width="5" height={c.h} rx="1.5" fill={c.i % 3 === 0 ? '#c8b3ee' : c.i % 3 === 1 ? '#f4a7bb' : '#f3dba9'} />
          <rect x={c.x - 2.5} y={c.baseY - c.h} width="1.6" height={c.h} fill="#fff" opacity="0.55" />
          <line x1={c.x} y1={c.baseY - c.h} x2={c.x} y2={c.baseY - c.h - 3} stroke="#5a4636" strokeWidth="0.8" />
          <AnimatePresence>
            {c.on && (
              <motion.g
                key="flame"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                style={{ transformOrigin: `${c.x}px ${c.baseY - c.h - 3}px` }}
              >
                <circle cx={c.x} cy={c.baseY - c.h - 8} r="9" fill="url(#flameGlow)" />
                <g className="flame" style={{ '--delay': `${(c.i % 7) * -0.13}s`, transformBox: 'fill-box' } as React.CSSProperties}>
                  <path
                    d={`M${c.x} ${c.baseY - c.h - 15} C ${c.x + 4} ${c.baseY - c.h - 9}, ${c.x + 3.5} ${c.baseY - c.h - 3}, ${c.x} ${c.baseY - c.h - 3} C ${c.x - 3.5} ${c.baseY - c.h - 3}, ${c.x - 4} ${c.baseY - c.h - 9}, ${c.x} ${c.baseY - c.h - 15}Z`}
                    fill="#ffb84d"
                  />
                  <ellipse cx={c.x} cy={c.baseY - c.h - 6} rx="1.6" ry="3" fill="#fff6cf" />
                </g>
              </motion.g>
            )}
          </AnimatePresence>
          {!c.on && (
            <motion.path
              d={`M${c.x} ${c.baseY - c.h - 4} q -4 -6 0 -12 q 4 -6 0 -12`}
              stroke="#b6a8b8"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ opacity: 0.8, y: 0 }}
              animate={{ opacity: 0, y: -18 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
