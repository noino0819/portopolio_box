import type { PortfolioBundle, PortfolioMeta } from '@/contexts/PortfolioContext';

interface CachedPortfolio {
  meta: PortfolioMeta;
  langData: Record<string, PortfolioBundle>;
  availableLangs: string[];
  fetchedAt: number;
}

const cache = new Map<string, CachedPortfolio>();

const MAX_AGE_MS = 10 * 60 * 1000;

export function getCached(slug: string): CachedPortfolio | null {
  const entry = cache.get(slug);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > MAX_AGE_MS) {
    cache.delete(slug);
    return null;
  }
  return entry;
}

export function setCache(
  slug: string,
  meta: PortfolioMeta,
  langData: Record<string, PortfolioBundle>,
  availableLangs: string[],
) {
  cache.set(slug, { meta, langData, availableLangs, fetchedAt: Date.now() });
}

export function updateCacheLangData(slug: string, lang: string, data: PortfolioBundle) {
  const entry = cache.get(slug);
  if (!entry) return;
  entry.langData[lang] = data;
}

export function updateCacheMeta(slug: string, partial: Partial<PortfolioMeta>) {
  const entry = cache.get(slug);
  if (!entry) return;
  entry.meta = { ...entry.meta, ...partial };
}

export function addCacheLang(slug: string, lang: string, data: PortfolioBundle) {
  const entry = cache.get(slug);
  if (!entry) return;
  entry.langData[lang] = data;
  if (!entry.availableLangs.includes(lang)) {
    entry.availableLangs = [...entry.availableLangs, lang];
  }
}

export function removeCacheLang(slug: string, lang: string) {
  const entry = cache.get(slug);
  if (!entry) return;
  delete entry.langData[lang];
  entry.availableLangs = entry.availableLangs.filter((l) => l !== lang);
}

export function invalidateCache(slug: string) {
  cache.delete(slug);
}
