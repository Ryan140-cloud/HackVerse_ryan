'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ADMIN_CATEGORIES } from '@/lib/admin/data';

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState(ADMIN_CATEGORIES);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', emoji: '', slug: '' });

  const beginCreate = () => {
    setEditing(null);
    setForm({ name: '', emoji: '', slug: '' });
    setOpen(true);
  };
  const beginEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, emoji: c.emoji, slug: c.slug });
    setOpen(true);
  };
  const submit = () => {
    if (!form.name || !form.slug) return toast.error('Name and slug required');
    if (editing) {
      setCats((prev) => prev.map((c) => (c.slug === editing.slug ? { ...c, ...form } : c)));
      toast.success('Category updated');
    } else {
      setCats((prev) => [...prev, { ...form, count: 0, color: 'from-primary to-fuchsia-500', createdAt: new Date().toISOString().slice(0, 10), approved: true }]);
      toast.success('Category created');
    }
    setOpen(false);
  };
  const remove = (slug) => {
    setCats((prev) => prev.filter((c) => c.slug !== slug));
    toast.success('Category deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Curate topical buckets shown across HackVerse.</p>
        </div>
        <Button onClick={beginCreate} className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500">
          <Plus className="h-4 w-4" /> New category
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cats.map((c) => (
          <Card key={c.slug} className="transition-colors hover:border-primary/40">
            <CardContent className="p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color || 'from-primary to-fuchsia-500'} text-2xl shadow-lg`}>
                {c.emoji}
              </div>
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">/{c.slug}</p>
              <p className="mt-3 text-xs text-muted-foreground">{c.count} events</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="gap-1" onClick={() => beginEdit(c)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => remove(c.slug)}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit category' : 'New category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Robotics" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="robotics" />
            </div>
            <div className="space-y-1.5">
              <Label>Emoji</Label>
              <Input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} placeholder="\uD83E\uDD16" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} className="bg-gradient-to-r from-primary to-fuchsia-500">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
