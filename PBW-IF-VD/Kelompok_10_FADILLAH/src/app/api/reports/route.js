import { NextResponse } from 'next/server';
import { historyLogs } from '../data';

export async function GET() {
  return NextResponse.json(historyLogs);
}
