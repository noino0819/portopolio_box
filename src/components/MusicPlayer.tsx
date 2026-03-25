import { useState, useEffect, useRef } from 'react';
import { youtubePlaylistId, youtubeFirstVideoId } from '@/data/portfolio';

interface MusicPlayerProps {
  activated: boolean;
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 640px)').matches : true,
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return desktop;
}

export default function MusicPlayer({ activated }: MusicPlayerProps) {
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useIsDesktop();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!activated) return;

    const handler = (e: Event) => {
      const { command } = (e as CustomEvent).detail as { command: string };
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*',
      );
    };

    window.addEventListener('music-control', handler);
    return () => window.removeEventListener('music-control', handler);
  }, [activated]);

  if (!activated) return null;

  const iframeSrc = `https://www.youtube.com/embed/${youtubeFirstVideoId}?list=${youtubePlaylistId}&autoplay=1&enablejsapi=1&origin=${window.location.origin}`;

  if (!isDesktop) {
    return (
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="YouTube 플레이리스트"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        aria-hidden="true"
        className="pointer-events-none fixed"
        style={{ width: 1, height: 1, left: -9999, top: -9999, opacity: 0 }}
      />
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] overflow-hidden rounded-xl border border-white/10 bg-bg-dark shadow-2xl"
      style={{
        width: expanded ? 480 : 300,
        transition: 'width 0.3s ease, height 0.3s ease',
      }}
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
        ref={iframeRef}
        src={iframeSrc}
        title="YouTube 플레이리스트"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen={expanded}
        style={{
          width: '100%',
          height: expanded ? 270 : 50,
          transition: 'height 0.3s ease',
        }}
        aria-label="YouTube 플레이어"
      />
    </div>
  );
}
