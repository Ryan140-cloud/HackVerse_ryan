'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/lib/data/hackathons';
import { SectionHeader } from './section-header';

export function Testimonials() {
  return (
    <section className="container py-20">
      <SectionHeader
        eyebrow="Loved by students"
        title="From the community"
        gradientWord="community"
        description="Hear from the students, builders and founders who use HackVerse."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
          >
            <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />
            <div className="flex items-center gap-1 text-yellow-500">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              \u201C{t.quote}\u201D
            </p>
            <div className="mt-6 flex items-center gap-3 border-t pt-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/20">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
