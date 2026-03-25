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

      // 살짝 들어올림
      await controls.start({
        scale: 1.05,
        y: -8,
        transition: { duration: 0.2, ease: 'easeOut' },
      });

      // 크게 줌인하며 내부를 들여다보는 느낌
      await controls.start({
        scale: 1.8,
        y: 0,
        opacity: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
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
