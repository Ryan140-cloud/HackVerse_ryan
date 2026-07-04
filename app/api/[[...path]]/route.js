import { NextResponse } from 'next/server';
import { HACKATHONS } from '@/lib/data/hackathons';

function json(data, init = 200) {
  return NextResponse.json(data, typeof init === 'number' ? { status: init } : init);
}

async function router(request, ctx) {
  const params = await ctx.params;
  const segments = (params?.path || []);
  const route = '/' + segments.join('/');
  const method = request.method;
  const url = new URL(request.url);

  // GET /api/
  if (route === '/' && method === 'GET') {
    return json({ ok: true, service: 'HackVerse API', version: '0.1.0' });
  }

  // GET /api/hackathons
  if (route === '/hackathons' && method === 'GET') {
    const q = url.searchParams.get('q')?.toLowerCase();
    const status = url.searchParams.get('status');
    const source = url.searchParams.get('source');
    const mode = url.searchParams.get('mode');

    let list = [...HACKATHONS];
    if (status && status !== 'all') list = list.filter((h) => h.status === status);
    if (source && source !== 'all') list = list.filter((h) => h.source === source);
    if (mode && mode !== 'all') list = list.filter((h) => h.mode === mode);
    if (q) {
      list = list.filter((h) =>
        `${h.title} ${h.description} ${h.tags.join(' ')} ${h.themes.join(' ')} ${h.location}`
          .toLowerCase()
          .includes(q)
      );
    }
    return json({ count: list.length, items: list });
  }

  // GET /api/hackathons/:slug
  if (segments[0] === 'hackathons' && segments[1] && method === 'GET') {
    const item = HACKATHONS.find((h) => h.slug === segments[1]);
    if (!item) return json({ error: 'Not found' }, 404);
    return json(item);
  }

  // POST /api/contact
  if (route === '/contact' && method === 'POST') {
    try {
      const body = await request.json();
      const { name, email, subject, message } = body || {};
      if (!name || !email || !subject || !message) {
        return json({ error: 'Missing fields' }, 400);
      }
      // MVP: log only. Wire to Prisma ContactMessage or email later.
      console.log('[HackVerse contact]', { name, email, subject });
      return json({ ok: true });
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }
  }

  // POST /api/subscribe
  if (route === '/subscribe' && method === 'POST') {
    try {
      const { email } = await request.json();
      if (!email) return json({ error: 'Email required' }, 400);
      console.log('[HackVerse subscribe]', email);
      return json({ ok: true });
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }
  }

  return json({ error: 'Not found', route, method }, 404);
}

export const GET = router;
export const POST = router;
export const PUT = router;
export const DELETE = router;
export const PATCH = router;
