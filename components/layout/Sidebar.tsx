import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggleSidebar } from '../ui/ThemeToggle';
import { Search } from '../Search';
import { LanguageSwitcher } from '../LanguageSwitcher';


export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/app', label: t('sidebar.dashboard'), icon: <HomeIcon /> },
    { path: '/app/skin-analysis', label: t('sidebar.skinAnalysis'), icon: <ScanFaceIcon /> },
    { path: '/app/hair-analysis', label: t('sidebar.hairAnalysis'), icon: <TestTubeIcon /> },
    { path: '/app/hair-advisor', label: t('sidebar.hairstyleAdvisor'), icon: <ScissorsIcon /> },
    { path: '/app/color-advisor', label: t('sidebar.colorAdvisor'), icon: <PaletteIcon /> },
    { path: '/app/makeup-advisor', label: t('sidebar.makeupAdvisor'), icon: <LipstickIcon /> },
    { path: '/app/product-analyzer', label: t('sidebar.productAnalyzer'), icon: <FlaskConicalIcon /> },
    { path: '/app/skincare-planner', label: t('sidebar.routinePlanner'), icon: <CalendarDaysIcon /> },
    { path: '/app/skin-journal', label: t('sidebar.skinJournal'), icon: <BookMarkedIcon /> },
    { path: '/app/ai-assistant', label: t('sidebar.aiAssistant'), icon: <SparklesIcon /> },
    { path: '/app/profile', label: t('sidebar.profile'), icon: <UserIcon /> },
    { path: '/app/settings/profile', label: t('sidebar.settings'), icon: <SettingsIcon /> },
  ];


  const getLinkClass = (path: string) => {
    // Make settings link active for all sub-routes, and dashboard for exact path
    const isActive = location.pathname.startsWith('/app/settings') 
        ? path.startsWith('/app/settings') 
        : location.pathname === path;
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      isActive
        ? 'bg-brand-light dark:bg-brand-primary/20 text-brand-text dark:text-brand-secondary'
        : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-gray-200'
    }`;
  };

  return (
    <div className="hidden border-r bg-base-200/40 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b dark:border-gray-800 px-6">
          <NavLink to="/app" className="flex items-center gap-2 font-semibold text-text-primary dark:text-gray-50">
            <LeafIcon />
            <span className="">ECOSKIN</span>
          </NavLink>
        </div>
        <div className="p-4">
            <Search navItems={navItems} />
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={getLinkClass(item.path)}>
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t dark:border-gray-800 space-y-2">
            <LanguageSwitcher variant="sidebar" />
            <ThemeToggleSidebar />
            <button onClick={logout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-secondary dark:text-gray-400 transition-all hover:text-text-primary dark:hover:text-gray-200 w-full">
                <LogOutIcon />
                {t('sidebar.logout')}
            </button>
        </div>
      </div>
    </div>
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
function ScanFaceIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>;
}
function PaletteIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.122-.297-.287-.74-.57-1.17-.75M12 22s1.714-6.286 4-8c1.286-1 2.857-2.5 4-4 1.143-1.5 1.5-3.5 1.5-5"/></svg>;
}
function LipstickIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m20.2 4.1-1.4 1.4c-1.2 1.2-1.2 3.1 0 4.2l1.4 1.4c1.2 1.2 3.1 1.2 4.2 0l1.4-1.4c1.2-1.2 1.2-3.1 0-4.2l-1.4-1.4c-1.1-1.2-3-1.2-4.2 0Z"/><path d="m14 11.2 2-2"/><path d="M12.5 18.5 11 20s-2 2-4 0-2-4 0-4l1.5-1.5"/><path d="m18 10-1.5-1.5"/><path d="M12.5 12.5 14 11"/><path d="M11 14 9.5 15.5"/><path d="m7 18-1.5-1.5"/></svg>;
}
function SettingsIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function LeafIcon({ className = "h-5 w-5 text-brand-primary" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13q0-3.5 2.5-6.5A10 10 0 0 1 20 4a7 7 0 0 1-7 7q-3.5 0-6.5 2.5Z"/><path d="M12 21a7 7 0 0 0 7-7q0-3.5-2.5-6.5A10 10 0 0 0 4 4a7 7 0 0 0 7 7q3.5 0 6.5 2.5Z"/></svg>;
}
function LogOutIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
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
function SparklesIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
}