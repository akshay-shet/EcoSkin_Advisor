import React from 'react';
import { useTranslation } from 'react-i18next';
import { SkincareRoutine, SkincareRoutineStep } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const RoutineColumn: React.FC<{ title: string; steps: SkincareRoutineStep[] }> = ({ title, steps }) => (
    <div>
        <h3 className="text-xl font-bold text-center mb-4 text-brand-text">{title}</h3>
        <div className="space-y-4">
            {steps.sort((a, b) => a.step - b.step).map((item) => (
                <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-light text-brand-dark font-bold rounded-full flex items-center justify-center">
                        {item.step}
                    </div>
                    <div>
                        <h4 className="font-semibold text-text-primary">{item.productType}</h4>
                        <p className="text-text-secondary text-sm">{item.instructions}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const RoutineDisplay: React.FC<{ routine: SkincareRoutine }> = ({ routine }) => {
    const { t } = useTranslation();
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-center">{t('skinAnalysis.generateRoutine')}</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x">
                <div className="pt-6 md:pt-0">
                    <RoutineColumn title={t('routinePlanner.morning')} steps={routine.morning} />
                </div>
                <div className="pt-6 md:pt-0 md:pl-8">
                     <RoutineColumn title={t('routinePlanner.evening')} steps={routine.evening} />
                </div>
            </CardContent>
        </Card>
    );
};
