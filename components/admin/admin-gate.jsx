'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDemoRole, enableDemoAdmin } from '@/lib/admin/session';

export function AdminGate({ children }) {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(getDemoRole());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (role !== 'ADMIN') {
    return (
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-xl shadow-primary/5"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="mt-6 font-[Space_Grotesk] text-2xl font-bold">
            Admin console
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The full auth database is on the way. Unlock demo access from this
            browser to preview the admin panel.
          </p>
          <Button
            onClick={() => {
              enableDemoAdmin();
              setRole('ADMIN');
            }}
            className="mt-6 w-full bg-gradient-to-r from-primary to-fuchsia-500"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Unlock demo admin
          </Button>
          <p className="mt-4 text-[11px] text-muted-foreground">
            When Neon Postgres and Auth.js credentials are provisioned, this gate
            switches to real role-based access.
          </p>
        </motion.div>
      </div>
    );
  }

  return children;
}
