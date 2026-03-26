import { useParams, Navigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePortfolio } from '@/hooks/usePortfolio';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { useAuth } from '@/contexts/AuthContext';
import App from '@/App';

function LoadingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <p className="text-sm text-card/50">Loading...</p>
      </div>
    </div>
  );
}

function NotFoundScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg-dark px-4">
      <h1 className="font-display text-4xl font-bold text-card">404</h1>
      <p className="text-card/60">Portfolio not found</p>
      <a href="/" className="text-sm text-accent-blue hover:underline">Go Home</a>
    </div>
  );
}

export default function PortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const { meta, data, loading, error } = usePortfolio(slug, lang);
  const { user } = useAuth();

  if (loading) return <LoadingScreen />;
  if (error || !meta || !data) return <NotFoundScreen />;

  const isOwner = !!user && !!meta.userId && user.id === meta.userId;

  return (
    <PortfolioProvider meta={meta} data={data} isOwner={isOwner}>
      <App />
    </PortfolioProvider>
  );
}

export function RedirectToExample() {
  return <Navigate to="/example" replace />;
}
