import Link from 'next/link';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Access denied · HackVerse' };

export default function AccessDeniedPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-xl shadow-primary/5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <ShieldOff className="h-5 w-5" />
        </div>
        <h1 className="mt-6 font-[Space_Grotesk] text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You need an admin role to view this area. Ask a HackVerse administrator
          to promote your account.
        </p>
        <Button asChild className="mt-6 w-full bg-gradient-to-r from-primary to-fuchsia-500">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
