import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ItemId } from './SuitcaseInterior';
import NametagDetail from './details/NametagDetail';
import BookDetail from './details/BookDetail';
import SwitchDetail from './details/SwitchDetail';
import CDDetail from './details/CDDetail';
import ItemNametag from '@/assets/ItemNametag';
import ItemBook from '@/assets/ItemBook';
import ItemSwitch from '@/assets/ItemSwitch';
import ItemCD from '@/assets/ItemCD';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DetailPanelProps {
  activeItem: ItemId | null;
  onClose: () => void;
}

const itemMeta: Record<ItemId, { label: string; subtitle?: string; Component: React.FC<{ className?: string }> }> = {
  nametag: { label: '이름표', subtitle: '만약 이름표를 직접 만들 수 있다면\n귀여운 얼굴이 그려져있었으면 좋겠어요.', Component: ItemNametag },
  book: { label: '책', subtitle: '제가 걸어온 길들에 대한 이야기입니다.\n즐거운 것들을 잔뜩 했어요 !', Component: ItemBook },
  switch: { label: '게임기', subtitle: '가장 좋아하는 걸 묻는다면 거리낌없이 게임이라 말할거에요.\n물론, 그외에도 좋아하는건 잔뜩 있지만요', Component: ItemSwitch },
  cd: { label: 'CD', subtitle: '노래에는 기억이 담긴다 생각해요.\n당신에게도 이 노래에 지금의 기억이 담긴다면 좋겠네요', Component: ItemCD },
};

const detailComponents: Record<ItemId, React.FC> = {
  nametag: NametagDetail,
  book: BookDetail,
  switch: SwitchDetail,
  cd: CDDetail,
};

export default function DetailPanel({ activeItem, onClose }: DetailPanelProps) {
  const reduced = useReducedMotion();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (activeItem) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeItem, handleKeyDown]);

  return (
    <AnimatePresence>
      {activeItem && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-label={`${itemMeta[activeItem].label} 상세 정보`}
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full max-w-[900px] flex-col overflow-hidden rounded-t-3xl bg-bg-dark shadow-2xl md:inset-y-4 md:inset-x-4 md:rounded-3xl lg:inset-y-8 lg:inset-x-auto"
            initial={reduced ? {} : { y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? {} : { y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              duration: reduced ? 0 : 0.35,
            }}
          >
            {/* Close button */}
            <div className="flex items-center justify-end p-4">
              <button
                onClick={onClose}
                className="rounded-full p-2 text-card/60 transition-colors hover:bg-white/10 hover:text-card"
                aria-label="닫기"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto scrollbar-hide px-6 pb-8 md:flex-row md:gap-8 md:px-8">
              {/* Left: Item illustration */}
              <div className="flex flex-col items-center gap-3 md:w-1/3 md:sticky md:top-0">
                <motion.div
                  initial={reduced ? {} : { scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.15, duration: reduced ? 0 : 0.2 }}
                >
                  {(() => {
                    const { Component } = itemMeta[activeItem];
                    return <Component className="w-[120px] md:w-[160px]" />;
                  })()}
                </motion.div>
                <h2 className="font-display text-xl font-bold text-gold">
                  {itemMeta[activeItem].label}
                </h2>
                {itemMeta[activeItem].subtitle && (
                  <p className="mt-1 whitespace-pre-line text-center font-accent text-xs leading-relaxed text-leather/50">
                    {itemMeta[activeItem].subtitle}
                  </p>
                )}
              </div>

              {/* Right: Detail content */}
              <motion.div
                className="flex-1"
                initial={reduced ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : 0.2, duration: reduced ? 0 : 0.3 }}
              >
                {(() => {
                  const DetailComponent = detailComponents[activeItem];
                  return <DetailComponent />;
                })()}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
