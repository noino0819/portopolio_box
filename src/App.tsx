import { useState, useCallback } from 'react';
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

  const handleOpen = useCallback(() => setScreen('interior'), []);
  const handleBack = useCallback(() => setScreen('landing'), []);

  const handleSelectItem = useCallback((id: ItemId) => {
    setActiveItem(id);
    if (id === 'cd') setMusicActivated(true);
  }, []);

  const handleCloseDetail = useCallback(() => setActiveItem(null), []);

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
