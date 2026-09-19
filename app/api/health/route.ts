import { NextResponse } from 'next/server';
import { modules, totalLessons } from '@/lib/content';

/** GET /api/health — liveness/readiness probe. */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    modules: modules.length,
    lessons: totalLessons(),
    time: new Date().toISOString(),
  });
}
