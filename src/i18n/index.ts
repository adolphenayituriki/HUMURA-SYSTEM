import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { en, type Translations } from './locales/en';
import { fr } from './locales/fr';
import { rw } from './locales/rw';

export type Lang = 'en' | 'fr' | 'rw';

const TRANSLATIONS: Record<Lang, Translations> = { en, fr, rw };

const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  fr: 'Français',
  rw: 'Kinyarwanda',
};

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: () => Translations;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
      t: () => TRANSLATIONS[get().lang] ?? en,
    }),
    { name: 'humura-lang' }
  )
);

export function t() {
  return useI18nStore.getState().t();
}

export { TRANSLATIONS, LANG_LABELS };
