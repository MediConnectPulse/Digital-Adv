'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedTemplates } from '@/lib/seed-data';
import { Template } from '@/lib/types';
import { TemplateEngine } from '@/lib/template-engine';

export default function BuilderPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [userPlan, setUserPlan] = useState('plan-free'); // In real app, this would come from auth

  const activeTemplates = TemplateEngine.getActiveTemplates(seedTemplates);
  const sortedTemplates = TemplateEngine.sortTemplatesByOrder(activeTemplates);
  const availableTemplates = TemplateEngine.filterTemplatesByPlan(sortedTemplates, userPlan);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    router.push(`/builder/${template.id}`);
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
              <Link href="/templates" className="text-gray-700 hover:text-blue-600 transition">
                Templates
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose a Template</h1>
          <p className="text-gray-600">Select a template to get started creating your card</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
                <div className="w-full h-full bg-white rounded-lg shadow-inner flex items-center justify-center">
                  <span className="text-4xl">📄</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  {template.isPremium && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">
                    {template.category.replace('_', ' ')}
                  </span>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Use Template →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {availableTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No templates available for your current plan.</p>
            <Link
              href="/pricing"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upgrade Your Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
