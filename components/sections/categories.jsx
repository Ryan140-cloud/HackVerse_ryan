'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/data/hackathons';
import { SectionHeader } from './section-header';

export function Categories() {
  return (
    <section className="container py-20">
      <SectionHeader
        eyebrow="Browse"
        title="Find your category"
        gradientWord="category"
        description="Explore hackathons across the industries and technologies you love."
      />
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
          >
            <Link
              href={`/explore?category=${c.slug}`}
              className="group relative block overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div
                className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br ${c.color}`}
                style={{ opacity: 0.08 }}
              />
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-2xl shadow-lg`}
              >
                {c.emoji}
              </div>
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.count} events
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
