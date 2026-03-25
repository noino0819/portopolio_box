import { useRef, useState, useEffect } from 'react';
import { youtubePlaylistId, youtubeFirstVideoId } from '@/data/portfolio';

export default function CDDetail() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(true);

  const postCommand = (func: string, args?: unknown[]) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func, args: args ?? [] }),
      '*',
    );
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://www.youtube.com') return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.event === 'onStateChange') {
          setPlaying(data.info === 1);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="space-y-6">
      {/* 모바일 인라인 플레이어 */}
      <section aria-labelledby="player-heading" className="sm:hidden">
        <h3
          id="player-heading"
          className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold"
        >
          Now Playing
        </h3>
        <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.03]">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${youtubeFirstVideoId}?list=${youtubePlaylistId}&autoplay=1&enablejsapi=1&origin=${window.location.origin}`}
            title="YouTube 플레이리스트"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="aspect-video w-full"
            aria-label="YouTube 플레이어"
          />
          <div className="flex items-center justify-center gap-6 px-4 py-3">
            <button
              type="button"
              onClick={() => postCommand('previousVideo')}
              className="rounded-full p-2 text-card/60 transition-colors hover:bg-white/10 hover:text-card"
              aria-label="이전 곡"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                if (playing) {
                  postCommand('pauseVideo');
                } else {
                  postCommand('playVideo');
                }
                setPlaying(!playing);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors hover:bg-gold/25"
              aria-label={playing ? '일시정지' : '재생'}
            >
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => postCommand('nextVideo')}
              className="rounded-full p-2 text-card/60 transition-colors hover:bg-white/10 hover:text-card"
              aria-label="다음 곡"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-card/40">
          이 창을 닫아도 음악은 계속 재생됩니다.
        </p>
      </section>

      {/* 데스크톱용 안내 */}
      <section aria-labelledby="player-heading-desktop" className="hidden sm:block">
        <h3
          id="player-heading-desktop"
          className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold"
        >
          Now Playing
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-accent-red" />
            <p className="text-sm text-card/70">
              음악이 재생 중입니다. 하단 플레이어에서 조작하세요.
            </p>
          </div>
          <p className="mt-3 text-xs text-card/40">
            이 창을 닫아도 음악은 계속 재생됩니다.
          </p>
        </div>
      </section>

      <section aria-labelledby="story-heading">
        <h3
          id="story-heading"
          className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold"
        >
          Story
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <div className="space-y-5 font-accent text-sm leading-loose text-card/70">
            <p>
              어린 시절,
              <br />
              막연히 세상을 바꾸는 사람이 되고 싶다는 꿈을 꿨습니다.
            </p>
            <p>
              어떻게 하면 세상을 바꿀 수 있을까 고민하던 제게
              <br />
              그 답이 되어준 것은 '소프트웨어'였습니다.
            </p>
            <p>
              환경이나 조건에 상관없이
              <br />
              누구에게나 평등하게 닿을 수 있는 것.
            </p>
            <p>
              언제 어디서든 무료로 제공될 수 있고,
              <br />
              사용자의 곁에서 수만 가지의 형태로 변모하며
              <br />
              삶을 돕는 존재.
            </p>
            <p>저는 그 무한한 가능성에 매료되었습니다.</p>
            <p>
              그렇게 고등학생 시절부터
              <br />
              '세상을 바꾸는 개발자'라는 꿈을 향한 항해를 시작했습니다.
            </p>
            <p>
              오늘 제 항해의 가방을 열어본 당신에게,
              <br />
              제가 가장 아끼는 노래를 들려드리고 싶습니다.
            </p>
          </div>
          <a
            href={`https://music.youtube.com/playlist?list=${youtubePlaylistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs text-accent-blue hover:underline"
          >
            YouTube Music에서 보기 →
          </a>
        </div>
      </section>
    </div>
  );
}
