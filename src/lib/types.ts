// Database Schema Types for PromoCard

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'guest' | 'free' | 'paid' | 'pro' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  subscriptionId?: string;
  referralCode?: string;
  referredBy?: string;
  monthlyCardCount: number;
  monthlyLimit: number;
  brandKitsUsed: number;
  brandKitsLimit: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'annual' | 'one_time';
  features: string[];
  monthlyCardLimit: number;
  brandKitsLimit: number;
  exportQuality: 'low' | 'high' | 'premium';
  watermarkEnabled: boolean;
  templateAccess: string[];
  prioritySupport: boolean;
  teamAccess: boolean;
  whiteLabel: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  niche: string;
  schema: TemplateSchema;
  previewImage?: string;
  isPremium: boolean;
  requiredPlan: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateCategory =
  | 'bio_card'
  | 'offer_card'
  | 'testimonial_card'
  | 'clinic_card'
  | 'shop_promo'
  | 'tutor_card'
  | 'festival_card'
  | 'event_card'
  | 'product_highlight'
  | 'qr_contact';

export interface TemplateSchema {
  fields: TemplateField[];
  layout: LayoutConfig;
  style: StyleConfig;
  exportPresets: ExportPreset[];
}

export interface TemplateField {
  id: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'select' | 'url' | 'phone' | 'email' | 'qr';
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: string;
  maxLength?: number;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface LayoutConfig {
  type: 'vertical' | 'horizontal' | 'grid';
  sections: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  type: 'header' | 'body' | 'footer' | 'sidebar';
  fields: string[];
  style: SectionStyle;
}

export interface SectionStyle {
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
}

export interface StyleConfig {
  fontFamily?: string;
  baseFontSize?: string;
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  spacing?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

export interface ExportPreset {
  id: string;
  name: string;
  format: 'png' | 'jpg';
  width: number;
  height: number;
  quality: number;
}

export interface GeneratedCard {
  id: string;
  userId: string;
  templateId: string;
  data: Record<string, any>;
  previewUrl?: string;
  exportUrl?: string;
  isPublic: boolean;
  shareCode?: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandKit {
  id: string;
  userId: string;
  name: string;
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading?: string;
    body?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  planIds: string[];
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralEvent {
  id: string;
  referrerId: string;
  referredUserId?: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  rewardType: 'free_exports' | 'premium_template' | 'discount_credit';
  rewardValue: number;
  expiresAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  allowedPlans?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  id: string;
  appName: string;
  logo?: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  landingPage: {
    headline: string;
    subheadline: string;
    heroImage?: string;
  };
  pricing: {
    freeMonthlyLimit: number;
    freeExportQuality: 'low' | 'high';
    paidExportQuality: 'high' | 'premium';
    watermarkText: string;
    watermarkEnabled: boolean;
  };
  referral: {
    enabled: boolean;
    rewardType: 'free_exports' | 'premium_template' | 'discount_credit';
    rewardValue: number;
    expiryDays: number;
  };
  announcements: {
    enabled: boolean;
    text: string;
    link?: string;
    dismissible: boolean;
  };
  contact: {
    email: string;
    phone?: string;
    supportUrl?: string;
  };
  legal: {
    termsOfService?: string;
    privacyPolicy?: string;
  };
  updatedAt: Date;
}

export interface PaymentEvent {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
