# HackVerse

> **Every hackathon, one universe.**  
> Discover, track and win at every hackathon that matters \u2014 in one dashboard.

**Founder & Owner:** Ryan Sharma  
**HQ:** Ambala Cantt, Haryana, India  
**License:** \u00A9 HackVerse by Ryan Sharma. All rights reserved.

---

## Overview

HackVerse aggregates ongoing and upcoming hackathons from Devpost, Devfolio, MLH, Unstop and more into a single, lightning-fast dashboard. Every date is **relative to today**: expired events are filtered out automatically and the feed refreshes on every request.

### Features

- \u2728 Home, Explore, Dashboard, About, Contact, Privacy, Terms + 404
- \ud83d\udd10 Auth (NextAuth v5): Google, GitHub, Email/Password, verification & reset
- \ud83c\udfaf AI recommendations, chatbot placeholder & user preferences
- \ud83d\uded2 Admin console: users, hackathons, categories, organizers, audit logs, RBAC
- \ud83d\udd0d Advanced search + filters + sorting + grid/list views + pagination
- \ud83c\udf1a Dark & light modes, responsive top-to-bottom
- \u26a1 Framer Motion, shadcn/ui, Tailwind, recharts
- \ud83d\udcbe Prisma schema for PostgreSQL (Neon / Supabase ready)
- \ud83d\udd04 Auto-refreshing hackathon data, sitemap + robots.txt + image + security headers

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 18, Tailwind CSS, shadcn/ui, Framer Motion
- **Auth:** NextAuth (Auth.js v5) with Prisma adapter
- **Database:** PostgreSQL via Prisma (deploy target: Neon or Supabase)
- **Email:** Resend (falls back to console log if key missing)
- **Charts:** Recharts
- **Runtime:** Node.js 20

---

## Getting started

```bash
yarn install
cp .env.example .env   # then fill in the placeholders
npx prisma generate
yarn dev
```

App runs at http://localhost:3000

### Required environment variables

```dotenv
DATABASE_URL="postgresql://user:password@host:5432/hackverse?schema=public"
AUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

RESEND_API_KEY=""
EMAIL_FROM="HackVerse <no-reply@hackverse.dev>"
```

---

## Project layout

```
app/
  app/                # Pages (App Router)
    api/              # REST endpoints
    admin/            # Admin console (RBAC-gated)
    dashboard/        # Authenticated user area
    (auth pages)      # signin, signup, forgot-password, reset-password, verify-email
    sitemap.js        # /sitemap.xml
    robots.js         # /robots.txt
  components/         # Shared UI (navbar, footer, sections, ui/, admin/, auth/, ai/)
  lib/
    auth.js           # NextAuth v5 config
    rbac.js           # Role + permission matrix
    mail.js           # Resend adapter
    prisma.js         # Prisma client singleton
    config/site.js    # Central branding placeholders (Ryan Sharma, HQ, socials, etc.)
    data/hackathons.js  # Self-refreshing dataset (relative dates)
    ai/               # Recommender + chatbot + preferences hook
    admin/            # Mock admin data (Prisma-ready)
  prisma/schema.prisma  # PostgreSQL schema
  middleware.js       # Protected routes + role gating
  next.config.js      # Images + security headers
  Dockerfile / .dockerignore
  vercel.json
```

---

## Editing branding placeholders

All company/creator information lives in **one file**: `lib/config/site.js`. Update `founder`, `address`, `contact`, `socials` and `team` there and the changes propagate to About, Contact, Footer, Privacy, Terms, Admin, metadata and copyright automatically.

---

## Data model (Prisma \u2192 PostgreSQL)

`prisma/schema.prisma` defines:

- `User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken`
- `Hackathon`, `Category`, `Organizer`, `Bookmark`, `Notification`, `Reminder`
- `AuditLog`

Swap `DATABASE_URL` to a Neon / Supabase / Railway connection string, then:

```bash
npx prisma migrate deploy
npx prisma generate
```

---

## Dynamic hackathon feed

`lib/data/hackathons.js` stores each hackathon as offsets from today (`startOffsetDays`, `durationDays`, `registerLeadDays`) and exposes:

- `getActive()` \u2014 upcoming + ongoing (never expired)
- `getUpcoming()` / `getOngoing()`
- `getFeatured(now, limit)` / `getTrending(now, limit)`
- `getByCategory(slug)` / `getBySlug(slug)`

All pages import from this module, so **Home, Explore, Dashboard, Trending, Featured and the API** share a single source of truth. Expired events are filtered automatically.

---

## APIs

| Endpoint | Description |
|---|---|
| `GET /api/hackathons` | Active hackathons. Supports `q`, `status`, `source`, `mode`, `category`, `sort`, `limit`. |
| `GET /api/hackathons/:slug` | Single hackathon by slug. |
| `GET /api/upcoming` \| `/ongoing` \| `/featured` \| `/trending` | Curated feeds. |
| `GET /api/categories/:slug` | Hackathons by category. |
| `POST /api/contact` | Contact form submission. |
| `POST /api/subscribe` | Newsletter signup. |
| `POST /api/auth/register` | Email/password registration. |
| `POST /api/auth/forgot-password` | Send reset link. |
| `POST /api/auth/reset-password` | Reset with token. |
| `GET  /api/auth/[...nextauth]` | NextAuth handler (Google, GitHub, Credentials). |
| `GET  /api/revalidate` | Bust the `hackathons` cache (cron hook). |

All list endpoints are edge-cached for 60s with 5-minute SWR.

---

## Scheduled refresh

`vercel.json` includes a cron:

```json
{ "crons": [{ "path": "/api/revalidate?tag=hackathons", "schedule": "0 * * * *" }] }
```

This hits our revalidate endpoint hourly, keeping edge caches fresh and giving future scrapers a hook to trigger.

---

## Docker

```bash
docker build -t hackverse .
docker run -p 3000:3000 --env-file .env hackverse
```

---

## Deploy to Vercel

1. Push the repo to GitHub.
2. In Vercel, import the project.
3. Add every variable from `.env` to the Vercel dashboard.
4. Vercel picks up `vercel.json` \u2014 `buildCommand` runs `prisma generate` before `next build` and the hourly cron is configured automatically.
5. Point your Neon / Supabase database URL at `DATABASE_URL`.

---

\u00A9 HackVerse by Ryan Sharma \u00B7 Ambala Cantt, Haryana, India
