'use client';

import { motion } from 'framer-motion';
import { STATS } from '@/lib/data/hackathons';

export function Stats() {
  return (
    <section className="border-y bg-muted/30">
      <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="text-center"
          >
            <div className="text-3xl font-bold md:text-4xl">
              <span className="text-gradient">{s.value}</span>
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
