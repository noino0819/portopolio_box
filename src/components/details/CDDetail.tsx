import { youtubePlaylistId } from '@/data/portfolio';

export default function CDDetail() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="player-heading">
        <h3 id="player-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Now Playing
        </h3>

        <div className="overflow-hidden rounded-xl border border-white/5">
          <iframe
            src={`https://www.youtube.com/embed/videoseries?list=${youtubePlaylistId}`}
            title="YouTube 플레이리스트"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="aspect-video w-full"
            aria-label="YouTube 플레이리스트 플레이어"
          />
        </div>
      </section>

      <section aria-labelledby="playlist-heading">
        <h3 id="playlist-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Playlist
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-sm text-card/70">
            제가 좋아하는 음악을 모아둔 플레이리스트입니다.
            위 플레이어에서 바로 감상하실 수 있습니다.
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
