import fs from 'fs';
import path from 'path';

export interface LeaderboardEntry {
  wallet: string;
  score: number;
  badges: number;
  personality: string;
  topBadge: string;
  verifiedAt: string;
}

// Try writable locations: /tmp works in Vercel/Lambda; cwd/data for local
const CANDIDATES = [
  '/tmp/merik-data',
  path.join(process.cwd(), 'data'),
];

let DATA_DIR = CANDIDATES[0];
let useMemoryOnly = false;
let initialized = false;
const memoryStore: LeaderboardEntry[] = [];

function initDir() {
  if (initialized) return;
  initialized = true;
  if (useMemoryOnly) return;
  for (const dir of CANDIDATES) {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const testFile = path.join(dir, '.write-test');
      fs.writeFileSync(testFile, 'ok');
      fs.unlinkSync(testFile);
      DATA_DIR = dir;
      return;
    } catch {
      continue;
    }
  }
  useMemoryOnly = true;
}

const LB_FILE = () => path.join(DATA_DIR, 'leaderboard.json');

export function getLeaderboard(): LeaderboardEntry[] {
  initDir();
  if (useMemoryOnly) return [...memoryStore];
  try {
    const fp = LB_FILE();
    if (!fs.existsSync(fp)) return [];
    return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  } catch {
    return [];
  }
}

export function upsertLeaderboard(entry: LeaderboardEntry) {
  initDir();
  const lb = getLeaderboard();
  const idx = lb.findIndex((e) => e.wallet === entry.wallet);
  if (idx >= 0) {
    lb[idx] = { ...lb[idx], ...entry };
  } else {
    lb.push(entry);
  }
  lb.sort((a, b) => b.score - a.score);
  if (useMemoryOnly) {
    memoryStore.length = 0;
    memoryStore.push(...lb);
    return lb;
  }
  try {
    fs.writeFileSync(LB_FILE(), JSON.stringify(lb, null, 2));
  } catch {
    useMemoryOnly = true;
    memoryStore.length = 0;
    memoryStore.push(...lb);
  }
  return lb;
}

export function getStats() {
  const lb = getLeaderboard();
  const total = lb.length;
  const avgScore = total > 0 ? Math.round(lb.reduce((s, e) => s + e.score, 0) / total) : 0;
  const totalBadges = lb.reduce((s, e) => s + e.badges, 0);
  return { totalWallets: total, avgScore, totalBadges };
}
