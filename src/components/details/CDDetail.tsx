import { youtubePlaylistId } from '@/data/portfolio';

export default function CDDetail() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="player-heading">
        <h3 id="player-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
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

      <section aria-labelledby="playlist-heading">
        <h3 id="playlist-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Playlist
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-sm text-card/70">
            제가 좋아하는 음악을 모아둔 플레이리스트입니다.
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
