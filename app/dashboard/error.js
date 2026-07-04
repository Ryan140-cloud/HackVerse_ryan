'use client';

import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({ error, reset }) {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-[Space_Grotesk] text-2xl font-bold">Dashboard error</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error?.message || 'Something went wrong.'}</p>
        <Button onClick={reset} className="mt-6 gap-2"><RotateCw className="h-4 w-4" /> Retry</Button>
      </div>
    </div>
  );
}
