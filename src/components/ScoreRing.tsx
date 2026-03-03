'use client';

import { useEffect, useState } from 'react';

function scoreColor(score: number) {
  if (score >= 80) return 'var(--color-emerald)';
  if (score >= 60) return 'var(--color-indigo)';
  if (score >= 40) return 'var(--color-amber)';
  return 'var(--color-rose)';
}

export default function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1200;

    function animate(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(score * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold" style={{ color: scoreColor(score) }}>
          {displayed}
        </span>
        <span className="text-xs text-muted uppercase tracking-widest mt-0.5">Merik</span>
      </div>
    </div>
  );
}
