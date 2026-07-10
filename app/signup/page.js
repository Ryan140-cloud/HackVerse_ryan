'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Github, Loader2, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      toast.success('Account created — signing you in…');
      const login = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (login?.ok) router.push('/dashboard');
      else router.push('/signin');
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
        <h1 className="mt-6 text-center font-[Space_Grotesk] text-3xl font-bold">
          Join <span className="text-gradient">HackVerse</span>
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Free forever for students. No credit card required.
        </p>

        <div className="mt-8 space-y-2">
          <Button variant="outline" className="w-full gap-2" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            <Sparkles className="h-4 w-4" /> Sign up with Google
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={() => signIn('github', { callbackUrl: '/dashboard' })}>
            <Github className="h-4 w-4" /> Sign up with GitHub
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or use email <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={change('name')} placeholder="Ada Lovelace" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={change('email')} placeholder="you@school.edu" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" minLength={8} value={form.password} onChange={change('password')} placeholder="At least 8 characters" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-fuchsia-500">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/signin" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          By continuing you agree to our{' '}
          <Link href="/terms" className="underline">Terms</Link> and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
}
