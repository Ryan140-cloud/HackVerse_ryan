'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Calendar, Trophy, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_STYLES = {
  ongoing: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20',
  upcoming: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
};

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });
  } catch { return d; }
}

export function RecommendationCard({ hackathon, index = 0 }) {
  const score = Math.min(100, Math.round(hackathon.score || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={hackathon.bannerUrl}
          alt={hackathon.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Match badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-fuchsia-500 px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30">
          <Sparkles className="h-3 w-3" />
          {score}% match
        </div>

        <div className="absolute left-3 top-3">
          <Badge
            variant="outline"
            className={cn('border capitalize backdrop-blur-md', STATUS_STYLES[hackathon.status])}
          >
            {hackathon.status === 'ongoing' && (
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            )}
            {hackathon.status}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="line-clamp-1 text-lg font-semibold text-white drop-shadow">
            {hackathon.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-1.5">
          {(hackathon.reasons || []).slice(0, 2).map((r, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="gap-1 border-primary/20 bg-primary/5 text-[10px] font-normal text-primary"
            >
              <Sparkles className="h-2.5 w-2.5" /> {r}
            </Badge>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {formatDate(hackathon.startDate)}
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span className="truncate">{hackathon.prizePool || '\u2014'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            {hackathon.participants?.toLocaleString?.() || 0}
          </div>
        </div>

        <Link
          href={hackathon.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View hackathon
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
