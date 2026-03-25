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

      <section aria-labelledby="story-heading">
        <h3 id="story-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Story
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <div className="space-y-4 font-accent text-sm leading-relaxed text-card/70">
            <p>
              어린 시절, 막연히 세상을 바꾸는 사람이 되고 싶다는 꿈을 꿨습니다.
              어떻게 하면 세상을 바꿀 수 있을까 고민하던 제게 그 답이 되어준 것은
              '소프트웨어'였습니다.
            </p>
            <p>
              환경이나 조건에 상관없이 누구에게나 평등하게 닿을 수 있는 것.
              언제 어디서든 무료로 제공될 수 있고, 사용자의 곁에서 수만 가지의
              형태로 변모하며 삶을 돕는 존재.
              저는 그 무한한 가능성에 매료되었습니다.
            </p>
            <p>
              그렇게 고등학생 시절부터 '세상을 바꾸는 개발자'라는 꿈을 향한 항해를
              시작했습니다. 오늘 제 항해의 가방을 열어본 당신에게, 제가 가장 아끼는
              노래를 들려드리고 싶습니다.
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
