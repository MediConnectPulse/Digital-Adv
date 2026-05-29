'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { seedAppSettings, seedPlans, seedTemplates, seedFeatureFlags } from '@/lib/seed-data';
import { AppSettings, Plan, Template, FeatureFlag } from '@/lib/types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'settings' | 'plans' | 'templates' | 'flags'>('settings');
  const [appSettings, setAppSettings] = useState<AppSettings>(seedAppSettings);
  const [plans, setPlans] = useState<Plan[]>(seedPlans);
  const [templates, setTemplates] = useState<Template[]>(seedTemplates);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(seedFeatureFlags);

  const handleSettingsUpdate = (field: keyof AppSettings, value: any) => {
    setAppSettings((prev) => ({ ...prev, [field]: value, updatedAt: new Date() }));
  };

  const handlePlanUpdate = (planId: string, field: keyof Plan, value: any) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, [field]: value, updatedAt: new Date() } : plan
      )
    );
  };

  const handleTemplateToggle = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, isActive: !template.isActive, updatedAt: new Date() }
          : template
      )
    );
  };

  const handleFeatureFlagToggle = (flagId: string) => {
    setFeatureFlags((prev) =>
      prev.map((flag) =>
        flag.id === flagId
          ? { ...flag, enabled: !flag.enabled, updatedAt: new Date() }
          : flag
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              PromoCard
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin Dashboard</span>
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'settings', label: 'App Settings' },
              { id: 'plans', label: 'Plans & Pricing' },
              { id: 'templates', label: 'Templates' },
              { id: 'flags', label: 'Feature Flags' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">App Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Name
                  </label>
                  <input
                    type="text"
                    value={appSettings.appName}
                    onChange={(e) => handleSettingsUpdate('appName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={appSettings.contact.email}
                    onChange={(e) =>
                      handleSettingsUpdate('contact', {
                        ...appSettings.contact,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={appSettings.brandColors.primary}
                    onChange={(e) =>
                      handleSettingsUpdate('brandColors', {
                        ...appSettings.brandColors,
                        primary: e.target.value,
                      })
                    }
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={appSettings.brandColors.secondary}
                    onChange={(e) =>
                      handleSettingsUpdate('brandColors', {
                        ...appSettings.brandColors,
                        secondary: e.target.value,
                      })
                    }
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Landing Page</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={appSettings.landingPage.headline}
                    onChange={(e) =>
                      handleSettingsUpdate('landingPage', {
                        ...appSettings.landingPage,
                        headline: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subheadline
                  </label>
                  <textarea
                    value={appSettings.landingPage.subheadline}
                    onChange={(e) =>
                      handleSettingsUpdate('landingPage', {
                        ...appSettings.landingPage,
                        subheadline: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Monthly Limit
                  </label>
                  <input
                    type="number"
                    value={appSettings.pricing.freeMonthlyLimit}
                    onChange={(e) =>
                      handleSettingsUpdate('pricing', {
                        ...appSettings.pricing,
                        freeMonthlyLimit: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={appSettings.pricing.watermarkText}
                    onChange={(e) =>
                      handleSettingsUpdate('pricing', {
                        ...appSettings.pricing,
                        watermarkText: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={appSettings.pricing.watermarkEnabled}
                    onChange={(e) =>
                      handleSettingsUpdate('pricing', {
                        ...appSettings.pricing,
                        watermarkEnabled: e.target.checked,
                      })
                    }
                    className="rounded mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Enable Watermark on Free Tier
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Referral Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={appSettings.referral.enabled}
                    onChange={(e) =>
                      handleSettingsUpdate('referral', {
                        ...appSettings.referral,
                        enabled: e.target.checked,
                      })
                    }
                    className="rounded mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Enable Referral System
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Value
                  </label>
                  <input
                    type="number"
                    value={appSettings.referral.rewardValue}
                    onChange={(e) =>
                      handleSettingsUpdate('referral', {
                        ...appSettings.referral,
                        rewardValue: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={plan.isActive}
                      onChange={() => handlePlanUpdate(plan.id, 'isActive', !plan.isActive)}
                      className="rounded mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handlePlanUpdate(plan.id, 'price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Card Limit
                    </label>
                    <input
                      type="number"
                      value={plan.monthlyCardLimit}
                      onChange={(e) => handlePlanUpdate(plan.id, 'monthlyCardLimit', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Kits Limit
                    </label>
                    <input
                      type="number"
                      value={plan.brandKitsLimit}
                      onChange={(e) => handlePlanUpdate(plan.id, 'brandKitsLimit', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-gray-600">{template.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{template.category.replace('_', ' ')}</span>
                      <span>•</span>
                      <span className="capitalize">{template.niche}</span>
                      {template.isPremium && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-600">Premium</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={template.isActive}
                        onChange={() => handleTemplateToggle(template.id)}
                        className="rounded mr-2"
                      />
                      <label className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'flags' && (
          <div className="space-y-6">
            {featureFlags.map((flag) => (
              <div key={flag.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{flag.name}</h3>
                    <p className="text-gray-600">{flag.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Rollout: {flag.rolloutPercentage}%
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={flag.enabled}
                      onChange={() => handleFeatureFlagToggle(flag.id)}
                      className="rounded mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Enabled</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
