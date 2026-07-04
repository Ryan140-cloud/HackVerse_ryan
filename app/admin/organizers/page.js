'use client';

import { useMemo, useState } from 'react';
import { Search, Check, X, Trash2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMIN_ORGANIZERS } from '@/lib/admin/data';

export default function AdminOrganizersPage() {
  const [orgs, setOrgs] = useState(ADMIN_ORGANIZERS);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => orgs.filter((o) =>
    !q || o.name.toLowerCase().includes(q.toLowerCase()) || o.slug.toLowerCase().includes(q.toLowerCase())
  ), [orgs, q]);

  const verify = (id) => {
    setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, verified: !o.verified } : o)));
    toast.success('Verification toggled');
  };
  const remove = (id) => {
    setOrgs((prev) => prev.filter((o) => o.id !== id));
    toast.success('Organizer deleted');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight">Organizers</h1>
        <p className="mt-1 text-sm text-muted-foreground">Approve organizations that publish hackathons on HackVerse.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg">{filtered.length} organizers</CardTitle>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search name or slug" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organizer</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Hackathons</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="font-medium">{o.name}</div>
                    <div className="text-xs text-muted-foreground">/{o.slug}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.ownerEmail}</TableCell>
                  <TableCell><Badge variant="outline" className="font-normal">{o.country}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{o.hackathons}</TableCell>
                  <TableCell>
                    {o.verified ? (
                      <Badge className="gap-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500" onClick={() => verify(o.id)} title={o.verified ? 'Unverify' : 'Verify'}>
                        {o.verified ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(o.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No organizers.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
