// NextAuth v5 (Auth.js) core configuration.
// Providers: Google, GitHub, Credentials (email/password).
// Strategy: JWT (works even if the database is temporarily unavailable).

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function authorizeCredentials(raw) {
  const parsed = credentialsSchema.safeParse(raw);
  if (!parsed.success) return null;
  if (!prisma) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (!user?.hashedPassword) return null;
    const ok = await bcrypt.compare(parsed.data.password, user.hashedPassword);
    if (!ok) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name || null,
      image: user.image || null,
      role: user.role,
    };
  } catch (e) {
    console.error('[auth] credentials error', e);
    return null;
  }
}

const providers = [
  Credentials({
    name: 'Email',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: authorizeCredentials,
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers,
  pages: {
    signIn: '/signin',
    error: '/signin',
    verifyRequest: '/verify-email',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'USER';
      } else if (token?.email && prisma) {
        try {
          const db = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true },
          });
          if (db) {
            token.id = db.id;
            token.role = db.role;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'USER';
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials' && !user.emailVerified) {
        // Auto-verify OAuth accounts.
        try {
          if (prisma && user.email) {
            await prisma.user.update({
              where: { email: user.email },
              data: { emailVerified: new Date() },
            });
          }
        } catch {}
      }
      return true;
    },
  },
});

// Enabled providers (for the UI to render only what's configured).
export const enabledProviders = {
  google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  github: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  credentials: true,
};
