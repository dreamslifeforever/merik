import { Connection, Keypair, Transaction, TransactionInstruction, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import fs from 'fs';
import path from 'path';

const HELIUS = 'https://mainnet.helius-rpc.com/?api-key=e30ea48e-bf93-4f7f-9e54-68ae7300fcc5';
const MEMO_PROGRAM = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

const memos = [
  'MERIK // INIT // Reputation protocol deployed. Score engine online. Badge system active.',
  'MERIK // SCORE // 12-dimension analysis: volume, win rate, wallet age, hold duration, diversity, consistency, risk, social, early adoption, survival, network, presence.',
  'MERIK // BADGES // 16 on-chain achievements: First Blood, Diamond Hands, Paper Hands, Survivor, Whale, Degen, Early Bird, Ghost, Sniper, Stacker, Rugged, Veteran, Collector, Minimalist, Tipper, Memo Writer.',
  'MERIK // PERSONALITY // 6 types: The Sniper, The Ape, The Ghost, The Surgeon, The Gambler, The Collector. Derived from trading patterns.',
  'MERIK // LEADERBOARD // Top wallets ranked by Merik Score. All data from on-chain activity. No self-reporting.',
  'MERIK // PROFILE // Shareable profile cards. Score, badges, personality, stats. Screenshot and share on Twitter.',
  'MERIK // ALGORITHM // Composite score 0-100. Weighted across 12 dimensions. Higher score = stronger on-chain reputation.',
  'MERIK // VERIFY // Every badge is verifiable. Every score is reproducible. Your wallet tells the truth.',
  'MERIK // STATUS // Protocol operational. Scoring engine running. Badge distribution active.',
  'MERIK // HEARTBEAT // Merik is live on Solana. Prove your standing. Earn your reputation.',
];

async function main() {
  const keyFile = path.join(__dirname, '..', 'keys', 'wallet.json');
  const { secretKey } = JSON.parse(fs.readFileSync(keyFile, 'utf-8'));
  const kp = Keypair.fromSecretKey(bs58.decode(secretKey));
  const conn = new Connection(HELIUS, 'confirmed');

  console.log(`Wallet: ${kp.publicKey.toBase58()}`);
  const bal = await conn.getBalance(kp.publicKey);
  console.log(`Balance: ${bal / 1e9} SOL`);
  if (bal < 5000000) { console.log('Need SOL. Fund wallet first.'); return; }

  const sigs: string[] = [];
  for (let i = 0; i < memos.length; i++) {
    const tx = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: kp.publicKey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM,
        data: Buffer.from(memos[i]),
      })
    );
    const sig = await sendAndConfirmTransaction(conn, tx, [kp]);
    sigs.push(sig);
    console.log(`Memo ${i + 1}/10: ${sig}`);
    if (i < memos.length - 1) await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('\n--- MEMO_LOGS for constants.ts ---');
  const ts = new Date().toISOString();
  sigs.forEach((s, i) => {
    console.log(`  { id: 'M-${String(i + 1).padStart(3, '0')}', content: '${memos[i].replace(/'/g, "\\'")}', signature: '${s}', ts: '${ts}' },`);
  });
}

main().catch(console.error);
