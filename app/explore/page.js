'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { CATEGORIES, SOURCES, MODES } from '@/lib/data/hackathons';

const PAGE_SIZE = 9;

const SORTS = [
  { value: 'ending-soon', label: 'Ending soon' },
  { value: 'soonest', label: 'Starting soon' },
  { value: 'prize', label: 'Highest prize' },
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
];

const STATUS_OPTIONS = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'upcoming', label: 'Upcoming' },
];

// Small chip toggle used for multi-select filters.
function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-transparent bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground'
          : 'bg-card hover:border-primary/40'
      }`}
    >
      {children}
    </button>
  );
}

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function parseCsv(v) {
  if (!v) return [];
  return v.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // -------- Filter state (all arrays support multi-select) -----------------
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [categories, setCategories] = useState(parseCsv(searchParams.get('category')));
  const [statuses, setStatuses] = useState(parseCsv(searchParams.get('status')));
  const [sources, setSources] = useState(parseCsv(searchParams.get('source')));
  const [modes, setModes] = useState(parseCsv(searchParams.get('mode')));
  const [sort, setSort] = useState(searchParams.get('sort') || 'ending-soon');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalActive, setTotalActive] = useState(0);

  // Reset page whenever filters change.
  useEffect(() => {
    setPage(1);
  }, [q, categories, statuses, sources, modes, sort]);

  // ---------------------------- Fetch --------------------------------------
  const buildQuery = useCallback(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (categories.length) p.set('category', categories.join(','));
    if (statuses.length) p.set('status', statuses.join(','));
    if (sources.length) p.set('source', sources.join(','));
    if (modes.length) p.set('mode', modes.join(','));
    if (sort) p.set('sort', sort);
    return p.toString();
  }, [q, categories, statuses, sources, modes, sort]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const qs = buildQuery();
        const r = await fetch(`/api/hackathons${qs ? `?${qs}` : ''}`, {
          cache: 'no-store',
        });
        const j = await r.json();
        if (!cancelled) setItems(j.items || []);
      } catch (e) {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    // Debounce a touch for the search text to avoid hammering.
    const t = setTimeout(load, q ? 220 : 0);
    return () => { cancelled = true; clearTimeout(t); };
  }, [buildQuery, q]);

  // Total active count (unfiltered) for the header text.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/hackathons', { cache: 'no-store' });
        const j = await r.json();
        if (!cancelled) setTotalActive(j.count || 0);
      } catch {
        /* ignore */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Keep the URL in sync with filters (shareable links).
  useEffect(() => {
    const qs = buildQuery();
    router.replace(`/explore${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [buildQuery, router]);

  // ---------------------------- Derived ------------------------------------
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginated = useMemo(
    () => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [items, page]
  );

  const clear = () => {
    setQ('');
    setCategories([]);
    setStatuses([]);
    setSources([]);
    setModes([]);
    setSort('ending-soon');
  };

  const activeCount =
    categories.length + statuses.length + sources.length + modes.length + (q ? 1 : 0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <div className="container py-8 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
              Explore <span className="text-gradient">hackathons</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              {totalActive} active events across {SOURCES.length} trusted sources — always current.
            </p>
          </motion.div>

          {/* Category chips — multi-select */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Chip
              active={categories.length === 0}
              onClick={() => setCategories([])}
            >
              All
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.slug}
                active={categories.includes(c.slug)}
                onClick={() => setCategories(toggleInArray(categories, c.slug))}
              >
                <span className="mr-1">{c.emoji}</span>
                {c.name}
              </Chip>
            ))}
          </div>

          {/* Search + status + source + mode + reset */}
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border bg-card p-3 md:p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, tag, theme, city..."
                className="pl-9"
                aria-label="Search hackathons"
              />
            </div>
            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              <MultiSelect
                label="Status"
                options={STATUS_OPTIONS}
                values={statuses}
                onToggle={(v) => setStatuses(toggleInArray(statuses, v))}
                onClear={() => setStatuses([])}
              />
              <MultiSelect
                label="Source"
                options={SOURCES.map((s) => ({ value: s, label: s }))}
                values={sources}
                onToggle={(v) => setSources(toggleInArray(sources, v))}
                onClear={() => setSources([])}
              />
              <MultiSelect
                label="Mode"
                options={MODES.map((m) => ({ value: m, label: m }))}
                values={modes}
                onToggle={(v) => setModes(toggleInArray(modes, v))}
                onClear={() => setModes([])}
              />
              <Button variant="outline" onClick={clear} className="gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          {/* Active filter pills */}
          {activeCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active:</span>
              {q && (
                <Badge variant="secondary" className="gap-1.5">
                  q: {q}
                  <button aria-label="Clear search" onClick={() => setQ('')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {categories.map((slug) => {
                const c = CATEGORIES.find((x) => x.slug === slug);
                return (
                  <Badge key={`cat-${slug}`} variant="secondary" className="gap-1.5">
                    {c?.emoji} {c?.name || slug}
                    <button
                      aria-label={`Remove ${slug}`}
                      onClick={() => setCategories(categories.filter((x) => x !== slug))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              {statuses.map((s) => (
                <Badge key={`st-${s}`} variant="secondary" className="gap-1.5 capitalize">
                  {s}
                  <button
                    aria-label={`Remove ${s}`}
                    onClick={() => setStatuses(statuses.filter((x) => x !== s))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {sources.map((s) => (
                <Badge key={`src-${s}`} variant="secondary" className="gap-1.5">
                  {s}
                  <button
                    aria-label={`Remove ${s}`}
                    onClick={() => setSources(sources.filter((x) => x !== s))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {modes.map((m) => (
                <Badge key={`m-${m}`} variant="secondary" className="gap-1.5">
                  {m}
                  <button
                    aria-label={`Remove ${m}`}
                    onClick={() => setModes(modes.filter((x) => x !== m))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Result count + sort + view */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{items.length}</span>{' '}
              {items.length === 1 ? 'result' : 'results'}
              {totalActive > 0 && ` of ${totalActive}`}
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[170px]" aria-label="Sort order">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ViewToggle value={view} onChange={setView} />
            </div>
          </div>

          {/* Results */}
          <div className="mt-6">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-2xl border bg-card" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-16 text-center">
                <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No hackathons match your filters</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try clearing filters or check back soon — new events are indexed hourly.
                </p>
                <Button className="mt-6" variant="outline" onClick={clear}>
                  Reset filters
                </Button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginated.map((h, i) => (
                  <HackathonCard key={h.id} hackathon={h} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paginated.map((h, i) => (
                  <HackathonListItem key={h.id} hackathon={h} index={i} />
                ))}
              </div>
            )}

            <HackathonPagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Multi-value dropdown built on the shadcn Select primitive shell.
// (We can't use raw <Select> for multi-select — this custom popover fits the
// existing style.)
// ---------------------------------------------------------------------------
function MultiSelect({ label, options, values, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const summary = values.length === 0 ? label : `${label} · ${values.length}`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-[130px] items-center justify-between rounded-md border bg-background px-3 text-sm font-medium hover:border-primary/40"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{summary}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 z-50 mt-2 w-52 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
            role="listbox"
          >
            {options.map((o) => {
              const checked = values.includes(o.value);
              return (
                <button
                  type="button"
                  key={o.value}
                  onClick={() => onToggle(o.value)}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  role="option"
                  aria-selected={checked}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      checked
                        ? 'border-primary bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground'
                        : 'border-input'
                    }`}
                  >
                    {checked && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="h-2.5 w-2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 text-left capitalize">{o.label}</span>
                </button>
              );
            })}
            {values.length > 0 && (
              <>
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  onClick={onClear}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent"
                >
                  <X className="h-3 w-3" /> Clear all
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
