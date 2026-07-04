'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  getPreferences,
  savePreferences,
  resetPreferences,
  getBookmarks,
  toggleBookmark,
  isBookmarked,
  getActivity,
  logActivity,
  subscribe,
} from './preferences';

// React hook that keeps a component in sync with localStorage preferences.
export function usePreferences() {
  const [prefs, setPrefs] = useState(() => ({
    skills: [],
    technologies: [],
    experience: 'intermediate',
    categories: [],
    onboarded: false,
    name: '',
  }));
  const [bookmarks, setBookmarks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPrefs(getPreferences());
    setBookmarks(getBookmarks());
    setActivity(getActivity());
    setReady(true);
    const unsub = subscribe(() => {
      setPrefs(getPreferences());
      setBookmarks(getBookmarks());
      setActivity(getActivity());
    });
    return unsub;
  }, []);

  return {
    prefs,
    bookmarks,
    activity,
    ready,
    save: savePreferences,
    reset: resetPreferences,
    toggleBookmark: (h) => {
      const next = toggleBookmark(h);
      logActivity('bookmark', { id: h.id, title: h.title });
      setBookmarks(next);
    },
    isBookmarked,
    logActivity,
  };
}
