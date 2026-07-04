'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, Inbox } from 'lucide-react';
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
import { HackathonListItem } from '@/components/hackathon-list-item';
import { ViewToggle } from '@/components/view-toggle';
import { HackathonPagination } from '@/components/hackathon-pagination';
import { getActive, SOURCES, MODES, CATEGORIES } from '@/lib/data/hackathons';

const PAGE_SIZE = 6;

const SORTS = [
  { value: 'ending-soon', label: 'Ending soon' },
  { value: 'soonest', label: 'Starting soon' },
  { value: 'prize', label: 'Highest prize' },
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
];

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Live data \u2014 refreshes on tab focus / every 60s to catch state changes.
  const [active, setActive] = useState(() => getActive());
  useEffect(() => {
    const refresh = () => setActive(getActive());
    refresh();
    const onFocus = () => refresh();
    const t = setInterval(refresh, 60_000);
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(t); window.removeEventListener('focus', onFocus); };
  }, []);

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [source, setSource] = useState(searchParams.get('source') || 'all');
  const [mode, setMode] = useState('all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('ending-soon');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [q, status, source, mode, category, sort]);

  const filtered = useMemo(() => {
    let list = active.filter((h) => {
      if (status !== 'all' && h.status !== status) return false;
      if (source !== 'all' && h.source !== source) return false;
      if (mode !== 'all' && h.mode !== mode) return false;
      if (category !== 'all' && h.category !== category) return false;
      if (q) {
        const needle = q.toLowerCase();
        const hay = `${h.title} ${h.description} ${h.tags.join(' ')} ${h.themes.join(' ')} ${h.location}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    switch (sort) {
      case 'ending-soon':
        list.sort((a, b) => a._registerMs - b._registerMs);
        break;
      case 'soonest':
        list.sort((a, b) => a._startMs - b._startMs);
        break;
      case 'prize':
        list.sort((a, b) => (b.prizeValue || 0) - (a.prizeValue || 0));
        break;
      case 'popular':
        list.sort((a, b) => b.participants - a.participants);
        break;
      case 'newest':
        list.sort((a, b) => b._startMs - a._startMs);
        break;
      default:
        break;
    }
    return list;
  }, [active, q, status, source, mode, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clear = () => {
    setQ(''); setStatus('all'); setSource('all'); setMode('all'); setCategory('all'); setSort('ending-soon');
    router.replace('/explore');
  };

  const activeFilters = [
    status !== 'all' && { key: 'status', value: status, reset: () => setStatus('all') },
    source !== 'all' && { key: 'source', value: source, reset: () => setSource('all') },
    mode !== 'all' && { key: 'mode', value: mode, reset: () => setMode('all') },
    category !== 'all' && {
      key: 'category',
      value: CATEGORIES.find((c) => c.slug === category)?.name || category,
      reset: () => setCategory('all'),
    },
  ].filter(Boolean);

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <div className="container py-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
              Explore <span className="text-gradient">hackathons</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              {active.length} active events across {SOURCES.length} trusted sources — always current.
            </p>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                category === 'all' ? 'bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground border-transparent' : 'bg-card hover:border-primary/40'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  category === c.slug ? 'bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground border-transparent' : 'bg-card hover:border-primary/40'
                }`}
              >
                <span className="mr-1">{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border bg-card p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, tag, theme, city..." className="pl-9" aria-label="Search hackathons" />
            </div>

            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[130px]" aria-label="Status filter"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All active</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>

              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-[130px]" aria-label="Source filter"><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="w-[130px]" aria-label="Mode filter"><SelectValue placeholder="Mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All modes</SelectItem>
                  {MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
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
                <Badge key={f.key} variant="secondary" className="gap-1.5 capitalize">
                  {f.key}: {f.value}
                  <button aria-label={`Remove ${f.key} filter`} onClick={f.reset}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> of {active.length}
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[170px]" aria-label="Sort order"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <ViewToggle value={view} onChange={setView} />
            </div>
          </div>

          <div className="mt-6">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-16 text-center">
                <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No active hackathons found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try clearing filters or check back soon \u2014 new events are indexed hourly.
                </p>
                <Button className="mt-6" variant="outline" onClick={clear}>Reset filters</Button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginated.map((h, i) => <HackathonCard key={h.id} hackathon={h} index={i} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paginated.map((h, i) => <HackathonListItem key={h.id} hackathon={h} index={i} />)}
              </div>
            )}

            <HackathonPagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
