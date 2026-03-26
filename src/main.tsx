import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import PortfolioPage, { RedirectToDefault } from './pages/PortfolioPage';
import './index.css';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Suspense>
            <Routes>
              <Route path="/" element={<RedirectToDefault />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/:slug" element={<PortfolioPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
