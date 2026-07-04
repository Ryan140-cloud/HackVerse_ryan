import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Privacy Policy — HackVerse',
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-20">
      <Badge
        variant="outline"
        className="mb-4 border-primary/30 bg-primary/5 text-primary"
      >
        Legal
      </Badge>
      <h1 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
        Privacy <span className="text-gradient">Policy</span>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: June 1, 2025
      </p>

      <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
        <p className="text-muted-foreground">
          HackVerse (“we”, “us”, “our”) respects your privacy. This
          Privacy Policy explains what we collect, how we use it, and the
          choices you have.
        </p>

        {[
          {
            h: '1. Information we collect',
            p: 'We collect only what we need to run HackVerse: your email if you subscribe, basic analytics on which pages you visit, and hackathon preferences you save. We do not sell your data — ever.',
          },
          {
            h: '2. How we use it',
            p: 'To surface the right hackathons to you, to remind you of deadlines, and to make HackVerse faster and easier to use. Aggregated stats may be shared with partner organizers.',
          },
          {
            h: '3. Cookies',
            p: 'We use privacy-respecting analytics and a single functional cookie to remember your theme preference. No third-party advertising trackers.',
          },
          {
            h: '4. Third-party sources',
            p: 'HackVerse aggregates public information from platforms like Devpost, Devfolio, MLH and Unstop. Their content remains subject to their own terms.',
          },
          {
            h: '5. Your rights',
            p: 'You can request export or deletion of any personal data at any time by emailing privacy@hackverse.dev.',
          },
          {
            h: '6. Changes',
            p: 'We’ll post any material changes here and, when possible, notify you by email.',
          },
        ].map((s) => (
          <section key={s.h} className="mt-8">
            <h2 className="text-xl font-semibold">{s.h}</h2>
            <p className="mt-2 text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
