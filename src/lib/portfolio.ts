import { supabase } from '@/lib/supabase';

export async function getPortfolioSlug(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('portfolio_box_portfolios')
    .select('slug')
    .eq('user_id', userId)
    .limit(1);
  if (data && data.length > 0) return (data[0] as { slug: string }).slug;
  return null;
}
