'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { useApp } from '@/components/providers/AppProvider';
import { AuthService } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isReady, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!AuthService.isAdmin(user)) {
      router.replace('/login?redirect=/admin');
    }
  }, [isReady, user, router]);

  if (!isReady || !AuthService.isAdmin(user)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Verifying admin access…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      {children}
    </div>
  );
}
