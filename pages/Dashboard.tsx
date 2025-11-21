// FIX: The type definitions in '../types' must be imported after 'react' to ensure JSX namespace augmentations are applied before JSX is processed.
import React from 'react';
// FIX: Removed redundant import of global types file. It should only be imported once in the application root (index.tsx).
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const DashboardPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const features = [
        { path: '/app/skin-analysis', label: t('sidebar.skinAnalysis'), description: t('dashboard.features.skinAnalysisDesc'), icon: <ScanFaceIcon /> },
        { path: '/app/hair-analysis', label: t('sidebar.hairAnalysis'), description: t('dashboard.features.hairAnalysisDesc'), icon: <TestTubeIcon /> },
        { path: '/app/hair-advisor', label: t('sidebar.hairstyleAdvisor'), description: t('dashboard.features.hairstyleAdvisorDesc'), icon: <ScissorsIcon /> },
        { path: '/app/color-advisor', label: t('sidebar.colorAdvisor'), description: t('dashboard.features.colorAdvisorDesc'), icon: <PaletteIcon /> },
        { path: '/app/makeup-advisor', label: t('sidebar.makeupAdvisor'), description: t('dashboard.features.makeupAdvisorDesc'), icon: <LipstickIcon /> },
        { path: '/app/product-analyzer', label: t('sidebar.productAnalyzer'), description: t('dashboard.features.productAnalyzerDesc'), icon: <FlaskConicalIcon /> },
        { path: '/app/skincare-planner', label: t('sidebar.routinePlanner'), description: t('dashboard.features.routinePlannerDesc'), icon: <CalendarDaysIcon /> },
        { path: '/app/skin-journal', label: t('sidebar.skinJournal'), description: t('dashboard.features.skinJournalDesc'), icon: <BookMarkedIcon /> },
    ];
    
    if (!user) {
        return null; // AppLayout's loading/auth guard should prevent this
    }

    return (
        <div className="container mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">{t('dashboard.welcome', { name: user.name })}</h1>
                <p className="text-text-secondary dark:text-gray-400 mt-2">{t('dashboard.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Skin Summary */}
                <div className="lg:col-span-1 space-y-6">

                    <Card className="overflow-hidden animate-fade-in">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <lottie-player
                                src="https://lottie.host/27d35b9a-af27-4a00-9288-005118ac939a/uBqBqBqBqB.json"
                                background="transparent"
                                speed="1"
                                style={{ width: '100%', height: 'auto', maxWidth: '200px', marginBottom: '-20px' }}
                                loop
                                // FIX: Changed `autoplay` back to `autoPlay`. With the lottie-player types reverted, `autoPlay` is the valid React prop that will be correctly rendered as the `autoplay` attribute for the custom element.
                                autoPlay
                            ></lottie-player>
                             <p className="text-md font-medium text-brand-text dark:text-brand-secondary">
                                Your journey to perfect skin starts now.
                             </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.skinProfileTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.skinProfile ? (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm uppercase text-text-secondary dark:text-gray-500">{t('profile.assessment')}</h4>
                                        <p className="text-text-primary dark:text-gray-200">{user.skinProfile.overallAssessment}</p>
                                    </div>
                                    <div>
                                         <h4 className="font-semibold text-sm uppercase text-text-secondary dark:text-gray-500">{t('profile.conditions')}</h4>
                                         {user.skinProfile.conditions.length > 0 ? (
                                            <ul className="list-disc list-inside text-text-primary dark:text-gray-200">
                                                {user.skinProfile.conditions.map(c => <li key={c.condition}>{c.condition}</li>)}
                                            </ul>
                                         ) : <p>{t('profile.noConditions')}</p>}
                                    </div>
                                    <Link to="/app/skin-analysis">
                                        <Button variant="secondary" className="w-full mt-2">{t('dashboard.viewDetails')}</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-text-secondary dark:text-gray-400 mb-4">{t('dashboard.noAnalysisText')}</p>
                                    <Link to="/app/skin-analysis">
                                        <Button>{t('dashboard.getStarted')}</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Features */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.featuresTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            {features.map((feature) => (
                                <Link key={feature.path} to={feature.path} className="block group">
                                    <Card className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:border-brand-primary/50 group-hover:-translate-y-1">
                                        <CardContent className="p-4 flex flex-col h-full">
                                            <div className="flex items-center mb-2">
                                                {React.cloneElement(feature.icon, { className: 'h-6 w-6 text-brand-primary' })}
                                                <h3 className="ml-3 font-semibold text-text-primary dark:text-gray-100">{feature.label}</h3>
                                            </div>
                                            <p className="text-sm text-text-secondary dark:text-gray-400 flex-grow">{feature.description}</p>
                                            <div className="mt-3 text-sm font-semibold text-brand-text dark:text-brand-secondary group-hover:underline">
                                                {t('dashboard.launchFeature')} &rarr;
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

function TestTubeIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg>;
}
function ScissorsIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>;
}
function ScanFaceIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>;
}
function PaletteIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.122-.297-.287-.74-.57-1.17-.75M12 22s1.714-6.286 4-8c1.286-1 2.857-2.5 4-4 1.143-1.5 1.5-3.5 1.5-5"/></svg>;
}
function LipstickIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m20.2 4.1-1.4 1.4c-1.2 1.2-1.2 3.1 0 4.2l1.4 1.4c1.2 1.2 3.1 1.2 4.2 0l1.4-1.4c1.2-1.2 1.2-3.1 0-4.2l-1.4-1.4c-1.1-1.2-3-1.2-4.2 0Z"/><path d="m14 11.2 2-2"/><path d="M12.5 18.5 11 20s-2 2-4 0-2-4 0-4l1.5-1.5"/><path d="m18 10-1.5-1.5"/><path d="M12.5 12.5 14 11"/><path d="M11 14 9.5 15.5"/><path d="m7 18-1.5-1.5"/></svg>;
}
function FlaskConicalIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M8.5 2h7"/><path d="M14 9.31 16.5 14h-9L10 9.31"/><path d="M7 14h10"/><path d="M7 18h10v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z"/></svg>;
}
function CalendarDaysIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;
}
function BookMarkedIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16l-2 2Z"/><path d="M14 2v20"/><path d="M8 7h4"/><path d="M8 12h4"/><path d="M8 17h2"/></svg>;
}


export default DashboardPage;