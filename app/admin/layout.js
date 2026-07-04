import { AdminShell } from '@/components/admin/admin-shell';
import { AdminGate } from '@/components/admin/admin-gate';

export const metadata = {
  title: 'Admin \u00B7 HackVerse',
};

export default function AdminLayout({ children }) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
