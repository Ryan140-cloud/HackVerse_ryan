import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config/site';

export const metadata = { title: 'Terms of Service — HackVerse' };

export default function TermsPage() {
  const sections = [
    { h: '1. Acceptance of terms', p: `By accessing ${siteConfig.name} you agree to these Terms. If you do not agree, please do not use the service.` },
    { h: '2. The service', p: `${siteConfig.name} aggregates publicly available hackathon information from third-party platforms. We do not organize or endorse the listed events unless explicitly stated.` },
    { h: '3. Accounts', p: 'Some features may require an account. You are responsible for keeping your credentials safe and for all activity under your account.' },
    { h: '4. Acceptable use', p: 'Don’t abuse the service: no scraping our data, no attempting to break auth, no submitting misleading listings. We may suspend accounts that do.' },
    { h: '5. Intellectual property', p: `${siteConfig.name} branding, code and design are owned by ${siteConfig.owner}. Listed hackathon content remains the property of the respective organizers.` },
    { h: '6. Disclaimer', p: 'The service is provided “as is”. We work hard to keep listings accurate but cannot guarantee they are error-free. Always verify details on the organizer’s official page.' },
    { h: '7. Governing law', p: `These Terms are governed by the laws of India, with jurisdiction of the courts of ${siteConfig.address.display}.` },
    { h: '8. Contact', p: `Questions about these Terms? Email ${siteConfig.contact.legalEmail}.` },
  ];

  return (
    <div className="container max-w-3xl py-20">
      <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">Legal</Badge>
      <h1 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
        Terms of <span className="text-gradient">Service</span>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: June 1, 2025</p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-semibold">{s.h}</h2>
            <p className="mt-2 text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
