import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Verify email \u2014 HackVerse' };

export default function VerifyEmailPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-xl shadow-primary/5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white">
          <MailCheck className="h-5 w-5" />
        </div>
        <h1 className="mt-6 font-[Space_Grotesk] text-3xl font-bold">Check your inbox</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We&apos;ve sent a verification link to your email. Click it to activate your
          HackVerse account.
        </p>
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link href="/signin">Back to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
