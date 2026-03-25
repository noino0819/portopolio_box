import { useState } from 'react';
import { youtubePlaylistId, youtubeFirstVideoId } from '@/data/portfolio';

interface MusicPlayerProps {
  activated: boolean;
}

export default function MusicPlayer({ activated }: MusicPlayerProps) {
  const [expanded, setExpanded] = useState(false);

  if (!activated) return null;

  return (
    <div
      className={`fixed z-[60] overflow-hidden rounded-xl border border-white/10 bg-bg-dark shadow-2xl transition-all duration-300 ${
        expanded
          ? 'bottom-8 left-1/2 w-[90vw] max-w-[560px] -translate-x-1/2 sm:bottom-12'
          : 'bottom-4 right-4 w-[300px]'
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="relative z-10 flex w-full cursor-pointer items-center justify-between bg-white/5 px-3 py-2.5 text-xs text-card/70 transition-colors hover:bg-white/10"
        aria-label={expanded ? '미니 플레이어로 축소' : '플레이어 확대'}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-red" />
          Now Playing
        </span>
        <span>{expanded ? '▼' : '▲'}</span>
      </button>
      <iframe
        src={`https://www.youtube.com/embed/${youtubeFirstVideoId}?list=${youtubePlaylistId}&autoplay=1`}
        title="YouTube 플레이리스트"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen={expanded}
        className={`w-full ${expanded ? 'aspect-video' : 'h-[50px]'}`}
        aria-label="YouTube 플레이어"
      />
    </div>
  );
}
