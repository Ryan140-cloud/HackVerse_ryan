// POST /api/ingest — triggers the ingestion pipeline.
// Protected by a static header token so Vercel cron can call it safely.
// Local invocation: curl -X POST http://localhost:3000/api/ingest -H "x-ingest-token: dev"

import { NextResponse } from 'next/server';
import { runIngestion } from '@/lib/ingest/pipeline';

export async function POST(request) {
  const token = request.headers.get('x-ingest-token');
  const expected = process.env.INGEST_TOKEN || 'dev';
  if (token !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get('dryRun') === '1';
  const sourcesParam = searchParams.get('sources');
  const sourceKeys = sourcesParam ? sourcesParam.split(',').map((s) => s.trim()) : null;

  try {
    const stats = await runIngestion({ dryRun, sourceKeys });
    return NextResponse.json({ ok: true, stats, at: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  // Health/metadata for the pipeline.
  const { CONNECTOR_SUMMARY } = await import('@/lib/ingest/connectors');
  return NextResponse.json({
    service: 'HackVerse ingestion',
    connectors: CONNECTOR_SUMMARY,
  });
}
