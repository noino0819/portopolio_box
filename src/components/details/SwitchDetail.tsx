import { useLanguage } from '@/i18n/LanguageContext';
import { t } from '@/i18n/ui';
import { getPortfolio } from '@/i18n/portfolioData';

export default function SwitchDetail() {
  const { lang } = useLanguage();
  const { games, hobbies, albums, books } = getPortfolio(lang);

  return (
    <div className="space-y-8">
      <section aria-labelledby="hobbies-heading">
        <h3 id="hobbies-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          {t('switch.interests', lang)}
        </h3>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((h) => (
            <span key={h.label} className="rounded-full border border-accent-pink/20 bg-accent-pink/10 px-3 py-1.5 text-sm text-accent-pink">
              {h.emoji} {h.label}
            </span>
          ))}
        </div>
      </section>

      <section aria-labelledby="games-heading">
        <h3 id="games-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">{t('switch.games', lang)}</h3>
        <div className="space-y-3">
          {games.map((game) => (
            <div key={game.title} className="rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display text-sm font-semibold text-card">{game.title}</h4>
                <span className="shrink-0 rounded bg-accent-pink/15 px-2 py-0.5 font-code text-[10px] text-accent-pink">{game.platform}</span>
              </div>
              <p className="mt-1 font-accent text-xs text-card/60 italic">"{game.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="music-heading">
        <h3 id="music-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">{t('switch.albums', lang)}</h3>
        <div className="space-y-3">
          {albums.map((album) => (
            <div key={`${album.artist}-${album.title}`} className="rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]">
              <div className="flex items-baseline gap-2">
                <h4 className="font-display text-sm font-semibold text-card">{album.title}</h4>
                <span className="text-xs text-card/50">— {album.artist}</span>
              </div>
              <p className="mt-1 font-accent text-xs text-card/60 italic">"{album.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="books-heading">
        <h3 id="books-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">{t('switch.books', lang)}</h3>
        <div className="space-y-3">
          {books.map((book) => (
            <div key={book.author} className="rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]">
              <h4 className="font-display text-sm font-semibold text-card">{book.author}</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {book.titles.map((tt) => (<span key={tt} className="rounded bg-accent-purple/15 px-2 py-0.5 text-xs text-accent-purple">{tt}</span>))}
              </div>
              <p className="mt-2 font-accent text-xs text-card/60 italic">"{book.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
