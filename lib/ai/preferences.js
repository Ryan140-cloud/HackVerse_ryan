'use client';

// Client-side preferences persistence (localStorage) with a simple pub/sub
// so any component in the tree can react to changes.

const KEY = 'hackverse:prefs:v1';
const BOOKMARKS_KEY = 'hackverse:bookmarks:v1';
const ACTIVITY_KEY = 'hackverse:activity:v1';

const DEFAULT_PREFS = {
  skills: [],
  technologies: [],
  experience: 'intermediate',
  categories: [],
  onboarded: false,
  name: '',
};

const listeners = new Set();

function safeGet(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getPreferences() {
  return { ...DEFAULT_PREFS, ...safeGet(KEY, {}) };
}

export function savePreferences(prefs) {
  const next = { ...getPreferences(), ...prefs };
  safeSet(KEY, next);
  listeners.forEach((cb) => cb(next));
  return next;
}

export function resetPreferences() {
  safeSet(KEY, DEFAULT_PREFS);
  listeners.forEach((cb) => cb(DEFAULT_PREFS));
}

export function getBookmarks() {
  return safeGet(BOOKMARKS_KEY, []);
}

export function toggleBookmark(hackathon) {
  const list = getBookmarks();
  const idx = list.findIndex((h) => h.id === hackathon.id);
  let next;
  if (idx >= 0) {
    next = [...list.slice(0, idx), ...list.slice(idx + 1)];
  } else {
    next = [hackathon, ...list];
  }
  safeSet(BOOKMARKS_KEY, next);
  listeners.forEach((cb) => cb(getPreferences(), next));
  return next;
}

export function isBookmarked(id) {
  return getBookmarks().some((h) => h.id === id);
}

export function logActivity(action, meta = {}) {
  const list = safeGet(ACTIVITY_KEY, []);
  const entry = { action, meta, at: Date.now() };
  const next = [entry, ...list].slice(0, 50);
  safeSet(ACTIVITY_KEY, next);
  return next;
}

export function getActivity() {
  return safeGet(ACTIVITY_KEY, []);
}

export function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
