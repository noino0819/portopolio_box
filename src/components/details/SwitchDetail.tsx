import { games, hobbies } from '@/data/portfolio';

export default function SwitchDetail() {
  return (
    <div className="space-y-8">
      {/* Hobbies */}
      <section aria-labelledby="hobbies-heading">
        <h3 id="hobbies-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((h) => (
            <span
              key={h.label}
              className="rounded-full border border-accent-pink/20 bg-accent-pink/10 px-3 py-1.5 text-sm text-accent-pink"
            >
              {h.emoji} {h.label}
            </span>
          ))}
        </div>
      </section>

      {/* Games */}
      <section aria-labelledby="games-heading">
        <h3 id="games-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          Favorite Games
        </h3>
        <div className="space-y-3">
          {games.map((game) => (
            <div
              key={game.title}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display text-sm font-semibold text-card">{game.title}</h4>
                <span className="shrink-0 rounded bg-accent-pink/15 px-2 py-0.5 font-code text-[10px] text-accent-pink">
                  {game.platform}
                </span>
              </div>
              <p className="mt-1 font-accent text-xs text-card/60 italic">"{game.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
