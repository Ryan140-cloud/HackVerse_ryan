'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function HackathonPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const range = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - range && i <= page + range)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </Button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="px-2 text-muted-foreground">
            \u2026
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              'h-9 w-9 rounded-md text-sm font-medium transition-colors',
              p === page
                ? 'bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground'
                : 'border bg-card hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {p}
          </button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="gap-1"
      >
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
