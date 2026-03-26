import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'ko' | 'en' | 'ja' | 'de' | 'zh' | 'es' | 'fr';

export const LANGUAGE_LABELS: Record<Language, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  de: 'Deutsch',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
  de: '🇩🇪',
  zh: '🇨🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
};

export const LANGUAGE_ORDER: Language[] = ['ko', 'en', 'ja', 'de', 'es', 'fr', 'zh'];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
});

const SUPPORTED_LANGUAGES: Language[] = LANGUAGE_ORDER;

function detectBrowserLanguage(): Language {
  const languages = navigator.languages ?? [navigator.language];
  for (const raw of languages) {
    const code = raw.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(code as Language)) {
      return code as Language;
    }
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio-lang');
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) return saved as Language;
    return detectBrowserLanguage();
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('portfolio-lang', l);
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : l;
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function sortLanguages(langs: string[]): Language[] {
  const order = LANGUAGE_ORDER;
  return [...langs].sort((a, b) => {
    const ia = order.indexOf(a as Language);
    const ib = order.indexOf(b as Language);
    const oa = ia === -1 ? 999 : ia;
    const ob = ib === -1 ? 999 : ib;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  }) as Language[];
}
