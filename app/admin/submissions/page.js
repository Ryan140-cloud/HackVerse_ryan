'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Check,
  X,
  Trash2,
  ExternalLink,
  Inbox,
  RefreshCw,
} from 'lucide-react';
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

const STATUS_OPTIONS = ['all', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED'];

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return String(d); }
}

export default function AdminSubmissionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/submissions', { cache: 'no-store' });
      const j = await r.json();
      setRows(j.items || []);
    } catch (e) {
      toast.error('Could not load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((h) => {
      if (status !== 'all' && h.status !== status) return false;
      if (!q) return true;
      const needle = q.toLowerCase();
      return (
        h.title.toLowerCase().includes(needle) ||
        (h.location || '').toLowerCase().includes(needle) ||
        (h.organizer?.name || '').toLowerCase().includes(needle)
      );
    });
  }, [rows, q, status]);

  const counts = useMemo(() => ({
    PENDING: rows.filter((h) => h.status === 'PENDING').length,
    APPROVED: rows.filter((h) => h.status === 'APPROVED').length,
    REJECTED: rows.filter((h) => h.status === 'REJECTED').length,
  }), [rows]);

  const setStatusOnRow = async (id, action, msg) => {
    // Optimistic update.
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(msg);
    } catch {
      toast.error('Something went wrong — reloading');
      load();
    }
  };

  const remove = async (id) => {
    const original = rows;
    setRows((prev) => prev.filter((r) => r.id !== id));
    try {
      const res = await fetch(`/api/admin/submissions?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Deleted');
    } catch {
      setRows(original);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Moderation</div>
          <h1 className="mt-1 font-[Space_Grotesk] text-3xl font-bold tracking-tight">Community submissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Approve, reject and manage user-submitted hackathons.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={load}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s === status ? 'all' : s)}
            className={`rounded-2xl border bg-card p-4 text-left transition-colors ${status === s ? 'border-primary' : 'hover:border-primary/40'}`}
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{s}</span>
              <StatusPill status={s} />
            </div>
            <div className="mt-2 text-3xl font-bold">{counts[s]}</div>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg">{filtered.length} {filtered.length === 1 ? 'submission' : 'submissions'}</CardTitle>
          <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search title, organizer, city..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s === 'all' ? 'All status' : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading && rows.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">Loading submissions…</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No submissions match</p>
              <p className="mt-1 text-xs text-muted-foreground">Community-submitted hackathons will appear here for moderation.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hackathon</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted</TableHead>
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
                          {h.bannerUrl && (
                            <Image src={h.bannerUrl} alt={h.title} fill sizes="56px" className="object-cover" unoptimized />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="line-clamp-1 text-sm font-medium">{h.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{h.location} · {h.mode}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {h.organizer?.name || '—'}
                    </TableCell>
                    <TableCell><Badge variant="outline" className="font-normal">{h.category?.name || 'Uncategorized'}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fmtDate(h.createdAt)}</TableCell>
                    <TableCell><StatusPill status={h.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <a href={h.sourceUrl} target="_blank" rel="noopener noreferrer" title="Open source">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-500 hover:text-emerald-600"
                          onClick={() => setStatusOnRow(h.id, 'APPROVED', 'Approved')}
                          title="Approve"
                          disabled={h.status === 'APPROVED'}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-500 hover:text-amber-600"
                          onClick={() => setStatusOnRow(h.id, 'REJECTED', 'Rejected')}
                          title="Reject"
                          disabled={h.status === 'REJECTED'}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm('Permanently delete this submission?')) remove(h.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Tip: users can submit hackathons via the public{' '}
        <Link href="/submit" className="text-primary underline underline-offset-4">Submit</Link>
        {' '}page. Approved entries appear on the Explore page immediately.
      </p>
    </div>
  );
}
