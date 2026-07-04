'use client';

import { useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AUDIT_LOGS } from '@/lib/admin/data';

const ACTION_STYLES = {
  APPROVE: 'bg-emerald-500/10 text-emerald-500',
  CREATE: 'bg-blue-500/10 text-blue-500',
  UPDATE: 'bg-primary/10 text-primary',
  REJECT: 'bg-amber-500/10 text-amber-500',
  SUSPEND: 'bg-destructive/10 text-destructive',
  VERIFY: 'bg-emerald-500/10 text-emerald-500',
  CRAWL: 'bg-indigo-500/10 text-indigo-500',
  DEDUPE: 'bg-fuchsia-500/10 text-fuchsia-500',
};

export default function AdminAuditLogsPage() {
  const [q, setQ] = useState('');
  const [action, setAction] = useState('all');

  const filtered = useMemo(() => AUDIT_LOGS.filter((l) => {
    if (action !== 'all' && l.action !== action) return false;
    if (!q) return true;
    const needle = q.toLowerCase();
    return l.actor.toLowerCase().includes(needle) || l.entity.toLowerCase().includes(needle) || l.target.toLowerCase().includes(needle);
  }), [q, action]);

  const actions = Array.from(new Set(AUDIT_LOGS.map((l) => l.action)));

  const download = () => {
    const header = 'timestamp,actor,action,entity,target\n';
    const rows = filtered.map((l) => `${l.at},${l.actor},${l.action},${l.entity},${l.target}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackverse-audit-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight">Audit logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every privileged action is traced and immutable.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg">{filtered.length} events</CardTitle>
          <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search actor, entity, target" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {actions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={download} className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="relative ml-3 border-l border-border">
            {filtered.map((l) => (
              <li key={l.id} className="mb-6 ml-6">
                <span className="absolute -left-[7px] mt-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`border-0 font-normal ${ACTION_STYLES[l.action] || 'bg-muted'}`}>{l.action}</Badge>
                  <span className="text-sm font-medium">{l.entity}</span>
                  <span className="text-sm text-muted-foreground">\u00b7 {l.target}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>By {l.actor}</span>
                  <span>{new Date(l.at).toLocaleString()}</span>
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No events match.</p>
            )}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
