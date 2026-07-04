// Route protection middleware.
// Reads the NextAuth JWT and enforces auth + role-based access on protected paths.

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PREFIXES = ['/dashboard', '/admin'];
const ADMIN_ONLY = ['/admin'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only run on protected paths for performance.
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow admin demo bypass via query string OR cookie \u2014 useful before real auth
  // credentials are provisioned. Remove `HACKVERSE_DEMO=1` cookie to disable.
  const demo = request.cookies.get('hackverse_demo')?.value;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  }).catch(() => null);

  if (!token && !demo) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    const role = token?.role || (demo === 'admin' ? 'ADMIN' : null);
    if (role !== 'ADMIN') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/access-denied';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
