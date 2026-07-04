'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="container max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-[Space_Grotesk] text-3xl font-bold">
          Something broke.
        </h1>
        <p className="mt-3 text-muted-foreground">
          {error?.message ||
            'An unexpected error occurred. Try again — or head home.'}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => reset()}
            className="bg-gradient-to-r from-primary to-fuchsia-500"
          >
            <RotateCw className="mr-2 h-4 w-4" /> Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
