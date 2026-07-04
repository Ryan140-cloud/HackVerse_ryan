'use client';

import { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AVAILABLE_SKILLS,
  AVAILABLE_TECH,
  EXPERIENCE_LEVELS,
} from '@/lib/ai/recommender';
import { CATEGORIES } from '@/lib/data/hackathons';
import { usePreferences } from '@/lib/ai/use-preferences';
import { cn } from '@/lib/utils';

export function PreferencesDialog({ open, onOpenChange, showTrigger = false }) {
  const { prefs, save, ready } = usePreferences();
  const [local, setLocal] = useState(prefs);

  useEffect(() => {
    if (open) setLocal(prefs);
  }, [open, prefs]);

  if (!ready) return null;

  const toggle = (key, value) => {
    setLocal((p) => {
      const arr = p[key] || [];
      return {
        ...p,
        [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value],
      };
    });
  };

  const submit = () => {
    save({ ...local, onboarded: true });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>Tell us about your builder DNA</DialogTitle>
              <DialogDescription>
                We&apos;ll use this to hand-pick hackathons \u2014 you can change it anytime.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your name (optional)</Label>
            <Input
              id="name"
              value={local.name || ''}
              onChange={(e) => setLocal((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ada Lovelace"
            />
          </div>

          <div className="space-y-3">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SKILLS.map((s) => {
                const active = local.skills?.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggle('skills', s)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors capitalize',
                      active
                        ? 'border-transparent bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground'
                        : 'hover:border-primary/40'
                    )}
                  >
                    {active && <Check className="mr-1 inline h-3 w-3" />}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Preferred technologies</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TECH.map((t) => {
                const active = local.technologies?.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggle('technologies', t)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-transparent bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground'
                        : 'hover:border-primary/40'
                    )}
                  >
                    {active && <Check className="mr-1 inline h-3 w-3" />}
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Experience level</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {EXPERIENCE_LEVELS.map((lvl) => {
                const active = local.experience === lvl.value;
                return (
                  <button
                    key={lvl.value}
                    type="button"
                    onClick={() => setLocal((p) => ({ ...p, experience: lvl.value }))}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-all',
                      active
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/40'
                    )}
                  >
                    <div className="font-semibold">{lvl.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {lvl.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Favourite categories</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = local.categories?.includes(c.slug);
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => toggle('categories', c.slug)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-transparent bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground'
                        : 'hover:border-primary/40'
                    )}
                  >
                    <span>{c.emoji}</span>
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Skip for now
          </Button>
          <Button
            onClick={submit}
            className="bg-gradient-to-r from-primary to-fuchsia-500"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Save & personalise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
