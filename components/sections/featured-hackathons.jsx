'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HackathonCard } from '@/components/hackathon-card';
import { HACKATHONS } from '@/lib/data/hackathons';

export function FeaturedHackathons() {
  const featured = HACKATHONS.filter((h) => h.featured).slice(0, 6);

  return (
    <section className="container py-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight md:text-4xl">
              Featured <span className="text-gradient">headliners</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked hackathons with the biggest crowds and prize pools.
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/explore">
            See all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((h, i) => (
          <HackathonCard key={h.id} hackathon={h} index={i} />
        ))}
      </div>
    </section>
  );
}
