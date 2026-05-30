'use client';

import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { getRoleLabel } from '@/lib/role-utils';

export function AdminNav() {
  const { user, signOut } = useApp();

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xl font-bold text-white">
              PromoCard Admin
            </Link>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
              Operations
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-slate-300">
                {user.name} · {getRoleLabel(user.role)}
              </span>
            )}
            <Link href="/" className="text-sm text-slate-300 hover:text-white transition">
              View user site
            </Link>
            <Link href="/builder" className="text-sm text-slate-300 hover:text-white transition">
              Card builder
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-sm text-slate-400 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
