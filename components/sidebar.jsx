'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Home,
  Flame,
  Calendar,
  Trophy,
  Bookmark,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/explore?status=ongoing', label: 'Ongoing', icon: Flame, badge: 'Live' },
  { href: '/explore?status=upcoming', label: 'Upcoming', icon: Calendar },
  { href: '/explore?tag=Winners', label: 'Winners', icon: Trophy },
  { href: '/explore?saved=1', label: 'Saved', icon: Bookmark },
];

export function Sidebar({ className }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden lg:flex sticky top-16 h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground',
        className
      )}
    >
      <ScrollArea className="flex-1 py-6">
        <div className="px-4 pb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Discover
        </div>
        <nav className="flex flex-col gap-1 px-2">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href.split('?')[0] &&
              link.href.split('?')[0] === pathname;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{link.label}</span>
                {link.badge && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/15 text-primary hover:bg-primary/20"
                  >
                    {link.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-4 pb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sources
        </div>
        <div className="px-2">
          {['Devpost', 'Devfolio', 'MLH', 'Unstop'].map((src) => (
            <Link
              key={src}
              href={`/explore?source=${src}`}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-fuchsia-500" />
              {src}
            </Link>
          ))}
        </div>

        <div className="mt-8 px-2">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </div>
      </ScrollArea>
    </aside>
  );
}
