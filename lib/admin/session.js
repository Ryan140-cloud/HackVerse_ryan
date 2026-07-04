// Client-side helper for the admin section.
// When the real auth database is not yet provisioned, an ADMIN role can be
// unlocked in the current browser via `enableDemoAdmin()`. The middleware
// reads the `hackverse_demo` cookie to allow access before real credentials
// are in place.

const DEMO_KEY = 'hackverse:demo-role';
const DEMO_COOKIE = 'hackverse_demo';

export function getDemoRole() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(DEMO_KEY);
}

function setCookie(name, value, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function enableDemoAdmin() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEMO_KEY, 'ADMIN');
  setCookie(DEMO_COOKIE, 'admin');
}

export function disableDemoAdmin() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DEMO_KEY);
  deleteCookie(DEMO_COOKIE);
}
