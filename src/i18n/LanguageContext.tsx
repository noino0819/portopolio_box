import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'ko' | 'en' | 'ja' | 'zh';

export const LANGUAGE_LABELS: Record<Language, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
});

const SUPPORTED_LANGUAGES: Language[] = ['ko', 'en', 'ja', 'zh'];

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
