'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Bell,
  Filter,
  Layers,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HackathonCard } from '@/components/hackathon-card';
import { HACKATHONS } from '@/lib/data/hackathons';

const FEATURES = [
  {
    icon: Globe,
    title: 'Every source, one feed',
    desc: 'Devpost, Devfolio, MLH, Unstop and more — unified into a single, searchable stream.',
  },
  {
    icon: Filter,
    title: 'Smart filters',
    desc: 'Drill down by mode, tags, prize pool, deadline or region in a single click.',
  },
  {
    icon: Bell,
    title: 'Never miss a deadline',
    desc: 'Personalised alerts before the registration window slams shut on you.',
  },
  {
    icon: Trophy,
    title: 'Track your wins',
    desc: 'Bookmark, categorise and showcase every hackathon you’ve shipped in.',
  },
  {
    icon: Layers,
    title: 'Team up faster',
    desc: 'Discover teammates and mentors filtered by skills, availability and interests.',
  },
  {
    icon: Zap,
    title: 'Lightning fast',
    desc: 'Next.js 15 App Router, edge-cached data, and a UI tuned for late-night sprints.',
  },
];

const STATS = [
  { value: '1,200+', label: 'Hackathons indexed' },
  { value: '50+', label: 'Countries covered' },
  { value: '4', label: 'Trusted sources' },
  { value: '25k+', label: 'Students onboard' },
];

export default function App() {
  const featured = HACKATHONS.filter((h) => h.featured).slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.25] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="container relative py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge
              variant="outline"
              className="mb-6 gap-1.5 border-primary/30 bg-primary/5 px-3 py-1 text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" /> Live in beta · June 2025
            </Badge>
            <h1 className="text-balance font-[Space_Grotesk] text-5xl font-bold tracking-tight md:text-7xl">
              Every hackathon,{' '}
              <span className="text-gradient">one universe.</span>
            </h1>
            <p className="mt-6 text-balance text-lg text-muted-foreground md:text-xl">
              HackVerse pulls together every ongoing and upcoming hackathon
              from Devpost, Devfolio, MLH and Unstop — so you can spend
              your time building, not searching.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-gradient-to-r from-primary to-fuchsia-500 px-8 text-primary-foreground hover:opacity-90"
              >
                <Link href="/explore">
                  Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8">
                <Link href="/about">How it works</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Indexing:</span>
              {['Devpost', 'Devfolio', 'MLH', 'Unstop'].map((src) => (
                <Badge key={src} variant="secondary" className="font-normal">
                  {src}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              <Image
                src="https://images.pexels.com/photos/34212916/pexels-photo-34212916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Students hacking together"
                width={1600}
                height={900}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
            </div>
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-primary/20 via-fuchsia-500/20 to-pink-500/20 blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y bg-muted/30">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="text-center"
            >
              <div className="text-3xl font-bold md:text-4xl">
                <span className="text-gradient">{s.value}</span>
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 bg-primary/5 text-primary"
          >
            Features
          </Badge>
          <h2 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
            Built for students who <span className="text-gradient">ship</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to find the next hackathon, form a team and
            walk away with a prize.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED HACKATHONS */}
      <section id="sources" className="container pb-24">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 bg-primary/5 text-primary"
            >
              Featured
            </Badge>
            <h2 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
              This week&apos;s <span className="text-gradient">headliners</span>
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Handpicked hackathons that are drawing the biggest crowds and
              prize pools right now.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/explore">
              See all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((h, i) => (
            <HackathonCard key={h.id} hackathon={h} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-pink-500/10 p-10 md:p-16">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative flex flex-col items-center text-center">
            <h2 className="font-[Space_Grotesk] text-3xl font-bold md:text-5xl">
              Ready to find your next{' '}
              <span className="text-gradient">victory</span>?
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Join thousands of students already using HackVerse to discover,
              track and win at hackathons around the world.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 h-12 bg-gradient-to-r from-primary to-fuchsia-500 px-8 text-primary-foreground hover:opacity-90"
            >
              <Link href="/explore">
                Explore Hackathons <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
