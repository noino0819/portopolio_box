import { useState, useEffect } from 'react';
import { youtubePlaylistId } from '@/data/portfolio';
import { useLanguage } from '@/i18n/LanguageContext';
import { t } from '@/i18n/ui';
import { getPortfolio } from '@/i18n/portfolioData';

function dispatchMusicControl(command: string) {
  window.dispatchEvent(new CustomEvent('music-control', { detail: { command } }));
}

export default function CDDetail() {
  const [playing, setPlaying] = useState(true);
  const { lang } = useLanguage();
  const { cdStory } = getPortfolio(lang);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://www.youtube.com') return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.event === 'onStateChange') setPlaying(data.info === 1);
      } catch { /* ignore */ }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="space-y-6">
      <section aria-labelledby="player-heading" className="sm:hidden">
        <h3 id="player-heading" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          {t('cd.nowPlaying', lang)}
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center justify-center gap-6 py-2">
            <button type="button" onClick={() => dispatchMusicControl('previousVideo')} className="rounded-full p-2 text-card/60 transition-colors hover:bg-white/10 hover:text-card" aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
            </button>
            <button type="button" onClick={() => { dispatchMusicControl(playing ? 'pauseVideo' : 'playVideo'); setPlaying(!playing); }} className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors hover:bg-gold/25" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button type="button" onClick={() => dispatchMusicControl('nextVideo')} className="rounded-full p-2 text-card/60 transition-colors hover:bg-white/10 hover:text-card" aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
            </button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-red" />
            <p className="text-xs text-card/50">{playing ? t('cd.playing', lang) : t('cd.paused', lang)}</p>
          </div>
          <p className="mt-3 text-center text-xs text-card/40">{t('cd.keepPlaying', lang)}</p>
        </div>
      </section>

      <section aria-labelledby="player-heading-desktop" className="hidden sm:block">
        <h3 id="player-heading-desktop" className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          {t('cd.nowPlaying', lang)}
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-accent-red" />
            <p className="text-sm text-card/70">{t('cd.desktopHint', lang)}</p>
          </div>
          <p className="mt-3 text-xs text-card/40">{t('cd.keepPlaying', lang)}</p>
        </div>
      </section>

      <section aria-labelledby="story-heading">
        <h3 id="story-heading" className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-gold">
          {t('cd.story', lang)}
        </h3>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
          <div className="space-y-5 font-accent text-sm leading-loose text-card/70">
            {cdStory.map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
          <a href={`https://music.youtube.com/playlist?list=${youtubePlaylistId}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs text-accent-blue hover:underline">
            {t('cd.viewOnYoutube', lang)}
          </a>
        </div>
      </section>
    </div>
  );
}
