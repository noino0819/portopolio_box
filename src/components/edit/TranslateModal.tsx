import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGE_LABELS, LANGUAGE_FLAGS, LANGUAGE_ORDER, type Language } from '@/i18n/LanguageContext';
import type { PortfolioBundle } from '@/contexts/PortfolioContext';
import { downloadMarkdown, readMarkdownFile, markdownToBundle } from '@/lib/portfolioMarkdown';

type Step = 'choose' | 'loading' | 'done' | 'error';

interface TranslateModalProps {
  open: boolean;
  onClose: () => void;
  editLang: Language;
  availableLangs: Language[];
  draft: PortfolioBundle;
  slug: string;
  onImport: (bundle: PortfolioBundle, targetLang: Language) => void;
}

const LOADING_MESSAGES = [
  '짐을 싸는 중...',
  '비행기에 탑승하는 중...',
  '다른 나라로 뻗어나가는 중...',
  '도착! 짐을 풀고 있어요...',
];

export default function TranslateModal({
  open,
  onClose,
  editLang,
  availableLangs,
  draft,
  slug,
  onImport,
}: TranslateModalProps) {
  const [step, setStep] = useState<Step>('choose');
  const [targetLang, setTargetLang] = useState<Language | null>(null);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetState = useCallback(() => {
    setStep('choose');
    setTargetLang(null);
    setLoadingIdx(0);
    setErrorMsg('');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const handleExport = () => {
    downloadMarkdown(draft, editLang, slug);
  };

  const startLoadingAnimation = (cb: () => void) => {
    setStep('loading');
    setLoadingIdx(0);
    let idx = 0;
    timerRef.current = setInterval(() => {
      idx++;
      if (idx < LOADING_MESSAGES.length) {
        setLoadingIdx(idx);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        cb();
      }
    }, 800);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetLang) return;

    e.target.value = '';

    startLoadingAnimation(async () => {
      try {
        const text = await readMarkdownFile(file);
        const { bundle } = markdownToBundle(text);

        if (!bundle.profile.name && !bundle.profile.headline && bundle.education.length === 0) {
          throw new Error('파일을 파싱할 수 없습니다. 마크다운 형식을 확인해주세요.');
        }

        setStep('done');
        setTimeout(() => {
          onImport(bundle, targetLang);
          handleClose();
        }, 1200);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다.');
        setStep('error');
      }
    });
  };

  const allLangs = LANGUAGE_ORDER.filter((l) => l !== editLang);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[310] w-[360px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-bg-dark shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {step === 'choose' && (
              <div className="p-5">
                <h3 className="mb-1 font-display text-sm font-bold text-card">
                  번역 도우미
                </h3>
                <p className="mb-4 text-[11px] leading-relaxed text-card/50">
                  현재 <span className="font-semibold text-gold">{LANGUAGE_LABELS[editLang]}</span> 데이터를 다른 언어로 옮겨보세요.
                </p>

                {/* Target language */}
                <div className="mb-4">
                  <label className="mb-1.5 block text-[11px] text-card/40">번역할 언어 선택</label>
                  <div className="flex flex-wrap gap-1.5">
                    {allLangs.map((l) => {
                      const exists = availableLangs.includes(l);
                      return (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setTargetLang(l)}
                          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] transition-all ${
                            targetLang === l
                              ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                              : 'bg-white/5 text-card/60 hover:bg-white/10'
                          }`}
                        >
                          <span>{LANGUAGE_FLAGS[l]}</span>
                          <span>{LANGUAGE_LABELS[l]}</span>
                          {exists && <span className="text-[9px] text-accent-teal/60">DB</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="flex w-full items-center gap-2.5 rounded-xl bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-teal/15 text-base">
                      📥
                    </span>
                    <div>
                      <p className="text-xs font-medium text-card">마크다운 내보내기</p>
                      <p className="text-[10px] text-card/40">현재 언어 데이터를 .md 파일로 다운로드</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={!targetLang}
                    className="flex w-full items-center gap-2.5 rounded-xl bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-purple/15 text-base">
                      📤
                    </span>
                    <div>
                      <p className="text-xs font-medium text-card">번역 파일 가져오기</p>
                      <p className="text-[10px] text-card/40">
                        {targetLang
                          ? `번역된 .md를 ${LANGUAGE_LABELS[targetLang]}(으)로 업로드`
                          : '먼저 번역할 언어를 선택하세요'}
                      </p>
                    </div>
                  </button>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".md,.txt,.markdown"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-4 w-full rounded-lg py-2 text-[11px] text-card/40 transition-colors hover:text-card/60"
                >
                  닫기
                </button>
              </div>
            )}

            {step === 'loading' && (
              <div className="flex flex-col items-center px-5 py-10">
                {/* Airplane animation */}
                <div className="relative mb-6 h-24 w-24">
                  {/* Orbit path */}
                  <div className="absolute inset-2 rounded-full border border-dashed border-white/10" />
                  {/* Globe */}
                  <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-30">
                    🌍
                  </div>
                  {/* Flying airplane */}
                  <motion.div
                    className="absolute text-2xl"
                    animate={{
                      x: [48, 80, 48, 16, 48],
                      y: [8, 48, 88, 48, 8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{ left: -8, top: -8 }}
                  >
                    ✈️
                  </motion.div>
                </div>

                {/* Source → Target flags */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xl">{LANGUAGE_FLAGS[editLang]}</span>
                  <motion.span
                    className="text-card/30"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✦ ✦ ✦
                  </motion.span>
                  <span className="text-xl">{targetLang ? LANGUAGE_FLAGS[targetLang] : '🌐'}</span>
                </div>

                {/* Loading messages */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingIdx}
                    className="text-xs text-card/60"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {LOADING_MESSAGES[loadingIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}

            {step === 'done' && (
              <motion.div
                className="flex flex-col items-center px-5 py-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="mb-4 text-4xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                >
                  🎉
                </motion.div>
                <p className="mb-1 text-sm font-semibold text-card">번역 완료!</p>
                <p className="text-[11px] text-card/50">내용을 확인하고 수정한 뒤 저장해주세요.</p>
              </motion.div>
            )}

            {step === 'error' && (
              <div className="p-5">
                <div className="mb-4 flex flex-col items-center">
                  <span className="mb-2 text-3xl">⚠️</span>
                  <p className="text-sm font-semibold text-accent-red">오류 발생</p>
                  <p className="mt-1 text-center text-[11px] text-card/50">{errorMsg}</p>
                </div>
                <button
                  type="button"
                  onClick={resetState}
                  className="w-full rounded-lg bg-white/5 py-2 text-xs text-card/70 transition-colors hover:bg-white/10"
                >
                  다시 시도
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
