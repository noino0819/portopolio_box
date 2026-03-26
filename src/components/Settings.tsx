import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LANGUAGE_LABELS, LANGUAGE_FLAGS, sortLanguages } from '@/i18n/LanguageContext';
import { t } from '@/i18n/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useAvailableLangs, usePortfolioMeta } from '@/contexts/PortfolioContext';
import gearImg from '@/assets/gear.png';

async function generateQrDataUrl(text: string, width: number): Promise<string> {
  const QRCode = await import('qrcode');
  const toDataURL = QRCode.toDataURL ?? QRCode.default?.toDataURL;
  return toDataURL(text, {
    width,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' },
    errorCorrectionLevel: 'H',
  });
}

export default function Settings() {
  const { lang, setLang } = useLanguage();
  const { user, signOut, deleteAccount } = useAuth();
  const { availableLangs } = useAvailableLangs();
  const meta = usePortfolioMeta();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const langOptions = sortLanguages(availableLangs.length > 0 ? availableLangs : ['ko']);

  const portfolioUrl = `${window.location.origin}/${meta.slug}`;

  const generateQr = useCallback(async () => {
    setQrOpen(true);
    try {
      const url = await generateQrDataUrl(portfolioUrl, 512);
      setQrDataUrl(url);
    } catch {
      setQrDataUrl(null);
    }
  }, [portfolioUrl]);

  const downloadQr = useCallback(async () => {
    try {
      const url = await generateQrDataUrl(portfolioUrl, 1024);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${meta.slug}-qr.png`;
      a.click();
    } catch { /* ignore */ }
  }, [portfolioUrl, meta.slug]);

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
                  {langOptions.map((l) => (
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
                        {LANGUAGE_FLAGS[l] ?? '🌐'}
                      </span>
                      <span>{LANGUAGE_LABELS[l]}</span>
                      {lang === l && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 px-4 py-3">
                <button
                  type="button"
                  onClick={() => { setOpen(false); generateQr(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-card/70 transition-colors hover:bg-white/[0.06] hover:text-card"
                >
                  <span className="text-base">📱</span>
                  <span>QR 코드 내보내기</span>
                </button>
              </div>

              <div className="border-t border-white/5 px-4 py-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 truncate text-[10px] text-card/40">{user.email}</p>
                      {(() => {
                        const provider = (user.app_metadata?.provider as string) ?? 'email';
                        const badge: Record<string, { icon: string; label: string }> = {
                          google: { icon: '🔵', label: 'Google' },
                          kakao: { icon: '🟡', label: 'Kakao' },
                          github: { icon: '⚫', label: 'GitHub' },
                          email: { icon: '✉️', label: 'Email' },
                        };
                        const b = badge[provider] ?? badge.email;
                        return (
                          <span className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-card/40">
                            {b.icon} {b.label}
                          </span>
                        );
                      })()}
                    </div>
                    <button
                      type="button"
                      onClick={async () => { await signOut(); setOpen(false); }}
                      className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs text-card/70 transition-colors hover:bg-white/10 hover:text-card"
                    >
                      로그아웃
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(true)}
                      className="w-full rounded-lg px-3 py-1.5 text-[10px] text-red-400/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      회원탈퇴
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

      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!deleting) setDeleteConfirm(false); }}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 z-[110] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-red-500/20 bg-bg-dark p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-display text-base font-bold text-red-400">회원탈퇴</h3>
              </div>

              <div className="mb-5 space-y-2 rounded-lg bg-red-500/5 p-3">
                <p className="text-xs leading-relaxed text-card/80">
                  탈퇴 시 아래 데이터가 <span className="font-semibold text-red-400">즉시 영구 삭제</span>되며,
                  복구할 수 없습니다.
                </p>
                <ul className="space-y-1 pl-1 text-[11px] text-card/60">
                  <li>• 포트폴리오 데이터 (모든 언어)</li>
                  <li>• 물건 배치 및 설정</li>
                  <li>• 결제 내역</li>
                  <li>• 계정 및 모든 개인정보</li>
                </ul>
              </div>

              {deleteError && (
                <p className="mb-3 rounded bg-red-500/10 px-3 py-2 text-xs text-red-400">{deleteError}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => { setDeleteConfirm(false); setDeleteError(null); }}
                  className="flex-1 rounded-lg bg-white/5 py-2.5 text-xs text-card/70 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true);
                    setDeleteError(null);
                    const { error } = await deleteAccount();
                    if (error) {
                      setDeleteError(error);
                      setDeleting(false);
                    } else {
                      setDeleteConfirm(false);
                      setOpen(false);
                      setDeleting(false);
                      navigate('/');
                    }
                  }}
                  className="flex-1 rounded-lg bg-red-500/20 py-2.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50"
                >
                  {deleting ? '처리 중...' : '탈퇴하기'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {qrOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQrOpen(false)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 z-[110] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-bg-dark p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-card">QR 코드</h3>
                <button
                  onClick={() => setQrOpen(false)}
                  className="rounded-full p-1 text-card/40 transition-colors hover:text-card"
                  aria-label="닫기"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col items-center gap-4">
                {qrDataUrl ? (
                  <div className="rounded-xl bg-white p-3">
                    <img src={qrDataUrl} alt="QR Code" className="h-48 w-48" draggable={false} />
                  </div>
                ) : (
                  <div className="flex h-48 w-48 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                  </div>
                )}

                <p className="max-w-full truncate text-center text-[10px] text-card/40">
                  {portfolioUrl}
                </p>

                <div className="flex w-full gap-2">
                  <button
                    type="button"
                    onClick={downloadQr}
                    className="flex-1 rounded-lg bg-gold/15 py-2.5 text-xs font-medium text-gold transition-colors hover:bg-gold/25"
                  >
                    PNG 다운로드
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(portfolioUrl);
                    }}
                    className="rounded-lg bg-white/5 px-4 py-2.5 text-xs text-card/60 transition-colors hover:bg-white/10 hover:text-card"
                  >
                    URL 복사
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
