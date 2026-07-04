'use client';

import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { PERMISSIONS } from '@/lib/rbac';

const ROLE_META = [
  { key: 'USER', label: 'User', desc: 'Default role for students.', icon: Shield, gradient: 'from-blue-500 to-indigo-500' },
  { key: 'ORGANIZER', label: 'Organizer', desc: 'Can list & manage own hackathons.', icon: ShieldCheck, gradient: 'from-emerald-500 to-teal-500' },
  { key: 'ADMIN', label: 'Admin', desc: 'Full moderation + platform access.', icon: ShieldAlert, gradient: 'from-primary to-fuchsia-500' },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight">Roles & permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">The single source of truth for what each role can do.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {ROLE_META.map((r) => {
          const Icon = r.icon;
          const count = PERMISSIONS.filter((p) => p[r.key]).length;
          return (
            <Card key={r.key}>
              <CardContent className="p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${r.gradient} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="font-semibold">{r.label}</h3>
                  <Badge variant="secondary" className="font-normal">{count}/{PERMISSIONS.length}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permissions matrix</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                {ROLE_META.map((r) => <TableHead key={r.key} className="text-center">{r.label}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSIONS.map((p) => (
                <TableRow key={p.key}>
                  <TableCell>
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.key}</div>
                  </TableCell>
                  {ROLE_META.map((r) => (
                    <TableCell key={r.key} className="text-center">
                      {p[r.key] ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
