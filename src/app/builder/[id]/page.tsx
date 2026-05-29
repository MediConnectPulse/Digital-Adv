'use client';

import React, { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { seedTemplates } from '@/lib/seed-data';
import { CardBuilder } from '@/components/card-builder/CardBuilder';
import { ExportUtils } from '@/lib/export-utils';
import { Template } from '@/lib/types';

export default function TemplateBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;
  const [template, setTemplate] = useState<Template | null>(
    seedTemplates.find((t) => t.id === templateId) || null
  );
  const [cardData, setCardData] = useState<Record<string, any>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <Link
            href="/builder"
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  const handleExport = async (format: 'png' | 'jpg') => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const preset = template.schema.exportPresets[0];
      await ExportUtils.exportAndDownload(previewRef.current, {
        format,
        quality: preset.quality,
        width: preset.width,
        height: preset.height,
        filename: ExportUtils.getExportFilename(template.name, format),
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!previewRef.current) return;

    try {
      const preset = template.schema.exportPresets[0];
      const dataUrl = await ExportUtils.exportToDataURL(previewRef.current, {
        format: 'png',
        quality: preset.quality,
        width: preset.width,
        height: preset.height,
      });
      await ExportUtils.shareCard(dataUrl, `Check out my ${template.name}`);
    } catch (error) {
      console.error('Share failed:', error);
      alert('Share failed. Please try again.');
    }
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
              <Link
                href="/builder"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Templates
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/builder"
                className="text-blue-600 hover:text-blue-700 text-sm mb-1 inline-block"
              >
                ← Back to Templates
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600 text-sm">{template.description}</p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-700">Show Watermark</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Builder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CardBuilder
          template={template}
          initialData={cardData}
          onDataChange={setCardData}
          showWatermark={showWatermark}
          watermarkText="Made with PromoCard"
        />
      </div>

      {/* Export Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleExport('png')}
                disabled={isExporting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Exporting...' : 'Download PNG'}
              </button>
              <button
                onClick={() => handleExport('jpg')}
                disabled={isExporting}
                className="bg-gray-100 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Exporting...' : 'Download JPG'}
              </button>
              <button
                onClick={handleShare}
                disabled={isExporting}
                className="bg-gray-100 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Share
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {template.isPremium && (
                <span className="text-yellow-600 font-medium">Premium Template</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-20"></div>
    </div>
  );
}
