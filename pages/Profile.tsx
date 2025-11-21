import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import QRCode from '../components/QRCode';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const profileUrl = `${window.location.origin}/#/app/profile`;

    const calculateAge = (dob: string | undefined) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(user?.dob);

    if (!user) {
        return null; // Should be handled by AppLayout
    }

    return (
        <div className="container mx-auto max-w-4xl">
            <div className="text-left mb-6">
                <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">{t('sidebar.profile')}</h1>
                <p className="text-text-secondary dark:text-gray-400 mt-2">{t('profile.description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{t('profile.personalInfo')}</CardTitle>
                            <Link to="/app/settings/profile">
                                <Button variant="ghost">{t('dashboard.editProfile')}</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('profile.name')}</label>
                                <p className="text-lg">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('profile.email')}</label>
                                <p className="text-lg">{user.email}</p>
                            </div>
                            {user.dob && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">{t('profile.dob')}</label>
                                    <p className="text-lg">{new Date(user.dob).toLocaleDateString()}</p>
                                </div>
                            )}
                            {age !== null && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">{t('profile.age')}</label>
                                    <p className="text-lg">{age} {t('profile.yearsOld')}</p>
                                </div>
                            )}
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

                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.shareableProfile')}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center flex flex-col items-center">
                            <QRCode value={profileUrl} size={160} />
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{t('profile.scanToShare')}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
