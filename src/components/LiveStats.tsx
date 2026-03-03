'use client';

import { useEffect, useState } from 'react';

export default function LiveStats() {
  const [stats, setStats] = useState({ totalWallets: 0, avgScore: 0, totalBadges: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const items = [
    { value: String(stats.totalWallets), label: 'Verified Wallets' },
    { value: stats.totalBadges > 0 ? String(stats.totalBadges) : '0', label: 'Badges Earned' },
    { value: stats.avgScore > 0 ? String(stats.avgScore) : '—', label: 'Avg Score' },
    { value: '16', label: 'Badge Types' },
  ];

  return (
    <section className="border-t border-border bg-white">
      <div className="max-w-4xl mx-auto px-6 py-14 flex justify-center gap-16 flex-wrap">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-mono text-2xl font-bold text-indigo">{s.value}</div>
            <div className="text-xs text-muted uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
