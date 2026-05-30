'use client';

import React, { useState } from 'react';
import { Template, TemplateFormData } from '@/lib/types';
import { TemplateEngine } from '@/lib/template-engine';
import { FormField } from './FormField';
import { CardPreview } from './CardPreview';

interface CardBuilderProps {
  template: Template;
  initialData?: TemplateFormData;
  onDataChange?: (data: TemplateFormData) => void;
  showWatermark?: boolean;
  watermarkText?: string;
}

export const CardBuilder: React.FC<CardBuilderProps> = ({
  template,
  initialData = {},
  onDataChange,
  showWatermark = false,
  watermarkText = 'Made with PromoCard',
}) => {
  const [data, setData] = useState<TemplateFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPreset, setSelectedPreset] = useState<string>(
    () => template.schema.exportPresets[0]?.id ?? ''
  );

  const handleFieldChange = (fieldId: string, value: string) => {
    const newData = { ...data, [fieldId]: value };
    setData(newData);
    
    // Validate the field
    const field = TemplateEngine.getFieldById(template.schema, fieldId);
    if (field) {
      const validation = TemplateEngine.validateField(field, value);
      const newErrors = { ...errors };
      if (validation.error) {
        newErrors[fieldId] = validation.error;
      } else {
        delete newErrors[fieldId];
      }
      setErrors(newErrors);
    }

    onDataChange?.(newData);
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
  };

  const schema = template.schema;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customize Your Card</h2>
          
          <div className="space-y-4">
            {schema.fields.map((field) => {
              const fieldValue = data[field.id];
              return (
              <FormField
                key={field.id}
                field={field}
                value={typeof fieldValue === 'string' ? fieldValue : ''}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={errors[field.id]}
              />
              );
            })}
          </div>
        </div>

        {/* Export Presets */}
        {schema.exportPresets.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h3>
            <div className="grid grid-cols-2 gap-3">
              {schema.exportPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPreset === preset.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.width} × {preset.height}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Preview</h2>
          
          <div className="flex justify-center">
            <CardPreview
              template={template}
              data={data}
              exportPreset={selectedPreset}
              showWatermark={showWatermark}
              watermarkText={watermarkText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
