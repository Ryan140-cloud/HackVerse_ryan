'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sidebar } from '@/components/sidebar';
import { HackathonCard } from '@/components/hackathon-card';
import { HACKATHONS, SOURCES, MODES } from '@/lib/data/hackathons';

export default function ExplorePage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [source, setSource] = useState('all');
  const [mode, setMode] = useState('all');

  const filtered = useMemo(() => {
    return HACKATHONS.filter((h) => {
      if (status !== 'all' && h.status !== status) return false;
      if (source !== 'all' && h.source !== source) return false;
      if (mode !== 'all' && h.mode !== mode) return false;
      if (q) {
        const needle = q.toLowerCase();
        const hay = `${h.title} ${h.description} ${h.tags.join(' ')} ${h.themes.join(' ')} ${h.location}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, status, source, mode]);

  const clear = () => {
    setQ('');
    setStatus('all');
    setSource('all');
    setMode('all');
  };

  const activeFilters = [
    status !== 'all' && { key: 'status', value: status },
    source !== 'all' && { key: 'source', value: source },
    mode !== 'all' && { key: 'mode', value: mode },
  ].filter(Boolean);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="container py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
              Explore <span className="text-gradient">hackathons</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              {HACKATHONS.length} events indexed across {SOURCES.length}{' '}
              trusted sources.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border bg-card p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, tag, theme, city..."
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  {SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All modes</SelectItem>
                  {MODES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clear} className="gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active:</span>
              {activeFilters.map((f) => (
                <Badge
                  key={f.key}
                  variant="secondary"
                  className="gap-1.5 capitalize"
                >
                  {f.key}: {f.value}
                  <button
                    onClick={() => {
                      if (f.key === 'status') setStatus('all');
                      if (f.key === 'source') setSource('all');
                      if (f.key === 'mode') setMode('all');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="mt-8">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">
                {filtered.length}
              </span>{' '}
              of {HACKATHONS.length}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-16 text-center">
                <p className="text-lg font-medium">No hackathons match.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try clearing filters or searching for a different keyword.
                </p>
                <Button className="mt-6" variant="outline" onClick={clear}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((h, i) => (
                  <HackathonCard key={h.id} hackathon={h} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
