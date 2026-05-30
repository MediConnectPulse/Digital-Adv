import { User, Plan, Template, AppSettings } from './types';

export interface EntitlementCheck {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  currentLimit?: number;
  used?: number;
}

export class MonetizationService {
  static checkCardGenerationLimit(user: User, appSettings: AppSettings): EntitlementCheck {
    const plan = this.getUserPlan(user);
    
    if (plan.monthlyCardLimit === -1) {
      return { allowed: true };
    }

    if (user.monthlyCardCount >= plan.monthlyCardLimit) {
      return {
        allowed: false,
        reason: 'Monthly card limit reached',
        upgradeRequired: true,
        currentLimit: plan.monthlyCardLimit,
        used: user.monthlyCardCount,
      };
    }

    return {
      allowed: true,
      currentLimit: plan.monthlyCardLimit,
      used: user.monthlyCardCount,
    };
  }

  static checkTemplateAccess(user: User, template: Template, plans: Plan[]): EntitlementCheck {
    const plan = this.getUserPlan(user);

    if (!template.isPremium) {
      return { allowed: true };
    }

    if (template.requiredPlan.includes('*')) {
      return { allowed: false, reason: 'Premium template', upgradeRequired: true };
    }

    if (template.requiredPlan.includes(plan.id)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'Premium template requires higher plan',
      upgradeRequired: true,
    };
  }

  static checkExportQuality(user: User, requestedQuality: string, appSettings: AppSettings): EntitlementCheck {
    const plan = this.getUserPlan(user);

    const qualityLevels = ['low', 'high', 'premium'];
    const planQualityIndex = qualityLevels.indexOf(plan.exportQuality);
    const requestedQualityIndex = qualityLevels.indexOf(requestedQuality);

    if (requestedQualityIndex <= planQualityIndex) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'Higher export quality requires premium plan',
      upgradeRequired: true,
    };
  }

  static checkWatermark(user: User, appSettings: AppSettings): { showWatermark: boolean } {
    const plan = this.getUserPlan(user);
    return { showWatermark: plan.watermarkEnabled };
  }

  static checkBrandKitLimit(user: User): EntitlementCheck {
    const plan = this.getUserPlan(user);

    if (plan.brandKitsLimit === -1) {
      return { allowed: true };
    }

    if (user.brandKitsUsed >= plan.brandKitsLimit) {
      return {
        allowed: false,
        reason: 'Brand kit limit reached',
        upgradeRequired: true,
        currentLimit: plan.brandKitsLimit,
        used: user.brandKitsUsed,
      };
    }

    return {
      allowed: true,
      currentLimit: plan.brandKitsLimit,
      used: user.brandKitsUsed,
    };
  }

  static getUserPlan(user: User, plans: Plan[] = []): Plan {
    const planIdByRole: Record<string, string> = {
      guest: 'plan-free',
      free: 'plan-free',
      paid: 'plan-pro',
      pro: 'plan-pro',
      admin: 'plan-business',
    };
    const targetPlanId = planIdByRole[user.role] || 'plan-free';
    const storedPlan = plans.find((plan) => plan.id === targetPlanId && plan.isActive);
    if (storedPlan) {
      return storedPlan;
    }

    // Fallback when persisted plans are unavailable (SSR / first load)
    const defaultPlans: Record<string, Plan> = {
      guest: {
        id: 'plan-free',
        name: 'Free',
        description: 'Guest user',
        price: 0,
        currency: 'USD',
        interval: 'monthly',
        features: [],
        monthlyCardLimit: 3,
        brandKitsLimit: 0,
        exportQuality: 'low',
        watermarkEnabled: true,
        templateAccess: [],
        prioritySupport: false,
        teamAccess: false,
        whiteLabel: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      free: {
        id: 'plan-free',
        name: 'Free',
        description: 'Free user',
        price: 0,
        currency: 'USD',
        interval: 'monthly',
        features: [],
        monthlyCardLimit: 5,
        brandKitsLimit: 1,
        exportQuality: 'low',
        watermarkEnabled: true,
        templateAccess: [],
        prioritySupport: false,
        teamAccess: false,
        whiteLabel: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      paid: {
        id: 'plan-pro',
        name: 'Pro',
        description: 'Paid user',
        price: 19,
        currency: 'USD',
        interval: 'monthly',
        features: [],
        monthlyCardLimit: 50,
        brandKitsLimit: 10,
        exportQuality: 'high',
        watermarkEnabled: false,
        templateAccess: ['*'],
        prioritySupport: true,
        teamAccess: false,
        whiteLabel: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      pro: {
        id: 'plan-pro',
        name: 'Pro',
        description: 'Pro user',
        price: 19,
        currency: 'USD',
        interval: 'monthly',
        features: [],
        monthlyCardLimit: 50,
        brandKitsLimit: 10,
        exportQuality: 'high',
        watermarkEnabled: false,
        templateAccess: ['*'],
        prioritySupport: true,
        teamAccess: false,
        whiteLabel: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      admin: {
        id: 'plan-business',
        name: 'Business',
        description: 'Admin user',
        price: 49,
        currency: 'USD',
        interval: 'monthly',
        features: [],
        monthlyCardLimit: -1,
        brandKitsLimit: -1,
        exportQuality: 'premium',
        watermarkEnabled: false,
        templateAccess: ['*'],
        prioritySupport: true,
        teamAccess: true,
        whiteLabel: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    return defaultPlans[user.role] || defaultPlans.free;
  }

  static incrementCardCount(user: User): User {
    const plan = this.getUserPlan(user);
    if (plan.monthlyCardLimit === -1) {
      return user;
    }
    return {
      ...user,
      monthlyCardCount: user.monthlyCardCount + 1,
    };
  }

  static canUpgrade(user: User): boolean {
    return user.role !== 'admin';
  }

  static getUpgradeTarget(user: User): string {
    const roleOrder = ['guest', 'free', 'paid', 'pro', 'admin'];
    const currentIndex = roleOrder.indexOf(user.role);
    if (currentIndex < roleOrder.length - 1) {
      return roleOrder[currentIndex + 1];
    }
    return user.role;
  }

  static calculateMonthlyRevenue(users: User[], plans: Plan[]): number {
    return users.reduce((total, user) => {
      const plan = this.getUserPlan(user, plans);
      return total + plan.price;
    }, 0);
  }

  static getUsageStats(user: User): {
    cardsUsed: number;
    cardsRemaining: number;
    cardsPercentage: number;
    brandKitsUsed: number;
    brandKitsRemaining: number;
  } {
    const plan = this.getUserPlan(user);

    const cardsUsed = user.monthlyCardCount;
    const cardsRemaining = plan.monthlyCardLimit === -1 ? -1 : Math.max(0, plan.monthlyCardLimit - cardsUsed);
    const cardsPercentage = plan.monthlyCardLimit === -1 ? 0 : (cardsUsed / plan.monthlyCardLimit) * 100;

    const brandKitsUsed = user.brandKitsUsed;
    const brandKitsRemaining = plan.brandKitsLimit === -1 ? -1 : Math.max(0, plan.brandKitsLimit - brandKitsUsed);

    return {
      cardsUsed,
      cardsRemaining,
      cardsPercentage,
      brandKitsUsed,
      brandKitsRemaining,
    };
  }
}
