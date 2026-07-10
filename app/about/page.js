'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Heart, Rocket, Users, ArrowRight, MapPin, Github, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config/site';

const VALUES = [
  { icon: Target, title: 'Focus', desc: 'We remove the noise so you can focus on shipping ideas that matter.' },
  { icon: Heart, title: 'Student-first', desc: 'Built by students, for students. Every design decision starts with your late-night hack.' },
  { icon: Rocket, title: 'Ship fast', desc: 'From discovery to submission, we compress the timeline so you can move at the speed of curiosity.' },
  { icon: Users, title: 'Community', desc: 'A place to find teammates, mentors and rivals — the fuel behind every great hack.' },
];

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/Ryan140-cloud' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/ryan-sharma-bb459b2a2' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/?utm_source=pwa_homescreen&__pwa=1' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="container relative py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/5 text-primary">
              About {siteConfig.name}
            </Badge>
            <h1 className="mx-auto max-w-3xl font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-6xl">
              We&apos;re building the <span className="text-gradient">home of hackathons</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              {siteConfig.name} started as a spreadsheet passed around a college WhatsApp group in {siteConfig.founded}. Today it&apos;s a full-stack platform indexing thousands of hackathons — built and led by {siteConfig.founder.name} from {siteConfig.address.display}.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-primary" /> HQ · {siteConfig.address.display}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container pb-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border bg-card p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Founder spotlight - single card, no fake team */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[Space_Grotesk] text-3xl font-bold md:text-4xl">
              Meet the <span className="text-gradient">founder</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              HackVerse is a one-person mission — for now. Made in Ambala Cantt.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-10 max-w-md rounded-3xl border bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-pink-500/10 p-8 text-center shadow-xl shadow-primary/10"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-fuchsia-500 to-pink-500 text-4xl font-bold text-white shadow-lg shadow-primary/30">
              RS
            </div>
            <h3 className="mt-5 text-2xl font-bold">Ryan Sharma</h3>
            <p className="text-sm font-medium text-primary">Founder &amp; CEO</p>
            <p className="mt-1 text-sm text-muted-foreground">Full-stack Developer · Founder of HackVerse</p>

            <div className="mt-6 flex justify-center gap-3">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/80 text-muted-foreground backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-16">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-pink-500/10 p-8 md:p-14">
          <div className="relative flex flex-col items-center text-center">
            <h2 className="font-[Space_Grotesk] text-2xl font-bold md:text-4xl">Come build with us</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              If you love hackathons, we&apos;d love to talk.
            </p>
            <Button asChild size="lg" className="mt-6 bg-gradient-to-r from-primary to-fuchsia-500">
              <Link href="/contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
