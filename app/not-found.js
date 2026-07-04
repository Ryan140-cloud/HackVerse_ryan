'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute inset-0 bg-radial-fade" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative container max-w-2xl text-center"
      >
        <div className="text-[8rem] font-black leading-none tracking-tighter md:text-[12rem]">
          <span className="text-gradient">404</span>
        </div>
        <h1 className="font-[Space_Grotesk] text-3xl font-bold md:text-4xl">
          Lost in the multiverse
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          This page doesn’t exist — or maybe it moved to a parallel
          timeline. Let’s get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-gradient-to-r from-primary to-fuchsia-500"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Back home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/explore">
              <Compass className="mr-2 h-4 w-4" /> Explore hackathons
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
