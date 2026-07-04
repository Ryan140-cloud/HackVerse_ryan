'use client';

import { useMemo, useState } from 'react';
import { Search, MoreHorizontal, ShieldCheck, ShieldOff, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusPill } from '@/components/admin/ui';
import { ADMIN_USERS } from '@/lib/admin/data';

function initials(name = '', email = '') {
  return (name || email).split(/\s+|@/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!q) return true;
      const needle = q.toLowerCase();
      return u.name.toLowerCase().includes(needle) || u.email.toLowerCase().includes(needle);
    });
  }, [users, q, roleFilter]);

  const setRole = (id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    toast.success(`Role updated to ${role}`);
  };

  const suspend = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u)));
    toast.success('User status updated');
  };

  const remove = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success('User deleted');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage roles, suspend accounts and audit member activity.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg">{filtered.length} members</CardTitle>
          <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ORGANIZER">Organizer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Hackathons</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatar || ''} alt={u.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-fuchsia-500 text-xs text-white">
                          {initials(u.name, u.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{u.role}</Badge>
                  </TableCell>
                  <TableCell><StatusPill status={u.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.location}</TableCell>
                  <TableCell className="text-right text-sm">{u.hackathons}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setRole(u.id, 'ADMIN')}>
                          <UserCog className="mr-2 h-4 w-4" /> Make admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRole(u.id, 'ORGANIZER')}>
                          <UserCog className="mr-2 h-4 w-4" /> Make organizer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRole(u.id, 'USER')}>
                          <UserCog className="mr-2 h-4 w-4" /> Set to user
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => suspend(u.id)}>
                          {u.status === 'suspended' ? (<><ShieldCheck className="mr-2 h-4 w-4" /> Reactivate</>) : (<><ShieldOff className="mr-2 h-4 w-4" /> Suspend</>)}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => remove(u.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No users match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
