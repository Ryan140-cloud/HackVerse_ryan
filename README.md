# HackVerse

**Every hackathon, one universe.**

HackVerse is a SaaS platform that aggregates ongoing and upcoming hackathons
from Devpost, Devfolio, MLH, Unstop and more \u2014 in a single, elegant dashboard
built for students who ship.

This repository contains the **foundation** (no authentication yet).

## Stack

- Next.js 15 (App Router)
- React 18
- Tailwind CSS + shadcn/ui
- Framer Motion
- Prisma (MongoDB provider in this template; Postgres-ready)
- MongoDB (via `MONGO_URL`)

> The requested stack included PostgreSQL. Because this environment ships with
> MongoDB, the Prisma schema uses the MongoDB provider (Prisma has first-class
> MongoDB support). Migrating to Postgres later is a one-line provider change.

## Structure

```
app/
  app/
    layout.js         # Global layout w/ Navbar, Footer, ThemeProvider
    page.js           # Home
    explore/page.js   # Explore hackathons w/ filters + Sidebar
    about/page.js
    contact/page.js
    privacy/page.js
    terms/page.js
    not-found.js      # 404
    error.js          # Error boundary
    loading.js        # Global loading skeleton
    providers.js      # React Query + next-themes
    globals.css
    api/[[...path]]/route.js
  components/
    navbar.jsx
    sidebar.jsx
    footer.jsx
    theme-switcher.jsx
    hackathon-card.jsx
    ui/**             # shadcn primitives
  lib/
    prisma.js         # Prisma singleton
    data/hackathons.js
    utils.js
  prisma/
    schema.prisma
```

## Scripts

- `yarn dev` \u2014 run Next.js dev server
- `npx prisma generate` \u2014 generate the Prisma client

## API

- `GET  /api/hackathons` \u2014 list (supports `?q=`, `?status=`, `?source=`, `?mode=`)
- `GET  /api/hackathons/:slug` \u2014 single hackathon
- `POST /api/contact` \u2014 submit contact form
- `POST /api/subscribe` \u2014 newsletter signup
