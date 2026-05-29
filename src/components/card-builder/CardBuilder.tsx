'use client';

import React, { useState, useEffect } from 'react';
import { Template, TemplateSchema } from '@/lib/types';
import { TemplateEngine } from '@/lib/template-engine';
import { FormField } from './FormField';
import { CardPreview } from './CardPreview';

interface CardBuilderProps {
  template: Template;
  initialData?: Record<string, any>;
  onDataChange?: (data: Record<string, any>) => void;
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
  const [data, setData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  useEffect(() => {
    if (template.schema.exportPresets.length > 0) {
      setSelectedPreset(template.schema.exportPresets[0].id);
    }
  }, [template]);

  const handleFieldChange = (fieldId: string, value: any) => {
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

  const validate = (): boolean => {
    const validation = TemplateEngine.validateTemplateData(template.schema, data);
    setErrors(validation.errors);
    return validation.valid;
  };

  const getData = (): Record<string, any> => data;

  const schema = template.schema;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customize Your Card</h2>
          
          <div className="space-y-4">
            {schema.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={data[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={errors[field.id]}
              />
            ))}
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
