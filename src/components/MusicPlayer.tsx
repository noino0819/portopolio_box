import { useState } from 'react';
import { youtubePlaylistId, youtubeFirstVideoId } from '@/data/portfolio';

interface MusicPlayerProps {
  activated: boolean;
}

export default function MusicPlayer({ activated }: MusicPlayerProps) {
  const [expanded, setExpanded] = useState(false);

  if (!activated) return null;

  if (!expanded) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(true)}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(true)}
        className="fixed bottom-4 right-4 z-[60] w-[300px] cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-bg-dark shadow-2xl transition-transform hover:scale-[1.02]"
        aria-label="플레이어 확대"
      >
        <div className="flex items-center justify-between bg-white/5 px-3 py-2 text-xs text-card/70">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-red" />
            Now Playing
          </span>
          <span>▲</span>
        </div>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeFirstVideoId}?list=${youtubePlaylistId}&autoplay=1`}
          title="YouTube 플레이리스트"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="pointer-events-none h-[50px] w-full"
          aria-label="YouTube 미니 플레이어"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center pb-8 sm:pb-12">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setExpanded(false)}
        aria-hidden="true"
      />
      <div className="relative w-[90vw] max-w-[560px] overflow-hidden rounded-xl border border-white/10 bg-bg-dark shadow-2xl">
        <button
          onClick={() => setExpanded(false)}
          className="flex w-full items-center justify-between bg-white/5 px-3 py-2 text-xs text-card/70 transition-colors hover:bg-white/10"
          aria-label="미니 플레이어로 축소"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-red" />
            Now Playing
          </span>
          <span>▼</span>
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeFirstVideoId}?list=${youtubePlaylistId}&autoplay=1`}
          title="YouTube 플레이리스트"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="aspect-video w-full"
          aria-label="YouTube 플레이어"
        />
      </div>
    </div>
  );
}
