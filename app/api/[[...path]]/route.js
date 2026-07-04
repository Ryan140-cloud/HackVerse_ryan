// Server-side API for hackathons. Always returns active (non-expired) events
// with dates computed relative to today. Consumed by external clients,
// the chatbot, or admin scripts.

import { NextResponse } from 'next/server';
import {
  getActive,
  getUpcoming,
  getOngoing,
  getFeatured,
  getTrending,
  getByCategory,
  getBySlug,
  SOURCES,
  MODES,
} from '@/lib/data/hackathons';

// Cache the JSON representation for 60s at the CDN layer to keep API cheap.
const CACHE_HEADERS = {
  'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
};

function respond(data, init = 200) {
  const options = typeof init === 'number' ? { status: init } : init;
  return NextResponse.json(data, { ...options, headers: { ...(options.headers || {}), ...CACHE_HEADERS } });
}

function stripInternal(h) {
  const { _startMs, _endMs, _registerMs, ...rest } = h;
  return rest;
}

async function router(request, ctx) {
  const params = await ctx.params;
  const segments = params?.path || [];
  const route = '/' + segments.join('/');
  const method = request.method;
  const url = new URL(request.url);

  if (route === '/' && method === 'GET') {
    return respond({ ok: true, service: 'HackVerse API', version: '1.0.0', now: new Date().toISOString() });
  }

  // GET /api/hackathons
  if (segments[0] === 'hackathons' && !segments[1] && method === 'GET') {
    const q = url.searchParams.get('q')?.toLowerCase();
    const status = url.searchParams.get('status');
    const source = url.searchParams.get('source');
    const mode = url.searchParams.get('mode');
    const category = url.searchParams.get('category');
    const sort = url.searchParams.get('sort') || 'ending-soon';
    const limit = Number(url.searchParams.get('limit')) || undefined;

    let list = getActive();
    if (status && status !== 'all') list = list.filter((h) => h.status === status);
    if (source && source !== 'all' && SOURCES.includes(source)) list = list.filter((h) => h.source === source);
    if (mode && mode !== 'all' && MODES.includes(mode)) list = list.filter((h) => h.mode === mode);
    if (category && category !== 'all') list = list.filter((h) => h.category === category);
    if (q) {
      list = list.filter((h) =>
        `${h.title} ${h.description} ${h.tags.join(' ')} ${h.themes.join(' ')} ${h.location}`.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'soonest': list.sort((a, b) => a._startMs - b._startMs); break;
      case 'prize': list.sort((a, b) => (b.prizeValue || 0) - (a.prizeValue || 0)); break;
      case 'popular': list.sort((a, b) => b.participants - a.participants); break;
      case 'ending-soon':
      default: list.sort((a, b) => a._registerMs - b._registerMs); break;
    }
    if (limit) list = list.slice(0, limit);
    return respond({ count: list.length, items: list.map(stripInternal) });
  }

  // GET /api/hackathons/:slug
  if (segments[0] === 'hackathons' && segments[1] && method === 'GET') {
    const item = getBySlug(segments[1]);
    if (!item || item.status === 'ended') return respond({ error: 'Not found' }, 404);
    return respond(stripInternal(item));
  }

  // Convenience endpoints.
  if (route === '/upcoming' && method === 'GET') {
    return respond({ items: getUpcoming().map(stripInternal) });
  }
  if (route === '/ongoing' && method === 'GET') {
    return respond({ items: getOngoing().map(stripInternal) });
  }
  if (route === '/featured' && method === 'GET') {
    return respond({ items: getFeatured().map(stripInternal) });
  }
  if (route === '/trending' && method === 'GET') {
    return respond({ items: getTrending().map(stripInternal) });
  }

  // Category listing.
  if (segments[0] === 'categories' && segments[1] && method === 'GET') {
    return respond({ items: getByCategory(segments[1]).map(stripInternal) });
  }

  // POST /api/contact
  if (route === '/contact' && method === 'POST') {
    try {
      const body = await request.json();
      const { name, email, subject, message } = body || {};
      if (!name || !email || !subject || !message) return respond({ error: 'Missing fields' }, 400);
      console.log('[HackVerse contact]', { name, email, subject });
      return respond({ ok: true });
    } catch { return respond({ error: 'Invalid JSON' }, 400); }
  }

  // POST /api/subscribe
  if (route === '/subscribe' && method === 'POST') {
    try {
      const { email } = await request.json();
      if (!email) return respond({ error: 'Email required' }, 400);
      console.log('[HackVerse subscribe]', email);
      return respond({ ok: true });
    } catch { return respond({ error: 'Invalid JSON' }, 400); }
  }

  // GET /api/revalidate?tag=hackathons \u2014 hook for scheduler / webhook.
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
