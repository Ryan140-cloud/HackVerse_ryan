'use client';

import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ViewToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border bg-card p-1">
      <button
        onClick={() => onChange('grid')}
        aria-label="Grid view"
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
          value === 'grid'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange('list')}
        aria-label="List view"
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
          value === 'list'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
