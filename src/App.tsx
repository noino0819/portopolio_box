import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Landing from '@/components/Landing';
import SuitcaseInterior from '@/components/SuitcaseInterior';
import DetailPanel from '@/components/DetailPanel';
import MusicPlayer from '@/components/MusicPlayer';
import type { ItemId } from '@/components/SuitcaseInterior';

type Screen = 'landing' | 'interior';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [activeItem, setActiveItem] = useState<ItemId | null>(null);
  const [musicActivated, setMusicActivated] = useState(false);

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
    <main className="min-h-dvh bg-bg-dark">
      <h1 className="sr-only">Suitcase Portfolio</h1>

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
    </main>
  );
}
