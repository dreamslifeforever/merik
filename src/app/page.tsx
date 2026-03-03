import { BADGES, PERSONALITIES } from '@/lib/constants';
import Link from 'next/link';
import WalletInput from '@/components/WalletInput';
import LiveStats from '@/components/LiveStats';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-light via-surface to-emerald-light opacity-60" />
        <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-1.5 text-xs text-muted mb-6 fade-up shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            Live on Solana
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-5 fade-up fade-up-d1">
            What&apos;s your standing<br />
            <span className="text-indigo">on Solana?</span>
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto mb-8 fade-up fade-up-d2">
            Enter any wallet. Get a real Merik Score based on actual on-chain activity. Badges, personality type, and full breakdown.
          </p>

          <WalletInput />

          <p className="text-xs text-muted mt-4 fade-up fade-up-d4">
            Works with any Solana wallet. No connection required — just paste an address.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '📊',
              title: 'Merik Score',
              body: 'A single number (0–100) computed from real on-chain data. Transaction count, wallet age, token diversity, balance, and consistency — all weighted into one score.',
              color: 'bg-indigo-light text-indigo',
            },
            {
              icon: '🏆',
              title: '16 Badges',
              body: 'From Diamond Hands to Rugged Survivor — earn badges based on verifiable on-chain activity. Each badge has specific criteria checked against real data.',
              color: 'bg-emerald-light text-emerald',
            },
            {
              icon: '🧬',
              title: 'Personality Type',
              body: 'The Sniper, The Ape, The Ghost — six distinct types determined by your trading frequency, hold patterns, and risk profile.',
              color: 'bg-amber-light text-amber',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-border rounded-2xl p-7 hover:shadow-lg hover:shadow-black/5 transition-shadow">
              <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center text-lg mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How scoring works */}
      <section className="bg-white border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Real data. Real scores.</h2>
            <p className="text-muted text-sm max-w-lg mx-auto">
              We scan your wallet&apos;s entire Solana history — every transaction, token, and interaction — and score it across 6 dimensions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { dim: 'Activity', weight: '22%', desc: 'Total transaction count and throughput', example: '1000+ txs = 100' },
              { dim: 'Veteran', weight: '18%', desc: 'How old your wallet is on Solana', example: '2+ years = 100' },
              { dim: 'Diversity', weight: '18%', desc: 'Number of unique tokens interacted with', example: '100+ tokens = 100' },
              { dim: 'Consistency', weight: '15%', desc: 'How regularly you use the wallet', example: 'Daily use = high score' },
              { dim: 'Interaction', weight: '15%', desc: 'Unique programs and protocols used', example: '20+ programs = 100' },
              { dim: 'Balance', weight: '12%', desc: 'Current SOL holdings in wallet', example: '500+ SOL = 100' },
            ].map((d) => (
              <div key={d.dim} className="border border-border rounded-xl p-5 bg-surface">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{d.dim}</span>
                  <span className="font-mono text-xs text-indigo font-medium bg-indigo-light px-2 py-0.5 rounded-full">{d.weight}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{d.desc}</p>
                <div className="text-[10px] font-mono text-muted mt-2 opacity-70">{d.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How it works.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Paste Address', body: 'Enter any Solana wallet address. No wallet connection needed — we just read public on-chain data.' },
            { step: '02', title: 'On-chain Scan', body: 'We fetch your transaction history, token holdings, activity patterns, and protocol interactions via Helius RPC.' },
            { step: '03', title: 'Get Results', body: 'See your Merik Score, earned badges, personality type, and detailed breakdown of your wallet reputation.' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-light text-indigo font-mono font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live stats */}
      <LiveStats />

      {/* Tournament */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo via-indigo to-emerald rounded-2xl p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                Weekly Tournament
              </div>
              <h3 className="text-xl font-bold mb-2">Top wallets earn weekly rewards.</h3>
              <p className="text-sm text-white/70 max-w-md">
                1st place gets 25% of weekly fees, 2nd gets 15%, 3rd gets 10%. Verify your wallet to compete.
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="bg-white text-indigo px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              View Leaderboard →
            </Link>
          </div>
        </div>
      </section>

      {/* Badge preview */}
      <section className="border-t border-border bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Badges.</h2>
              <p className="text-sm text-muted">16 on-chain achievements. Each verified from real wallet data.</p>
            </div>
            <Link href="/badges" className="text-sm text-indigo font-medium hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BADGES.slice(0, 8).map((b) => (
              <div
                key={b.id}
                className="bg-surface border border-border rounded-xl p-5 text-center hover:shadow-md hover:shadow-black/5 transition-shadow"
              >
                <div className="text-2xl mb-2">{b.icon}</div>
                <div className="text-xs font-semibold tracking-wide mb-1">{b.name}</div>
                <div className="text-[10px] text-muted">{b.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personality preview */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Which degen are you?</h2>
        <p className="text-sm text-muted text-center mb-10">Six personality types based on your real trading patterns.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERSONALITIES.map((p) => (
            <div key={p.id} className="border border-border rounded-xl p-6 hover:shadow-md hover:shadow-black/5 transition-shadow bg-white">
              <div className="font-semibold text-base mb-0.5">{p.name}</div>
              <div className="text-xs text-muted mb-3">{p.title}</div>
              <p className="text-sm text-muted leading-relaxed mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.traits.map((t) => (
                  <span key={t} className="text-[10px] bg-gray-100 text-muted px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-b from-white to-indigo-light/30">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Check any wallet.</h2>
          <p className="text-muted text-sm mb-8">It takes 3 seconds. No sign-up. No wallet connection. Just paste and go.</p>
          <Link
            href="/profile"
            className="inline-block bg-indigo text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-indigo/20"
          >
            Start Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
