import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

const AppearanceSettingsPage: React.FC = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.appearancePage.themeTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">{t('settings.appearancePage.themeDescription')}</p>
                    <div className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                           {theme === 'light' ? <SunIcon /> : <MoonIcon />}
                           <span>{theme === 'light' ? t('settings.appearancePage.lightMode') : t('settings.appearancePage.darkMode')}</span>
                        </div>
                        <button onClick={toggleTheme} className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 bg-gray-200 dark:bg-gray-600">
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}/>
                        </button>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t('settings.appearancePage.languageTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">{t('settings.appearancePage.languageDescription')}</p>
                    <LanguageSwitcher variant="settings" />
                </CardContent>
            </Card>
        </div>
    );
};

function SunIcon({ className = "h-5 w-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>;
}

function MoonIcon({ className = "h-5 w-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
}

export default AppearanceSettingsPage;
