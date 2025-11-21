import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggleSidebar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
         <button onClick={toggleTheme} className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-secondary dark:text-gray-400 transition-all hover:text-text-primary dark:hover:text-gray-200 w-full">
            {theme === 'light' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            {t('theme.toggle')}
        </button>
    )
}

export const ThemeToggleListItem: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
         <button 
            onClick={toggleTheme} 
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
            role="menuitem"
        >
            {theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
        </button>
    )
}

// FIX: Updated icon component to accept className prop.
function SunIcon({ className = "h-6 w-6" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>;
}

// FIX: Updated icon component to accept className prop.
function MoonIcon({ className = "h-6 w-6" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
}
