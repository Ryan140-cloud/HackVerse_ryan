import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="container py-24">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-pink-500/10 p-10 md:p-16">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative flex flex-col items-center text-center">
          <Sparkles className="h-8 w-8 text-primary" />
          <h2 className="mt-4 font-[Space_Grotesk] text-3xl font-bold md:text-5xl">
            Ready to find your next{' '}
            <span className="text-gradient">victory</span>?
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Join thousands of students already using HackVerse to discover,
            track and win at hackathons around the world.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-gradient-to-r from-primary to-fuchsia-500 px-8 text-primary-foreground hover:opacity-90"
            >
              <Link href="/explore">
                Explore Hackathons <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8">
              <Link href="/about">Learn more</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
