'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Users, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return d;
  }
}

const STATUS_STYLES = {
  ongoing:
    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  upcoming:
    'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20',
  ended: 'bg-muted text-muted-foreground border-border',
};

export function HackathonCard({ hackathon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Card className="group h-full overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={hackathon.bannerUrl}
            alt={hackathon.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                'border capitalize backdrop-blur-md',
                STATUS_STYLES[hackathon.status]
              )}
            >
              {hackathon.status === 'ongoing' && (
                <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              )}
              {hackathon.status}
            </Badge>
            <Badge className="border-0 bg-black/50 text-white backdrop-blur-md">
              {hackathon.source}
            </Badge>
          </div>
          {hackathon.featured && (
            <Badge className="absolute right-3 top-3 border-0 bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground">
              Featured
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="line-clamp-2 text-lg font-semibold text-white drop-shadow-md">
              {hackathon.title}
            </h3>
          </div>
        </div>

        <CardContent className="p-5">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {hackathon.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{formatDate(hackathon.startDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">{hackathon.location}</span>
            </div>
            {hackathon.prizePool && (
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">{hackathon.prizePool}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>{hackathon.participants.toLocaleString()} joined</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {hackathon.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="font-normal text-[10px]"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <Link
            href={hackathon.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View details
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
