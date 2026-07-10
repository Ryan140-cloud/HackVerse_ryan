// Postgres-backed data source for hackathons.
// -----------------------------------------------------------------------
// Fetches hackathons from Prisma and normalises them into the exact same
// shape the frontend/components expect (matching lib/data/hackathons.js).
// This lets us swap the source of truth from a static file to the live DB
// with zero component changes.
//
// Public helpers are ASYNC:
//   dbGetActive()      - non-expired only (upcoming + ongoing), APPROVED only
//   dbGetUpcoming()    - upcoming only
//   dbGetOngoing()     - live only
//   dbGetFeatured()    - active + featured, sorted by nearest deadline
//   dbGetTrending()    - active + trending, sorted by popularity
//   dbGetByCategory()  - active + category slug filter
//   dbGetBySlug()      - single hackathon by slug (any status for admin previews)
// -----------------------------------------------------------------------

import prisma from '@/lib/prisma';

const DAY_MS = 86400000;

function isoDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function toLiveStatus(startDate, endDate, now) {
  if (endDate < now) return 'ended';
  if (startDate <= now) return 'ongoing';
  return 'upcoming';
}

// Normalise a Prisma Hackathon row into the shape components expect.
function normaliseRow(row, now) {
  const start = new Date(row.startDate);
  const end = new Date(row.endDate);
  const registerBy = row.registerBy ? new Date(row.registerBy) : start;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    source: row.source,
    sourceUrl: row.sourceUrl,
    bannerUrl: row.bannerUrl || null,
    location: row.location,
    // Prisma stores enum values in UPPERCASE (ONLINE/HYBRID/OFFLINE). The
    // frontend expects Title Case (Online/Hybrid/Offline).
    mode:
      row.mode === 'ONLINE'
        ? 'Online'
        : row.mode === 'HYBRID'
        ? 'Hybrid'
        : 'Offline',
    startDate: isoDate(start),
    endDate: isoDate(end),
    registerBy: isoDate(registerBy),
    prizePool: row.prizePool || null,
    prizeValue: row.prizeValue || 0,
    tags: row.tags || [],
    themes: row.themes || [],
    participants: row.participants || 0,
    featured: !!row.featured,
    trending: !!row.trending,
    // Live status derived from dates (independent of DB status).
    status: toLiveStatus(start, end, now),
    // Category / organizer are joined lookups.
    category: row.category?.slug || null,
    categoryName: row.category?.name || null,
    organizer: row.organizer?.name || null,
    // Millisecond timestamps for fast client-side sorting.
    _startMs: start.getTime(),
    _endMs: end.getTime(),
    _registerMs: registerBy.getTime(),
  };
}

const HACK_INCLUDE = {
  category: { select: { slug: true, name: true } },
  organizer: { select: { name: true, slug: true } },
};

// -----------------------------------------------------------------------
// PUBLIC HELPERS
// -----------------------------------------------------------------------

export async function dbGetAll({ statuses = ['APPROVED'] } = {}) {
  if (!prisma) return [];
  try {
    const rows = await prisma.hackathon.findMany({
      where: { status: { in: statuses } },
      include: HACK_INCLUDE,
      orderBy: { startDate: 'asc' },
    });
    const now = new Date();
    return rows.map((r) => normaliseRow(r, now));
  } catch (e) {
    console.error('[db] dbGetAll error:', e?.message || e);
    return [];
  }
}

export async function dbGetActive() {
  const list = await dbGetAll();
  return list.filter((h) => h.status !== 'ended');
}

export async function dbGetUpcoming() {
  const list = await dbGetActive();
  return list
    .filter((h) => h.status === 'upcoming')
    .sort((a, b) => a._startMs - b._startMs);
}

export async function dbGetOngoing() {
  const list = await dbGetActive();
  return list.filter((h) => h.status === 'ongoing');
}

export async function dbGetFeatured(limit) {
  const list = await dbGetActive();
  const featured = list
    .filter((h) => h.featured)
    .sort((a, b) => a._registerMs - b._registerMs);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export async function dbGetTrending(limit) {
  const list = await dbGetActive();
  const trending = list
    .filter((h) => h.trending)
    .sort((a, b) => b.participants - a.participants);
  return typeof limit === 'number' ? trending.slice(0, limit) : trending;
}

export async function dbGetByCategory(slug) {
  const list = await dbGetActive();
  return list.filter((h) => h.category === slug);
}

export async function dbGetBySlug(slug) {
  if (!prisma) return null;
  try {
    const row = await prisma.hackathon.findUnique({
      where: { slug },
      include: HACK_INCLUDE,
    });
    if (!row) return null;
    return normaliseRow(row, new Date());
  } catch {
    return null;
  }
}

export async function dbGetCategories() {
  if (!prisma) return [];
  try {
    const cats = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { hackathons: true } } },
    });
    return cats.map((c) => ({
      slug: c.slug,
      name: c.name,
      emoji: c.emoji,
      color: c.color,
      count: c._count?.hackathons ?? 0,
    }));
  } catch {
    return [];
  }
}
