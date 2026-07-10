// GET  /api/admin/submissions  —  list all community-submitted hackathons
//                                  (any status), newest first.
// PATCH /api/admin/submissions   —  { id, action: 'APPROVED'|'REJECTED' }.
// DELETE /api/admin/submissions?id=xxx — delete an entry.
//
// All endpoints require an authenticated ADMIN.

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (session.user.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session };
}

async function audit(entry) {
  if (!prisma) return;
  try {
    await prisma.auditLog.create({ data: entry });
  } catch (e) {
    console.warn('[audit] failed:', e?.message || e);
  }
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  if (!prisma) return NextResponse.json({ items: [] });

  try {
    const items = await prisma.hackathon.findMany({
      where: { source: 'Community' },
      orderBy: { createdAt: 'desc' },
      include: {
        organizer: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
      },
      take: 200,
    });
    return NextResponse.json({ count: items.length, items });
  } catch (e) {
    return NextResponse.json({ items: [], error: String(e?.message || e) }, { status: 500 });
  }
}

export async function PATCH(request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  if (!prisma) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  try {
    const { id, action, notes } = await request.json();
    if (!id || !['APPROVED', 'REJECTED', 'ARCHIVED', 'PENDING'].includes(action)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const updated = await prisma.hackathon.update({
      where: { id },
      data: { status: action },
      select: { id: true, title: true, slug: true, status: true },
    });
    await audit({
      userId: gate.session.user.id || null,
      actorEmail: gate.session.user.email || null,
      action: `submission:${action.toLowerCase()}`,
      entity: 'hackathon',
      entityId: id,
      metadata: notes ? { notes } : undefined,
    });
    return NextResponse.json({ ok: true, hackathon: updated });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

export async function DELETE(request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  if (!prisma) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await prisma.hackathon.delete({ where: { id } });
    await audit({
      userId: gate.session.user.id || null,
      actorEmail: gate.session.user.email || null,
      action: 'submission:deleted',
      entity: 'hackathon',
      entityId: id,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
