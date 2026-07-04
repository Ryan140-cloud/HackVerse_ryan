'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Github, Loader2, Mail, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.75h3.56c2.08-1.92 3.28-4.74 3.28-8.08Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.75c-.99.66-2.26 1.06-3.72 1.06-2.86 0-5.28-1.93-6.14-4.52H2.2v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.86 14.13a6.6 6.6 0 0 1 0-4.26V7.03H2.2a11 11 0 0 0 0 9.94l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.2 7.03l3.66 2.84C6.72 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const oauth = async (provider) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      toast.error(`${provider} sign-in is not configured yet.`);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn('credentials', { email, password, redirect: false, callbackUrl });
      if (res?.error) {
        toast.error('Invalid email or password.');
      } else if (res?.ok) {
        toast.success('Welcome back!');
        router.push(callbackUrl);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl shadow-primary/5"
      >
        <Link href="/" className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white">
          <Rocket className="h-5 w-5" />
        </Link>
        <h1 className="mt-6 text-center font-[Space_Grotesk] text-3xl font-bold">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to your <span className="text-gradient font-medium">HackVerse</span> account
        </p>

        <div className="mt-8 space-y-2">
          <Button variant="outline" className="w-full gap-2" onClick={() => oauth('google')} disabled={loading}>
            <GoogleIcon className="h-4 w-4" /> Continue with Google
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={() => oauth('github')} disabled={loading}>
            <Github className="h-4 w-4" /> Continue with GitHub
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or continue with email <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@school.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-fuchsia-500">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Mail className="mr-2 h-4 w-4" /> Sign in</>)}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to HackVerse?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-muted-foreground">Loading\u2026</div>}>
      <SignInInner />
    </Suspense>
  );
}
