import { useEffect, useState } from 'react';
import { birthday } from '../config/birthday';
import { birthdayTarget, dayMode } from '../lib/fx';

export function Countdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const mode = dayMode(now);
  if (mode === 'today') {
    return (
      <div className="rounded-full border border-[#f3dba9]/50 bg-[#f3dba9]/15 px-4 py-2 text-sm font-semibold text-[#fff1cf] backdrop-blur-sm">
        🎉 It's your birthday today! 🎉
      </div>
    );
  }
  if (mode === 'after') {
    return (
      <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-sm">
        🎂 Birthday: {birthday.birthdayDateLabel}
      </div>
    );
  }

  const diff = Math.max(0, birthdayTarget().getTime() - now.getTime());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const cells: [number, string][] = [
    [d, 'days'],
    [h, 'hrs'],
    [m, 'min'],
    [s, 'sec'],
  ];

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`${d} days ${h} hours ${m} minutes until the birthday`}>
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#f3dba9]/80">Counting down to the big day</span>
      <div className="flex gap-2">
        {cells.map(([v, l]) => (
          <div key={l} className="flex min-w-[3.4rem] flex-col items-center rounded-2xl border border-white/15 bg-white/[0.07] px-2 py-1.5 backdrop-blur-sm">
            <span className="font-display text-xl font-extrabold tabular-nums text-[#fff1cf]">{String(v).padStart(2, '0')}</span>
            <span className="text-[0.6rem] uppercase tracking-widest text-white/60">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
