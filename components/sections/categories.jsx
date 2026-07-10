'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { CATEGORIES as FALLBACK_CATEGORIES } from '@/lib/data/hackathons';

export function Categories() {
  const [cats, setCats] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/categories', { cache: 'no-store' });
        const j = await r.json();
        if (!cancelled && j.items?.length) {
          // Merge live counts on top of local emoji/color from fallback so we
          // never lose styling if a category was renamed in the DB.
          const merged = j.items.map((c) => {
            const fb = FALLBACK_CATEGORIES.find((x) => x.slug === c.slug);
            return { ...fb, ...c };
          });
          setCats(merged);
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="container py-16 md:py-20">
      <SectionHeader
        eyebrow="Browse"
        title="Find your category"
        gradientWord="category"
        description="Explore hackathons across the industries and technologies you love."
      />
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cats.map((c, i) => (
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
                className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br ${c.color || 'from-primary to-fuchsia-500'}`}
                style={{ opacity: 0.08 }}
              />
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color || 'from-primary to-fuchsia-500'} text-2xl shadow-lg`}
              >
                {c.emoji || '✨'}
              </div>
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.count} {c.count === 1 ? 'event' : 'events'}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
