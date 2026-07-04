'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Users, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_STYLES = {
  ongoing: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  upcoming: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20',
  ended: 'bg-muted text-muted-foreground border-border',
};

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return d; }
}

export function HackathonListItem({ hackathon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="group flex flex-col gap-4 rounded-2xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 md:flex-row md:items-center"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted md:h-32 md:w-56">
        <Image
          src={hackathon.bannerUrl}
          alt={hackathon.title}
          fill
          sizes="(max-width: 768px) 100vw, 224px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2">
          <Badge
            variant="outline"
            className={cn('border capitalize backdrop-blur-md text-[10px]', STATUS_STYLES[hackathon.status])}
          >
            {hackathon.status === 'ongoing' && (
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            )}
            {hackathon.status}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-0 bg-primary/10 text-primary hover:bg-primary/20">
            {hackathon.source}
          </Badge>
          {hackathon.featured && (
            <Badge className="border-0 bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground">
              Featured
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            by {hackathon.organizer}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-1 text-lg font-semibold">
          {hackathon.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {hackathon.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {formatDate(hackathon.startDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {hackathon.location}
          </span>
          {hackathon.prizePool && (
            <span className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              {hackathon.prizePool}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            {hackathon.participants.toLocaleString()}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Link
        href={hackathon.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 md:self-center"
      >
        View <ArrowUpRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
