import { isAdminRole } from './role-utils';
import { User } from './types';

const SESSION_COOKIE = 'promocard_role';
const COOKIE_MAX_AGE_DAYS = 7;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export class AuthService {
  static generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  static createUser(email: string, name?: string, role: User['role'] = 'free'): User {
    const limits =
      role === 'admin'
        ? { monthlyLimit: -1, brandKitsLimit: -1 }
        : role === 'pro' || role === 'paid'
          ? { monthlyLimit: 50, brandKitsLimit: 10 }
          : { monthlyLimit: 5, brandKitsLimit: 1 };

    return {
      id: this.generateUserId(),
      email,
      name: name || email.split('@')[0],
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      monthlyCardCount: 0,
      monthlyLimit: limits.monthlyLimit,
      brandKitsUsed: 0,
      brandKitsLimit: limits.brandKitsLimit,
    };
  }

  static signInAsRole(role: User['role']): User {
    const profiles: Record<User['role'], { email: string; name: string }> = {
      guest: { email: 'guest@promocard.local', name: 'Guest User' },
      free: { email: 'user@promocard.local', name: 'Free User' },
      paid: { email: 'paid@promocard.local', name: 'Paid User' },
      pro: { email: 'pro@promocard.local', name: 'Pro User' },
      admin: { email: 'admin@promocard.local', name: 'Admin User' },
    };
    const profile = profiles[role];
    const user = this.createUser(profile.email, profile.name, role);
    this.saveUser(user);
    return user;
  }

  static isAdmin(user: User | null): boolean {
    return user !== null && isAdminRole(user.role);
  }

  private static setSessionCookie(role: User['role'] | null): void {
    if (typeof document === 'undefined') return;
    if (!role) {
      document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
      return;
    }
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${SESSION_COOKIE}=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  static async sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
    // In a real app, this would send an email with a magic link
    // For demo purposes, we'll simulate success
    console.log(`Magic link sent to ${email}`);
    return { success: true };
  }

  static async verifyMagicLink(token: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // In a real app, this would verify the token and return the user
    // For demo purposes, we'll simulate success
    const user = this.createUser('demo@example.com', 'Demo User');
    return { success: true, user };
  }

  static async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    // In a real app, this would integrate with Google OAuth
    // For demo purposes, we'll simulate success
    const user = this.createUser('google@example.com', 'Google User');
    return { success: true, user };
  }

  static async signOut(): Promise<void> {
    this.clearUser();
  }

  static getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('promocard_user');
      if (!userJson) return null;
      const user = JSON.parse(userJson) as User;
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      };
    }
    return null;
  }

  static saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('promocard_user', JSON.stringify(user));
      this.setSessionCookie(user.role);
    }
  }

  static clearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('promocard_user');
      this.setSessionCookie(null);
    }
  }

  static updateUserRole(user: User, newRole: User['role']): User {
    return {
      ...user,
      role: newRole,
      updatedAt: new Date(),
    };
  }
}
