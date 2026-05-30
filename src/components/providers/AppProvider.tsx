'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadAppState, PersistedAppState, saveAppState } from '@/lib/app-store';
import { AuthService } from '@/lib/auth';
import { MonetizationService } from '@/lib/monetization';
import { roleToPlanId } from '@/lib/role-utils';
import {
  AppSettings,
  FeatureFlag,
  Plan,
  Template,
  User,
} from '@/lib/types';

interface AppContextValue {
  isReady: boolean;
  user: User | null;
  userPlanId: string;
  appSettings: AppSettings;
  plans: Plan[];
  templates: Template[];
  featureFlags: FeatureFlag[];
  refreshUser: () => void;
  signInAsRole: (role: User['role']) => User;
  signOut: () => void;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlag[]>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings>(
    () => loadAppState().appSettings
  );
  const [plans, setPlans] = useState<Plan[]>(() => loadAppState().plans);
  const [templates, setTemplates] = useState<Template[]>(() => loadAppState().templates);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(
    () => loadAppState().featureFlags
  );

  useEffect(() => {
    const current = AuthService.getCurrentUser();
    if (current) {
      AuthService.saveUser(current);
    }
    // Client-only session hydration after mount
    queueMicrotask(() => {
      setUser(current);
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const state: PersistedAppState = { appSettings, plans, templates, featureFlags };
    saveAppState(state);
  }, [appSettings, plans, templates, featureFlags, isReady]);

  const refreshUser = useCallback(() => {
    setUser(AuthService.getCurrentUser());
  }, []);

  const signInAsRole = useCallback(
    (role: User['role']) => {
      const signedIn = AuthService.signInAsRole(role);
      setUser(signedIn);
      return signedIn;
    },
    []
  );

  const signOut = useCallback(() => {
    AuthService.signOut();
    setUser(null);
  }, []);

  const userPlanId = useMemo(() => {
    if (!user) return 'plan-free';
    const plan = MonetizationService.getUserPlan(user, plans);
    return plan.id || roleToPlanId(user.role);
  }, [user, plans]);

  const value = useMemo<AppContextValue>(
    () => ({
      isReady,
      user,
      userPlanId,
      appSettings,
      plans,
      templates,
      featureFlags,
      refreshUser,
      signInAsRole,
      signOut,
      setAppSettings,
      setPlans,
      setTemplates,
      setFeatureFlags,
    }),
    [
      isReady,
      user,
      userPlanId,
      appSettings,
      plans,
      templates,
      featureFlags,
      refreshUser,
      signInAsRole,
      signOut,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
