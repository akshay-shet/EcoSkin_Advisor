import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const SettingsPage: React.FC = () => {
    const { t } = useTranslation();

    const navItems = [
        { path: '/app/settings/profile', label: t('settings.profile') },
        { path: '/app/settings/account', label: t('settings.account') },
        { path: '/app/settings/appearance', label: t('settings.appearance') },
    ];

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
            ? 'bg-brand-light dark:bg-brand-primary/20 text-brand-text dark:text-brand-secondary'
            : 'text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`;

    return (
        <div className="container mx-auto max-w-4xl">
             <div className="text-left mb-6">
                <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">{t('settings.title')}</h1>
                <p className="text-text-secondary dark:text-gray-400 mt-2">{t('settings.description')}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[180px_1fr]">
                <nav className="flex flex-col gap-1" aria-label="Settings navigation">
                     {navItems.map(item => (
                        <NavLink key={item.path} to={item.path} className={getLinkClass}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="grid gap-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;