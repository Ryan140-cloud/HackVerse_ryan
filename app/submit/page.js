'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const CATEGORIES = ['ai-ml', 'web3', 'fintech', 'healthtech', 'climate', 'gaming', 'hardware', 'space'];
const MODES = ['ONLINE', 'HYBRID', 'OFFLINE'];

export default function SubmitHackathonPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    sourceUrl: '',
    location: 'Online',
    mode: 'ONLINE',
    startDate: '',
    endDate: '',
    registerBy: '',
    prizePool: '',
    category: 'ai-ml',
    organizer: '',
    bannerUrl: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const change = (k) => (e) => setForm((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      if (data.duplicate) {
        toast.warning('A hackathon with a similar title already exists — we’ll double-check before publishing.');
      } else {
        toast.success('Submitted! An admin will review shortly.');
      }
      router.push('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">Submit</Badge>
        <h1 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
          Submit a <span className="text-gradient">hackathon</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Organizing an event? Fill in the details below. Every submission enters <span className="font-medium text-foreground">Pending</span> status and is reviewed by an admin.
        </p>
      </motion.div>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" required value={form.title} onChange={change('title')} placeholder="e.g. Hack the Planet 2026" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" required rows={4} value={form.description} onChange={change('description')} placeholder="What's the hackathon about, who is it for, what can participants build?" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sourceUrl">Official URL *</Label>
            <Input id="sourceUrl" required type="url" value={form.sourceUrl} onChange={change('sourceUrl')} placeholder="https://" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="organizer">Organizer *</Label>
            <Input id="organizer" required value={form.organizer} onChange={change('organizer')} placeholder="Your organization name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={form.location} onChange={change('location')} placeholder="Online · City, Country" />
          </div>
          <div className="space-y-1.5">
            <Label>Mode</Label>
            <Select value={form.mode} onValueChange={change('mode')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="startDate">Start date *</Label>
            <Input id="startDate" required type="date" value={form.startDate} onChange={change('startDate')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="endDate">End date *</Label>
            <Input id="endDate" required type="date" value={form.endDate} onChange={change('endDate')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="registerBy">Registration deadline</Label>
            <Input id="registerBy" type="date" value={form.registerBy} onChange={change('registerBy')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prizePool">Prize pool</Label>
            <Input id="prizePool" value={form.prizePool} onChange={change('prizePool')} placeholder="$25,000 or ₹10 Lakhs" />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={change('category')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={form.tags} onChange={change('tags')} placeholder="AI, LLM, Beginner Friendly" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="bannerUrl">Banner image URL</Label>
            <Input id="bannerUrl" type="url" value={form.bannerUrl} onChange={change('bannerUrl')} placeholder="https://... (paste a public image URL for now)" />
            <p className="text-xs text-muted-foreground">Direct upload is coming next — for now, paste a public image URL.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3" />
            Duplicate detection is automatic — you’ll be told if a similar event already exists.
          </p>
          <Button type="submit" disabled={loading} className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Submit for review</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
