import { motion } from 'framer-motion';
import SuitcaseOpen from '@/assets/SuitcaseOpen';
import ItemNametag from '@/assets/ItemNametag';
import ItemBook from '@/assets/ItemBook';
import ItemSwitch from '@/assets/ItemSwitch';
import ItemCD from '@/assets/ItemCD';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type ItemId = 'nametag' | 'book' | 'switch' | 'cd';

interface SuitcaseInteriorProps {
  onSelectItem: (id: ItemId) => void;
  onBack: () => void;
}

const items: {
  id: ItemId;
  label: string;
  sublabel: string;
  Component: React.FC<{ className?: string }>;
  position: string;
  rotation: string;
  size: string;
  color: string;
}[] = [
  {
    id: 'nametag',
    label: '이름표',
    sublabel: '프로필 & 연락처',
    Component: ItemNametag,
    position: 'top-[8%] left-[12%] sm:top-[6%] sm:left-[14%]',
    rotation: '-rotate-3',
    size: 'w-[80px] sm:w-[100px] md:w-[115px]',
    color: 'hover:shadow-accent-teal/30',
  },
  {
    id: 'book',
    label: '책',
    sublabel: '프로젝트 & 경험',
    Component: ItemBook,
    position: 'top-[12%] right-[14%] sm:top-[10%] sm:right-[16%]',
    rotation: 'rotate-6',
    size: 'w-[90px] sm:w-[110px] md:w-[130px]',
    color: 'hover:shadow-accent-purple/30',
  },
  {
    id: 'switch',
    label: '닌텐도 스위치',
    sublabel: '취미 & 관심사',
    Component: ItemSwitch,
    position: 'bottom-[22%] left-[12%] sm:bottom-[20%] sm:left-[14%]',
    rotation: '-rotate-3',
    size: 'w-[120px] sm:w-[145px] md:w-[170px]',
    color: 'hover:shadow-accent-pink/30',
  },
  {
    id: 'cd',
    label: 'CD',
    sublabel: '플레이리스트',
    Component: ItemCD,
    position: 'bottom-[20%] right-[14%] sm:bottom-[18%] sm:right-[16%]',
    rotation: 'rotate-3',
    size: 'w-[90px] sm:w-[110px] md:w-[130px]',
    color: 'hover:shadow-accent-blue/30',
  },
];

export default function SuitcaseInterior({ onSelectItem, onBack }: SuitcaseInteriorProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="flex min-h-dvh items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="fixed left-4 top-4 z-50 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-display text-sm text-card backdrop-blur-md transition-colors hover:bg-white/10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: reduced ? 0 : 0.4 }}
        aria-label="가방 닫기, 랜딩으로 돌아가기"
      >
        ← 뒤로
      </motion.button>

      {/* Suitcase interior container */}
      <div className="relative aspect-square w-full max-w-[500px]">
        <SuitcaseOpen className="absolute inset-0 h-full w-full" />

        {/* Items */}
        {items.map((item, i) => {
          const { id, label, sublabel, Component, position, rotation, size, color } = item;
          return (
            <motion.button
              key={id}
              onClick={() => onSelectItem(id)}
              className={`absolute ${position} ${rotation} group cursor-pointer border-none bg-transparent p-2`}
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduced ? 0 : 0.3 + i * 0.08,
                duration: reduced ? 0 : 0.4,
                ease: 'easeOut',
              }}
              whileHover={reduced ? {} : { y: -6, scale: 1.05 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              aria-label={`${label} 열기 - ${sublabel}`}
              role="button"
            >
              <div className={`transition-shadow duration-300 ${color} rounded-lg drop-shadow-lg group-hover:drop-shadow-2xl`}>
                <Component className={size} />
              </div>
              <span className="mt-1 block font-accent text-xs text-gold/80 opacity-0 transition-opacity group-hover:opacity-100">
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
