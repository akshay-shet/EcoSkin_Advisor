import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { Spinner } from './components/ui/Spinner';

// Public pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/Login'));

// App pages
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const SkinAnalysisPage = lazy(() => import('./pages/SkinAnalysis'));
const HairAnalysisPage = lazy(() => import('./pages/HairAnalysis'));
const ColorAdvisorPage = lazy(() => import('./pages/ColorAdvisor'));
const MakeupAdvisorPage = lazy(() => import('./pages/MakeupAdvisor'));
const ProductAnalyzerPage = lazy(() => import('./pages/ProductAnalyzer'));
const SkincareRoutinePlannerPage = lazy(() => import('./pages/SkincareRoutinePlanner'));
const SkinJournalPage = lazy(() => import('./pages/SkinJournal'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistant'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const HairAdvisorPage = lazy(() => import('./pages/HairAdvisor'));

// Settings Pages
const SettingsPage = lazy(() => import('./pages/Settings'));
const ProfileSettingsPage = lazy(() => import('./pages/settings/ProfileSettings'));
const AccountSettingsPage = lazy(() => import('./pages/settings/AccountSettings'));
const AppearanceSettingsPage = lazy(() => import('./pages/settings/AppearanceSettings'));

const AppRoutes: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-base-100 dark:bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <Routes>
            {isAuthenticated ? (
                 <Route path="/app" element={<AppLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="skin-analysis" element={<SkinAnalysisPage />} />
                    <Route path="hair-analysis" element={<HairAnalysisPage />} />
                    <Route path="hair-advisor" element={<HairAdvisorPage />} />
                    <Route path="color-advisor" element={<ColorAdvisorPage />} />
                    <Route path="makeup-advisor" element={<MakeupAdvisorPage />} />
                    <Route path="product-analyzer" element={<ProductAnalyzerPage />} />
                    <Route path="skincare-planner" element={<SkincareRoutinePlannerPage />} />
                    <Route path="skin-journal" element={<SkinJournalPage />} />
                    <Route path="ai-assistant" element={<AIAssistantPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />}>
                        <Route index element={<Navigate to="/app/settings/profile" replace />} />
                        <Route path="profile" element={<ProfileSettingsPage />} />
                        <Route path="account" element={<AccountSettingsPage />} />
                        <Route path="appearance" element={<AppearanceSettingsPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/app" replace />} />
                </Route>
            ) : (
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            )}
             <Route path="*" element={<Navigate to={isAuthenticated ? '/app' : '/'} replace />} />
        </Routes>
    )
}


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center dark:bg-gray-900"><Spinner size="lg" /></div>}>
            <AppRoutes />
          </Suspense>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;