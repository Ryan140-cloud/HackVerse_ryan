'use client';

import { Users, Trophy, Building2, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AdminStatCard } from '@/components/admin/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ANALYTICS,
  ADMIN_USERS,
  ADMIN_HACKATHONS,
  ADMIN_ORGANIZERS,
  AUDIT_LOGS,
} from '@/lib/admin/data';

export default function AdminOverview() {
  const pending = ADMIN_HACKATHONS.filter((h) => h.reviewStatus === 'PENDING').length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Admin console
        </div>
        <h1 className="mt-1 font-[Space_Grotesk] text-3xl font-bold tracking-tight md:text-4xl">
          Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Snapshot of every metric that matters, refreshed hourly.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard icon={Users} label="Total users" value={ADMIN_USERS.length + '+'} hint="across roles" delta={12} index={0} />
        <AdminStatCard icon={Trophy} label="Hackathons" value={ADMIN_HACKATHONS.length} hint={`${pending} pending review`} delta={8} gradient="from-amber-500 to-orange-500" index={1} />
        <AdminStatCard icon={Building2} label="Organizers" value={ADMIN_ORGANIZERS.length} hint="5 verified" delta={3} gradient="from-emerald-500 to-teal-500" index={2} />
        <AdminStatCard icon={Activity} label="Audit events" value={AUDIT_LOGS.length} hint="in the last week" delta={-4} gradient="from-blue-500 to-indigo-500" index={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4 text-primary" /> User growth
            </CardTitle>
            <Badge variant="secondary" className="font-normal">Last 6 months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS.usersOverTime}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(262 83% 58%)"
                    strokeWidth={2}
                    fill="url(#userGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-4 w-4 text-primary" /> Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ANALYTICS.hackathonsBySource}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {ANALYTICS.hackathonsBySource.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {ANALYTICS.hackathonsBySource.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registrations by category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS.registrationsByCategory}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#barGradient)" />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(262 83% 58%)" />
                    <stop offset="100%" stopColor="hsl(320 83% 58%)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
