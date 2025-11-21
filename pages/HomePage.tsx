import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

// Re-using icons from Sidebar for consistency
const featureIcons = {
    skinAnalysis: <ScanFaceIcon />,
    hairAnalysis: <TestTubeIcon />,
    hairstyleAdvisor: <ScissorsIcon />,
    colorAdvisor: <PaletteIcon />,
    makeupAdvisor: <LipstickIcon />,
    productAnalyzer: <FlaskConicalIcon />,
    routinePlanner: <CalendarDaysIcon />,
};

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    const features = [
        'skinAnalysis', 'hairAnalysis', 'hairstyleAdvisor', 'colorAdvisor', 'makeupAdvisor',
        'productAnalyzer', 'routinePlanner'
    ];
    
    const howItWorksSteps = [
        {
            icon: <CameraIcon />,
            title: t('home.howItWorks.step1Title'),
            description: t('home.howItWorks.step1Desc')
        },
        {
            icon: <SparklesIcon />,
            title: t('home.howItWorks.step2Title'),
            description: t('home.howItWorks.step2Desc')
        },
        {
            icon: <ClipboardListIcon />,
            title: t('home.howItWorks.step3Title'),
            description: t('home.howItWorks.step3Desc')
        }
    ];

    return (
        <div className="bg-base-100 dark:bg-gray-900 text-text-primary dark:text-gray-200">
            {/* Hero Section */}
            <section className="relative text-center py-20 lg:py-32 px-4 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover -z-10"
                    poster="https://images.pexels.com/videos/4692418/pexels-photo-4692418.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                >
                    <source src="https://videos.pexels.com/video-files/4692418/4692418-hd_1920_1080_25fps.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/50 -z-10"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-white animate-fade-in" style={{ animationFillMode: 'backwards' }}>
                        {t('home.hero.title')}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
                        {t('home.hero.subtitle')}
                    </p>
                    <Link to="/login">
                        <Button className="mt-8 text-lg px-8 py-3 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
                            {t('home.hero.cta')}
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 lg:py-24 px-4 container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold">{t('home.features.title')}</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-text-secondary dark:text-gray-400">{t('home.features.subtitle')}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((featureKey, index) => (
                         <div
                            key={featureKey}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'backwards' }}
                        >
                        <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-8">
                                <div className="inline-block p-4 bg-brand-light dark:bg-brand-primary/20 rounded-full mb-4">
                                    {React.cloneElement(featureIcons[featureKey as keyof typeof featureIcons], { className: 'h-8 w-8 text-brand-primary' })}
                                </div>
                                <h3 className="text-xl font-semibold">{t(`sidebar.${featureKey}`)}</h3>
                                <p className="mt-2 text-text-secondary dark:text-gray-400">{t(`home.features.${featureKey}`)}</p>
                            </CardContent>
                        </Card>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 lg:py-24 px-4 bg-base-200 dark:bg-gray-900/50">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl lg:text-4xl font-bold">{t('home.howItWorks.title')}</h2>
                         <p className="mt-3 max-w-2xl mx-auto text-text-secondary dark:text-gray-400">{t('home.howItWorks.subtitle')}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {howItWorksSteps.map((step, index) => (
                            <div 
                                key={index} 
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${0.2 * index}s`, animationFillMode: 'backwards' }}
                            >
                                <div className="inline-block p-5 bg-white dark:bg-gray-800 rounded-full shadow-md mb-5 border dark:border-gray-700">
                                    {React.cloneElement(step.icon, { className: 'h-10 w-10 text-brand-primary' })}
                                </div>
                                <h3 className="text-xl font-semibold">{step.title}</h3>
                                <p className="mt-2 text-text-secondary dark:text-gray-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Final CTA */}
            <section className="py-20 lg:py-28 px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold">{t('home.cta.title')}</h2>
                    <p className="mt-4 text-lg text-text-secondary dark:text-gray-400">{t('home.cta.subtitle')}</p>
                    <Link to="/login">
                        <Button className="mt-8 text-lg px-8 py-3">{t('home.cta.button')}</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

// SVG Icons
function TestTubeIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg>;
}
function ScissorsIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>;}
function ScanFaceIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>;}
function PaletteIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.122-.297-.287-.74-.57-1.17-.75M12 22s1.714-6.286 4-8c1.286-1 2.857-2.5 4-4 1.143-1.5 1.5-3.5 1.5-5"/></svg>;}
function LipstickIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m20.2 4.1-1.4 1.4c-1.2 1.2-1.2 3.1 0 4.2l1.4 1.4c1.2 1.2 3.1 1.2 4.2 0l1.4-1.4c1.2-1.2 1.2-3.1 0-4.2l-1.4-1.4c-1.1-1.2-3-1.2-4.2 0Z"/><path d="m14 11.2 2-2"/><path d="M12.5 18.5 11 20s-2 2-4 0-2-4 0-4l1.5-1.5"/><path d="m18 10-1.5-1.5"/><path d="M12.5 12.5 14 11"/><path d="M11 14 9.5 15.5"/><path d="m7 18-1.5-1.5"/></svg>;}
function FlaskConicalIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M8.5 2h7"/><path d="M14 9.31 16.5 14h-9L10 9.31"/><path d="M7 14h10"/><path d="M7 18h10v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z"/></svg>;}
function CalendarDaysIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;}
function CameraIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;}
function SparklesIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;}
function ClipboardListIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;}

export default HomePage;