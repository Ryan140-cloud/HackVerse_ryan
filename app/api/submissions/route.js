// POST /api/submissions — accept user-submitted hackathons.
// Runs duplicate detection (title similarity + same registration deadline)
// and stores everything as `status = 'PENDING'` for admin moderation.

import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const schema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20).max(4000),
  sourceUrl: z.string().url(),
  location: z.string().default('Online'),
  mode: z.enum(['ONLINE', 'HYBRID', 'OFFLINE']).default('ONLINE'),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  registerBy: z.string().optional(),
  prizePool: z.string().optional(),
  prizeValue: z.number().optional(),
  category: z.string().min(1),
  organizer: z.string().min(1),
  bannerUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function titleSimilarity(a, b) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const A = norm(a);
  const B = norm(b);
  if (!A || !B) return 0;
  if (A === B) return 1;
  if (A.includes(B) || B.includes(A)) return 0.9;
  // Simple token overlap.
  const at = new Set(a.toLowerCase().split(/\s+/));
  const bt = new Set(b.toLowerCase().split(/\s+/));
  const inter = [...at].filter((x) => bt.has(x)).length;
  return inter / Math.max(at.size, bt.size);
}

export async function POST(request) {
  if (!prisma) return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 });

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid submission.', details: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;

    // Look up or create organizer/category by slug.
    const orgSlug = slugify(d.organizer);
    const organizer = await prisma.organizer.upsert({
      where: { slug: orgSlug },
      create: { slug: orgSlug, name: d.organizer, verified: false },
      update: {},
    });
    const category = await prisma.category.findUnique({ where: { slug: d.category } });

    // Duplicate detection: compare against recent hackathons (last 12 months).
    const twelveMonthsAgo = new Date(Date.now() - 365 * 86400000);
    const recent = await prisma.hackathon.findMany({
      where: { startDate: { gte: twelveMonthsAgo } },
      select: { id: true, title: true, sourceUrl: true, startDate: true },
    });

    let duplicate = false;
    for (const h of recent) {
      if (h.sourceUrl === d.sourceUrl) { duplicate = true; break; }
      if (titleSimilarity(h.title, d.title) > 0.85) { duplicate = true; break; }
    }

    const slug = slugify(d.title) + '-' + Date.now().toString(36);
    const created = await prisma.hackathon.create({
      data: {
        slug,
        title: d.title,
        description: d.description,
        source: 'Community',
        sourceUrl: d.sourceUrl,
        bannerUrl: d.bannerUrl || null,
        location: d.location,
        mode: d.mode,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        registerBy: d.registerBy ? new Date(d.registerBy) : null,
        prizePool: d.prizePool || null,
        prizeValue: 0,
        tags: d.tags,
        themes: [],
        participants: 0,
        featured: false,
        trending: false,
        status: 'PENDING',
        categoryId: category?.id || null,
        organizerId: organizer.id,
      },
      select: { id: true, slug: true, status: true },
    });

    return NextResponse.json({ ok: true, hackathon: created, duplicate });
  } catch (e) {
    console.error('[submissions] error', e);
    return NextResponse.json({ error: 'Unable to save submission.' }, { status: 500 });
  }
}

export async function GET() {
  if (!prisma) return NextResponse.json({ items: [] });
  try {
    const items = await prisma.hackathon.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { organizer: { select: { name: true } }, category: { select: { slug: true, name: true } } },
    });
    return NextResponse.json({ count: items.length, items });
  } catch (e) {
    return NextResponse.json({ items: [], error: String(e) }, { status: 500 });
  }
}
