import { User } from './types';

export function isAdminRole(role: User['role']): boolean {
  return role === 'admin';
}

export function getRoleLabel(role: User['role']): string {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'pro':
    case 'paid':
      return 'Pro';
    case 'free':
      return 'Free';
    case 'guest':
      return 'Guest';
    default:
      return 'User';
  }
}

export function roleToPlanId(role: User['role']): string {
  switch (role) {
    case 'admin':
      return 'plan-business';
    case 'pro':
    case 'paid':
      return 'plan-pro';
    default:
      return 'plan-free';
  }
}
