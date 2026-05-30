import { Template, TemplateSchema, TemplateField, TemplateFormData } from './types';

export class TemplateEngine {
  static validateField(field: TemplateField, value: unknown): { valid: boolean; error?: string } {
    const stringValue = typeof value === 'string' ? value : '';

    if (field.required && (!value || stringValue === '')) {
      return { valid: false, error: `${field.label} is required` };
    }

    if (field.maxLength && stringValue && stringValue.length > field.maxLength) {
      return { valid: false, error: `${field.label} must be ${field.maxLength} characters or less` };
    }

    if (field.validation) {
      if (field.validation.pattern && stringValue) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(stringValue)) {
          return { valid: false, error: `${field.label} format is invalid` };
        }
      }
    }

    return { valid: true };
  }

  static validateTemplateData(schema: TemplateSchema, data: TemplateFormData): {
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
    const { colors, fontFamily, baseFontSize, spacing } = schema.style;
    const baseStyles = TemplateEngine.toStringRecord({
      '--primary-color': colors.primary,
      '--secondary-color': colors.secondary,
      '--accent-color': colors.accent,
      '--background-color': colors.background,
      '--text-color': colors.text,
      '--font-family': fontFamily,
      '--base-font-size': baseFontSize,
      '--spacing-small': spacing?.small ?? '8px',
      '--spacing-medium': spacing?.medium ?? '16px',
      '--spacing-large': spacing?.large ?? '24px',
    });

    return { ...baseStyles, ...customStyles };
  }

  private static toStringRecord(styles: object): Record<string, string> {
    return Object.fromEntries(
      Object.entries(styles).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    );
  }

  static getSectionStyle(sectionId: string, schema: TemplateSchema): Record<string, string> {
    const section = schema.layout.sections.find((s) => s.id === sectionId);
    if (!section) return {};

    return TemplateEngine.toStringRecord(section.style);
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
