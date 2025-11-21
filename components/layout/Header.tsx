import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggleListItem } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../LanguageSwitcher';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();

    const navItems = [
        { path: '/app/skin-analysis', label: t('sidebar.skinAnalysis'), icon: <ScanFaceIcon /> },
        { path: '/app/hair-analysis', label: t('sidebar.hairAnalysis'), icon: <TestTubeIcon /> },
        { path: '/app/hair-advisor', label: t('sidebar.hairstyleAdvisor'), icon: <ScissorsIcon /> },
        { path: '/app/color-advisor', label: t('sidebar.colorAdvisor'), icon: <PaletteIcon /> },
        { path: '/app/makeup-advisor', label: t('sidebar.makeupAdvisor'), icon: <LipstickIcon /> },
        { path: '/app/product-analyzer', label: t('sidebar.productAnalyzer'), icon: <FlaskConicalIcon /> },
        { path: '/app/skincare-planner', label: t('sidebar.routinePlanner'), icon: <CalendarDaysIcon /> },
        { path: '/app/profile', label: t('sidebar.profile'), icon: <UserIcon /> },
        { path: '/app/settings/profile', label: t('sidebar.settings'), icon: <SettingsIcon /> },
    ];

    return (
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-base-200/40 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 px-6 lg:hidden">
            <NavLink to="/app" className="flex items-center gap-2 font-semibold text-text-primary dark:text-gray-50">
                <LeafIcon />
                <span className="">ECOSKIN</span>
            </NavLink>
            <div className="w-full flex-1" />
            
            <NavLink to="/app" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Home">
                <HomeIcon className="h-5 w-5 text-text-secondary dark:text-gray-400" />
            </NavLink>
            <LanguageSwitcher variant="header-icon" />

            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative inline-flex items-center justify-center rounded-full border-2 border-transparent w-8 h-8 bg-brand-light text-brand-text font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                id="user-menu-button"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
            >
                <span className="sr-only">Open user menu</span>
                {user?.name.charAt(0)}
            </button>
            {isMenuOpen && (
                <div
                    className="absolute top-16 right-4 z-50 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    <div className="py-1" role="none">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}
                                role="menuitem"
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <ThemeToggleListItem />
                        <button
                            onClick={() => { logout(); setIsMenuOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-t dark:border-gray-700"
                            role="menuitem"
                        >
                            {t('sidebar.signOut')}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

// SVG Icons
function TestTubeIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg>;
}
function ScissorsIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>;
}
function UserIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function HomeIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function LeafIcon({ className = "h-6 w-6 text-brand-primary" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13q0-3.5 2.5-6.5A10 10 0 0 1 20 4a7 7 0 0 1-7 7q-3.5 0-6.5 2.5Z"/><path d="M12 21a7 7 0 0 0 7-7q0-3.5-2.5-6.5A10 10 0 0 0 4 4a7 7 0 0 0 7 7q3.5 0 6.5 2.5Z"/></svg>;
}
function ScanFaceIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>;}
function PaletteIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.122-.297-.287-.74-.57-1.17-.75M12 22s1.714-6.286 4-8c1.286-1 2.857-2.5 4-4 1.143-1.5 1.5-3.5 1.5-5"/></svg>;}
function LipstickIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m20.2 4.1-1.4 1.4c-1.2 1.2-1.2 3.1 0 4.2l1.4 1.4c1.2 1.2 3.1 1.2 4.2 0l1.4-1.4c1.2-1.2 1.2-3.1 0-4.2l-1.4-1.4c-1.1-1.2-3-1.2-4.2 0Z"/><path d="m14 11.2 2-2"/><path d="M12.5 18.5 11 20s-2 2-4 0-2-4 0-4l1.5-1.5"/><path d="m18 10-1.5-1.5"/><path d="M12.5 12.5 14 11"/><path d="M11 14 9.5 15.5"/><path d="m7 18-1.5-1.5"/></svg>;}
function SettingsIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;}
function FlaskConicalIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.31"/><path d="M14 9.31V2"/><path d="M8.5 2h7"/><path d="M14 9.31 16.5 14h-9L10 9.31"/><path d="M7 14h10"/><path d="M7 18h10v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z"/></svg>;}
function CalendarDaysIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;}