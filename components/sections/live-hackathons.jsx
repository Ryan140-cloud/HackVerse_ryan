'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radio, ArrowRight, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HackathonCard } from '@/components/hackathon-card';

export function LiveHackathons() {
  const [live, setLive] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch('/api/ongoing', { cache: 'no-store' });
        const j = await r.json();
        if (!cancelled) setLive((j.items || []).slice(0, 3));
      } catch {
        if (!cancelled) setLive([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  return (
    <section className="border-y bg-muted/20">
      <div className="container py-16 md:py-20">
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
                Join in — these hackathons are happening as you read this.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/explore?status=ongoing">
              All live events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? null : live.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed bg-card p-10 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No hackathons are live at this second</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon or explore upcoming events.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/explore?status=upcoming">See upcoming</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {live.map((h, i) => (
              <HackathonCard key={h.id} hackathon={h} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
