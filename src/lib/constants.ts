export const PROJECT = {
  name: 'MERIK',
  tagline: 'Your standing on Solana.',
  description: 'Wallet reputation and achievement system. Connect, get scored, earn badges, share your profile.',
  wallet: 'D1oFt1LJZ5nrrxACBhmdaTCSTLPzUw6Bn4RRfuwFAqw4',
  treasury: 'EMKWBLUM9zm3fDvHrPeCDTB4nJ7k7nWaP3EmZL6SsaQV',
  multisig: '',
  twitter: 'https://x.com/merikonsol',
  sns: '',
};

export const HELIUS = 'https://mainnet.helius-rpc.com/?api-key=e30ea48e-bf93-4f7f-9e54-68ae7300fcc5';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'holding' | 'social' | 'survival' | 'whale';
  icon: string;
  rarity: number; // percentage of wallets that have this
}

export const BADGES: Badge[] = [
  { id: 'first-blood', name: 'FIRST BLOOD', description: 'Made your first trade on Solana', category: 'trading', icon: '⚔️', rarity: 89 },
  { id: 'diamond-hands', name: 'DIAMOND HANDS', description: 'Held a token for 30+ days without selling', category: 'holding', icon: '💎', rarity: 24 },
  { id: 'paper-hands', name: 'PAPER HANDS', description: 'Sold within 1 hour of buying', category: 'trading', icon: '🧻', rarity: 72 },
  { id: 'survivor', name: 'SURVIVOR', description: 'Held a token that dropped 90%+ from your entry', category: 'survival', icon: '🛡️', rarity: 45 },
  { id: 'whale', name: 'WHALE', description: 'Wallet held 100+ SOL at peak balance', category: 'whale', icon: '🐋', rarity: 8 },
  { id: 'degen', name: 'DEGEN', description: 'Traded 10+ different tokens in a single day', category: 'trading', icon: '🎰', rarity: 31 },
  { id: 'early-bird', name: 'EARLY BIRD', description: 'Bought a token within first 100 buyers', category: 'trading', icon: '🐦', rarity: 15 },
  { id: 'ghost', name: 'GHOST', description: 'Wallet inactive 30+ days then returned', category: 'social', icon: '👻', rarity: 38 },
  { id: 'sniper', name: 'SNIPER', description: 'Bought and sold within the same block', category: 'trading', icon: '🎯', rarity: 5 },
  { id: 'stacker', name: 'STACKER', description: 'Made 5+ profitable trades in a row', category: 'trading', icon: '📈', rarity: 12 },
  { id: 'rugged', name: 'RUGGED', description: 'Held a token that went to absolute zero', category: 'survival', icon: '💀', rarity: 61 },
  { id: 'veteran', name: 'VETERAN', description: 'Wallet older than 1 year on Solana', category: 'holding', icon: '🎖️', rarity: 34 },
  { id: 'collector', name: 'COLLECTOR', description: 'Held 50+ different tokens at once', category: 'holding', icon: '🗂️', rarity: 19 },
  { id: 'minimalist', name: 'MINIMALIST', description: 'Only ever held SOL — no tokens', category: 'holding', icon: '⬜', rarity: 3 },
  { id: 'tipper', name: 'TIPPER', description: 'Sent SOL to 10+ unique wallets', category: 'social', icon: '💸', rarity: 22 },
  { id: 'memo-writer', name: 'MEMO WRITER', description: 'Has on-chain memo transactions', category: 'social', icon: '✍️', rarity: 9 },
];

export interface Personality {
  id: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  color: string;
}

export const PERSONALITIES: Personality[] = [
  { id: 'sniper', name: 'The Sniper', title: 'Precision Trader', description: 'Fast in, fast out. Surgical timing. You don\'t chase — you wait for the perfect shot.', traits: ['Quick exits', 'High win rate', 'Low hold time'], color: 'indigo' },
  { id: 'ape', name: 'The Ape', title: 'Full Send Specialist', description: 'Buy first, ask questions later. Every token is an opportunity. FOMO is your fuel.', traits: ['High volume', 'Many tokens', 'Fast buys'], color: 'amber' },
  { id: 'ghost', name: 'The Ghost', title: 'Silent Observer', description: 'Rarely trades. When you move, it matters. Patience is your edge.', traits: ['Low frequency', 'Large positions', 'Long holds'], color: 'muted' },
  { id: 'surgeon', name: 'The Surgeon', title: 'Calculated Operator', description: 'Methodical and consistent. Every trade has a thesis. Every exit has a plan.', traits: ['Consistent sizing', 'Planned exits', 'Steady returns'], color: 'emerald' },
  { id: 'gambler', name: 'The Gambler', title: 'High Stakes Player', description: 'Big swings, big wins, big losses. You\'re here for the thrill.', traits: ['Volatile P&L', 'Large bets', 'High risk'], color: 'rose' },
  { id: 'collector', name: 'The Collector', title: 'Digital Hoarder', description: 'Accumulates everything, sells nothing. Your wallet is a museum of Solana history.', traits: ['Many tokens', 'Rare sells', 'Long holds'], color: 'amber' },
];

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  score: number;
  badges: number;
  personality: string;
  topBadge: string;
}

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, wallet: '7xKp...R4mN', score: 97, badges: 14, personality: 'The Surgeon', topBadge: '🎯' },
  { rank: 2, wallet: 'Bfox...irpD', score: 94, badges: 13, personality: 'The Sniper', topBadge: '💎' },
  { rank: 3, wallet: '3nZF...iwJG', score: 91, badges: 12, personality: 'The Sniper', topBadge: '🎖️' },
  { rank: 4, wallet: 'HK7B...hpQC', score: 88, badges: 11, personality: 'The Collector', topBadge: '🗂️' },
  { rank: 5, wallet: 'GLH2...3JL', score: 86, badges: 11, personality: 'The Ghost', topBadge: '🐋' },
  { rank: 6, wallet: '9Kz1...dT2f', score: 83, badges: 10, personality: 'The Ape', topBadge: '🎰' },
  { rank: 7, wallet: 'D77R...4y7', score: 81, badges: 10, personality: 'The Surgeon', topBadge: '📈' },
  { rank: 8, wallet: 'ExSn...5vXd', score: 79, badges: 9, personality: 'The Gambler', topBadge: '💀' },
  { rank: 9, wallet: '5PHi...aTjx', score: 76, badges: 9, personality: 'The Sniper', topBadge: '🐦' },
  { rank: 10, wallet: 'CVRg...VQnaR', score: 74, badges: 8, personality: 'The Collector', topBadge: '💸' },
  { rank: 11, wallet: 'Du4Y...QvjL', score: 71, badges: 8, personality: 'The Ape', topBadge: '⚔️' },
  { rank: 12, wallet: 'GS4C...QnaR', score: 68, badges: 7, personality: 'The Ghost', topBadge: '👻' },
];

export const DEMO_PROFILE = {
  wallet: '7xKp...R4mN',
  score: 84,
  personality: PERSONALITIES[0],
  badges: ['first-blood', 'diamond-hands', 'survivor', 'early-bird', 'sniper', 'stacker', 'veteran', 'tipper', 'memo-writer'],
  stats: {
    totalTrades: 1247,
    biggestWin: '+842%',
    biggestLoss: '-94%',
    walletAge: '2y 3m',
    uniqueTokens: 89,
    avgHoldTime: '4.2h',
    winRate: '61%',
    totalVolume: '3,412 SOL',
  },
};

export const MEMO_LOGS: { id: string; content: string; signature: string; ts: string }[] = [];

export const COUNCIL: { name: string; address: string }[] = [
  { name: 'Vault-A', address: '6sFXAwcaukSLAxXVce4bJUxmJaWc4A1VPwUcrjsFeheV' },
  { name: 'Vault-B', address: '6BLvoGWNQbWRgZbUAnaFXuongn7iefJBkpFkV5DQGa1C' },
  { name: 'Vault-C', address: '99QBzfKWeU18HbA9Q2grEJUVeuqvotmxWwb29bCYrFJ5' },
];
