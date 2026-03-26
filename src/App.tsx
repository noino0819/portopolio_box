import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Landing from '@/components/Landing';
import SuitcaseInterior from '@/components/SuitcaseInterior';
import DetailPanel from '@/components/DetailPanel';
import MusicPlayer from '@/components/MusicPlayer';
import Settings from '@/components/Settings';
import EditButton from '@/components/edit/EditButton';
import EditPanel from '@/components/edit/EditPanel';
import { useLanguage } from '@/i18n/LanguageContext';
import { t } from '@/i18n/ui';
import { usePortfolioMeta } from '@/contexts/PortfolioContext';
import type { ItemId } from '@/components/SuitcaseInterior';

type Screen = 'landing' | 'interior';

export default function App() {
  const { lang } = useLanguage();
  const meta = usePortfolioMeta();
  const [screen, setScreen] = useState<Screen>('landing');
  const [editOpen, setEditOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ItemId | null>(null);
  const [musicActivated, setMusicActivated] = useState(false);

  useEffect(() => {
    const title = meta.pageTitle || `${meta.slug}의 여행가방`;
    document.title = title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag && meta.pageDescription) {
      descTag.setAttribute('content', meta.pageDescription);
    }
  }, [meta.pageTitle, meta.pageDescription, meta.slug]);

  const navigateTo = useCallback((target: Screen, item: ItemId | null = null) => {
    setScreen(target);
    setActiveItem(item);
  }, []);

  const handleOpen = useCallback(() => {
    history.pushState({ screen: 'interior' }, '');
    navigateTo('interior');
  }, [navigateTo]);

  const handleBack = useCallback(() => {
    history.back();
  }, []);

  const handleSelectItem = useCallback((id: ItemId) => {
    history.pushState({ screen: 'interior', item: id }, '');
    setActiveItem(id);
    if (id === 'cd') setMusicActivated(true);
  }, []);

  const lastCloseRef = useRef(0);

  useEffect(() => {
    if (!activeItem) {
      lastCloseRef.current = Date.now();
    }
  }, [activeItem]);

  const handleCloseDetail = useCallback(() => {
    if (!activeItem) return;
    const now = Date.now();
    if (now - lastCloseRef.current < 500) return;
    lastCloseRef.current = now;
    history.back();
  }, [activeItem]);

  useEffect(() => {
    history.replaceState({ screen: 'landing' }, '');

    const onPopState = (e: PopStateEvent) => {
      const state = e.state as { screen?: Screen; item?: ItemId } | null;

      if (!state || state.screen === 'landing') {
        navigateTo('landing');
      } else if (state.screen === 'interior') {
        navigateTo('interior', state.item ?? null);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [navigateTo]);

  return (
    <>
      <Settings />
      <main className="min-h-dvh bg-bg-dark">
        <h1 className="sr-only">{t('srOnly.title', lang)}</h1>

        <AnimatePresence mode="wait">
          {screen === 'landing' && <Landing key="landing" onOpen={handleOpen} />}
          {screen === 'interior' && (
            <SuitcaseInterior
              key="interior"
              onSelectItem={handleSelectItem}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>

        <DetailPanel activeItem={activeItem} onClose={handleCloseDetail} />

        <MusicPlayer activated={musicActivated} />

        <EditButton onClick={() => setEditOpen(true)} />
        <EditPanel open={editOpen} onClose={() => setEditOpen(false)} />
      </main>
    </>
  );
}
