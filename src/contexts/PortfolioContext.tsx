import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  Profile,
  Education,
  Certification,
  Project,
  Award,
  Game,
  Album,
  Book,
  Hobby,
} from '@/data/portfolio';

export interface ItemLabel {
  label?: string;
  sublabel?: string;
  subtitle?: string;
}

export interface PortfolioBundle {
  profile: Profile;
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  games: Game[];
  albums: Album[];
  books: Book[];
  hobbies: Hobby[];
  cdStory: string[];
  itemLabels?: Record<string, ItemLabel>;
}

export interface PortfolioMeta {
  id: string;
  slug: string;
  userId: string | null;
  youtubePlaylistId: string | null;
  youtubeFirstVideoId: string | null;
}

interface PortfolioContextType {
  meta: PortfolioMeta;
  data: PortfolioBundle;
  isOwner: boolean;
  updateData: (data: PortfolioBundle) => void;
  updateMeta: (meta: Partial<PortfolioMeta>) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({
  meta: initialMeta,
  data: initialData,
  isOwner,
  children,
}: { meta: PortfolioMeta; data: PortfolioBundle; isOwner: boolean; children: ReactNode }) {
  const [data, setData] = useState(initialData);
  const [meta, setMeta] = useState(initialMeta);

  const updateData = useCallback((newData: PortfolioBundle) => {
    setData(newData);
  }, []);

  const updateMeta = useCallback((partial: Partial<PortfolioMeta>) => {
    setMeta((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <PortfolioContext.Provider value={{ meta, data, isOwner, updateData, updateMeta }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData(): PortfolioBundle {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolioData must be used within PortfolioProvider');
  return ctx.data;
}

export function usePortfolioMeta(): PortfolioMeta {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolioMeta must be used within PortfolioProvider');
  return ctx.meta;
}

export function useIsOwner(): boolean {
  const ctx = useContext(PortfolioContext);
  return ctx?.isOwner ?? false;
}

export function useUpdatePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('useUpdatePortfolio must be used within PortfolioProvider');
  return { updateData: ctx.updateData, updateMeta: ctx.updateMeta };
}
