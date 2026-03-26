import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SuitcaseOpen from '@/assets/SuitcaseOpen';
import ItemNametag from '@/assets/ItemNametag';
import ItemBook from '@/assets/ItemBook';
import ItemSwitch from '@/assets/ItemSwitch';
import ItemCD from '@/assets/ItemCD';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useOpenSound } from '@/hooks/useOpenSound';
import { useItemSounds } from '@/hooks/useItemSounds';
import { useBumpSound } from '@/hooks/useBumpSound';
import { useLanguage } from '@/i18n/LanguageContext';
import { t } from '@/i18n/ui';
import noteImg from '@/assets/note.png';

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
  const bump = useBumpSound();
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const [tappedItem, setTappedItem] = useState<ItemId | null>(null);
  const [nudgeItem, setNudgeItem] = useState<ItemId | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [noteReleased, setNoteReleased] = useState(
    () => sessionStorage.getItem('note-released') === 'true',
  );
  const [noteDropping, setNoteDropping] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [notePos, setNotePos] = useState<{ x: number; y: number }>(() => {
    const saved = sessionStorage.getItem('note-pos');
    if (saved) try { return JSON.parse(saved); } catch { /* ignore */ }
    return { x: 62, y: 28 };
  });
  const noteReleasedRef = useRef(noteReleased);

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

  const [, setZCounter] = useState(1);
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
    bump.prepare();
  }, [playOpen, bump]);

  useEffect(() => {
    if (!noteOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setNoteOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [noteOpen]);

  const dragState = useRef<{
    id: ItemId;
    startPointerX: number;
    startPointerY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const clampedEdges = useRef({ left: false, right: false, top: false, bottom: false });

  const bookShakeRef = useRef<{
    lastY: number;
    dir: 'up' | 'down' | null;
    reversals: number;
  }>({ lastY: 0, dir: null, reversals: 0 });

  const getContainerRect = useCallback(() => containerRef.current?.getBoundingClientRect(), []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, id: ItemId) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      resetIdleTimer();
      bump.prepare();
      bringToFront(id);
      clampedEdges.current = { left: false, right: false, top: false, bottom: false };
      if (id === 'book') {
        bookShakeRef.current = { lastY: e.clientY, dir: null, reversals: 0 };
      }
      dragState.current = {
        id,
        startPointerX: e.clientX,
        startPointerY: e.clientY,
        startX: positions[id].x,
        startY: positions[id].y,
        moved: false,
      };
    },
    [positions, bringToFront, resetIdleTimer, bump],
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

      if (ds.id === 'book' && !noteReleasedRef.current) {
        const shake = bookShakeRef.current;
        const deltaY = e.clientY - shake.lastY;
        const MIN_MOVE = 10;
        if (Math.abs(deltaY) > MIN_MOVE) {
          const newDir = deltaY > 0 ? 'down' : 'up';
          if (shake.dir && newDir !== shake.dir) {
            shake.reversals++;
            if (shake.reversals >= 4) {
              const pos = { x: Math.min(78, ds.startX + 3), y: Math.min(78, ds.startY + 12) };
              noteReleasedRef.current = true;
              setNoteReleased(true);
              setNotePos(pos);
              setNoteDropping(true);
              sessionStorage.setItem('note-released', 'true');
              sessionStorage.setItem('note-pos', JSON.stringify(pos));
              setTimeout(() => bump.play(), 350);
            }
          }
          shake.dir = newDir;
          shake.lastY = e.clientY;
        }
      }

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

      if (newEdgeHit) bump.play();

      clampedEdges.current = { left: hitLeft, right: hitRight, top: hitTop, bottom: hitBottom };

      setPositions((prev) => ({
        ...prev,
        [ds.id]: { x: clampedX, y: clampedY },
      }));
    },
    [getContainerRect, bump],
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
        aria-label={t('interior.backAria', lang)}
      >
        {t('interior.back', lang)}
      </motion.button>

      <div ref={containerRef} className="relative aspect-square w-full max-w-[500px]">
        <SuitcaseOpen className="absolute inset-0 h-full w-full" />

        {noteReleased && (
          <motion.div
            className="group absolute cursor-pointer"
            style={{ left: `${notePos.x}%`, top: `${notePos.y}%`, zIndex: 0 }}
            initial={noteDropping ? { y: -30, opacity: 0, rotate: -20 } : false}
            animate={{ y: 0, opacity: 1, rotate: 8 }}
            transition={
              noteDropping
                ? { type: 'spring', damping: 10, stiffness: 180, delay: 0.15 }
                : { duration: 0 }
            }
            onAnimationComplete={() => setNoteDropping(false)}
            onClick={() => { setNoteOpen(true); resetIdleTimer(); }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            role="button"
            tabIndex={0}
            aria-label={t('note.title', lang)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNoteOpen(true); }
            }}
          >
            <div className="p-1 drop-shadow-lg group-hover:drop-shadow-2xl">
              <img
                src={noteImg}
                alt={t('note.title', lang)}
                className="w-[35px] sm:w-[45px] md:w-[55px]"
                draggable={false}
              />
            </div>
            <span className="mt-1 block text-center font-accent text-xs text-gold/80 opacity-0 transition-opacity group-hover:opacity-100">
              {t('note.title', lang)}
            </span>
          </motion.div>
        )}

        {itemDefs.map((item, i) => {
          const { id, Component, rotation, size, color } = item;
          const label = t(`items.${id}.label`, lang);
          const sublabel = t(`items.${id}.sublabel`, lang);
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
              aria-label={`${label} - ${sublabel} (${t('detail.dragHint', lang)})`}
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

      <AnimatePresence>
        {noteOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNoteOpen(false)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 z-[61] w-[260px]"
              style={{ translateX: '-50%', translateY: '-50%' }}
              initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotate: 5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="relative overflow-hidden rounded-lg bg-amber-50 px-6 pb-7 pt-5 shadow-2xl">
                <button
                  onClick={() => setNoteOpen(false)}
                  className="absolute right-2 top-2 rounded-full p-1 text-amber-800/30 transition-colors hover:text-amber-800"
                  aria-label={t('detail.close', lang)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex flex-col items-center gap-3">
                  <img src={noteImg} alt="" className="w-14" draggable={false} />
                  <h3 className="font-display text-lg font-bold text-amber-900">
                    {t('note.title', lang)}
                  </h3>
                  <div className="w-10 border-t border-amber-300/60" />
                  <p className="whitespace-pre-line text-center font-accent text-sm leading-relaxed text-amber-800">
                    {t('note.line1', lang)}{'\n'}{t('note.line2', lang)}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
