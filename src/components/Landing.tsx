import { motion } from 'framer-motion';
import SuitcaseClosed from '@/assets/SuitcaseClosed';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LandingProps {
  onOpen: () => void;
}

export default function Landing({ onOpen }: LandingProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      <motion.button
        onClick={onOpen}
        className="group relative cursor-pointer border-none bg-transparent p-0"
        whileHover={reduced ? {} : { scale: 1.03 }}
        whileTap={reduced ? {} : { scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        role="button"
        aria-label="여행가방 열기"
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
          두드려 안을보기
        </motion.span>
      </motion.p>
    </motion.div>
  );
}
