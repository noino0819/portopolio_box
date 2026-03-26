import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LANGUAGE_LABELS, type Language } from '@/i18n/LanguageContext';
import { t } from '@/i18n/ui';
import { useAuth } from '@/contexts/AuthContext';
import gearImg from '@/assets/gear.png';

const LANGUAGES: Language[] = ['ko', 'en', 'ja', 'zh'];

export default function Settings() {
  const { lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-[70] p-1 transition-opacity hover:opacity-80"
        aria-label={t('settings.title', lang)}
      >
        <img src={gearImg} alt="" className="h-9 w-9 drop-shadow-lg" draggable={false} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-label={t('settings.title', lang)}
              aria-modal="true"
              className="fixed right-4 top-16 z-[90] w-56 overflow-hidden rounded-2xl border border-white/10 bg-bg-dark shadow-2xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="border-b border-white/5 px-4 py-3">
                <h3 className="font-display text-sm font-semibold text-card">
                  {t('settings.title', lang)}
                </h3>
              </div>

              <div className="px-4 py-3">
                <p className="mb-2 text-xs text-card/50">{t('settings.language', lang)}</p>
                <div className="space-y-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => { setLang(l); setOpen(false); }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        lang === l
                          ? 'bg-gold/15 text-gold'
                          : 'text-card/70 hover:bg-white/[0.06] hover:text-card'
                      }`}
                    >
                      <span className="text-base">
                        {l === 'ko' ? '🇰🇷' : l === 'en' ? '🇺🇸' : l === 'ja' ? '🇯🇵' : '🇨🇳'}
                      </span>
                      <span>{LANGUAGE_LABELS[l]}</span>
                      {lang === l && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 px-4 py-3">
                {user ? (
                  <div className="space-y-2">
                    <p className="truncate text-[10px] text-card/40">{user.email}</p>
                    <button
                      type="button"
                      onClick={async () => { await signOut(); setOpen(false); }}
                      className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs text-card/70 transition-colors hover:bg-white/10 hover:text-card"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { navigate('/login'); setOpen(false); }}
                    className="w-full rounded-lg bg-gold/15 px-3 py-2 text-xs text-gold transition-colors hover:bg-gold/25"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
