'use client';

import { useState } from 'react';
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { siteConfig } from '@/lib/config/site';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Message sent! We\u2019ll get back to you soon.');
      e.currentTarget.reset();
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    { icon: Mail, title: 'Email', value: siteConfig.contact.email },
    { icon: MessageSquare, title: 'Discord', value: siteConfig.contact.discord },
    { icon: MapPin, title: 'HQ', value: siteConfig.address.display },
  ];

  return (
    <div>
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">Contact</Badge>
          <h1 className="font-[Space_Grotesk] text-5xl font-bold tracking-tight md:text-6xl">
            Let&apos;s <span className="text-gradient">talk</span>.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Reach {siteConfig.founder.name} and the {siteConfig.name} team directly \u2014 we reply to every message.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {contactCards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="flex items-start gap-4 rounded-2xl border bg-card p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.title}</div>
                    <div className="mt-1 font-medium">{c.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-card p-6 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Ada Lovelace" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@school.edu" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="What\u2019s this about?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={6} placeholder="Tell us more..." required />
            </div>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-fuchsia-500">
              {loading ? 'Sending...' : (<>Send message <Send className="ml-2 h-4 w-4" /></>)}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
