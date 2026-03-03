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

const DATA_DIR = path.join(process.cwd(), 'data');
const LB_FILE = path.join(DATA_DIR, 'leaderboard.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getLeaderboard(): LeaderboardEntry[] {
  ensureDir();
  if (!fs.existsSync(LB_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LB_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function upsertLeaderboard(entry: LeaderboardEntry) {
  ensureDir();
  const lb = getLeaderboard();
  const idx = lb.findIndex((e) => e.wallet === entry.wallet);
  if (idx >= 0) {
    lb[idx] = { ...lb[idx], ...entry };
  } else {
    lb.push(entry);
  }
  lb.sort((a, b) => b.score - a.score);
  fs.writeFileSync(LB_FILE, JSON.stringify(lb, null, 2));
  return lb;
}

export function getStats() {
  const lb = getLeaderboard();
  const total = lb.length;
  const avgScore = total > 0 ? Math.round(lb.reduce((s, e) => s + e.score, 0) / total) : 0;
  const totalBadges = lb.reduce((s, e) => s + e.badges, 0);
  return { totalWallets: total, avgScore, totalBadges };
}
