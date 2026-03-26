import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { PortfolioBundle, PortfolioMeta } from '@/contexts/PortfolioContext';
import type { Language } from '@/i18n/LanguageContext';

interface PortfolioRow {
  id: string;
  user_id: string | null;
  slug: string;
  youtube_playlist_id: string | null;
  youtube_first_video_id: string | null;
  hidden_items: string[] | null;
  item_positions: Record<string, { x: number; y: number }> | null;
}

interface PortfolioDataRow {
  profile: unknown;
  education: unknown;
  certifications: unknown;
  projects: unknown;
  awards: unknown;
  games: unknown;
  albums: unknown;
  books: unknown;
  hobbies: unknown;
  cd_story: unknown;
  item_labels: unknown;
  note_content: unknown;
}

function mapDataRow(row: PortfolioDataRow): PortfolioBundle {
  return {
    profile: row.profile as PortfolioBundle['profile'],
    education: row.education as PortfolioBundle['education'],
    certifications: row.certifications as PortfolioBundle['certifications'],
    projects: row.projects as PortfolioBundle['projects'],
    awards: row.awards as PortfolioBundle['awards'],
    games: row.games as PortfolioBundle['games'],
    albums: row.albums as PortfolioBundle['albums'],
    books: row.books as PortfolioBundle['books'],
    hobbies: row.hobbies as PortfolioBundle['hobbies'],
    cdStory: row.cd_story as string[],
    itemLabels: (row.item_labels as Record<string, PortfolioBundle['itemLabels']> | null) as PortfolioBundle['itemLabels'] ?? {},
    noteContent: (row.note_content as PortfolioBundle['noteContent']) ?? {},
  };
}

interface UsePortfolioResult {
  meta: PortfolioMeta | null;
  data: PortfolioBundle | null;
  availableLangs: string[];
  loading: boolean;
  error: string | null;
}

export function usePortfolio(slug: string | undefined, lang: Language): UsePortfolioResult {
  const [meta, setMeta] = useState<PortfolioMeta | null>(null);
  const [data, setData] = useState<PortfolioBundle | null>(null);
  const [availableLangs, setAvailableLangs] = useState<string[]>(['ko']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('No slug provided');
      return;
    }

    let cancelled = false;

    async function fetchPortfolio() {
      setLoading(true);
      setError(null);

      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug!)
        .single();

      if (portfolioError || !portfolio) {
        if (!cancelled) {
          setError('Portfolio not found');
          setLoading(false);
        }
        return;
      }

      const p = portfolio as unknown as PortfolioRow;

      const { data: langRows } = await supabase
        .from('portfolio_data')
        .select('lang')
        .eq('portfolio_id', p.id);
      const langs = langRows
        ? (langRows as { lang: string }[]).map((r) => r.lang)
        : ['ko'];
      if (!cancelled) setAvailableLangs(langs.length > 0 ? langs : ['ko']);

      const { data: portfolioData, error: dataError } = await supabase
        .from('portfolio_data')
        .select('*')
        .eq('portfolio_id', p.id)
        .eq('lang', lang)
        .single();

      if (!cancelled) {
        const metaObj: PortfolioMeta = {
          id: p.id,
          slug: p.slug,
          userId: p.user_id,
          youtubePlaylistId: p.youtube_playlist_id,
          youtubeFirstVideoId: p.youtube_first_video_id,
          hiddenItems: Array.isArray(p.hidden_items) ? p.hidden_items as string[] : [],
          itemPositions: (p.item_positions && typeof p.item_positions === 'object' && !Array.isArray(p.item_positions))
            ? p.item_positions as Record<string, { x: number; y: number }>
            : {},
        };

        if (dataError || !portfolioData) {
          const { data: fallbackData } = await supabase
            .from('portfolio_data')
            .select('*')
            .eq('portfolio_id', p.id)
            .eq('lang', 'ko')
            .single();

          if (fallbackData) {
            setMeta(metaObj);
            setData(mapDataRow(fallbackData as unknown as PortfolioDataRow));
          } else {
            setError('Portfolio data not found');
          }
        } else {
          setMeta(metaObj);
          setData(mapDataRow(portfolioData as unknown as PortfolioDataRow));
        }
        setLoading(false);
      }
    }

    fetchPortfolio();
    return () => { cancelled = true; };
  }, [slug, lang]);

  return { meta, data, availableLangs, loading, error };
}
