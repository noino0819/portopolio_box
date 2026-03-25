import { useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import SuitcaseClosed from '@/assets/SuitcaseClosed';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useKnockSound } from '@/hooks/useKnockSound';

interface LandingProps {
  onOpen: () => void;
}

export default function Landing({ onOpen }: LandingProps) {
  const reduced = useReducedMotion();
  const playKnock = useKnockSound();
  const controls = useAnimation();
  const [isOpening, setIsOpening] = useState(false);

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

      // 살짝 확대 후 열림
      await controls.start({
        scale: 1.08,
        y: -10,
        transition: { duration: 0.3, ease: 'easeOut' },
      });

      // 위로 올라가며 페이드
      await controls.start({
        scale: 1.15,
        y: -40,
        opacity: 0,
        transition: { duration: 0.35, ease: 'easeIn' },
      });
    }

    onOpen();
  }, [isOpening, playKnock, reduced, controls, onOpen]);

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
        animate={controls}
        className="group relative cursor-pointer border-none bg-transparent p-0"
        whileHover={isOpening || reduced ? {} : { scale: 1.03 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        role="button"
        aria-label="여행가방 두드려 열기"
        disabled={isOpening}
      >
        <SuitcaseClosed className="w-[280px] drop-shadow-2xl sm:w-[340px] md:w-[400px]" />
      </motion.button>

      <motion.p
        className="mt-8 font-accent text-lg tracking-wide text-gold"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.5, duration: reduced ? 0 : 0.6 }}
      >
        <motion.span
          animate={reduced ? {} : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          두드려 안을 보기
        </motion.span>
      </motion.p>
    </motion.div>
  );
}
