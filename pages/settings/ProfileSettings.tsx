import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import QRCode from '../../components/QRCode';

const ProfileSettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [age, setAge] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const profileUrl = `${window.location.origin}/#/app/settings/profile`;

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [dob]);

  const handleSaveChanges = () => {
    updateUser({ name, email, dob });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{t('profile.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.name')}</label>
                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.email')}</label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                 <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.dob')}</label>
                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                 {age !== null && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.age')}</label>
                        <p className="mt-1 text-lg dark:text-gray-200">{age} {t('profile.yearsOld')}</p>
                    </div>
                 )}
                 <div className="flex items-center gap-4 pt-2">
                    <Button onClick={handleSaveChanges}>{t('profile.save')}</Button>
                    {isSaved && 
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircleIcon />
                        <span className="ml-2">{t('profile.savedSuccess')}</span>
                      </div>
                    }
                 </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{t('profile.shareableProfile')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col items-center">
                <QRCode value={profileUrl} size={160} />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{t('profile.scanToShare')}</p>
                <Input readOnly value={profileUrl} className="mt-2 text-center text-xs" onClick={(e) => (e.target as HTMLInputElement).select()} />
            </CardContent>
        </Card>
    </div>
  );
};

// FIX: Updated icon component to accept className prop.
function CheckCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}

export default ProfileSettingsPage;
