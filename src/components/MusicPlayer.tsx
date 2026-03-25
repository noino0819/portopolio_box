import { motion } from 'framer-motion';
import { youtubePlaylistId, youtubeFirstVideoId } from '@/data/portfolio';

interface MusicPlayerProps {
  activated: boolean;
}

export default function MusicPlayer({ activated }: MusicPlayerProps) {
  if (!activated) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-[60] w-[300px] overflow-hidden rounded-xl border border-white/10 bg-bg-dark shadow-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 text-xs text-card/70">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-red" />
        Now Playing
      </div>
      <iframe
        src={`https://www.youtube.com/embed/${youtubeFirstVideoId}?list=${youtubePlaylistId}&autoplay=1`}
        title="YouTube 플레이리스트"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-[50px] w-full"
        aria-label="YouTube 미니 플레이어"
      />
    </motion.div>
  );
}
