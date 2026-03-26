import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const SLUG_REGEX = /^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/;
const RESERVED = ['login', 'signup', 'pricing', 'auth', 'admin', 'api', 'example', 'onboarding'];

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('portfolios')
      .select('slug')
      .eq('user_id', user.id)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          navigate(`/${(data[0] as { slug: string }).slug}`, { replace: true });
        }
      });
  }, [user, navigate]);

  const checkAvailability = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const normalized = value.toLowerCase().trim();
    if (!normalized) {
      setAvailable(null);
      return;
    }

    if (!SLUG_REGEX.test(normalized)) {
      setAvailable(false);
      setError('3~30자의 영소문자, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.');
      return;
    }

    if (RESERVED.includes(normalized)) {
      setAvailable(false);
      setError('사용할 수 없는 아이디입니다.');
      return;
    }

    setChecking(true);
    setError(null);
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('portfolios')
        .select('id')
        .eq('slug', normalized)
        .limit(1);

      setChecking(false);
      if (data && data.length > 0) {
        setAvailable(false);
        setError('이미 사용 중인 아이디입니다.');
      } else {
        setAvailable(true);
        setError(null);
      }
    }, 400);
  }, []);

  const handleChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setSlug(normalized);
    checkAvailability(normalized);
  };

  const handleCreate = async () => {
    if (!user || !available || !slug) return;
    setCreating(true);
    setError(null);

    const { data: portfolio, error: createErr } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        slug,
        is_active: true,
      })
      .select('id')
      .single();

    if (createErr) {
      setError(createErr.message);
      setCreating(false);
      return;
    }

    const portfolioId = (portfolio as { id: string }).id;

    const defaultProfile = {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New User',
      title: 'Developer',
      headline: 'Welcome to my portfolio!',
      bioPoints: [{ emoji: '👋', text: 'Hello! This is my portfolio.' }],
      skills: [],
      contacts: [
        ...(user.email ? [{ label: 'Email', value: user.email, url: `mailto:${user.email}`, icon: '✉️' }] : []),
      ],
    };

    await supabase.from('portfolio_data').insert({
      portfolio_id: portfolioId,
      lang: 'ko',
      profile: defaultProfile,
      education: [],
      certifications: [],
      projects: [],
      awards: [],
      games: [],
      albums: [],
      books: [],
      hobbies: [],
      cd_story: [],
    });

    navigate(`/${slug}`, { replace: true });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg-dark px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
              <span className="text-3xl">🎒</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-card">
              포트폴리오 만들기
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-card/60">
              나만의 포트폴리오 주소를 만들어보세요!<br />
              아래에서 입력한 아이디가 URL 뒤에 붙어요.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="slug" className="mb-2 block text-xs font-medium text-card/60">
              포트폴리오 아이디
            </label>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="mb-2 flex items-center gap-1 text-xs text-card/40">
                <span>portopolio.com /</span>
                <span className={slug ? 'font-semibold text-gold' : 'text-card/30'}>
                  {slug || 'your-id'}
                </span>
              </div>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="my-portfolio"
                maxLength={30}
                autoFocus
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-card outline-none transition-colors placeholder:text-card/25 focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
              />
            </div>

            <div className="mt-2 min-h-[20px]">
              {checking && (
                <p className="flex items-center gap-1.5 text-xs text-card/50">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-card/20 border-t-gold" />
                  확인 중...
                </p>
              )}
              {!checking && error && (
                <p className="text-xs text-accent-red">{error}</p>
              )}
              {!checking && available && slug && (
                <p className="text-xs text-accent-teal">사용 가능한 아이디입니다!</p>
              )}
            </div>
          </div>

          <div className="mb-4 rounded-lg bg-gold/5 px-4 py-3">
            <p className="text-xs leading-relaxed text-card/50">
              <span className="font-medium text-gold/80">Tip:</span>{' '}
              영소문자, 숫자, 하이픈(-), 언더스코어(_)를 사용할 수 있고,
              3~30자까지 가능해요. 이 아이디는 나중에 변경할 수 없으니 신중하게 골라주세요!
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!available || creating || !slug}
            className="w-full rounded-lg bg-gold/90 py-3 text-sm font-semibold text-bg-dark transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            {creating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg-dark/30 border-t-bg-dark" />
                생성 중...
              </span>
            ) : (
              '포트폴리오 생성하기'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
