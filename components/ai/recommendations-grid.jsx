'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Settings2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RecommendationCard } from './recommendation-card';
import { PreferencesDialog } from './preferences-dialog';
import { usePreferences } from '@/lib/ai/use-preferences';
import { HACKATHONS } from '@/lib/data/hackathons';
import { recommendHackathons } from '@/lib/ai/recommender';

export function RecommendationsGrid({ limit = 6, title = 'For you' }) {
  const { prefs, bookmarks, ready } = usePreferences();
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const recs = useMemo(() => {
    if (!ready) return [];
    return recommendHackathons(HACKATHONS, { ...prefs, bookmarks }, limit);
  }, [prefs, bookmarks, ready, limit, refreshing]);

  if (!ready) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
    );
  }

  const isPersonalised = prefs?.onboarded;

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-[Space_Grotesk] text-2xl font-bold">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isPersonalised
                ? 'AI picks based on your skills, preferences and bookmarks.'
                : 'Set your preferences to unlock personalised recommendations.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRefreshing((v) => !v);
            }}
            className="gap-2"
          >
            <RotateCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500"
          >
            <Settings2 className="h-3.5 w-3.5" />
            {isPersonalised ? 'Update preferences' : 'Personalise'}
          </Button>
        </div>
      </div>

      {!isPersonalised && (
        <div className="mt-6 rounded-2xl border border-dashed bg-primary/5 p-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h3 className="mt-3 text-lg font-semibold">
            Unlock AI recommendations
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Tell us your skills, favourite tech and experience level.
            We&apos;ll rank every hackathon by how well it matches you.
          </p>
          <Button
            onClick={() => setOpen(true)}
            className="mt-4 bg-gradient-to-r from-primary to-fuchsia-500"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Get started
          </Button>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recs.map((h, i) => (
          <RecommendationCard key={h.id} hackathon={h} index={i} />
        ))}
      </div>

      <PreferencesDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
