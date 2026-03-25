import { useState, useEffect, useRef, useCallback } from 'react';
import { youtubePlaylistId } from '@/data/portfolio';

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  getVideoData: () => { title: string; author: string };
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTPlayerConstructor {
  new (
    el: HTMLElement,
    config: {
      height: string;
      width: string;
      playerVars: Record<string, string | number>;
      events: Record<string, (event: { target: YTPlayer; data: number }) => void>;
    },
  ): YTPlayer;
}

declare global {
  interface Window {
    YT: {
      Player: YTPlayerConstructor;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

let ytApiLoading = false;
const ytApiCallbacks: (() => void)[] = [];

function loadYTApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    ytApiCallbacks.push(resolve);

    if (!ytApiLoading) {
      ytApiLoading = true;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => {
        ytApiCallbacks.forEach((cb) => cb());
        ytApiCallbacks.length = 0;
      };
    }
  });
}

export default function CDDetail() {
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ title: '', author: '' });
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const updateTrackInfo = useCallback(() => {
    if (!playerRef.current) return;
    try {
      const data = playerRef.current.getVideoData();
      if (data?.title) setCurrentTrack({ title: data.title, author: data.author });
    } catch {
      /* not ready */
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let player: YTPlayer | null = null;

    const init = async () => {
      try {
        await loadYTApi();
      } catch {
        if (mounted) setHasError(true);
        return;
      }

      if (!mounted || !containerRef.current) return;

      const holderEl = document.createElement('div');
      containerRef.current.appendChild(holderEl);

      player = new window.YT.Player(holderEl, {
        height: '1',
        width: '1',
        playerVars: {
          listType: 'playlist',
          list: youtubePlaylistId,
          autoplay: 0,
          controls: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (!mounted) return;
            playerRef.current = player;
            setIsReady(true);
            updateTrackInfo();
          },
          onStateChange: (event: { data: number }) => {
            if (!mounted) return;
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            updateTrackInfo();
          },
        },
      });
    };

    init();

    return () => {
      mounted = false;
      playerRef.current = null;
      try {
        player?.destroy();
      } catch {
        /* already destroyed */
      }
    };
  }, [updateTrackInfo]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  return (
    <div className="space-y-6">
      <section aria-labelledby="player-heading">
        <h3 id="player-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Now Playing
        </h3>

        <div ref={containerRef} className="fixed -left-[9999px] top-0 h-px w-px overflow-hidden" />

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          {hasError ? (
            <p className="text-sm text-accent-red/70">플레이어를 로드할 수 없습니다.</p>
          ) : currentTrack.title ? (
            <div className="space-y-1">
              <p className="font-display text-base font-semibold text-card">{currentTrack.title}</p>
              <p className="text-xs text-card/50">{currentTrack.author}</p>
            </div>
          ) : (
            <p className="text-sm text-card/40">
              {isReady ? '재생 버튼을 눌러주세요' : 'YouTube 플레이어 로딩 중...'}
            </p>
          )}

          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              onClick={() => playerRef.current?.previousVideo()}
              disabled={!isReady}
              className="rounded-full p-2 text-card/60 transition-colors hover:bg-white/10 hover:text-card disabled:opacity-30"
              aria-label="이전 곡"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              disabled={!isReady}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-blue text-white transition-colors hover:bg-accent-blue/80 disabled:opacity-30"
              aria-label={isPlaying ? '정지' : '재생'}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => playerRef.current?.nextVideo()}
              disabled={!isReady}
              className="rounded-full p-2 text-card/60 transition-colors hover:bg-white/10 hover:text-card disabled:opacity-30"
              aria-label="다음 곡"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="playlist-heading">
        <h3 id="playlist-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Playlist
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-sm text-card/70">
            제가 좋아하는 음악을 모아둔 플레이리스트입니다.
            재생 버튼을 눌러 들어보세요.
          </p>
          <a
            href={`https://music.youtube.com/playlist?list=${youtubePlaylistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs text-accent-blue hover:underline"
          >
            YouTube Music에서 보기 →
          </a>
        </div>
      </section>
    </div>
  );
}
