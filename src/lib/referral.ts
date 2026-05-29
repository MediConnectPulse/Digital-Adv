import { User, ReferralEvent, AppSettings } from './types';

export interface ReferralReward {
  type: 'free_exports' | 'premium_template' | 'discount_credit';
  value: number;
  description: string;
}

export class ReferralService {
  static generateReferralCode(userId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `REF${timestamp}${random}`.toUpperCase();
  }

  static createReferralEvent(
    referrerId: string,
    referralCode: string,
    appSettings: AppSettings
  ): ReferralEvent {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + appSettings.referral.expiryDays);

    return {
      id: `ref-${Date.now()}`,
      referrerId,
      referralCode,
      status: 'pending',
      rewardType: appSettings.referral.rewardType,
      rewardValue: appSettings.referral.rewardValue,
      expiresAt: expiryDate,
      createdAt: new Date(),
    };
  }

  static completeReferral(
    referralEvent: ReferralEvent,
    referredUserId: string
  ): ReferralEvent {
    return {
      ...referralEvent,
      referredUserId,
      status: 'completed',
      completedAt: new Date(),
    };
  }

  static applyReferralReward(
    user: User,
    reward: ReferralReward
  ): User {
    switch (reward.type) {
      case 'free_exports':
        return {
          ...user,
          monthlyCardCount: Math.max(0, user.monthlyCardCount - reward.value),
        };
      case 'discount_credit':
        // In a real app, this would add credit to the user's account
        return user;
      case 'premium_template':
        // In a real app, this would grant access to premium templates
        return user;
      default:
        return user;
    }
  }

  static getReferralReward(
    appSettings: AppSettings
  ): ReferralReward {
    const { rewardType, rewardValue } = appSettings.referral;

    switch (rewardType) {
      case 'free_exports':
        return {
          type: 'free_exports',
          value: rewardValue,
          description: `${rewardValue} free card exports`,
        };
      case 'premium_template':
        return {
          type: 'premium_template',
          value: rewardValue,
          description: `${rewardValue} premium template access`,
        };
      case 'discount_credit':
        return {
          type: 'discount_credit',
          value: rewardValue,
          description: `${rewardValue}% discount on next purchase`,
        };
      default:
        return {
          type: 'free_exports',
          value: 5,
          description: '5 free card exports',
        };
    }
  }

  static validateReferralCode(
    referralCode: string,
    referralEvents: ReferralEvent[]
  ): { valid: boolean; referrerId?: string } {
    const event = referralEvents.find(
      (e) => e.referralCode === referralCode && e.status === 'pending'
    );

    if (!event) {
      return { valid: false };
    }

    // Check if expired
    if (event.expiresAt && new Date() > event.expiresAt) {
      return { valid: false };
    }

    return { valid: true, referrerId: event.referrerId };
  }

  static getReferralStats(
    userId: string,
    referralEvents: ReferralEvent[]
  ): {
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    expiredReferrals: number;
    totalRewards: number;
  } {
    const userEvents = referralEvents.filter((e) => e.referrerId === userId);

    const completed = userEvents.filter((e) => e.status === 'completed').length;
    const pending = userEvents.filter((e) => e.status === 'pending').length;
    const expired = userEvents.filter(
      (e) => e.status === 'pending' && e.expiresAt && new Date() > e.expiresAt
    ).length;

    const totalRewards = completed * userEvents[0]?.rewardValue || 0;

    return {
      totalReferrals: userEvents.length,
      completedReferrals: completed,
      pendingReferrals: pending,
      expiredReferrals: expired,
      totalRewards,
    };
  }

  static getShareableReferralLink(
    userId: string,
    referralCode: string,
    baseUrl: string = 'https://promocard.com'
  ): string {
    return `${baseUrl}?ref=${referralCode}`;
  }

  static generateReferralMessage(
    referralCode: string,
    reward: ReferralReward,
    baseUrl: string = 'https://promocard.com'
  ): string {
    const link = this.getShareableReferralLink('user', referralCode, baseUrl);
    return `Join PromoCard and get ${reward.description}! Use my referral link: ${link}`;
  }

  static checkReferralAbuse(
    userId: string,
    referralEvents: ReferralEvent[],
    maxReferralsPerDay: number = 10
  ): { allowed: boolean; reason?: string } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayReferrals = referralEvents.filter(
      (e) => e.referrerId === userId && new Date(e.createdAt) >= today
    );

    if (todayReferrals.length >= maxReferralsPerDay) {
      return {
        allowed: false,
        reason: 'Daily referral limit reached',
      };
    }

    return { allowed: true };
  }

  static expireOldReferrals(referralEvents: ReferralEvent[]): ReferralEvent[] {
    const now = new Date();
    return referralEvents.map((event) => {
      if (
        event.status === 'pending' &&
        event.expiresAt &&
        now > event.expiresAt
      ) {
        return { ...event, status: 'expired' };
      }
      return event;
    });
  }
}
