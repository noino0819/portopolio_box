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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio-lang');
    if (saved && ['ko', 'en', 'ja', 'zh'].includes(saved)) return saved as Language;
    return 'ko';
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
