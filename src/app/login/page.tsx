'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { User } from '@/lib/types';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/builder';
  const { signInAsRole } = useApp();

  const handleSignIn = (role: User['role']) => {
    signInAsRole(role);
    if (role === 'admin') {
      router.push(redirect.startsWith('/admin') ? redirect : '/admin');
      return;
    }
    router.push(redirect === '/admin' ? '/builder' : redirect);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            PromoCard
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600 text-sm mb-8">
            Demo sign-in for user and admin roles. Admin changes apply across the app after you save in the dashboard.
          </p>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User accounts</p>
            <button
              type="button"
              onClick={() => handleSignIn('free')}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <span className="font-semibold text-gray-900 block">Free user</span>
              <span className="text-sm text-gray-600">Basic templates, watermark, 5 cards/mo</span>
            </button>
            <button
              type="button"
              onClick={() => handleSignIn('pro')}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <span className="font-semibold text-gray-900 block">Pro user</span>
              <span className="text-sm text-gray-600">All templates, no watermark, higher limits</span>
            </button>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-4">Admin</p>
            <button
              type="button"
              onClick={() => handleSignIn('admin')}
              className="w-full text-left px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 hover:border-amber-400 transition"
            >
              <span className="font-semibold text-gray-900 block">Admin</span>
              <span className="text-sm text-gray-600">Manage settings, plans, templates, and flags</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
