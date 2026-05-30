import {
  seedAppSettings,
  seedFeatureFlags,
  seedPlans,
  seedTemplates,
} from './seed-data';
import { AppSettings, FeatureFlag, Plan, Template } from './types';

export interface PersistedAppState {
  appSettings: AppSettings;
  plans: Plan[];
  templates: Template[];
  featureFlags: FeatureFlag[];
}

const STORAGE_KEY = 'promocard_app_state';

function reviveDates<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => reviveDates(item)) as T;
  }
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      result[key] = reviveDates(entry);
    }
    return result as T;
  }
  return value;
}

export function getDefaultAppState(): PersistedAppState {
  return {
    appSettings: seedAppSettings,
    plans: seedPlans,
    templates: seedTemplates,
    featureFlags: seedFeatureFlags,
  };
}

export function loadAppState(): PersistedAppState {
  if (typeof window === 'undefined') {
    return getDefaultAppState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultAppState();
    return reviveDates(JSON.parse(raw)) as PersistedAppState;
  } catch {
    return getDefaultAppState();
  }
}

export function saveAppState(state: PersistedAppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
