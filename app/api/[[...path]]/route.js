// Server-side API for hackathons. Reads live data from the PostgreSQL
// database (via Prisma) so admin edits reflect immediately on the frontend.
// Falls back to an empty list if the DB is unreachable.

import { NextResponse } from 'next/server';
import {
  dbGetActive,
  dbGetUpcoming,
  dbGetOngoing,
  dbGetFeatured,
  dbGetTrending,
  dbGetByCategory,
  dbGetBySlug,
  dbGetCategories,
} from '@/lib/data/db';

// Static enum sources — kept in code because they never change.
export const SOURCES = ['Devpost', 'Devfolio', 'MLH', 'Unstop'];
export const MODES = ['Online', 'Hybrid', 'Offline'];

// Cache the JSON representation for 30s at the CDN layer to keep API cheap.
const CACHE_HEADERS = {
  'Cache-Control': 's-maxage=30, stale-while-revalidate=120',
};

function respond(data, init = 200) {
  const options = typeof init === 'number' ? { status: init } : init;
  return NextResponse.json(data, {
    ...options,
    headers: { ...(options.headers || {}), ...CACHE_HEADERS },
  });
}

function stripInternal(h) {
  if (!h) return h;
  const { _startMs, _endMs, _registerMs, ...rest } = h;
  return rest;
}

// Multi-value filter helper — supports comma-separated ("web3,fintech") or
// repeated (?source=Devpost&source=MLH) query params, so the Explore page can
// filter by many values at once.
function multi(url, key) {
  const values = url.searchParams.getAll(key).flatMap((v) => v.split(','));
  return values.map((v) => v.trim()).filter((v) => v && v !== 'all');
}

async function router(request, ctx) {
  const params = await ctx.params;
  const segments = params?.path || [];
  const route = '/' + segments.join('/');
  const method = request.method;
  const url = new URL(request.url);

  if (route === '/' && method === 'GET') {
    return respond({
      ok: true,
      service: 'HackVerse API',
      version: '1.1.0',
      source: 'postgresql',
      now: new Date().toISOString(),
    });
  }

  // GET /api/hackathons — supports multi-value filters + text search + sort.
  if (segments[0] === 'hackathons' && !segments[1] && method === 'GET') {
    const q = (url.searchParams.get('q') || '').toLowerCase().trim();
    const statuses = multi(url, 'status'); // ['ongoing','upcoming']
    const sources = multi(url, 'source');
    const modes = multi(url, 'mode');
    const categories = multi(url, 'category');
    const tags = multi(url, 'tag');
    const sort = url.searchParams.get('sort') || 'ending-soon';
    const limit = Number(url.searchParams.get('limit')) || undefined;

    let list = await dbGetActive();

    if (statuses.length) list = list.filter((h) => statuses.includes(h.status));
    if (sources.length) list = list.filter((h) => sources.includes(h.source));
    if (modes.length) list = list.filter((h) => modes.includes(h.mode));
    if (categories.length) list = list.filter((h) => categories.includes(h.category));
    if (tags.length) {
      list = list.filter((h) =>
        (h.tags || []).some((t) => tags.map((x) => x.toLowerCase()).includes(t.toLowerCase()))
      );
    }
    if (q) {
      list = list.filter((h) =>
        `${h.title} ${h.description} ${h.tags.join(' ')} ${h.themes.join(' ')} ${h.location}`
          .toLowerCase()
          .includes(q)
      );
    }

    switch (sort) {
      case 'soonest':
        list.sort((a, b) => a._startMs - b._startMs);
        break;
      case 'prize':
        list.sort((a, b) => (b.prizeValue || 0) - (a.prizeValue || 0));
        break;
      case 'popular':
        list.sort((a, b) => b.participants - a.participants);
        break;
      case 'newest':
        list.sort((a, b) => b._startMs - a._startMs);
        break;
      case 'ending-soon':
      default:
        list.sort((a, b) => a._registerMs - b._registerMs);
        break;
    }
    if (limit) list = list.slice(0, limit);
    return respond({ count: list.length, items: list.map(stripInternal) });
  }

  // GET /api/hackathons/:slug
  if (segments[0] === 'hackathons' && segments[1] && method === 'GET') {
    const item = await dbGetBySlug(segments[1]);
    if (!item || item.status === 'ended') {
      return respond({ error: 'Not found' }, 404);
    }
    return respond(stripInternal(item));
  }

  // Convenience endpoints.
  if (route === '/upcoming' && method === 'GET') {
    const items = await dbGetUpcoming();
    return respond({ items: items.map(stripInternal) });
  }
  if (route === '/ongoing' && method === 'GET') {
    const items = await dbGetOngoing();
    return respond({ items: items.map(stripInternal) });
  }
  if (route === '/featured' && method === 'GET') {
    const items = await dbGetFeatured();
    return respond({ items: items.map(stripInternal) });
  }
  if (route === '/trending' && method === 'GET') {
    const items = await dbGetTrending();
    return respond({ items: items.map(stripInternal) });
  }

  // GET /api/categories — for populating filter dropdowns from live counts.
  if (route === '/categories' && method === 'GET') {
    const items = await dbGetCategories();
    return respond({ items });
  }

  // Category listing.
  if (segments[0] === 'categories' && segments[1] && method === 'GET') {
    const items = await dbGetByCategory(segments[1]);
    return respond({ items: items.map(stripInternal) });
  }

  // POST /api/contact
  if (route === '/contact' && method === 'POST') {
    try {
      const body = await request.json();
      const { name, email, subject, message } = body || {};
      if (!name || !email || !subject || !message) {
        return respond({ error: 'Missing fields' }, 400);
      }
      console.log('[HackVerse contact]', { name, email, subject });
      return respond({ ok: true });
    } catch {
      return respond({ error: 'Invalid JSON' }, 400);
    }
  }

  // POST /api/subscribe
  if (route === '/subscribe' && method === 'POST') {
    try {
      const { email } = await request.json();
      if (!email) return respond({ error: 'Email required' }, 400);
      console.log('[HackVerse subscribe]', email);
      return respond({ ok: true });
    } catch {
      return respond({ error: 'Invalid JSON' }, 400);
    }
  }

  // GET /api/revalidate?tag=hackathons — hook for scheduler / webhook.
  if (route === '/revalidate' && (method === 'GET' || method === 'POST')) {
    try {
      const { revalidateTag } = await import('next/cache');
      revalidateTag('hackathons');
      return respond({ ok: true, revalidated: true, at: new Date().toISOString() });
    } catch (e) {
      return respond({ ok: false, error: String(e) }, 500);
    }
  }

  return respond({ error: 'Not found', route, method }, 404);
}

export const GET = router;
export const POST = router;
export const PUT = router;
export const DELETE = router;
export const PATCH = router;

// Ensure this route is dynamic (not statically cached at build time) since
// hackathon live status depends on `Date.now()`.
export const dynamic = 'force-dynamic';
