'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function ResetPasswordInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      toast.success('Password updated. Sign in with your new password.');
      router.push('/signin');
    } catch (err) {
      toast.error(err.message);
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
        <h1 className="mt-6 text-center font-[Space_Grotesk] text-3xl font-bold">Choose a new password</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Must be at least 8 characters.</p>

        {!token ? (
          <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
            Missing or invalid token. Please request a new reset link.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-fuchsia-500">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset password'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-muted-foreground">Loading…</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
