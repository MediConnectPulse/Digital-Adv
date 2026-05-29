import { User } from './types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export class AuthService {
  static generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  static createUser(email: string, name?: string): User {
    return {
      id: this.generateUserId(),
      email,
      name: name || email.split('@')[0],
      role: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
      monthlyCardCount: 0,
      monthlyLimit: 5,
      brandKitsUsed: 0,
      brandKitsLimit: 1,
    };
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
    // In a real app, this would clear the session
    console.log('User signed out');
  }

  static getCurrentUser(): User | null {
    // In a real app, this would check the session
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('promocard_user');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  static saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('promocard_user', JSON.stringify(user));
    }
  }

  static clearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('promocard_user');
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
