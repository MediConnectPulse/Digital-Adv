import { Template, TemplateSchema, TemplateField } from './types';

export class TemplateEngine {
  static validateField(field: TemplateField, value: any): { valid: boolean; error?: string } {
    if (field.required && (!value || value === '')) {
      return { valid: false, error: `${field.label} is required` };
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return { valid: false, error: `${field.label} must be ${field.maxLength} characters or less` };
    }

    if (field.validation) {
      if (field.validation.pattern && value) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          return { valid: false, error: `${field.label} format is invalid` };
        }
      }
    }

    return { valid: true };
  }

  static validateTemplateData(schema: TemplateSchema, data: Record<string, any>): {
    valid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    schema.fields.forEach((field) => {
      const validation = this.validateField(field, data[field.id]);
      if (!validation.valid && validation.error) {
        errors[field.id] = validation.error;
      }
    });

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static getTemplateFields(schema: TemplateSchema): TemplateField[] {
    return schema.fields;
  }

  static getFieldById(schema: TemplateSchema, fieldId: string): TemplateField | undefined {
    return schema.fields.find((field) => field.id === fieldId);
  }

  static getFieldsBySection(schema: TemplateSchema, sectionId: string): TemplateField[] {
    const section = schema.layout.sections.find((s) => s.id === sectionId);
    if (!section) return [];

    return section.fields
      .map((fieldId) => this.getFieldById(schema, fieldId))
      .filter((field): field is TemplateField => field !== undefined);
  }

  static getExportPresets(schema: TemplateSchema) {
    return schema.exportPresets;
  }

  static applyStyleVariables(schema: TemplateSchema, customStyles?: Record<string, string>): Record<string, string> {
    const baseStyles = {
      '--primary-color': schema.style.colors.primary,
      '--secondary-color': schema.style.colors.secondary,
      '--accent-color': schema.style.colors.accent,
      '--background-color': schema.style.colors.background,
      '--text-color': schema.style.colors.text,
      '--font-family': schema.style.fontFamily,
      '--base-font-size': schema.style.baseFontSize,
      '--spacing-small': schema.style.spacing?.small || '8px',
      '--spacing-medium': schema.style.spacing?.medium || '16px',
      '--spacing-large': schema.style.spacing?.large || '24px',
    };

    return { ...baseStyles, ...customStyles };
  }

  static getSectionStyle(sectionId: string, schema: TemplateSchema): Record<string, string> {
    const section = schema.layout.sections.find((s) => s.id === sectionId);
    if (!section) return {};

    return section.style;
  }

  static filterTemplatesByPlan(templates: Template[], userPlanId: string): Template[] {
    return templates.filter((template) => {
      if (!template.isPremium) return true;
      if (template.requiredPlan.includes(userPlanId)) return true;
      if (template.requiredPlan.includes('*')) return true;
      return false;
    });
  }

  static filterTemplatesByCategory(templates: Template[], category: string): Template[] {
    return templates.filter((template) => template.category === category);
  }

  static filterTemplatesByNiche(templates: Template[], niche: string): Template[] {
    return templates.filter((template) => template.niche === niche);
  }

  static getActiveTemplates(templates: Template[]): Template[] {
    return templates.filter((template) => template.isActive);
  }

  static sortTemplatesByOrder(templates: Template[]): Template[] {
    return [...templates].sort((a, b) => a.order - b.order);
  }
}
