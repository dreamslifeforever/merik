import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { upsertLeaderboard } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet, message, signature, score, badges, personality, topBadge } = body;

    if (!wallet || !message || !signature || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const expectedMessage = `MERIK verify: ${wallet}`;
    if (message !== expectedMessage) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, 'base64');
    const publicKeyBytes = bs58.decode(wallet);

    if (signatureBytes.length !== 64) {
      return NextResponse.json({ error: 'Invalid signature format' }, { status: 400 });
    }

    const valid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature. Wallet ownership could not be verified.' }, { status: 403 });
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
