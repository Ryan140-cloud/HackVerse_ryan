import Link from 'next/link';
import { Rocket, Github, Twitter, Linkedin, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/config/site';

export function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: [
        { href: '/explore', label: 'Explore' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/#features', label: 'Features' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy' },
        { href: '/terms', label: 'Terms' },
      ],
    },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-pink-500 text-white">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">
                Hack<span className="text-gradient">Verse</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>HQ: {siteConfig.address.display}</span>
            </div>
            <div className="mt-6 flex gap-3">
              {[
                { href: siteConfig.socials.github, icon: Github, label: 'GitHub' },
                { href: siteConfig.socials.twitter, icon: Twitter, label: 'Twitter' },
                { href: siteConfig.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {siteConfig.copyright(year)}
          </p>
          <p className="text-xs text-muted-foreground">
            Crafted by {siteConfig.founder.name} \u00B7 {siteConfig.address.display}
          </p>
        </div>
      </div>
    </footer>
  );
}
