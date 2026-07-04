'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const QUICK_TAGS = ['AI', 'Web3', 'HealthTech', 'Climate', 'Gaming'];

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    router.push(`/explore${params.toString() ? `?${params}` : ''}`);
  };

  return (
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
            <Sparkles className="h-3.5 w-3.5" /> Live in beta \u00B7 June 2025
          </Badge>
          <h1 className="text-balance font-[Space_Grotesk] text-5xl font-bold tracking-tight md:text-7xl">
            Every hackathon,{' '}
            <span className="text-gradient">one universe.</span>
          </h1>
          <p className="mt-6 text-balance text-lg text-muted-foreground md:text-xl">
            Discover ongoing and upcoming hackathons from Devpost, Devfolio,
            MLH and Unstop \u2014 all in one lightning-fast dashboard.
          </p>

          {/* Search Bar */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-2xl border bg-card/80 p-2 shadow-lg shadow-primary/5 backdrop-blur-md"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search 1,200+ hackathons by name, tag, or city..."
                className="border-0 bg-transparent pl-9 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              type="submit"
              className="h-10 bg-gradient-to-r from-primary to-fuchsia-500 px-6"
            >
              Search <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Trending:</span>
            {QUICK_TAGS.map((t) => (
              <Link
                key={t}
                href={`/explore?q=${encodeURIComponent(t)}`}
                className="transition-colors hover:text-foreground"
              >
                <Badge variant="secondary" className="cursor-pointer font-normal hover:bg-primary/10">
                  {t}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8"
            >
              <Link href="/explore">Browse all events</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-12 px-8">
              <Link href="/about">How it works</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
