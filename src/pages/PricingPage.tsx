import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PLANS = [
  {
    id: 'monthly' as const,
    name: 'Monthly',
    price: 4900,
    priceLabel: '4,900',
    period: '/month',
    description: 'Basic portfolio hosting with monthly billing',
    features: ['Custom URL (/:slug)', 'Portfolio editing', 'Multi-language support (4 languages)'],
    highlight: false,
  },
  {
    id: 'yearly' as const,
    name: 'Yearly',
    price: 39000,
    priceLabel: '39,000',
    period: '/year',
    description: 'Save 34% compared to monthly',
    features: ['Custom URL (/:slug)', 'Portfolio editing', 'Multi-language support (4 languages)', 'Priority support'],
    highlight: true,
  },
  {
    id: 'permanent' as const,
    name: 'Permanent',
    price: 99000,
    priceLabel: '99,000',
    period: 'one-time',
    description: 'Pay once, use forever',
    features: ['Custom URL (/:slug)', 'Portfolio editing', 'Multi-language support (4 languages)', 'Priority support', 'Lifetime access'],
    highlight: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');
  const [slugError, setSlugError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (planId: 'monthly' | 'yearly' | 'permanent') => {
    if (!slug.trim()) {
      setSlugError('Please enter a URL slug');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
      setSlugError('Only letters, numbers, hyphens and underscores');
      return;
    }
    setSlugError(null);
    setLoading(true);

    const plan = PLANS.find((p) => p.id === planId)!;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    try {
      const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
      const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk');
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: user?.id ?? `guest_${orderId}` });

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: plan.price },
        orderId,
        orderName: `Portfolio ${plan.name} Plan`,
        successUrl: `${window.location.origin}/pricing?success=true&planId=${planId}&slug=${encodeURIComponent(slug)}&orderId=${orderId}`,
        failUrl: `${window.location.origin}/pricing?success=false`,
      });
    } catch (err) {
      console.error('Payment error:', err);
      setLoading(false);
    }
  };

  const params = new URLSearchParams(window.location.search);
  const isSuccess = params.get('success') === 'true';
  const paymentKey = params.get('paymentKey');

  if (isSuccess && paymentKey) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-bg-dark px-4">
        <div className="text-center">
          <div className="mb-4 text-4xl">&#10003;</div>
          <h1 className="mb-2 font-display text-2xl font-bold text-card">Payment Successful!</h1>
          <p className="mb-6 text-sm text-card/60">Your portfolio is being set up.</p>
          {user ? (
            <button onClick={() => navigate(`/${params.get('slug')}`)} className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-bg-dark hover:bg-gold/90">
              Go to My Portfolio
            </button>
          ) : (
            <Link to="/signup" className="inline-block rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-bg-dark hover:bg-gold/90">
              Create Account to Get Started
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg-dark px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-center font-display text-3xl font-bold text-card">Pricing</h1>
        <p className="mb-8 text-center text-sm text-card/60">Choose the plan that works for you</p>

        <div className="mx-auto mb-10 max-w-xs">
          <label htmlFor="slug" className="mb-1 block text-xs text-card/60">Choose your URL</label>
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5">
            <span className="pl-3 text-xs text-card/40">portfoliobox.com/</span>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugError(null); }}
              placeholder="your-name"
              className="flex-1 bg-transparent px-1 py-2.5 text-sm text-card outline-none"
            />
          </div>
          {slugError && <p className="mt-1 text-[11px] text-accent-red">{slugError}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 transition-colors ${
                plan.highlight
                  ? 'border-gold/40 bg-gold/5'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              {plan.highlight && (
                <span className="mb-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                  Popular
                </span>
              )}
              <h2 className="font-display text-lg font-bold text-card">{plan.name}</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-extrabold text-card">{plan.priceLabel}</span>
                <span className="text-xs text-card/50">KRW {plan.period}</span>
              </div>
              <p className="mt-2 text-xs text-card/50">{plan.description}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-card/70">
                    <span className="text-accent-teal">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handlePurchase(plan.id)}
                disabled={loading}
                className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                  plan.highlight
                    ? 'bg-gold text-bg-dark hover:bg-gold/90'
                    : 'border border-white/10 bg-white/5 text-card hover:bg-white/10'
                }`}
              >
                {loading ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link to="/" className="text-xs text-card/40 hover:text-card/60">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
