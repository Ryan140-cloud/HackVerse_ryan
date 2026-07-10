'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  FileText,
  Video,
  Book,
  Globe,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { STUDY_TOPICS } from '@/lib/data/study-materials';
import { cn } from '@/lib/utils';

const TYPE_ICON = {
  Course: Video,
  PDF: FileText,
  Book: Book,
  Docs: Globe,
  Blog: BookOpen,
  Practice: ListChecks,
  Guide: Sparkles,
};

const BOOKMARK_KEY = 'hackverse:study-bookmarks:v1';

function readBookmarks() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
  } catch {
    return [];
  }
}
function writeBookmarks(list) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list));
}

export default function StudyHubPage() {
  const [q, setQ] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState(STUDY_TOPICS[0].slug);

  useEffect(() => {
    setBookmarks(readBookmarks());
    setReady(true);
  }, []);

  const toggle = (topicSlug, resource) => {
    const key = `${topicSlug}:${resource.name}`;
    const idx = bookmarks.findIndex((b) => b.key === key);
    const next =
      idx >= 0
        ? bookmarks.filter((_, i) => i !== idx)
        : [{ key, topicSlug, resource }, ...bookmarks];
    setBookmarks(next);
    writeBookmarks(next);
  };

  const isBookmarked = (topicSlug, resource) =>
    bookmarks.some((b) => b.key === `${topicSlug}:${resource.name}`);

  const filteredTopics = useMemo(() => {
    if (!q) return STUDY_TOPICS;
    const needle = q.toLowerCase();
    return STUDY_TOPICS.map((t) => ({
      ...t,
      resources: t.resources.filter(
        (r) =>
          r.name.toLowerCase().includes(needle) ||
          r.type.toLowerCase().includes(needle) ||
          t.title.toLowerCase().includes(needle) ||
          t.tagline.toLowerCase().includes(needle)
      ),
    })).filter((t) => t.resources.length > 0 || t.title.toLowerCase().includes(needle));
  }, [q]);

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Study Hub</div>
        <h1 className="mt-1 font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
          Learn what wins <span className="text-gradient">hackathons</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Curated courses, PDFs, cheat-sheets and mock interviews for every track HackVerse covers.
        </p>
      </motion.div>

      {/* Search + bookmark count */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border bg-card p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search resources, topics, PDFs..."
            className="border-0 bg-transparent pl-9 focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Search study resources"
          />
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <BookmarkCheck className="h-3.5 w-3.5" />
          {ready ? bookmarks.length : 0} bookmarked
        </Badge>
      </div>

      {/* Tabs of topics */}
      <div className="mt-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="h-auto flex-wrap gap-1 bg-muted/50">
            {STUDY_TOPICS.map((t) => (
              <TabsTrigger
                key={t.slug}
                value={t.slug}
                className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-fuchsia-500 data-[state=active]:text-primary-foreground"
              >
                <span>{t.emoji}</span> {t.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredTopics.map((topic) => (
            <TabsContent key={topic.slug} value={topic.slug} className="mt-6">
              <div className="flex flex-col gap-2 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-lg', topic.color)}>
                    {topic.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{topic.title}</h2>
                    <p className="text-sm text-muted-foreground">{topic.tagline}</p>
                  </div>
                </div>
                <Badge variant="outline" className="font-normal">
                  {topic.resources.length} resources
                </Badge>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topic.resources.map((r) => {
                  const Icon = TYPE_ICON[r.type] || Sparkles;
                  const marked = isBookmarked(topic.slug, r);
                  return (
                    <motion.div
                      key={r.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group relative rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white', topic.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <button
                          onClick={() => toggle(topic.slug, r)}
                          aria-label={marked ? 'Remove bookmark' : 'Add bookmark'}
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                            marked
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:border-primary/40 hover:text-primary'
                          )}
                        >
                          {marked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                      </div>
                      <h3 className="mt-3 line-clamp-1 font-semibold">{r.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="font-normal text-[10px]">{r.type}</Badge>
                        <Badge variant="outline" className="font-normal text-[10px]">{r.level}</Badge>
                      </div>
                      <Link
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        Open resource
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Interview quick prep */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ListChecks className="h-4 w-4 text-primary" /> Interview quick-prep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {topic.interviews.map((q) => (
                      <li
                        key={q}
                        className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Bookmarks section */}
      {ready && bookmarks.length > 0 && (
        <div className="mt-12">
          <h2 className="font-[Space_Grotesk] text-2xl font-bold">
            Your <span className="text-gradient">bookmarks</span>
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((b) => (
              <a
                key={b.key}
                href={b.resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="min-w-0">
                  <div className="line-clamp-1 text-sm font-medium">{b.resource.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.resource.type} · {b.topicSlug.toUpperCase()}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
