'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radio, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HackathonCard } from '@/components/hackathon-card';
import { HACKATHONS } from '@/lib/data/hackathons';

export function LiveHackathons() {
  const live = HACKATHONS.filter((h) => h.status === 'ongoing').slice(0, 3);

  return (
    <section className="border-y bg-muted/20">
      <div className="container py-20">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <Radio className="h-5 w-5" />
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-xl bg-emerald-500/30"
              />
            </div>
            <div>
              <h2 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight md:text-4xl">
                <span className="text-emerald-500">Live</span> right now
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Join in \u2014 these hackathons are happening as you read this.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/explore?status=ongoing">
              All live events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {live.map((h, i) => (
            <HackathonCard key={h.id} hackathon={h} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
