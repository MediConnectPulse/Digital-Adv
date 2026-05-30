'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserNav } from '@/components/layout/UserNav';
import { useApp } from '@/components/providers/AppProvider';
import { Plan } from '@/lib/types';

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const { plans } = useApp();

  const activePlans = plans.filter((plan) => plan.isActive);

  const getAnnualPrice = (monthlyPrice: number) => {
    const annualPrice = monthlyPrice * 12;
    const discount = Math.round(annualPrice * 0.2);
    return annualPrice - discount;
  };

  const getDisplayPrice = (plan: Plan) => {
    if (billingInterval === 'monthly') {
      return plan.price;
    }
    return getAnnualPrice(plan.price);
  };

  const getBillingText = (plan: Plan) => {
    if (plan.interval === 'one_time') {
      return 'one-time';
    }
    return billingInterval === 'monthly' ? '/month' : '/year';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav active="pricing" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 mb-8">Choose the plan that fits your needs</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-lg transition ${
                billingInterval === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-6 py-2 rounded-lg transition ${
                billingInterval === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {activePlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-sm border-2 p-8 ${
                plan.name === 'Pro'
                  ? 'border-blue-600 relative transform scale-105'
                  : 'border-gray-200'
              }`}
            >
              {plan.name === 'Pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  ${getDisplayPrice(plan)}
                </span>
                <span className="text-gray-600 text-lg">{getBillingText(plan)}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-0.5">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/builder"
                className={`block w-full py-3 rounded-lg text-center font-semibold transition ${
                  plan.name === 'Pro'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.price === 0 ? 'Get Started Free' : 'Upgrade to ' + plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  {activePlans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-4 font-semibold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Monthly Card Limit', values: activePlans.map((p) => p.monthlyCardLimit === -1 ? 'Unlimited' : p.monthlyCardLimit) },
                  { feature: 'Brand Kits', values: activePlans.map((p) => p.brandKitsLimit === -1 ? 'Unlimited' : p.brandKitsLimit) },
                  { feature: 'Export Quality', values: activePlans.map((p) => p.exportQuality) },
                  { feature: 'Watermark', values: activePlans.map((p) => p.watermarkEnabled ? 'Yes' : 'No') },
                  { feature: 'Template Access', values: activePlans.map((p) => p.templateAccess.includes('*') ? 'All' : 'Basic') },
                  { feature: 'Priority Support', values: activePlans.map((p) => p.prioritySupport ? 'Yes' : 'No') },
                  { feature: 'Team Access', values: activePlans.map((p) => p.teamAccess ? 'Yes' : 'No') },
                  { feature: 'White Label', values: activePlans.map((p) => p.whiteLabel ? 'Yes' : 'No') },
                ].map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                    {row.values.map((value, colIndex) => (
                      <td key={colIndex} className="text-center py-4 px-4 text-gray-600">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: 'Can I change my plan later?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
            },
            {
              q: 'What happens if I exceed my monthly limit?',
              a: 'You can purchase additional card credits or upgrade to a higher plan with more generous limits.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes! Our free plan lets you create 5 cards per month at no cost. No credit card required.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Absolutely. You can cancel your subscription at any time. Your access continues until the end of your billing period.',
            },
            {
              q: 'Do you offer refunds?',
              a: 'We offer a 14-day money-back guarantee for all paid plans. Contact support if you\'re not satisfied.',
            },
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals creating beautiful cards
          </p>
          <Link
            href="/builder"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Start Creating Now
          </Link>
        </div>
      </div>
    </div>
  );
}
