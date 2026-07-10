'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Trophy,
  Tags,
  Building2,
  ScrollText,
  Shield,
  Rocket,
  Inbox,
  Menu,
  LogOut,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  getDemoRole,
  enableDemoAdmin,
  disableDemoAdmin,
} from '@/lib/admin/session';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/hackathons', label: 'Hackathons', icon: Trophy },
  { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/organizers', label: 'Organizers', icon: Building2 },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/audit-logs', label: 'Audit logs', icon: ScrollText },
  { href: '/admin/roles', label: 'Roles & permissions', icon: Shield },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((l) => {
        const Icon = l.icon;
        const active = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href));
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-gradient-to-r from-primary/15 to-fuchsia-500/15 text-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className={cn('h-4 w-4', active ? 'text-primary' : '')} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [demoRole, setDemoRole] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDemoRole(getDemoRole());
  }, []);

  const user = session?.user;
  const activeRole = user?.role || demoRole || 'ADMIN';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2 border-b px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-pink-500 text-white">
            <Rocket className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold">HackVerse</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin console</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks pathname={pathname} />
        </div>
        <div className="space-y-2 border-t p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
              <Shield className="h-3 w-3" /> {activeRole}
            </Badge>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Signed in as {user?.email || 'demo·admin'}
          </div>
          {!user && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                disableDemoAdmin();
                setDemoRole(null);
                router.push('/');
              }}
            >
              Exit demo
            </Button>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-16 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="mt-8">
                  <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" /> Back to site
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="mr-1 h-4 w-4" /> Sign out
              </Button>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
