import { memo } from 'react';

/** Deterministic pseudo-random so decorations don't jump between renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 999.7) * 10000;
  return x - Math.floor(x);
}

export function Balloon({ color, className = '', size = 46 }: { color: string; className?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.9} viewBox="0 0 50 95" className={className} aria-hidden>
      <defs>
        <radialGradient id={`b${color.slice(1)}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="25%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <ellipse cx="25" cy="25" rx="21" ry="25" fill={`url(#b${color.slice(1)})`} />
      <path d="M22 49 L28 49 L25 54 Z" fill={color} />
      <path d="M25 54 C 20 64, 31 72, 24 82 S 27 92, 25 95" stroke="#c9a25a" strokeWidth="1" fill="none" opacity="0.8" />
    </svg>
  );
}

export function Heart({ className = '', size = 20, color = '#e0718f' }: { className?: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.1 1.8-1.9 3.3-3.1 5.4-3.1 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z"
        fill={color}
      />
    </svg>
  );
}

export function Sparkle({ className = '', size = 16, color = '#ecd3a0' }: { className?: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill={color} />
    </svg>
  );
}

const BALLOON_COLORS = ['#f4a7bb', '#d6c3f3', '#ecd3a0', '#f9cdd8', '#bfa6ea'];

function DecorImpl({ theme }: { theme: 'night' | 'day' }) {
  const isNight = theme === 'night';
  const sparkles = Array.from({ length: isNight ? 26 : 12 }, (_, i) => i);
  const floaters = Array.from({ length: 9 }, (_, i) => i);
  const balloons = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* soft glows */}
      {isNight ? (
        <>
          <div className="absolute -left-24 top-[10%] h-72 w-72 scale-150 bg-[radial-gradient(closest-side,rgba(124,79,184,0.4),transparent)]" />
          <div className="absolute -right-20 bottom-[8%] h-80 w-80 scale-150 bg-[radial-gradient(closest-side,rgba(196,81,122,0.3),transparent)]" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 scale-150 bg-[radial-gradient(closest-side,rgba(236,211,160,0.15),transparent)]" />
        </>
      ) : (
        <>
          <div className="absolute -left-24 top-[5%] h-80 w-80 scale-150 bg-[radial-gradient(closest-side,rgba(248,201,212,0.6),transparent)]" />
          <div className="absolute -right-24 top-[40%] h-80 w-80 scale-150 bg-[radial-gradient(closest-side,rgba(220,207,245,0.7),transparent)]" />
          <div className="absolute bottom-[-6rem] left-[20%] h-72 w-72 scale-150 bg-[radial-gradient(closest-side,rgba(236,211,160,0.45),transparent)]" />
        </>
      )}

      {sparkles.map((i) => (
        <div
          key={`s${i}`}
          className="twinkle absolute"
          style={
            {
              left: `${rand(i + 1) * 100}%`,
              top: `${rand(i + 50) * 100}%`,
              '--dur': `${2 + rand(i + 3) * 3}s`,
              '--delay': `${rand(i + 9) * 3}s`,
            } as React.CSSProperties
          }
        >
          {isNight && i % 3 !== 0 ? (
            <div className="h-1 w-1 rounded-full bg-[#fff1cf] shadow-[0_0_6px_2px_rgba(255,241,207,0.7)]" />
          ) : (
            <Sparkle size={8 + rand(i + 7) * 10} color={isNight ? '#f3dba9' : '#d9b46c'} />
          )}
        </div>
      ))}

      {floaters.map((i) => (
        <div
          key={`f${i}`}
          className="float-y absolute opacity-70"
          style={
            {
              left: `${4 + rand(i + 20) * 88}%`,
              top: `${6 + rand(i + 70) * 85}%`,
              '--dur': `${5 + rand(i + 4) * 4}s`,
              '--delay': `${rand(i + 11) * -5}s`,
              '--rot': `${-12 + rand(i + 2) * 24}deg`,
            } as React.CSSProperties
          }
        >
          {isNight ? (
            <Sparkle size={14 + rand(i) * 12} color="#ecd3a0" />
          ) : (
            <Heart size={12 + rand(i) * 14} color={i % 2 ? '#f0a3b8' : '#c8b3ee'} />
          )}
        </div>
      ))}

      {!isNight &&
        balloons.map((i) => (
          <div
            key={`b${i}`}
            className="rise absolute bottom-[-12rem]"
            style={
              {
                left: `${8 + i * 19 + rand(i + 30) * 8}%`,
                '--dur': `${16 + rand(i + 5) * 10}s`,
                '--delay': `${i * -4.3}s`,
                '--sway': `${-30 + rand(i + 8) * 60}px`,
              } as React.CSSProperties
            }
          >
            <Balloon color={BALLOON_COLORS[i % BALLOON_COLORS.length]} size={34 + rand(i + 12) * 18} className="opacity-80" />
          </div>
        ))}
    </div>
  );
}

export const Decor = memo(DecorImpl);
