import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const lb = getLeaderboard();
  return NextResponse.json(lb);
}
