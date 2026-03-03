import { BADGES } from '@/lib/constants';

const CATEGORIES = [
  { id: 'trading', name: 'Trading', desc: 'Based on how you trade' },
  { id: 'holding', name: 'Holding', desc: 'Based on what you hold and for how long' },
  { id: 'survival', name: 'Survival', desc: 'Based on what you survived' },
  { id: 'whale', name: 'Whale', desc: 'Based on wallet size' },
  { id: 'social', name: 'Social', desc: 'Based on social on-chain behavior' },
];

function rarityLabel(r: number) {
  if (r <= 5) return { text: 'Legendary', color: 'bg-amber-light text-amber' };
  if (r <= 15) return { text: 'Rare', color: 'bg-indigo-light text-indigo' };
  if (r <= 40) return { text: 'Uncommon', color: 'bg-emerald-light text-emerald' };
  return { text: 'Common', color: 'bg-gray-100 text-muted' };
}

export default function BadgesPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-3">Badge Catalog</h1>
        <p className="text-muted text-sm max-w-md mx-auto">
          16 achievements based on verifiable on-chain activity. No self-reporting. No faking. Your wallet tells the truth.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex justify-center gap-12 mb-14 flex-wrap">
        {[
          { value: '16', label: 'Total Badges' },
          { value: '5', label: 'Categories' },
          { value: '3%', label: 'Rarest Badge' },
          { value: '89%', label: 'Most Common' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-mono text-xl font-bold text-indigo">{s.value}</div>
            <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* By category */}
      {CATEGORIES.map((cat) => {
        const badges = BADGES.filter((b) => b.category === cat.id);
        if (badges.length === 0) return null;

        return (
          <section key={cat.id} className="mb-12">
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="text-xl font-bold">{cat.name}</h2>
              <span className="text-xs text-muted">{cat.desc}</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((b) => {
                const rl = rarityLabel(b.rarity);
                return (
                  <div
                    key={b.id}
                    className="bg-surface-card border border-border rounded-xl p-6 hover:shadow-md hover:shadow-black/5 transition-shadow badge-shimmer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{b.icon}</div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${rl.color}`}>
                        {rl.text}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm tracking-wide mb-1">{b.name}</h3>
                    <p className="text-xs text-muted leading-relaxed mb-3">{b.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo rounded-full" style={{ width: `${b.rarity}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-muted">{b.rarity}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
