// Ingestion pipeline: fetch -> normalize -> deduplicate -> categorize -> persist.
// Runs in a Next.js API route or scheduled worker. Idempotent.

import prisma from '@/lib/prisma';
import { normalizeHackathon, slug as toSlug } from './normalize';
import { isDuplicate } from './dedupe';
import { CONNECTORS } from './connectors';

function inferCategory({ tags = [], themes = [], title = '' }) {
  const hay = `${tags.join(' ')} ${themes.join(' ')} ${title}`.toLowerCase();
  if (/\b(ai|ml|llm|gpt|agents?)\b/.test(hay)) return 'ai-ml';
  if (/\b(web3|defi|zk|blockchain|ethereum|solana)\b/.test(hay)) return 'web3';
  if (/\b(fintech|payments?|finance)\b/.test(hay)) return 'fintech';
  if (/\b(health|bio|medical|medtech)\b/.test(hay)) return 'healthtech';
  if (/\b(climate|sustainab|planet|carbon)\b/.test(hay)) return 'climate';
  if (/\b(game|unity|godot|gaming)\b/.test(hay)) return 'gaming';
  if (/\b(hardware|iot|robotics|firmware)\b/.test(hay)) return 'hardware';
  if (/\b(space|nasa|astro|orbital)\b/.test(hay)) return 'space';
  return null;
}

async function upsertOrganizer(name) {
  if (!name) return null;
  const s = toSlug(name);
  return prisma.organizer.upsert({
    where: { slug: s },
    create: { slug: s, name },
    update: {},
  });
}

async function upsertCategory(catSlug) {
  if (!catSlug) return null;
  return prisma.category.findUnique({ where: { slug: catSlug } });
}

export async function runIngestion({ sourceKeys = null, dryRun = false } = {}) {
  if (!prisma) throw new Error('prisma unavailable');

  const stats = { fetched: 0, created: 0, skipped: 0, duplicates: 0, errors: 0, bySource: {} };

  // 1. Fetch from every enabled source in parallel (with per-connector isolation).
  const connectors = CONNECTORS.filter((c) => !sourceKeys || sourceKeys.includes(c.source));

  const fetched = await Promise.all(
    connectors.map(async (Connector) => {
      const stat = { fetched: 0, errors: 0 };
      stats.bySource[Connector.source] = stat;
      try {
        const inst = new Connector();
        const raw = await inst.fetch();
        stat.fetched = raw.length;
        return { source: Connector.source, records: raw };
      } catch (e) {
        stat.errors += 1;
        stats.errors += 1;
        console.error(`[ingest:${Connector.source}] failed:`, e.message);
        return { source: Connector.source, records: [] };
      }
    })
  );

  // 2. Normalize.
  const normalized = [];
  for (const batch of fetched) {
    for (const raw of batch.records) {
      const n = normalizeHackathon(raw, { defaultSource: batch.source });
      if (n) normalized.push(n);
    }
  }
  stats.fetched = normalized.length;

  // 3. Load recent hackathons for dedupe (12 months window).
  const twelveMonthsAgo = new Date(Date.now() - 365 * 86400000);
  const existing = await prisma.hackathon.findMany({
    where: { startDate: { gte: twelveMonthsAgo } },
    select: { id: true, slug: true, title: true, sourceUrl: true, startDate: true },
  });

  // 4. Persist non-duplicates.
  for (const n of normalized) {
    const dup = isDuplicate(n, existing);
    if (dup) {
      stats.duplicates += 1;
      continue;
    }

    const catSlug = n.category || inferCategory(n);
    if (dryRun) {
      stats.created += 1;
      continue;
    }

    try {
      const organizer = await upsertOrganizer(n.organizerName);
      const category = await upsertCategory(catSlug);
      await prisma.hackathon.upsert({
        where: { slug: n.slug },
        create: {
          slug: n.slug,
          title: n.title,
          description: n.description,
          source: n.source,
          sourceUrl: n.sourceUrl,
          bannerUrl: n.bannerUrl,
          location: n.location,
          mode: n.mode,
          startDate: n.startDate,
          endDate: n.endDate,
          registerBy: n.registerBy,
          prizePool: n.prizePool,
          prizeValue: n.prizeValue,
          tags: n.tags,
          themes: n.themes,
          participants: n.participants,
          status: 'APPROVED',
          categoryId: category?.id || null,
          organizerId: organizer?.id || null,
        },
        update: {
          startDate: n.startDate,
          endDate: n.endDate,
          registerBy: n.registerBy,
        },
      });
      existing.push({ id: n.slug, slug: n.slug, title: n.title, sourceUrl: n.sourceUrl, startDate: n.startDate });
      stats.created += 1;
    } catch (e) {
      stats.errors += 1;
      console.error(`[ingest] insert failed for ${n.title}:`, e.message);
    }
  }

  // 5. Auto-archive expired.
  const archived = await prisma.hackathon.updateMany({
    where: { endDate: { lt: new Date() }, status: { not: 'ARCHIVED' } },
    data: { status: 'ARCHIVED' },
  });
  stats.archived = archived.count;

  return stats;
}
