'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Entry {
  wallet: string;
  score: number;
  badges: number;
  personality: string;
  topBadge: string;
  verifiedAt: string;
}

function scoreColor(score: number) {
  if (score >= 90) return 'text-emerald';
  if (score >= 75) return 'text-indigo';
  if (score >= 60) return 'text-amber';
  return 'text-rose';
}

function shortAddr(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const top3 = entries.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Leaderboard</h1>
        <p className="text-muted text-sm">Verified wallets ranked by Merik Score. Connect & verify to compete.</p>
      </div>

      {/* Tournament banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo via-indigo to-emerald rounded-2xl p-8 mb-10 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            Weekly Tournament
          </div>
          <h2 className="text-2xl font-bold mb-2">Top wallets earn real rewards.</h2>
          <p className="text-sm text-white/70 max-w-md mb-6">
            The top 3 Merik Score holders share a percentage of weekly platform fees. Verify your wallet to compete.
          </p>
          <div className="flex gap-4 flex-wrap">
            {[
              { place: '1st', pct: '25%', color: 'bg-amber' },
              { place: '2nd', pct: '15%', color: 'bg-gray-300' },
              { place: '3rd', pct: '10%', color: 'bg-amber/60' },
            ].map((p) => (
              <div key={p.place} className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center min-w-[90px]">
                <div className={`w-8 h-8 ${p.color} rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold text-primary`}>
                  {p.place.replace(/[a-z]/g, '')}
                </div>
                <div className="font-mono font-bold text-lg">{p.pct}</div>
                <div className="text-[10px] text-white/60 uppercase tracking-wider">{p.place} place</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/profile"
              className="inline-block bg-white text-indigo px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Verify Your Wallet →
            </Link>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-[3px] border-border border-t-indigo rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted">Loading leaderboard...</p>
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-20 bg-white border border-border rounded-2xl">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-xl font-bold mb-2">No verified wallets yet</h2>
          <p className="text-sm text-muted max-w-sm mx-auto mb-6">
            Be the first to verify your wallet and claim the #1 spot on the leaderboard.
          </p>
          <Link
            href="/profile"
            className="inline-block bg-indigo text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo/20"
          >
            Get Scored & Verify
          </Link>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <>
          {/* Top 3 podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
              {[top3[1], top3[0], top3[2]].map((entry, i) => {
                const isFirst = i === 1;
                const rank = isFirst ? 1 : i === 0 ? 2 : 3;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
                return (
                  <div key={entry.wallet} className={`text-center ${isFirst ? '-mt-4' : 'mt-2'}`}>
                    <div
                      className={`mx-auto mb-3 rounded-2xl flex items-center justify-center font-mono font-bold ${
                        isFirst
                          ? 'w-16 h-16 bg-indigo text-white text-2xl shadow-lg shadow-indigo/30'
                          : 'w-12 h-12 bg-indigo-light text-indigo text-lg'
                      }`}
                    >
                      {medal}
                    </div>
                    <Link href={`/profile?wallet=${entry.wallet}`} className="font-mono text-xs text-muted hover:text-indigo transition-colors">
                      {shortAddr(entry.wallet)}
                    </Link>
                    <div className={`font-mono font-bold text-lg ${scoreColor(entry.score)}`}>{entry.score}</div>
                    <div className="text-[10px] text-muted">{entry.badges} badges</div>
                    <div className="text-xs mt-1">{entry.personality}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[50px_1fr_70px_70px_1fr] gap-4 px-6 py-3 border-b border-border text-[10px] text-muted uppercase tracking-widest">
              <span>Rank</span>
              <span>Wallet</span>
              <span>Score</span>
              <span>Badges</span>
              <span>Type</span>
            </div>

            {entries.map((entry, i) => (
              <div
                key={entry.wallet}
                className={`grid grid-cols-[50px_1fr_70px_70px_1fr] gap-4 px-6 py-4 items-center ${
                  i % 2 === 0 ? 'bg-surface' : ''
                } ${i < entries.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <span className={`font-mono text-sm font-bold ${i < 3 ? 'text-indigo' : 'text-muted'}`}>
                  #{i + 1}
                </span>
                <Link href={`/profile?wallet=${entry.wallet}`} className="font-mono text-sm hover:text-indigo transition-colors">
                  {shortAddr(entry.wallet)}
                </Link>
                <span className={`font-mono text-sm font-bold ${scoreColor(entry.score)}`}>{entry.score}</span>
                <span className="font-mono text-sm text-muted">{entry.badges}</span>
                <span className="text-xs text-muted">{entry.personality}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 text-xs text-muted">
            {entries.length} verified wallet{entries.length !== 1 ? 's' : ''} • Updated in real time
          </div>
        </>
      )}
    </div>
  );
}
