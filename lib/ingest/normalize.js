// Normalize a raw hackathon record to HackVerse's canonical shape.
// Mode values are coerced to enum, dates to Date, tags to string[].

const MODE_MAP = {
  online: 'ONLINE',
  virtual: 'ONLINE',
  remote: 'ONLINE',
  hybrid: 'HYBRID',
  offline: 'OFFLINE',
  'in-person': 'OFFLINE',
  in_person: 'OFFLINE',
};

function toDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function toList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  return String(v).split(/[,;]/).map((s) => s.trim()).filter(Boolean);
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function normalizeHackathon(raw, { defaultSource = 'unknown' } = {}) {
  const title = String(raw.title || raw.name || '').trim();
  if (!title) return null;

  const startDate = toDate(raw.startDate || raw.start_time || raw.starts_at || raw.start_at);
  const endDate = toDate(raw.endDate || raw.end_time || raw.ends_at || raw.end_at);
  if (!startDate) return null;

  const modeKey = String(raw.mode || raw.type || raw.location_type || 'online').toLowerCase();
  const mode = MODE_MAP[modeKey] || (modeKey.includes('online') ? 'ONLINE' : 'OFFLINE');

  return {
    slug: slugify(title) + '-' + (startDate.getTime() / 86400000 | 0),
    title,
    description: String(raw.description || raw.summary || raw.subtitle || '').slice(0, 4000),
    source: raw.source || defaultSource,
    sourceUrl: raw.sourceUrl || raw.url || raw.link || '',
    bannerUrl: raw.bannerUrl || raw.image || raw.banner || null,
    location: String(raw.location || raw.city || (mode === 'ONLINE' ? 'Online' : 'TBA')),
    mode,
    startDate,
    endDate: endDate || new Date(startDate.getTime() + 2 * 86400000),
    registerBy: toDate(raw.registerBy || raw.deadline || raw.registration_deadline),
    prizePool: raw.prizePool || raw.prize || raw.prizes || null,
    prizeValue: Number(raw.prizeValue || 0) || 0,
    tags: toList(raw.tags || raw.themes || raw.categories),
    themes: toList(raw.themes),
    category: raw.category || null,
    organizerName: String(raw.organizer || raw.organizer_name || raw.host || defaultSource),
    participants: Number(raw.participants || 0) || 0,
  };
}

export function slug(s) {
  return slugify(s);
}
