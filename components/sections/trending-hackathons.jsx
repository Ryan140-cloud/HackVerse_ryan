'use client';

import Link from 'next/link';
import { Flame, ArrowRight, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { HackathonCard } from '@/components/hackathon-card';
import { getTrending } from '@/lib/data/hackathons';

export function TrendingHackathons() {
  const trending = getTrending(new Date(), 8);

  return (
    <section className="container py-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight md:text-4xl">
              Trending <span className="text-gradient">this week</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The hackathons everyone is signing up for right now.
            </p>
          </div>
        </div>
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/explore">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {trending.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed bg-card p-10 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">No trending hackathons right now</p>
          <p className="mt-1 text-sm text-muted-foreground">
            New events are indexed hourly \u2014 the feed will refresh shortly.
          </p>
        </div>
      ) : (
        <ScrollArea className="mt-8 w-full">
          <div className="flex gap-6 pb-4">
            {trending.map((h, i) => (
              <div key={h.id} className="w-[320px] shrink-0 md:w-[360px]">
                <HackathonCard hackathon={h} index={i} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </section>
  );
}
