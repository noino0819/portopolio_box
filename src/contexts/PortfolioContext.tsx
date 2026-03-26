import { createContext, useContext, type ReactNode } from 'react';
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
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({
  meta,
  data,
  isOwner,
  children,
}: PortfolioContextType & { children: ReactNode }) {
  return (
    <PortfolioContext.Provider value={{ meta, data, isOwner }}>
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
