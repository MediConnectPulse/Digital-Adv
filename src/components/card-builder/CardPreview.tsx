import React from 'react';
import { Template, TemplateFormData } from '@/lib/types';
import { TemplateEngine } from '@/lib/template-engine';

interface CardPreviewProps {
  template: Template;
  data: TemplateFormData;
  exportPreset?: string;
  showWatermark?: boolean;
  watermarkText?: string;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  template,
  data,
  exportPreset,
  showWatermark = false,
  watermarkText = 'Made with PromoCard',
}) => {
  const schema = template.schema;
  const styleVariables = TemplateEngine.applyStyleVariables(schema, typeof data.primaryColor === 'string' && data.primaryColor ? {
    '--primary-color': data.primaryColor,
  } : {});

  const renderFieldContent = (fieldId: string) => {
    const value = data[fieldId];
    const field = TemplateEngine.getFieldById(schema, fieldId);

    if (!value) return null;

    if (field?.type === 'image' && typeof value === 'string') {
      return <img src={value} alt={field.label} className="w-full h-full object-cover" />;
    }

    return <span>{value}</span>;
  };

  const renderSection = (sectionId: string) => {
    const sectionStyle = TemplateEngine.getSectionStyle(sectionId, schema);
    const fields = TemplateEngine.getFieldsBySection(schema, sectionId);

    return (
      <div
        style={{
          ...sectionStyle,
          backgroundColor: sectionStyle.backgroundColor || schema.style.colors.background,
        }}
        className="w-full"
      >
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className={getFieldClassName(field.type)}>
              {renderFieldContent(field.id)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getFieldClassName = (fieldType: string) => {
    switch (fieldType) {
      case 'image':
        return 'w-24 h-24 rounded-full overflow-hidden mx-auto';
      default:
        return 'text-sm';
    }
  };

  const preset = exportPreset
    ? schema.exportPresets.find((p) => p.id === exportPreset)
    : schema.exportPresets[0];

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: preset ? preset.width / 2 : 400,
    aspectRatio: preset ? `${preset.width}/${preset.height}` : 'auto',
    ...styleVariables,
  };

  return (
    <div
      id="card-preview"
      style={containerStyle}
      className="relative bg-white shadow-2xl rounded-xl overflow-hidden mx-auto"
    >
      <div
        style={{
          fontFamily: schema.style.fontFamily,
          fontSize: schema.style.baseFontSize,
          color: schema.style.colors.text,
        }}
      >
        {schema.layout.sections.map((section) => (
          <div key={section.id}>{renderSection(section.id)}</div>
        ))}
      </div>

      {showWatermark && (
        <div className="absolute bottom-2 right-2 text-xs opacity-50 text-gray-500">
          {watermarkText}
        </div>
      )}
    </div>
  );
};
