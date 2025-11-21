import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const AccountSettingsPage: React.FC = () => {
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // This is a simulation. In a real app, you'd call an API.
        console.log('Password change submitted');
        setIsSaved(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.accountPage.changePasswordTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.accountPage.currentPassword')}</label>
                        <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.accountPage.newPassword')}</label>
                        <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.accountPage.confirmPassword')}</label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <Button type="submit">{t('settings.accountPage.updatePasswordButton')}</Button>
                        {isSaved && 
                          <div className="flex items-center text-sm text-green-600">
                             <CheckCircleIcon />
                            <span className="ml-2">{t('settings.accountPage.passwordUpdatedSuccess')}</span>
                          </div>
                        }
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

function CheckCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}

export default AccountSettingsPage;
