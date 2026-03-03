import { NextRequest, NextResponse } from 'next/server';

const HELIUS_KEY = 'e30ea48e-bf93-4f7f-9e54-68ae7300fcc5';
const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;
const HELIUS_API = `https://api.helius.xyz/v0`;

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

async function heliusTxs(wallet: string) {
  const res = await fetch(
    `${HELIUS_API}/addresses/${wallet}/transactions?api-key=${HELIUS_KEY}&limit=100`,
  );
  if (!res.ok) return [];
  return res.json();
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function tierScore(value: number, tiers: [number, number][]) {
  for (const [threshold, score] of tiers) {
    if (value < threshold) return score;
  }
  return tiers[tiers.length - 1][1];
}

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')?.trim();
  if (!wallet || wallet.length < 32 || wallet.length > 44) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

  try {
    const [balanceRes, signatures, tokenAccounts, enrichedTxs] = await Promise.all([
      rpc('getBalance', [wallet]),
      rpc('getSignaturesForAddress', [wallet, { limit: 1000 }]),
      rpc('getTokenAccountsByOwner', [
        wallet,
        { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
        { encoding: 'jsonParsed' },
      ]),
      heliusTxs(wallet),
    ]);

    const solBalance = (balanceRes?.value || 0) / 1e9;
    const txCount = signatures?.length || 0;
    const tokenCount = tokenAccounts?.value?.length || 0;

    // Wallet age
    let walletAgeDays = 0;
    let firstTxTime = 0;
    if (txCount > 0) {
      const times: number[] = signatures
        .map((s: { blockTime?: number }) => s.blockTime)
        .filter(Boolean);
      firstTxTime = Math.min(...times);
      walletAgeDays = Math.floor((Date.now() / 1000 - firstTxTime) / 86400);
    }

    // Activity gaps
    let longestGapDays = 0;
    if (txCount > 1) {
      const sorted = signatures
        .map((s: { blockTime?: number }) => s.blockTime)
        .filter(Boolean)
        .sort((a: number, b: number) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        const gap = (sorted[i] - sorted[i - 1]) / 86400;
        if (gap > longestGapDays) longestGapDays = gap;
      }
    }

    // Active days
    const activeDays = new Set(
      signatures
        .filter((s: { blockTime?: number }) => s.blockTime)
        .map((s: { blockTime: number }) => Math.floor(s.blockTime / 86400)),
    ).size;

    // Token data
    const tokenMints = new Set(
      tokenAccounts?.value
        ?.map(
          (a: { account?: { data?: { parsed?: { info?: { mint?: string } } } } }) =>
            a.account?.data?.parsed?.info?.mint,
        )
        .filter(Boolean) || [],
    );
    const nonZeroTokens =
      tokenAccounts?.value?.filter(
        (a: {
          account?: {
            data?: { parsed?: { info?: { tokenAmount?: { uiAmount?: number } } } } };
        }) => {
          const amt = a.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
          return amt && amt > 0;
        },
      ).length || 0;
    const zeroTokens = tokenCount - nonZeroTokens;

    // Enriched transaction analysis
    const enriched = Array.isArray(enrichedTxs) ? enrichedTxs : [];
    let swapCount = 0;
    let transferCount = 0;
    let hasMemo = false;
    const transferRecipients = new Set<string>();
    const swapMints = new Set<string>();

    for (const tx of enriched) {
      const t = tx.type || '';
      if (t === 'SWAP') {
        swapCount++;
        tx.tokenTransfers?.forEach((tt: { mint?: string }) => {
          if (tt.mint) swapMints.add(tt.mint);
        });
      }
      if (t === 'TRANSFER' || t === 'SOL_TRANSFER') {
        transferCount++;
        tx.nativeTransfers?.forEach((nt: { toUserAccount?: string }) => {
          if (nt.toUserAccount && nt.toUserAccount !== wallet) {
            transferRecipients.add(nt.toUserAccount);
          }
        });
        tx.tokenTransfers?.forEach((tt: { toUserAccount?: string }) => {
          if (tt.toUserAccount && tt.toUserAccount !== wallet) {
            transferRecipients.add(tt.toUserAccount);
          }
        });
      }
      if (
        t === 'MEMO' ||
        tx.instructions?.some(
          (i: { programId?: string }) =>
            i.programId === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr' ||
            i.programId === 'Memo1UhkJBfCR6MNTJeJfhBnDN5LnWfySmMCmzMo8KP',
        )
      ) {
        hasMemo = true;
      }
    }

    // Programs interacted with
    const programs = new Set<string>();
    for (const tx of enriched) {
      tx.instructions?.forEach((i: { programId?: string }) => {
        if (i.programId) programs.add(i.programId);
      });
    }

    // --- SCORING ---
    const activityScore = tierScore(txCount, [
      [1, 0], [10, 15], [50, 30], [200, 50], [500, 70], [1000, 85], [Infinity, 100],
    ]);

    const veteranScore = tierScore(walletAgeDays, [
      [1, 0], [30, 10], [90, 30], [180, 50], [365, 70], [730, 85], [Infinity, 100],
    ]);

    const balanceScore = tierScore(solBalance, [
      [0.001, 0], [0.1, 10], [1, 25], [10, 45], [50, 60], [100, 75], [500, 90], [Infinity, 100],
    ]);

    const diversityScore = tierScore(tokenMints.size, [
      [1, 0], [5, 20], [15, 40], [30, 55], [50, 70], [100, 85], [Infinity, 100],
    ]);

    const consistencyRaw =
      walletAgeDays > 0
        ? Math.round((activeDays / Math.min(walletAgeDays, 365)) * 100)
        : 0;
    const consistencyScore = clamp(consistencyRaw);

    const interactionScore = tierScore(programs.size, [
      [1, 0], [3, 20], [5, 40], [10, 60], [20, 80], [Infinity, 100],
    ]);

    const score = clamp(
      Math.round(
        activityScore * 0.22 +
          veteranScore * 0.18 +
          balanceScore * 0.12 +
          diversityScore * 0.18 +
          consistencyScore * 0.15 +
          interactionScore * 0.15,
      ),
    );

    // --- BADGES ---
    const badges: string[] = [];
    if (txCount > 0) badges.push('first-blood');
    if (walletAgeDays > 365) badges.push('veteran');
    if (solBalance >= 100) badges.push('whale');
    if (tokenMints.size >= 50) badges.push('collector');
    if (walletAgeDays > 180 && nonZeroTokens > 0) badges.push('diamond-hands');
    if (tokenMints.size === 0 && txCount > 0) badges.push('minimalist');
    if (longestGapDays > 30) badges.push('ghost');
    if (zeroTokens > 10) badges.push('rugged');
    if (activeDays > 0 && txCount / activeDays > 10) badges.push('degen');
    if (walletAgeDays > 180 && solBalance < 0.1 && txCount > 50) badges.push('survivor');
    if (swapCount > 0 && enriched.length > 0 && swapCount / enriched.length > 0.5) badges.push('sniper');
    if (hasMemo) badges.push('memo-writer');
    if (transferRecipients.size >= 10) badges.push('tipper');
    if (swapMints.size > 20) badges.push('early-bird');

    // --- PERSONALITY ---
    const txPerDay = activeDays > 0 ? txCount / activeDays : 0;
    let personalityId: string;
    if (txPerDay > 8 && tokenMints.size > 30) {
      personalityId = 'ape';
    } else if (txCount < 20 && walletAgeDays > 180) {
      personalityId = 'ghost';
    } else if (tokenMints.size > 40 && nonZeroTokens > 20) {
      personalityId = 'collector';
    } else if (swapCount > 30 || txPerDay > 5) {
      personalityId = 'sniper';
    } else if (zeroTokens > tokenMints.size * 0.5 && zeroTokens > 5) {
      personalityId = 'gambler';
    } else {
      personalityId = 'surgeon';
    }

    // Format wallet age
    const years = Math.floor(walletAgeDays / 365);
    const months = Math.floor((walletAgeDays % 365) / 30);
    const walletAgeStr =
      years > 0
        ? `${years}y ${months}m`
        : months > 0
          ? `${months}m ${walletAgeDays % 30}d`
          : `${walletAgeDays}d`;

    return NextResponse.json({
      wallet,
      score,
      badges,
      personalityId,
      stats: {
        totalTxs: txCount,
        solBalance: solBalance.toFixed(2),
        tokenCount: tokenMints.size,
        nonZeroTokens,
        zeroTokens,
        walletAge: walletAgeStr,
        walletAgeDays,
        activeDays,
        longestGapDays: Math.round(longestGapDays),
        txPerDay: txPerDay.toFixed(1),
        swapCount,
        transferCount,
        uniqueRecipients: transferRecipients.size,
        programsUsed: programs.size,
      },
      breakdown: {
        activity: activityScore,
        veteran: veteranScore,
        balance: balanceScore,
        diversity: diversityScore,
        consistency: consistencyScore,
        interaction: interactionScore,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
