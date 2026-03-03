import { Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import * as multisig from '@sqds/multisig';
import bs58 from 'bs58';
import fs from 'fs';
import path from 'path';

const HELIUS = 'https://mainnet.helius-rpc.com/?api-key=e30ea48e-bf93-4f7f-9e54-68ae7300fcc5';

async function main() {
  const keyFile = path.join(__dirname, '..', 'keys', 'wallet.json');
  const { secretKey } = JSON.parse(fs.readFileSync(keyFile, 'utf-8'));
  const creator = Keypair.fromSecretKey(bs58.decode(secretKey));
  const conn = new Connection(HELIUS, 'confirmed');

  const councilFiles = ['council-a', 'council-b', 'council-c'];
  const members: { key: PublicKey; permissions: ReturnType<typeof multisig.types.Permissions.all> }[] = [];
  for (const f of councilFiles) {
    const { publicKey } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'keys', `${f}.json`), 'utf-8'));
    members.push({ key: new PublicKey(publicKey), permissions: multisig.types.Permissions.all() });
  }

  const createKey = Keypair.generate();
  const [multisigPda] = multisig.getMultisigPda({ createKey: createKey.publicKey });
  console.log('Multisig PDA:', multisigPda.toBase58());

  const programConfigPda = multisig.getProgramConfigPda({})[0];
  let treasury: PublicKey;
  try {
    const cfg = await multisig.accounts.ProgramConfig.fromAccountAddress(conn, programConfigPda);
    treasury = cfg.treasury;
  } catch {
    treasury = programConfigPda;
  }

  const ix = multisig.instructions.multisigCreateV2({
    createKey: createKey.publicKey,
    creator: creator.publicKey,
    multisigPda,
    configAuthority: null,
    timeLock: 0,
    threshold: 2,
    members,
    rentCollector: null,
    treasury,
  });

  const { blockhash } = await conn.getLatestBlockhash();
  const msg = new TransactionMessage({ payerKey: creator.publicKey, recentBlockhash: blockhash, instructions: [ix] }).compileToV0Message();
  const tx = new VersionedTransaction(msg);
  tx.sign([creator, createKey]);

  const sig = await conn.sendTransaction(tx);
  console.log('Multisig deployed:', sig);
  console.log('Update constants.ts multisig to:', multisigPda.toBase58());
}

main().catch(console.error);
