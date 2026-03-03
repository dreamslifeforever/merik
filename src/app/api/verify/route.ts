import { NextRequest, NextResponse } from 'next/server';
import { upsertLeaderboard } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet, signature, score, badges, personality, topBadge } = body;

    if (!wallet || !signature || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const HELIUS_KEY = 'e30ea48e-bf93-4f7f-9e54-68ae7300fcc5';
    const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;

    const txRes = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }],
      }),
    });
    const txJson = await txRes.json();
    const tx = txJson.result;

    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found. Please wait a moment and retry.' }, { status: 400 });
    }

    const signers = tx.transaction?.message?.accountKeys
      ?.filter((k: { signer?: boolean }) => k.signer)
      ?.map((k: { pubkey?: string }) => k.pubkey) || [];

    if (!signers.includes(wallet)) {
      return NextResponse.json({ error: 'Wallet is not a signer of this transaction' }, { status: 403 });
    }

    const lb = upsertLeaderboard({
      wallet,
      score,
      badges: badges || 0,
      personality: personality || 'Unknown',
      topBadge: topBadge || '',
      verifiedAt: new Date().toISOString(),
    });

    const rank = lb.findIndex((e) => e.wallet === wallet) + 1;

    return NextResponse.json({ ok: true, rank, total: lb.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
