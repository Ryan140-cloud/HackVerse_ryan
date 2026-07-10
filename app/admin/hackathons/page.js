'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Search, Check, X, Trash2, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusPill } from '@/components/admin/ui';
import { ADMIN_HACKATHONS } from '@/lib/admin/data';

export default function AdminHackathonsPage() {
  const [rows, setRows] = useState(ADMIN_HACKATHONS);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return rows.filter((h) => {
      if (status !== 'all' && h.reviewStatus !== status) return false;
      if (!q) return true;
      const needle = q.toLowerCase();
      return (
        h.title.toLowerCase().includes(needle) ||
        h.source.toLowerCase().includes(needle) ||
        h.location.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, status]);

  const update = (id, patch, msg) => {
    setRows((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
    toast.success(msg);
  };

  const remove = (id) => {
    setRows((prev) => prev.filter((h) => h.id !== id));
    toast.success('Hackathon deleted');
  };

  const counts = useMemo(() => ({
    APPROVED: rows.filter((h) => h.reviewStatus === 'APPROVED').length,
    PENDING: rows.filter((h) => h.reviewStatus === 'PENDING').length,
    REJECTED: rows.filter((h) => h.reviewStatus === 'REJECTED').length,
  }), [rows]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight">Hackathons</h1>
        <p className="mt-1 text-sm text-muted-foreground">Approve submissions, edit metadata, remove spam.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {['APPROVED', 'PENDING', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s === status ? 'all' : s)}
            className={`rounded-2xl border bg-card p-4 text-left transition-colors ${status === s ? 'border-primary' : 'hover:border-primary/40'}`}
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{s}</span><StatusPill status={s} /></div>
            <div className="mt-2 text-3xl font-bold">{counts[s]}</div>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg">{filtered.length} events</CardTitle>
          <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search title, source, city..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hackathon</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Submitted by</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image src={h.bannerUrl} alt={h.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="line-clamp-1 text-sm font-medium">{h.title}</div>
                        <div className="text-xs text-muted-foreground">{h.location} · {h.mode}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="font-normal">{h.source}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{h.submittedBy}<div className="text-[10px]">{h.submittedAt}</div></TableCell>
                  <TableCell><StatusPill status={h.reviewStatus} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <a href={h.sourceUrl} target="_blank" rel="noopener noreferrer" title="Open source">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-600" onClick={() => update(h.id, { reviewStatus: 'APPROVED' }, 'Approved')} title="Approve">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-600" onClick={() => update(h.id, { reviewStatus: 'REJECTED' }, 'Rejected')} title="Reject">
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(h.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">No hackathons match.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
