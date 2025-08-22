import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { useAuth } from '../contexts/AuthContext';

interface AppRouterProps {
  language: 'th' | 'en';
  setLanguage: (lang: 'th' | 'en') => void;
  scrollY: number;
}

// Lazy load components for better performance with default exports
const HomePage = lazy(() => import('../pages/HomePage'));
const Suite = lazy(() => import('../pages/Suite'));
const Pricing = lazy(() => import('../pages/Pricing'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const TypographyDemo = lazy(() => import('../components/TypographyDemo'));
const ButtonTest = lazy(() => import('../components/ButtonTest'));
const DialogLightEffectsDemo = lazy(() => import('../components/DialogLightEffectsDemo'));
const TransparencyEffectsDemo = lazy(() => import('../components/TransparencyEffectsDemo'));
const ColorReadabilityAnalysis = lazy(() => import('../components/ColorReadabilityAnalysis'));
const ColorSystemDocumentation = lazy(() => import('../components/ColorSystemDocumentation'));

// Professional Loading Component
const ProfessionalLoader = () => (
  <div 
    className="min-h-screen flex items-center justify-center"
    style={{ backgroundColor: 'oklch(0.145 0 0)' }}
  >
    <div className="flex flex-col items-center gap-4">
      <div 
        className="w-8 h-8 border-2 rounded-full animate-spin border-t-transparent"
        style={{ borderColor: 'oklch(0.488 0.243 264.376)' }}
      />
      <p 
        className="text-sm font-medium tracking-wide"
        style={{ color: 'oklch(0.708 0 0)' }}
      >
        Loading EyeMotion...
      </p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <ProfessionalLoader />;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export function AppRouter({ language, setLanguage, scrollY }: AppRouterProps) {
  return (
    <Router>
      <Suspense fallback={<ProfessionalLoader />}>
        <Routes>
          {/* Public Routes with PageLayout */}
          <Route path="/" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <HomePage language={language} />
            </PageLayout>
          } />
          
          <Route path="/suite" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <Suite language={language} />
            </PageLayout>
          } />

          <Route path="/pricing" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <Pricing language={language} />
            </PageLayout>
          } />
          
          <Route path="/about" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <About language={language} />
            </PageLayout>
          } />
          
          <Route path="/contact" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <Contact language={language} />
            </PageLayout>
          } />

          {/* Typography Test Route (Development) */}
          <Route path="/typography-test" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <TypographyDemo language={language} />
            </PageLayout>
          } />

          {/* Button Test Route (Development) */}
          <Route path="/button-test" element={
            <ButtonTest language={language} />
          } />

          {/* Dialog Light Effects Test Route (Development) */}
          <Route path="/dialog-light-effects-test" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <DialogLightEffectsDemo language={language} />
            </PageLayout>
          } />

          {/* Transparency Effects Test Route (Development) */}
          <Route path="/transparency-effects-test" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <TransparencyEffectsDemo language={language} />
            </PageLayout>
          } />

          {/* Color Readability Analysis Test Route (Development) */}
          <Route path="/color-readability-analysis" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <ColorReadabilityAnalysis language={language} />
            </PageLayout>
          } />

          {/* Color System Documentation Test Route (Development) */}
          <Route path="/color-system-documentation" element={
            <PageLayout language={language} setLanguage={setLanguage} scrollY={scrollY}>
              <ColorSystemDocumentation language={language} />
            </PageLayout>
          } />

          {/* Protected Routes with WorkspaceLayout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <WorkspaceLayout language={language} setLanguage={setLanguage}>
                <Dashboard language={language} />
              </WorkspaceLayout>
            </ProtectedRoute>
          } />

          {/* Language switching routes (redirect to main routes) */}
          <Route path="/en" element={<Navigate to="/" replace />} />
          <Route path="/th" element={<Navigate to="/" replace />} />
          
          {/* Legacy language-specific routes (redirect to main) */}
          <Route path="/en/*" element={<Navigate to="/" replace />} />
          <Route path="/th/*" element={<Navigate to="/" replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}