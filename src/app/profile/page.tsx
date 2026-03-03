'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import ScoreRing from '@/components/ScoreRing';
import { BADGES, PERSONALITIES } from '@/lib/constants';

interface AnalysisResult {
  wallet: string;
  score: number;
  badges: string[];
  personalityId: string;
  stats: {
    totalTxs: number;
    solBalance: string;
    tokenCount: number;
    nonZeroTokens: number;
    zeroTokens: number;
    walletAge: string;
    walletAgeDays: number;
    activeDays: number;
    longestGapDays: number;
    txPerDay: string;
    swapCount: number;
    transferCount: number;
    uniqueRecipients: number;
    programsUsed: number;
  };
  breakdown: {
    activity: number;
    veteran: number;
    balance: number;
    diversity: number;
    consistency: number;
    interaction: number;
  };
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const walletParam = searchParams.get('wallet') || '';

  const { publicKey, signMessage, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const [input, setInput] = useState('');
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<{ rank: number; total: number } | null>(null);
  const [verifyError, setVerifyError] = useState('');

  const analyze = useCallback(async (addr: string) => {
    setLoading(true);
    setError('');
    setData(null);
    setVerified(null);
    setVerifyError('');
    try {
      const res = await fetch(`/api/analyze?wallet=${encodeURIComponent(addr)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (walletParam) {
      setInput(walletParam);
      analyze(walletParam);
    }
  }, [walletParam, analyze]);

  useEffect(() => {
    if (connected && publicKey && !walletParam) {
      const addr = publicKey.toBase58();
      setInput(addr);
      router.push(`/profile?wallet=${addr}`);
    }
  }, [connected, publicKey, walletParam, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length >= 32) {
      router.push(`/profile?wallet=${trimmed}`);
    }
  }

  async function handleVerify() {
    if (!publicKey || !data || !signMessage) {
      setVerifyError('Your wallet does not support message signing. Try Phantom or Solflare.');
      return;
    }

    if (publicKey.toBase58() !== data.wallet) {
      setVerifyError('Connected wallet doesn\'t match the analyzed wallet. Connect the correct wallet.');
      return;
    }

    setVerifying(true);
    setVerifyError('');
    try {
      const message = `MERIK verify: ${data.wallet}`;
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(messageBytes);
      const signature = btoa(String.fromCharCode(...Array.from(signatureBytes)));

      const personality = PERSONALITIES.find((p) => p.id === data.personalityId);
      const earnedBadges = BADGES.filter((b) => data.badges.includes(b.id));

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: data.wallet,
          message,
          signature,
          score: data.score,
          badges: earnedBadges.length,
          personality: personality?.name || 'Unknown',
          topBadge: earnedBadges[0]?.icon || '',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Verification failed');
      setVerified({ rank: json.rank, total: json.total });
    } catch (e: unknown) {
      setVerifyError(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  }

  const personality = data
    ? PERSONALITIES.find((p) => p.id === data.personalityId) || PERSONALITIES[0]
    : null;
  const earnedBadges = data ? BADGES.filter((b) => data.badges.includes(b.id)) : [];
  const shortWallet = data
    ? `${data.wallet.slice(0, 4)}...${data.wallet.slice(-4)}`
    : '';

  const isOwnWallet = connected && publicKey && data && publicKey.toBase58() === data.wallet;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Search bar */}
      <div className="mb-14">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Merik Profile</h1>
          <p className="text-sm text-muted">Enter any Solana wallet or connect yours to get scored.</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste Solana wallet address..."
              className="flex-1 bg-white border border-border rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={loading || input.trim().length < 32}
              className="bg-indigo text-white px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 shadow-lg shadow-indigo/20 whitespace-nowrap"
            >
              {loading ? 'Scanning...' : 'Analyze'}
            </button>
          </div>
        </form>

        {!connected && (
          <div className="text-center">
            <button
              onClick={() => setVisible(true)}
              className="text-sm text-indigo font-medium hover:underline"
            >
              Or connect wallet →
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-[3px] border-border border-t-indigo rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted">Scanning on-chain data...</p>
          <p className="text-xs text-muted mt-1">Reading transactions, tokens, and activity patterns</p>
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <div className="inline-block bg-rose-light text-rose px-6 py-3 rounded-xl text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Results */}
      {data && personality && (
        <div className="fade-up">
          {/* Verify banner */}
          {!verified && (
            <div className="bg-gradient-to-r from-indigo-light to-emerald-light border border-indigo/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="font-semibold text-sm mb-1">
                    {isOwnWallet ? 'Verify ownership to join the Leaderboard' : 'This is your wallet? Verify to join the Leaderboard'}
                  </div>
                  <div className="text-xs text-muted">
                    Sign a message to prove you own this wallet. Top 3 earn weekly fee rewards.
                  </div>
                </div>
                {!connected ? (
                  <button
                    onClick={() => setVisible(true)}
                    className="bg-indigo text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-md shadow-indigo/20 whitespace-nowrap"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <button
                    onClick={handleVerify}
                    disabled={verifying || !isOwnWallet}
                    className="bg-indigo text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 shadow-md shadow-indigo/20 whitespace-nowrap"
                  >
                    {verifying ? 'Signing...' : 'Verify & Join'}
                  </button>
                )}
              </div>
              {verifyError && (
                <div className="text-xs text-rose mt-3">{verifyError}</div>
              )}
            </div>
          )}

          {verified && (
            <div className="bg-emerald-light border border-emerald/20 rounded-2xl p-6 mb-8 text-center">
              <div className="text-lg font-bold text-emerald mb-1">Verified & Listed!</div>
              <div className="text-sm text-muted">
                You&apos;re <span className="font-mono font-bold text-indigo">#{verified.rank}</span> out of {verified.total} verified wallets on the leaderboard.
              </div>
            </div>
          )}

          {/* Score + Personality */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <div className="text-xs text-muted uppercase tracking-widest mb-5">Merik Score</div>
              <ScoreRing score={data.score} size={180} />
              <div className="font-mono text-xs text-muted mt-4">{shortWallet}</div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-8">
              <div className="text-xs text-muted uppercase tracking-widest mb-5">Personality Type</div>
              <div className="text-4xl font-bold mb-1">{personality.name}</div>
              <div className="text-sm text-indigo font-medium mb-4">{personality.title}</div>
              <p className="text-sm text-muted leading-relaxed mb-5">{personality.description}</p>
              <div className="flex flex-wrap gap-2">
                {personality.traits.map((t) => (
                  <span key={t} className="text-xs bg-indigo-light text-indigo px-3 py-1 rounded-full font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white border border-border rounded-2xl p-8 mb-8">
            <div className="text-xs text-muted uppercase tracking-widest mb-6">Score Breakdown</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[
                { label: 'Activity', value: data.breakdown.activity, desc: `${data.stats.totalTxs} transactions` },
                { label: 'Veteran', value: data.breakdown.veteran, desc: `Wallet age: ${data.stats.walletAge}` },
                { label: 'Balance', value: data.breakdown.balance, desc: `${data.stats.solBalance} SOL` },
                { label: 'Diversity', value: data.breakdown.diversity, desc: `${data.stats.tokenCount} unique tokens` },
                { label: 'Consistency', value: data.breakdown.consistency, desc: `${data.stats.activeDays} active days` },
                { label: 'Interaction', value: data.breakdown.interaction, desc: `${data.stats.programsUsed} programs` },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="font-mono text-xs font-semibold text-indigo">{item.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo rounded-full transition-all duration-1000" style={{ width: `${item.value}%` }} />
                  </div>
                  <div className="text-[10px] text-muted mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-border rounded-2xl p-8 mb-8">
            <div className="text-xs text-muted uppercase tracking-widest mb-6">Wallet Stats</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
              {[
                { label: 'Transactions', value: data.stats.totalTxs.toLocaleString() },
                { label: 'SOL Balance', value: `${data.stats.solBalance} SOL` },
                { label: 'Tokens Held', value: `${data.stats.nonZeroTokens} / ${data.stats.tokenCount}` },
                { label: 'Wallet Age', value: data.stats.walletAge },
                { label: 'Active Days', value: String(data.stats.activeDays) },
                { label: 'Txs per Day', value: data.stats.txPerDay },
                { label: 'Swaps', value: String(data.stats.swapCount) },
                { label: 'Longest Gap', value: `${data.stats.longestGapDays}d` },
                { label: 'Transfers', value: String(data.stats.transferCount) },
                { label: 'Recipients', value: String(data.stats.uniqueRecipients) },
                { label: 'Programs', value: String(data.stats.programsUsed) },
                { label: 'Dead Tokens', value: String(data.stats.zeroTokens) },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-mono text-lg font-bold">{s.value}</div>
                  <div className="text-[10px] text-muted uppercase tracking-wide mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-muted uppercase tracking-widest mb-1">Badges Earned</div>
                <div className="font-mono text-sm text-indigo font-semibold">
                  {earnedBadges.length} / {BADGES.length}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BADGES.map((b) => {
                const unlocked = data.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`border rounded-xl p-4 text-center transition-all ${
                      unlocked
                        ? 'bg-white border-indigo/30 shadow-sm'
                        : 'bg-gray-50 border-gray-200 opacity-35'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{b.icon}</div>
                    <div className="text-[11px] font-semibold tracking-wide">{b.name}</div>
                    <div className="text-[9px] text-muted mt-0.5">
                      {unlocked ? '✓ Earned' : b.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!walletParam && !loading && !data && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2">Enter a wallet to begin</h2>
          <p className="text-sm text-muted max-w-md mx-auto mb-6">
            Paste any Solana wallet address above, or connect your wallet to auto-fill.
          </p>
          {!connected && (
            <button
              onClick={() => setVisible(true)}
              className="bg-indigo text-white px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-indigo/20"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}
