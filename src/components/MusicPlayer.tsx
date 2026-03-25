import { motion } from 'framer-motion';
import { youtubePlaylistId, youtubeFirstVideoId } from '@/data/portfolio';

interface MusicPlayerProps {
  activated: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

export default function MusicPlayer({ activated, expanded, onToggleExpand }: MusicPlayerProps) {
  if (!activated) return null;

  return (
    <motion.div
      layout
      className={`fixed z-[60] overflow-hidden rounded-xl border border-white/10 bg-bg-dark shadow-2xl ${
        expanded
          ? 'bottom-8 left-1/2 w-[90vw] max-w-[560px] -translate-x-1/2 sm:bottom-12'
          : 'bottom-4 right-4 w-[300px]'
      }`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* Header bar */}
      <button
        onClick={onToggleExpand}
        className="flex w-full items-center justify-between bg-white/5 px-3 py-2 text-xs text-card/70 transition-colors hover:bg-white/10"
        aria-label={expanded ? '미니 플레이어로 축소' : '플레이어 확대'}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-red" />
          Now Playing
        </span>
        <span>{expanded ? '▼' : '▲'}</span>
      </button>

      {/* iframe */}
      <iframe
        src={`https://www.youtube.com/embed/${youtubeFirstVideoId}?list=${youtubePlaylistId}&autoplay=1`}
        title="YouTube 플레이리스트"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className={`w-full transition-all ${expanded ? 'aspect-video' : 'h-[50px]'}`}
        aria-label="YouTube 플레이리스트 플레이어"
      />
    </motion.div>
  );
}
