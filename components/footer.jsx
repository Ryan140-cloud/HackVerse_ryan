import Link from 'next/link';
import { Rocket, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: [
        { href: '/explore', label: 'Explore' },
        { href: '/#features', label: 'Features' },
        { href: '/#sources', label: 'Sources' },
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
              The single dashboard for every hackathon that matters. Discover,
              track and win — without tab-hopping.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: '#', icon: Github, label: 'GitHub' },
                { href: '#', icon: Twitter, label: 'Twitter' },
                { href: '#', icon: Linkedin, label: 'LinkedIn' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
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
            © {year} HackVerse. Built for students who ship.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ and a lot of caffeine.
          </p>
        </div>
      </div>
    </footer>
  );
}
