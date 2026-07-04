'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AdminStatCard({
  icon: Icon,
  label,
  value,
  delta,
  hint,
  gradient = 'from-primary to-fuchsia-500',
  index = 0,
}) {
  const positive = typeof delta === 'number' ? delta >= 0 : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="rounded-2xl border bg-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        {delta !== undefined && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
              positive
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-destructive/10 text-destructive'
            )}
          >
            {positive ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <div className="mt-4 text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium">{label}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}

export function StatusPill({ status }) {
  const map = {
    active: 'bg-emerald-500/10 text-emerald-500',
    APPROVED: 'bg-emerald-500/10 text-emerald-500',
    verified: 'bg-emerald-500/10 text-emerald-500',
    PENDING: 'bg-amber-500/10 text-amber-500',
    pending: 'bg-amber-500/10 text-amber-500',
    REJECTED: 'bg-destructive/10 text-destructive',
    suspended: 'bg-destructive/10 text-destructive',
    ARCHIVED: 'bg-muted text-muted-foreground',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize', map[status] || 'bg-muted text-muted-foreground')}>
      {status?.toLowerCase()}
    </span>
  );
}
