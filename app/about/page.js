'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Target, Heart, Rocket, Users, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config/site';

const VALUES = [
  { icon: Target, title: 'Focus', desc: 'We remove the noise so you can focus on shipping ideas that matter.' },
  { icon: Heart, title: 'Student-first', desc: 'Built by students, for students. Every design decision starts with your late-night hack.' },
  { icon: Rocket, title: 'Ship fast', desc: 'From discovery to submission, we compress the timeline so you can move at the speed of curiosity.' },
  { icon: Users, title: 'Community', desc: 'A place to find teammates, mentors and rivals \u2014 the fuel behind every great hack.' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="container relative py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/5 text-primary">
              About {siteConfig.name}
            </Badge>
            <h1 className="mx-auto max-w-3xl font-[Space_Grotesk] text-5xl font-bold tracking-tight md:text-6xl">
              We&apos;re building the{' '}
              <span className="text-gradient">home of hackathons</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {siteConfig.name} started as a spreadsheet passed around a college WhatsApp group in {siteConfig.founded}. Today it&apos;s a full-stack platform indexing thousands of hackathons from every corner of the internet \u2014 built and led by {siteConfig.founder.name} from {siteConfig.address.display}.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-primary" /> HQ \u00B7 {siteConfig.address.display}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border bg-card p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[Space_Grotesk] text-4xl font-bold">
              Meet the <span className="text-gradient">crew</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Led by <span className="font-medium text-foreground">{siteConfig.founder.name}</span> \u2014 a tiny team of builders, hackers and designers who spend their weekends at hackathons, just like you.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {siteConfig.team.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`rounded-2xl border p-6 text-center ${i === 0 ? 'bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-pink-500/10 border-primary/30' : 'bg-card'}`}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-fuchsia-500/20 text-4xl">
                  {t.emoji}
                </div>
                <h3 className="mt-4 font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.role}</p>
                {i === 0 && (
                  <Badge className="mt-3 border-0 bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground">
                    {siteConfig.founder.role}
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-pink-500/10 p-10 md:p-16">
          <div className="relative flex flex-col items-center text-center">
            <h2 className="font-[Space_Grotesk] text-3xl font-bold md:text-4xl">Come build with us</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">We&apos;re early. If you love hackathons, we&apos;d love to talk.</p>
            <Button asChild size="lg" className="mt-6 bg-gradient-to-r from-primary to-fuchsia-500">
              <Link href="/contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
