import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import SuitcaseOpen from '@/assets/SuitcaseOpen';
import ItemNametag from '@/assets/ItemNametag';
import ItemBook from '@/assets/ItemBook';
import ItemSwitch from '@/assets/ItemSwitch';
import ItemCD from '@/assets/ItemCD';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useOpenSound } from '@/hooks/useOpenSound';
import { useItemSounds } from '@/hooks/useItemSounds';
import { useBumpSound } from '@/hooks/useBumpSound';

export type ItemId = 'nametag' | 'book' | 'switch' | 'cd';

interface SuitcaseInteriorProps {
  onSelectItem: (id: ItemId) => void;
  onBack: () => void;
}

interface ItemDef {
  id: ItemId;
  label: string;
  sublabel: string;
  Component: React.FC<{ className?: string }>;
  rotation: string;
  size: string;
  color: string;
  defaultX: number;
  defaultY: number;
}

const itemDefs: ItemDef[] = [
  {
    id: 'nametag',
    label: '이름표',
    sublabel: '프로필 & 연락처',
    Component: ItemNametag,
    rotation: '-rotate-3',
    size: 'w-[78px] sm:w-[98px] md:w-[113px]',
    color: 'hover:shadow-accent-teal/30',
    defaultX: 18,
    defaultY: 22,
  },
  {
    id: 'book',
    label: '책',
    sublabel: '프로젝트 & 경험',
    Component: ItemBook,
    rotation: 'rotate-6',
    size: 'w-[90px] sm:w-[110px] md:w-[130px]',
    color: 'hover:shadow-accent-purple/30',
    defaultX: 62,
    defaultY: 16,
  },
  {
    id: 'switch',
    label: '게임기',
    sublabel: '취미 & 관심사',
    Component: ItemSwitch,
    rotation: '-rotate-3',
    size: 'w-[180px] sm:w-[218px] md:w-[255px]',
    color: 'hover:shadow-accent-pink/30',
    defaultX: 12,
    defaultY: 62,
  },
  {
    id: 'cd',
    label: 'CD',
    sublabel: '플레이리스트',
    Component: ItemCD,
    rotation: 'rotate-3',
    size: 'w-[90px] sm:w-[110px] md:w-[130px]',
    color: 'hover:shadow-accent-blue/30',
    defaultX: 65,
    defaultY: 60,
  },
];

const DRAG_THRESHOLD = 6;

export default function SuitcaseInterior({ onSelectItem, onBack }: SuitcaseInteriorProps) {
  const reduced = useReducedMotion();
  const playOpen = useOpenSound();
  const sounds = useItemSounds();
  const playBump = useBumpSound();
  const containerRef = useRef<HTMLDivElement>(null);

  const [tappedItem, setTappedItem] = useState<ItemId | null>(null);
  const [nudgeItem, setNudgeItem] = useState<ItemId | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdleTimer = useCallback(() => {
    setNudgeItem(null);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setNudgeItem('nametag'), 7000);
  }, []);

  useEffect(() => {
    if (reduced) return;
    resetIdleTimer();
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [resetIdleTimer, reduced]);

  const [zCounter, setZCounter] = useState(1);
  const [zOrders, setZOrders] = useState<Record<ItemId, number>>({
    nametag: 1, book: 1, switch: 1, cd: 1,
  });

  const bringToFront = useCallback((id: ItemId) => {
    setZCounter((c) => {
      const next = c + 1;
      setZOrders((prev) => ({ ...prev, [id]: next }));
      return next;
    });
  }, []);

  const [positions, setPositions] = useState<Record<ItemId, { x: number; y: number }>>(() => {
    const saved = sessionStorage.getItem('item-positions');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return Object.fromEntries(
      itemDefs.map((d) => [d.id, { x: d.defaultX, y: d.defaultY }]),
    ) as Record<ItemId, { x: number; y: number }>;
  });

  useEffect(() => {
    sessionStorage.setItem('item-positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    playOpen();
  }, [playOpen]);

  const dragState = useRef<{
    id: ItemId;
    startPointerX: number;
    startPointerY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const clampedEdges = useRef({ left: false, right: false, top: false, bottom: false });

  const getContainerRect = useCallback(() => containerRef.current?.getBoundingClientRect(), []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, id: ItemId) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      resetIdleTimer();
      bringToFront(id);
      clampedEdges.current = { left: false, right: false, top: false, bottom: false };
      dragState.current = {
        id,
        startPointerX: e.clientX,
        startPointerY: e.clientY,
        startX: positions[id].x,
        startY: positions[id].y,
        moved: false,
      };
    },
    [positions, bringToFront, resetIdleTimer],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const ds = dragState.current;
      const rect = getContainerRect();
      if (!ds || !rect) return;

      const dx = e.clientX - ds.startPointerX;
      const dy = e.clientY - ds.startPointerY;

      if (!ds.moved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;
      ds.moved = true;

      const el = e.currentTarget as HTMLElement;
      const maxX = Math.max(5, ((rect.width - el.offsetWidth) / rect.width) * 100);
      const maxY = Math.max(5, ((rect.height - el.offsetHeight) / rect.height) * 100);

      const rawX = ds.startX + (dx / rect.width) * 100;
      const rawY = ds.startY + (dy / rect.height) * 100;
      const clampedX = Math.max(2, Math.min(maxX, rawX));
      const clampedY = Math.max(2, Math.min(maxY, rawY));

      const hitLeft = rawX < 2;
      const hitRight = rawX > maxX;
      const hitTop = rawY < 2;
      const hitBottom = rawY > maxY;

      const prev = clampedEdges.current;
      const newEdgeHit =
        (hitLeft && !prev.left) ||
        (hitRight && !prev.right) ||
        (hitTop && !prev.top) ||
        (hitBottom && !prev.bottom);

      if (newEdgeHit) playBump();

      clampedEdges.current = { left: hitLeft, right: hitRight, top: hitTop, bottom: hitBottom };

      setPositions((prev) => ({
        ...prev,
        [ds.id]: { x: clampedX, y: clampedY },
      }));
    },
    [getContainerRect, playBump],
  );

  const handlePointerUp = useCallback(
    (_e: React.PointerEvent, id: ItemId) => {
      const ds = dragState.current;
      if (!ds) return;
      const wasDrag = ds.moved;
      dragState.current = null;

      if (!wasDrag) {
        sounds[id]();
        bringToFront(id);
        setTappedItem(id);
        setTimeout(() => {
          setTappedItem(null);
          onSelectItem(id);
        }, 200);
      }
    },
    [sounds, onSelectItem, bringToFront],
  );

  return (
    <motion.div
      className="flex min-h-dvh items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
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

      <div ref={containerRef} className="relative aspect-square w-full max-w-[500px]">
        <SuitcaseOpen className="absolute inset-0 h-full w-full" />

        {itemDefs.map((item, i) => {
          const { id, label, sublabel, Component, rotation, size, color } = item;
          const pos = positions[id];
          return (
            <motion.div
              key={id}
              className={`absolute w-max ${rotation} group touch-none`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                cursor: dragState.current?.id === id ? 'grabbing' : 'grab',
                zIndex: zOrders[id],
              }}
              initial={reduced ? {} : { opacity: 0, y: 20, scale: 1 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: tappedItem === id ? 1.15 : 1,
              }}
              transition={
                tappedItem === id
                  ? { scale: { duration: 0.15, ease: 'easeOut' } }
                  : {
                      delay: reduced ? 0 : 0.3 + i * 0.08,
                      duration: reduced ? 0 : 0.4,
                      ease: 'easeOut',
                      scale: { duration: 0.1, ease: 'easeOut', delay: 0 },
                    }
              }
              whileHover={reduced ? {} : { scale: 1.12 }}
              onPointerDown={(e) => handlePointerDown(e, id)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(e, id)}
              role="button"
              tabIndex={0}
              aria-label={`${label} 열기 - ${sublabel} (드래그하여 이동 가능)`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  resetIdleTimer();
                  sounds[id]();
                  bringToFront(id);
                  setTappedItem(id);
                  setTimeout(() => {
                    setTappedItem(null);
                    onSelectItem(id);
                  }, 200);
                }
              }}
            >
              <div
                className={`p-2 transition-shadow duration-300 ${color} rounded-lg drop-shadow-lg group-hover:drop-shadow-2xl ${nudgeItem === id ? 'animate-nudge' : ''}`}
                onAnimationEnd={() => { if (nudgeItem === id) setNudgeItem(null); }}
              >
                <Component className={size} />
              </div>
              <span className="mt-1 block text-center font-accent text-xs text-gold/80 opacity-0 transition-opacity group-hover:opacity-100">
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
