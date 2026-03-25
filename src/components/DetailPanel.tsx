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

const itemMeta: Record<ItemId, { label: string; Component: React.FC<{ className?: string }> }> = {
  nametag: { label: '이름표', Component: ItemNametag },
  book: { label: '책', Component: ItemBook },
  switch: { label: '닌텐도 스위치', Component: ItemSwitch },
  cd: { label: 'CD', Component: ItemCD },
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
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-8 md:flex-row md:gap-8 md:px-8">
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
