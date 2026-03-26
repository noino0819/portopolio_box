import { memo } from 'react';
import { useIsOwner } from '@/contexts/PortfolioContext';

interface EditButtonProps {
  onClick: () => void;
}

export default memo(function EditButton({ onClick }: EditButtonProps) {
  const isOwner = useIsOwner();
  if (!isOwner) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[65] flex h-12 w-12 items-center justify-center rounded-full bg-gold shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Edit portfolio"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-bg-dark">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
});
