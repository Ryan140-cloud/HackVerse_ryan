'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Bookmark,
  Trophy,
  Bell,
  Compass,
  Settings2,
  Activity,
  User,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RecommendationsGrid } from '@/components/ai/recommendations-grid';
import { PreferencesDialog } from '@/components/ai/preferences-dialog';
import { HackathonListItem } from '@/components/hackathon-list-item';
import { HACKATHONS } from '@/lib/data/hackathons';
import { usePreferences } from '@/lib/ai/use-preferences';

const NOTIFICATIONS = [
  {
    id: 'n1',
    icon: Trophy,
    text: 'HackNYU Summer Sprint is live!',
    time: '2h ago',
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    id: 'n2',
    icon: Bell,
    text: 'Registration closes in 24h for Hack the Future 2025.',
    time: '5h ago',
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    id: 'n3',
    icon: Sparkles,
    text: '3 new AI hackathons match your profile.',
    time: 'yesterday',
    color: 'text-primary bg-primary/10',
  },
];

function daysUntil(date) {
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const { prefs, bookmarks, activity, ready } = usePreferences();
  const [prefsOpen, setPrefsOpen] = useState(false);

  const upcoming = useMemo(() => {
    return [...HACKATHONS]
      .filter((h) => h.status === 'upcoming')
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 4);
  }, []);

  // Profile completion: 20% per filled section.
  const completion = useMemo(() => {
    if (!ready) return 0;
    let c = 20; // account exists
    if (prefs.name) c += 20;
    if (prefs.skills?.length) c += 20;
    if (prefs.technologies?.length) c += 20;
    if (prefs.categories?.length) c += 20;
    return c;
  }, [prefs, ready]);

  const displayName = prefs.name || 'Builder';

  const monthDays = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    return { cells, month: now.toLocaleString('en-US', { month: 'long' }), year: y, today: now.getDate() };
  }, []);

  const eventsThisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const set = new Set();
    HACKATHONS.forEach((h) => {
      const s = new Date(h.startDate);
      if (s.getFullYear() === y && s.getMonth() === m) set.add(s.getDate());
    });
    return set;
  }, []);

  if (!ready) {
    return (
      <div className="container py-10">
        <Skeleton className="h-10 w-64" />
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mt-8 h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
      >
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Dashboard
          </div>
          <h1 className="mt-1 font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
            Welcome back, <span className="text-gradient">{displayName}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your hackathon co-pilot has picked out {6} events for you today.
          </p>
        </div>
        <Button onClick={() => setPrefsOpen(true)} className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500">
          <Settings2 className="h-4 w-4" /> Edit preferences
        </Button>
      </motion.div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Compass}
          label="Upcoming"
          value={upcoming.length}
          hint="in the next 30 days"
          gradient="from-primary to-fuchsia-500"
        />
        <StatCard
          icon={Bookmark}
          label="Bookmarks"
          value={bookmarks.length}
          hint="saved for later"
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={Bell}
          label="Notifications"
          value={NOTIFICATIONS.length}
          hint="unread"
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={Activity}
          label="Activity"
          value={activity.length}
          hint="recent actions"
          gradient="from-blue-500 to-indigo-500"
        />
      </div>

      {/* AI Recommendations */}
      <div className="mt-12">
        <RecommendationsGrid limit={6} title="Recommended for you" />
      </div>

      {/* Two-column: upcoming + sidebar (calendar, notifications, profile) */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {/* Upcoming */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" /> Upcoming hackathons
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/explore?status=upcoming">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map((h, i) => (
                <HackathonListItem key={h.id} hackathon={h} index={i} />
              ))}
            </CardContent>
          </Card>

          {/* Bookmarks */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bookmark className="h-5 w-5 text-primary" /> Saved hackathons
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookmarks.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                  <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">No bookmarks yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bookmark any hackathon and it will show up here.
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-4">
                    <Link href="/explore">Explore hackathons</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.slice(0, 4).map((h, i) => (
                    <HackathonListItem key={h.id} hackathon={h} index={i} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" /> Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing yet \u2014 explore hackathons and bookmarks to build your feed.
                </p>
              ) : (
                <ul className="space-y-2">
                  {activity.slice(0, 6).map((a, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="capitalize">{a.action}</span>
                      {a.meta?.title && (
                        <span className="text-muted-foreground">\u00b7 {a.meta.title}</span>
                      )}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(a.at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" /> Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-semibold">{completion}%</span>
              </div>
              <Progress value={completion} className="mt-2" />
              <ul className="mt-4 space-y-2 text-xs">
                <ProfileItem done={!!prefs.name} label="Add your name" />
                <ProfileItem done={!!prefs.skills?.length} label="Pick your skills" />
                <ProfileItem done={!!prefs.technologies?.length} label="Choose favourite tech" />
                <ProfileItem done={!!prefs.categories?.length} label="Select categories" />
              </ul>
              <Button
                onClick={() => setPrefsOpen(true)}
                size="sm"
                className="mt-4 w-full bg-gradient-to-r from-primary to-fuchsia-500"
              >
                Complete profile
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" /> Notifications
              </CardTitle>
              <Badge variant="secondary" className="font-normal">
                {NOTIFICATIONS.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {NOTIFICATIONS.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/40"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">{n.text}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {n.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                {monthDays.month} {monthDays.year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {monthDays.cells.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const isToday = d === monthDays.today;
                  const hasEvent = eventsThisMonth.has(d);
                  return (
                    <div
                      key={i}
                      className={`relative flex h-8 items-center justify-center rounded-md text-xs ${
                        isToday
                          ? 'bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground'
                          : hasEvent
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {d}
                      {hasEvent && !isToday && (
                        <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" />
                {eventsThisMonth.size} hackathons this month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <PreferencesDialog open={prefsOpen} onOpenChange={setPrefsOpen} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border bg-card p-5"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </motion.div>
  );
}

function ProfileItem({ done, label }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          done ? 'bg-gradient-to-r from-primary to-fuchsia-500 text-white' : 'border'
        }`}
      >
        {done && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-2.5 w-2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className={done ? 'text-muted-foreground line-through' : ''}>{label}</span>
    </li>
  );
}
