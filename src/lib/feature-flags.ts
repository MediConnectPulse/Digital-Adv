import { FeatureFlag, User } from './types';

export class FeatureFlagService {
  static isFeatureEnabled(
    flag: FeatureFlag,
    user: User,
    userId?: string
  ): boolean {
    // If feature is not enabled at all
    if (!flag.enabled) {
      return false;
    }

    // Check if user's plan is allowed
    if (flag.allowedPlans && flag.allowedPlans.length > 0) {
      const userPlan = user.role;
      if (!flag.allowedPlans.includes(userPlan)) {
        return false;
      }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage < 100) {
      // Use user ID for consistent hashing
      const hash = this.hashString(userId || user.id);
      const threshold = (flag.rolloutPercentage / 100) * 0xFFFFFFFF;
      return hash < threshold;
    }

    return true;
  }

  static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  static getEnabledFlags(
    flags: FeatureFlag[],
    user: User,
    userId?: string
  ): FeatureFlag[] {
    return flags.filter((flag) => this.isFeatureEnabled(flag, user, userId));
  }

  static getDisabledFlags(
    flags: FeatureFlag[],
    user: User,
    userId?: string
  ): FeatureFlag[] {
    return flags.filter((flag) => !this.isFeatureEnabled(flag, user, userId));
  }

  static checkFeature(
    flags: FeatureFlag[],
    featureName: string,
    user: User,
    userId?: string
  ): { enabled: boolean; flag?: FeatureFlag } {
    const flag = flags.find((f) => f.name === featureName);
    if (!flag) {
      return { enabled: false };
    }

    return {
      enabled: this.isFeatureEnabled(flag, user, userId),
      flag,
    };
  }

  static updateFlagRollout(
    flag: FeatureFlag,
    newPercentage: number
  ): FeatureFlag {
    return {
      ...flag,
      rolloutPercentage: Math.min(100, Math.max(0, newPercentage)),
      updatedAt: new Date(),
    };
  }

  static enableFlag(flag: FeatureFlag): FeatureFlag {
    return {
      ...flag,
      enabled: true,
      updatedAt: new Date(),
    };
  }

  static disableFlag(flag: FeatureFlag): FeatureFlag {
    return {
      ...flag,
      enabled: false,
      updatedAt: new Date(),
    };
  }

  static addAllowedPlan(flag: FeatureFlag, planId: string): FeatureFlag {
    const allowedPlans = flag.allowedPlans || [];
    if (!allowedPlans.includes(planId)) {
      return {
        ...flag,
        allowedPlans: [...allowedPlans, planId],
        updatedAt: new Date(),
      };
    }
    return flag;
  }

  static removeAllowedPlan(flag: FeatureFlag, planId: string): FeatureFlag {
    const allowedPlans = flag.allowedPlans || [];
    return {
      ...flag,
      allowedPlans: allowedPlans.filter((p) => p !== planId),
      updatedAt: new Date(),
    };
  }

  static getFeatureMetrics(
    flags: FeatureFlag[],
    user: User,
    userId?: string
  ): {
    totalFlags: number;
    enabledFlags: number;
    disabledFlags: number;
    rolloutFlags: number;
    percentageEnabled: number;
  } {
    const total = flags.length;
    const enabled = this.getEnabledFlags(flags, user, userId).length;
    const disabled = total - enabled;
    const rollout = flags.filter((f) => f.rolloutPercentage > 0 && f.rolloutPercentage < 100).length;
    const percentage = total > 0 ? (enabled / total) * 100 : 0;

    return {
      totalFlags: total,
      enabledFlags: enabled,
      disabledFlags: disabled,
      rolloutFlags: rollout,
      percentageEnabled: percentage,
    };
  }

  static createFeatureFlag(
    name: string,
    description: string,
    options: {
      enabled?: boolean;
      rolloutPercentage?: number;
      allowedPlans?: string[];
    } = {}
  ): FeatureFlag {
    return {
      id: `flag-${Date.now()}`,
      name,
      description,
      enabled: options.enabled ?? false,
      rolloutPercentage: options.rolloutPercentage ?? 0,
      allowedPlans: options.allowedPlans || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
