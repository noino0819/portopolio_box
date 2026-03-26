import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

async function getPortfolioSlug(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('portfolios')
    .select('slug')
    .eq('user_id', userId)
    .limit(1);
  if (data && data.length > 0) return (data[0] as { slug: string }).slug;
  return null;
}

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const slug = await getPortfolioSlug(user.id);
      navigate(slug ? `/${slug}` : '/onboarding', { replace: true });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg-dark px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center font-display text-2xl font-bold text-card">Login</h1>

        <SocialLoginButtons />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-card/40">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs text-card/60">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-card outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs text-card/60">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-card outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
            />
          </div>
          {error && <p className="text-xs text-accent-red">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold/90 py-2.5 text-sm font-semibold text-bg-dark transition-colors hover:bg-gold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-card/50">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent-blue hover:underline">Sign up</Link>
        </p>
        <p className="mt-2 text-center">
          <Link to="/" className="text-xs text-card/40 hover:text-card/60">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
