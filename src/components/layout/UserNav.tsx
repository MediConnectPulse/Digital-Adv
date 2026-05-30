'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import { AuthService } from '@/lib/auth';
import { getRoleLabel } from '@/lib/role-utils';

interface UserNavProps {
  active?: 'templates' | 'pricing' | 'builder';
}

export function UserNav({ active }: UserNavProps) {
  const pathname = usePathname();
  const { user, signOut } = useApp();
  const isAdmin = AuthService.isAdmin(user);

  const isActive = (key: UserNavProps['active']) => {
    if (active) return active === key;
    if (key === 'templates') return pathname === '/templates';
    if (key === 'pricing') return pathname === '/pricing';
    if (key === 'builder') return pathname.startsWith('/builder');
    return false;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            PromoCard
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
            <Link
              href="/templates"
              className={
                isActive('templates')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600 transition'
              }
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className={
                isActive('pricing')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600 transition'
              }
            >
              Pricing
            </Link>
            <Link
              href="/builder"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Start Creating
            </Link>
            {user ? (
              <>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {getRoleLabel(user.role)}
                </span>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600 font-medium">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
