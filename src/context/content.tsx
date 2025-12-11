'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultTexts } from '@/lib/content';

export type EditableTexts = typeof defaultTexts;

type ContentContextValue = {
  texts: EditableTexts;
  update: <K extends keyof EditableTexts>(
    section: K,
    value: Partial<EditableTexts[K]>
  ) => void;
  reset: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);
const STORAGE_KEY = 'landing-four-texts';

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [texts, setTexts] = useState<EditableTexts>(defaultTexts);

  // Load overrides from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<EditableTexts>;
        setTexts((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load saved texts', error);
    }
  }, []);

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(texts));
    } catch (error) {
      console.warn('Failed to persist texts', error);
    }
  }, [texts]);

  const update: ContentContextValue['update'] = (section, value) => {
    setTexts((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...value },
    }));
  };

  const reset = () => setTexts(defaultTexts);

  const value = useMemo(() => ({ texts, update, reset }), [texts]);

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return ctx;
}
