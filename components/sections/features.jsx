'use client';

import { motion } from 'framer-motion';
import { Bell, Filter, Globe, Layers, Trophy, Zap } from 'lucide-react';
import { SectionHeader } from './section-header';

const FEATURES = [
  { icon: Globe, title: 'Every source, one feed', desc: 'Devpost, Devfolio, MLH, Unstop and more — unified into a single, searchable stream.' },
  { icon: Filter, title: 'Smart filters', desc: 'Drill down by mode, tags, prize pool, deadline or region in a single click.' },
  { icon: Bell, title: 'Never miss a deadline', desc: 'Personalised alerts before the registration window slams shut on you.' },
  { icon: Trophy, title: 'Track your wins', desc: 'Bookmark, categorise and showcase every hackathon you have shipped in.' },
  { icon: Layers, title: 'Team up faster', desc: 'Discover teammates and mentors filtered by skills, availability and interests.' },
  { icon: Zap, title: 'Lightning fast', desc: 'Next.js 15 App Router, edge-cached data, and a UI tuned for late-night sprints.' },
];

export function Features() {
  return (
    <section id="features" className="container py-20">
      <SectionHeader
        eyebrow="Features"
        title="Built for students who ship"
        gradientWord="ship"
        description="Everything you need to find the next hackathon, form a team and walk away with a prize."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
