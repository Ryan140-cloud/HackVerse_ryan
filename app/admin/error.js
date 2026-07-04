'use client';

import { AlertTriangle, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminError({ error, reset }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="container max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-[Space_Grotesk] text-2xl font-bold">Admin console error</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message || 'Something went wrong loading this page.'}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset} className="gap-2"><RotateCw className="h-4 w-4" /> Retry</Button>
          <Button asChild variant="outline"><Link href="/admin">Back to overview</Link></Button>
        </div>
      </div>
    </div>
  );
}
