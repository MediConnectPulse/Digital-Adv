'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedTemplates } from '@/lib/seed-data';
import { Template } from '@/lib/types';
import { TemplateEngine } from '@/lib/template-engine';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userPlan, setUserPlan] = useState('plan-free');

  const activeTemplates = TemplateEngine.getActiveTemplates(seedTemplates);
  const sortedTemplates = TemplateEngine.sortTemplatesByOrder(activeTemplates);
  const availableTemplates = TemplateEngine.filterTemplatesByPlan(sortedTemplates, userPlan);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'bio_card', name: 'Bio Cards' },
    { id: 'offer_card', name: 'Offer Cards' },
    { id: 'clinic_card', name: 'Clinic Cards' },
    { id: 'tutor_card', name: 'Tutor Cards' },
    { id: 'testimonial_card', name: 'Testimonials' },
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? availableTemplates
      : TemplateEngine.filterTemplatesByCategory(availableTemplates, selectedCategory);

  const handleSelectTemplate = (template: Template) => {
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
              <Link href="/templates" className="text-blue-600 font-medium">
                Templates
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition">
                Pricing
              </Link>
              <Link
                href="/builder"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Template Gallery</h1>
          <p className="text-xl text-gray-600">
            Choose from our collection of professionally designed templates
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer group"
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8 relative">
                <div className="w-full h-full bg-white rounded-lg shadow-inner flex items-center justify-center">
                  <span className="text-6xl">📄</span>
                </div>
                {template.isPremium && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full font-semibold">
                    Premium
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">
                    Use Template
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 capitalize">
                    {template.category.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{template.niche}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">No templates found in this category.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Templates
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Upgrade to Pro or Business to access all premium templates
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
