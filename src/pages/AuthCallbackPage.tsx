import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data } = await supabase
          .from('portfolios')
          .select('slug')
          .eq('user_id', session.user.id)
          .limit(1);

        if (data && data.length > 0) {
          navigate(`/${(data[0] as { slug: string }).slug}`, { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <p className="text-sm text-card/50">로그인 중...</p>
      </div>
    </div>
  );
}
