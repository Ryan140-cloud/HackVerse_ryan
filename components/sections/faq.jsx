'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQS } from '@/lib/data/hackathons';
import { SectionHeader } from './section-header';

export function FAQ() {
  return (
    <section className="border-y bg-muted/20">
      <div className="container py-20">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          gradientWord="questions"
          description="Everything you need to know before your next hackathon."
        />
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border bg-card px-5"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
