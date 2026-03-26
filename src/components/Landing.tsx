import { useState, useCallback, useEffect, memo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import SuitcaseClosed from '@/assets/SuitcaseClosed';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useKnockSound } from '@/hooks/useKnockSound';
import { useLanguage } from '@/i18n/LanguageContext';
import { t } from '@/i18n/ui';

interface LandingProps {
  onOpen: () => void;
}

const EMPTY_HOVER = {} as const;
const LANDING_HOVER = { scale: 1.03 } as const;

export default memo(function Landing({ onOpen }: LandingProps) {
  const reduced = useReducedMotion();
  const playKnock = useKnockSound();
  const { lang } = useLanguage();
  const controls = useAnimation();
  const textControls = useAnimation();
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    textControls.start({
      opacity: 1,
      y: 0,
      transition: { delay: reduced ? 0 : 0.5, duration: reduced ? 0 : 0.6 },
    });
  }, [textControls, reduced]);

  const handleClick = useCallback(async () => {
    if (isOpening) return;
    setIsOpening(true);

    playKnock();

    if (!reduced) {
      // 똑똑 흔들림
      await controls.start({
        rotate: [0, -2, 2, -2, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      });

      // 살짝 들어올림
      await controls.start({
        scale: 1.05,
        y: -8,
        transition: { duration: 0.2, ease: 'easeOut' },
      });

      // 크게 줌인하며 내부를 들여다보는 느낌 + 텍스트 동시 페이드아웃
      textControls.start({
        opacity: 0,
        y: 10,
        transition: { duration: 0.4, ease: 'easeIn' },
      });
      await controls.start({
        scale: 1.8,
        y: 0,
        opacity: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
      });
    }

    onOpen();
  }, [isOpening, playKnock, reduced, controls, textControls, onOpen]);

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      <motion.button
        onClick={handleClick}
        initial={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
        animate={controls}
        className="group relative cursor-pointer border-none bg-transparent p-0"
        whileHover={isOpening || reduced ? EMPTY_HOVER : LANDING_HOVER}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        role="button"
        aria-label={t('landing.ariaLabel', lang)}
        disabled={isOpening}
      >
        <SuitcaseClosed className="w-[280px] drop-shadow-2xl sm:w-[340px] md:w-[400px]" />
      </motion.button>

      <motion.p
        className="mt-8 font-display text-lg font-medium tracking-wide text-gold drop-shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={textControls}
      >
        <span className={reduced ? '' : 'animate-soft-pulse'}>
          {isOpening ? t('landing.hintOpening', lang) : t('landing.hint', lang)}
        </span>
      </motion.p>

      <p className="fixed bottom-4 left-4 right-4 text-center text-[10px] leading-relaxed text-card/20 sm:left-auto sm:text-right">
        {t('landing.credit', lang)}
      </p>
    </motion.div>
  );
});
