import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { generateWeeklySkincarePlan } from '../services/geminiService';
import { WeeklySkincareRoutine, DailyRoutine, TrackedWeeklySkincareRoutine, TrackedDailyRoutine, TrackedSkincareRoutineStep, StepStatus, SkincareRoutineStep } from '../types';
import { useAuth } from '../hooks/useAuth';

// --- Icon Components ---
const EditIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
const PlusIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const OilyIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="m15.5 8.5-1.5 1.5"/></svg>;
const DryIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0-7-7c0-2 2-3.7 3.5-5.2s2.3-2.6 3.5-4.3c1.2 1.7 2 2.8 3.5 4.3S19 13 19 15a7 7 0 0 0-7 7z"/></svg>;
const CombinationIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0-10-10v0a10 10 0 0 0 10 10z"/><path d="M12 2a10 10 0 1 0 10 10"/></svg>;
const SensitiveIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4.4-3.6-8-8-8S2 7.6 2 12z"/><path d="m15 15-4 4"/><path d="m17 11-4 4"/><path d="M9 13l-4 4"/><path d="M13 7l4 4"/></svg>;
const MatureIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4.4-3.6-8-8-8S2 7.6 2 12z"/><path d="M12 6v12"/><path d="m16 8-8 8"/><path d="m8 8 8 8"/></svg>;
const SunIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>;
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const SkipIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const LightbulbIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 9 6c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;


type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Mature';
const skinTypes: { name: SkinType; icon: React.FC<{className?: string}> }[] = [
    { name: 'Oily', icon: OilyIcon },
    { name: 'Dry', icon: DryIcon },
    { name: 'Combination', icon: CombinationIcon },
    { name: 'Sensitive', icon: SensitiveIcon },
    { name: 'Mature', icon: MatureIcon },
];
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// --- Sub-components ---
interface RoutineStepsProps {
    steps: TrackedSkincareRoutineStep[];
    onStatusChange?: (stepIndex: number, newStatus: StepStatus) => void;
    isEditing: boolean;
    onStepChange?: (stepIndex: number, field: 'productType' | 'instructions', value: string) => void;
    onDeleteStep?: (stepIndex: number) => void;
    onAddStep?: () => void;
}

const RoutineSteps: React.FC<RoutineStepsProps> = ({ steps, onStatusChange, isEditing, onStepChange, onDeleteStep, onAddStep }) => {
    const { t } = useTranslation();
    return (
    <div className="space-y-3">
        {steps.sort((a,b) => a.step - b.step).map((step, index) => {
            if (isEditing) {
                return (
                    <div key={step.step} className="flex gap-3 items-start p-2 border rounded-md dark:border-gray-700 bg-base-100 dark:bg-gray-900/50">
                        <div className="flex-shrink-0 w-8 h-8 bg-brand-light dark:bg-brand-primary/20 text-brand-dark dark:text-brand-secondary font-bold rounded-full flex items-center justify-center border border-brand-secondary mt-1">
                            {step.step}
                        </div>
                        <div className="flex-grow space-y-2">
                             <input 
                                type="text"
                                value={step.productType}
                                placeholder={t('routinePlanner.productTypePlaceholder')}
                                onChange={(e) => onStepChange?.(index, 'productType', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm sm:text-sm bg-base-100 dark:bg-gray-800"
                            />
                            <textarea
                                value={step.instructions}
                                placeholder={t('routinePlanner.instructionsPlaceholder')}
                                onChange={(e) => onStepChange?.(index, 'instructions', e.target.value)}
                                rows={2}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm sm:text-sm bg-base-100 dark:bg-gray-800"
                            />
                        </div>
                         <button onClick={() => onDeleteStep?.(index)} title={t('routinePlanner.deleteStep')} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-400 mt-1">
                            <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                )
            }
            
            // Display mode
            const isPending = step.status === 'pending';
            const isCompleted = step.status === 'completed';
            const isSkipped = step.status === 'skipped';
            return (
                <div key={step.step} className="flex gap-3 items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-brand-light dark:bg-brand-primary/20 text-brand-dark dark:text-brand-secondary font-bold rounded-full flex items-center justify-center border border-brand-secondary">
                        {step.step}
                    </div>
                    <div className={`flex-grow transition-opacity ${!isPending ? 'opacity-60' : ''}`}>
                        <h5 className={`font-semibold text-text-primary dark:text-gray-200 ${isCompleted ? 'line-through' : ''}`}>{step.productType}</h5>
                        <p className={`text-sm text-text-secondary dark:text-gray-400 ${isCompleted ? 'line-through' : ''}`}>{step.instructions}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <button 
                            onClick={() => onStatusChange?.(index, 'completed')}
                            title={t('routinePlanner.markComplete')}
                            className={`p-1.5 rounded-full transition-colors ${isCompleted ? 'bg-teal-500 text-white' : 'hover:bg-teal-100 dark:hover:bg-teal-900/50 text-gray-400'}`}
                        >
                            <CheckIcon className="w-4 h-4" />
                        </button>
                         <button 
                            onClick={() => onStatusChange?.(index, 'skipped')}
                            title={t('routinePlanner.markSkipped')}
                            className={`p-1.5 rounded-full transition-colors ${isSkipped ? 'bg-red-500 text-white' : 'hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-400'}`}
                        >
                            <SkipIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )
        })}
        {isEditing && (
            <Button onClick={onAddStep} variant="ghost" className="w-full border-2 border-dashed">
                <PlusIcon className="mr-2" />
                {t('routinePlanner.addStep')}
            </Button>
        )}
    </div>
)};

interface DayAccordionProps {
    day: string, 
    routine: TrackedDailyRoutine, 
    isOpen: boolean, 
    onToggle: () => void, 
    isEditing: boolean;
    onStatusChange: (time: 'morning' | 'evening', stepIndex: number, newStatus: StepStatus) => void;
    onStepChange: (time: 'morning' | 'evening', stepIndex: number, field: 'productType' | 'instructions', value: string) => void;
    onDeleteStep: (time: 'morning' | 'evening', stepIndex: number) => void;
    onAddStep: (time: 'morning' | 'evening') => void;
}

const DayAccordion: React.FC<DayAccordionProps> = ({ day, routine, isOpen, onToggle, isEditing, onStatusChange, onStepChange, onDeleteStep, onAddStep }) => {
    const { t } = useTranslation();
    const morningCompleted = routine.morning.filter(s => s.status === 'completed').length;
    const morningTotal = routine.morning.length;
    const eveningCompleted = routine.evening.filter(s => s.status === 'completed').length;
    const eveningTotal = routine.evening.length;

    return (
    <div className="border-b dark:border-gray-700 last:border-b-0">
        <h2 id={`${day}-header`} onClick={onToggle} className="cursor-pointer">
            <button 
                type="button" 
                className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                aria-expanded={isOpen}
                aria-controls={`${day}-content`}
            >
                <span className="text-lg capitalize">{t(`routinePlanner.days.${day}`)}</span>
                <svg className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                </svg>
            </button>
        </h2>
        {isOpen && (
            <div 
                id={`${day}-content`}
                role="region"
                aria-labelledby={`${day}-header`}
                className="p-5 border-t dark:border-gray-700 bg-white dark:bg-gray-800"
            >
                {routine.dailyTip && !isEditing && (
                    <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg flex items-start gap-3 text-sm">
                        <LightbulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Daily Tip:</strong> {routine.dailyTip}</span>
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-brand-text dark:text-brand-secondary flex items-center gap-2">
                                <SunIcon className="w-5 h-5 text-yellow-500" />
                                {t('routinePlanner.morning')}
                            </h4>
                           {!isEditing && <span className="text-xs font-medium text-text-secondary bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{t('routinePlanner.progress', {completed: morningCompleted, total: morningTotal})}</span>}
                        </div>
                        <RoutineSteps 
                            steps={routine.morning} 
                            isEditing={isEditing}
                            onStatusChange={(stepIndex, newStatus) => onStatusChange('morning', stepIndex, newStatus)} 
                            onStepChange={(stepIndex, field, value) => onStepChange('morning', stepIndex, field, value)}
                            onDeleteStep={(stepIndex) => onDeleteStep('morning', stepIndex)}
                            onAddStep={() => onAddStep('morning')}
                        />
                    </div>
                    <div className="border-t pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-8 border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-brand-text dark:text-brand-secondary flex items-center gap-2">
                                <MoonIcon className="w-5 h-5 text-indigo-400" />
                                {t('routinePlanner.evening')}
                            </h4>
                            {!isEditing && <span className="text-xs font-medium text-text-secondary bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{t('routinePlanner.progress', {completed: eveningCompleted, total: eveningTotal})}</span>}
                        </div>
                        <RoutineSteps 
                            steps={routine.evening} 
                            isEditing={isEditing}
                            onStatusChange={(stepIndex, newStatus) => onStatusChange('evening', stepIndex, newStatus)} 
                            onStepChange={(stepIndex, field, value) => onStepChange('evening', stepIndex, field, value)}
                            onDeleteStep={(stepIndex) => onDeleteStep('evening', stepIndex)}
                            onAddStep={() => onAddStep('evening')}
                        />
                    </div>
                </div>
            </div>
        )}
    </div>
)};

// --- Main Page Component ---
const SkincareRoutinePlannerPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { user, updateTrackedRoutine } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [routinePlan, setRoutinePlan] = useState<TrackedWeeklySkincareRoutine | null>(null);
    const [originalPlan, setOriginalPlan] = useState<TrackedWeeklySkincareRoutine | null>(null); // For canceling edits
    const [isEditing, setIsEditing] = useState(false);
    
    const [view, setView] = useState<'select' | 'display'>('select');
    const [creationMode, setCreationMode] = useState<'ai' | 'custom' | null>(null);
    
    // AI generation state
    const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
    const [customDescription, setCustomDescription] = useState('');
    
    const [openDay, setOpenDay] = useState<string | null>(null);
    const [planFor, setPlanFor] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        // This effect runs only on initial mount to load saved data.
        if (user?.trackedRoutine) {
            setRoutinePlan(user.trackedRoutine);
            // FIX: Correctly map JS Date.getDay() (Sun=0) to the daysOfWeek array (Mon=0).
            const dayIndex = new Date().getDay();
            const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Maps Sunday to index 6, Monday to 0, etc.
            setOpenDay(daysOfWeek[adjustedIndex]);
            setView('display');
        }
    }, []); // Empty dependency array ensures this runs only once.
    
    useEffect(() => {
        // FIX: This effect handles setting the title text and updating it on language change, without resetting the page.
        const isShowingSavedPlan = view === 'display' && routinePlan && user?.trackedRoutine && JSON.stringify(routinePlan) === JSON.stringify(user.trackedRoutine);

        if (isShowingSavedPlan) {
            // A custom plan title could be stored, so we check if the current title seems like a translation key.
            const currentTitleIsDefault = planFor === '' || planFor === t('routinePlanner.yourSavedPlan', { lng: i18n.options.fallbackLng?.[0] });
            if(currentTitleIsDefault) {
                setPlanFor(t('routinePlanner.yourSavedPlan'));
            }
        }
    }, [view, routinePlan, user?.trackedRoutine, t, i18n.language]);

    
    const addTrackingToRoutine = (routine: WeeklySkincareRoutine): TrackedWeeklySkincareRoutine => {
        const trackedRoutine = { ...routine } as any;
        daysOfWeek.forEach(day => {
            const dayKey = day as keyof WeeklySkincareRoutine;
            if (routine[dayKey]) {
                const dayRoutine = routine[dayKey] as DailyRoutine;
                trackedRoutine[dayKey] = {
                    morning: (dayRoutine.morning || []).map((step: SkincareRoutineStep, index: number) => ({ ...step, step: index + 1, status: 'pending' as StepStatus })),
                    evening: (dayRoutine.evening || []).map((step: SkincareRoutineStep, index: number) => ({ ...step, step: index + 1, status: 'pending' as StepStatus })),
                    dailyTip: dayRoutine.dailyTip || undefined,
                };
            }
        });
        return trackedRoutine as TrackedWeeklySkincareRoutine;
    };

    const handleGeneratePlan = async () => {
        const planTopic = customDescription.trim() || selectedSkinType;
        if (!planTopic) return;
        
        setLoading(true);
        setError(null);
        setPlanFor(customDescription.trim() ? `"${customDescription.trim()}"` : t(`routinePlanner.skinTypes.${selectedSkinType!}`));

        try {
            const plan = await generateWeeklySkincarePlan(planTopic, i18n.language);
            const trackedPlan = addTrackingToRoutine(plan);
            setRoutinePlan(trackedPlan);
            updateTrackedRoutine(trackedPlan);
            setOpenDay('monday');
            setView('display');
        } catch (err) {
            console.error(err);
            setError(t('routinePlanner.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBlankPlan = () => {
        const blankPlan: TrackedWeeklySkincareRoutine = {
            weeklyFocus: 'My Custom Eco-Friendly Routine',
            ...Object.fromEntries(daysOfWeek.map(day => [day, { morning: [], evening: [], dailyTip: '' }]))
        } as TrackedWeeklySkincareRoutine;
        setRoutinePlan(blankPlan);
        setPlanFor(t('routinePlanner.customTitle'));
        setOpenDay('monday');
        setView('display');
        setIsEditing(true);
        setOriginalPlan(JSON.parse(JSON.stringify(blankPlan))); // Save for cancel
    };

    const handleStatusChange = (day: string, time: 'morning' | 'evening', stepIndex: number, newStatus: StepStatus) => {
        if (!routinePlan) return;
        const newPlan = JSON.parse(JSON.stringify(routinePlan));
        const dayRoutine = newPlan[day as keyof TrackedWeeklySkincareRoutine] as TrackedDailyRoutine;
        const stepToUpdate = dayRoutine[time][stepIndex];
        stepToUpdate.status = stepToUpdate.status === newStatus ? 'pending' : newStatus;
        setRoutinePlan(newPlan);
        updateTrackedRoutine(newPlan);
    };

    const handleStepChange = (day: string, time: 'morning' | 'evening', stepIndex: number, field: 'productType' | 'instructions', value: string) => {
        setRoutinePlan(prevPlan => {
            if (!prevPlan) return null;
            const newPlan = JSON.parse(JSON.stringify(prevPlan));
            const dayRoutine = newPlan[day as keyof TrackedWeeklySkincareRoutine] as TrackedDailyRoutine;
            dayRoutine[time][stepIndex][field] = value;
            return newPlan;
        });
    };

    const handleAddStep = (day: string, time: 'morning' | 'evening') => {
        setRoutinePlan(prevPlan => {
            if (!prevPlan) return null;
            const newPlan = JSON.parse(JSON.stringify(prevPlan));
            const dayRoutine = newPlan[day as keyof TrackedWeeklySkincareRoutine] as TrackedDailyRoutine;
            const newStep: TrackedSkincareRoutineStep = {
                step: dayRoutine[time].length + 1,
                productType: '',
                instructions: '',
                status: 'pending'
            };
            dayRoutine[time].push(newStep);
            return newPlan;
        });
    };

    const handleDeleteStep = (day: string, time: 'morning' | 'evening', stepIndex: number) => {
        setRoutinePlan(prevPlan => {
            if (!prevPlan) return null;
            const newPlan = JSON.parse(JSON.stringify(prevPlan));
            const dayRoutine = newPlan[day as keyof TrackedWeeklySkincareRoutine] as TrackedDailyRoutine;
            dayRoutine[time].splice(stepIndex, 1);
            // Re-number steps
            dayRoutine[time].forEach((step, i) => step.step = i + 1);
            return newPlan;
        });
    };

    const handleSaveChanges = () => {
        if (!routinePlan) return;
        updateTrackedRoutine(routinePlan);
        setIsEditing(false);
        setOriginalPlan(null);
    };

    const handleCancelEdit = () => {
        if (originalPlan) setRoutinePlan(originalPlan);
        setIsEditing(false);
        setOriginalPlan(null);
    };
    
    const handlePrint = () => window.print();

    const handleStartNewPlan = () => {
        if (routinePlan) {
            setShowConfirmModal(true);
        } else {
            resetAndSelect();
        }
    };
    
    const resetAndSelect = () => {
        setRoutinePlan(null);
        updateTrackedRoutine(null);
        setError(null);
        setCreationMode(null);
        setSelectedSkinType(null);
        setCustomDescription('');
        setView('select');
        setShowConfirmModal(false);
    };

    const renderConfirmModal = () => (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <Card className="max-w-md">
                <CardHeader><CardTitle>{t('routinePlanner.confirmOverwriteTitle')}</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-text-secondary">{t('routinePlanner.confirmOverwriteText')}</p>
                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>{t('routinePlanner.confirmNo')}</Button>
                        <Button onClick={resetAndSelect}>{t('routinePlanner.confirmYes')}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
    
    const renderSelection = () => (
        <Card>
            <CardHeader><CardTitle className="text-center">{t('routinePlanner.selectPrompt')}</CardTitle></CardHeader>
            <CardContent className="p-6 text-center">
            {!creationMode ? (
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button onClick={() => setCreationMode('ai')} className="p-6 border-2 rounded-lg hover:border-brand-primary transition-all">
                        <h3 className="text-xl font-semibold">{t('routinePlanner.generateWithAI')}</h3>
                        <p className="text-sm text-text-secondary mt-2">{t('routinePlanner.description')}</p>
                    </button>
                    <button onClick={() => setCreationMode('custom')} className="p-6 border-2 rounded-lg hover:border-brand-primary transition-all">
                         <h3 className="text-xl font-semibold">{t('routinePlanner.createManually')}</h3>
                         <p className="text-sm text-text-secondary mt-2">{t('routinePlanner.customDescription')}</p>
                    </button>
                </div>
            ) : creationMode === 'ai' ? (
                <div>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {skinTypes.map(({ name, icon: Icon }) => (
                            <button key={name} onClick={() => { setSelectedSkinType(name); setCustomDescription(''); }} className={`p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 ${selectedSkinType === name ? 'border-brand-primary bg-brand-light dark:bg-brand-primary/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-secondary dark:hover:border-brand-secondary/50'}`}>
                                <Icon className="w-8 h-8 text-brand-primary" />
                                <span className="font-medium text-sm text-text-primary dark:text-gray-200">{t(`routinePlanner.skinTypes.${name}`)}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center my-6"><div className="flex-grow border-t dark:border-gray-700"></div><span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span><div className="flex-grow border-t dark:border-gray-700"></div></div>
                    <div>
                        <label htmlFor="custom-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('routinePlanner.customPrompt')}</label>
                        <textarea id="custom-description" rows={3} value={customDescription} onChange={(e) => { setCustomDescription(e.target.value); setSelectedSkinType(null); }} placeholder={t('routinePlanner.customPlaceholder')} className="w-full max-w-lg mx-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm bg-base-100 dark:bg-gray-900" />
                    </div>
                    <Button onClick={handleGeneratePlan} disabled={loading || (!selectedSkinType && !customDescription.trim())} className="mt-6">
                        {loading ? <Spinner size="sm" /> : t('routinePlanner.generateButton')}
                    </Button>
                </div>
            ) : (
                 <Button onClick={handleCreateBlankPlan} size="lg">{t('routinePlanner.startBuilding')}</Button>
            )}
            </CardContent>
        </Card>
    );

    const renderResults = () => {
        if (loading) return <div className="text-center py-10"><Spinner size="lg" className="mx-auto" /><p className="mt-4 text-text-secondary dark:text-gray-400">{t('routinePlanner.generating')}</p></div>;
        if (error) return <p className="text-red-500 text-center py-10">{error}</p>;
        if (routinePlan) {
            return (
                <>
                    <style>{`@media print { body * { visibility: hidden; } #printable-plan, #printable-plan * { visibility: visible; } #printable-plan { position: absolute; left: 0; top: 0; width: 100%; padding: 1rem; } .no-print { display: none !important; } }`}</style>
                    <div className="print:hidden">
                        <Card>
                            <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left flex-grow">
                                    <CardTitle>{t('routinePlanner.planTitle', { skinType: planFor })}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <strong className="text-sm text-text-secondary dark:text-gray-400">{t('routinePlanner.weeklyFocus')}</strong>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={routinePlan.weeklyFocus}
                                                onChange={(e) => setRoutinePlan(prev => prev ? {...prev, weeklyFocus: e.target.value} : null)}
                                                className="text-sm p-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-base-100 dark:bg-gray-800"
                                            />
                                        ) : (
                                            <p className="text-sm text-text-secondary dark:text-gray-400">{routinePlan.weeklyFocus}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 no-print">
                                    {isEditing ? (
                                        <>
                                            <Button variant="ghost" onClick={handleCancelEdit}>{t('routinePlanner.cancel')}</Button>
                                            <Button onClick={handleSaveChanges}>{t('routinePlanner.saveChanges')}</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="ghost" onClick={handlePrint}>{t('routinePlanner.printPlan')}</Button>
                                            <Button variant="secondary" onClick={() => { setOriginalPlan(JSON.parse(JSON.stringify(routinePlan))); setIsEditing(true); }}>{t('routinePlanner.editPlan')}</Button>
                                            <Button onClick={handleStartNewPlan}>{t('routinePlanner.startOver')}</Button>
                                        </>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                               <div className="bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                                 {daysOfWeek.map(day => {
                                    const routineForDay = routinePlan[day as keyof WeeklySkincareRoutine] as TrackedDailyRoutine;
                                    if (!routineForDay) return null;
                                    return <DayAccordion 
                                        key={day} 
                                        day={day} 
                                        routine={routineForDay} 
                                        isOpen={openDay === day} 
                                        onToggle={() => setOpenDay(openDay === day ? null : day)} 
                                        isEditing={isEditing}
                                        onStatusChange={(time, stepIndex, newStatus) => handleStatusChange(day, time, stepIndex, newStatus)} 
                                        onStepChange={(time, stepIndex, field, value) => handleStepChange(day, time, stepIndex, field, value)}
                                        onDeleteStep={(time, stepIndex) => handleDeleteStep(day, time, stepIndex)}
                                        onAddStep={(time) => handleAddStep(day, time)}
                                    />;
                                 })}
                               </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Printable version remains unchanged and will not show editable fields */}
                </>
            );
        }
        return null;
    };
    
    return (
        <div className="container mx-auto space-y-8">
            {showConfirmModal && renderConfirmModal()}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">{t('routinePlanner.title')}</h1>
                <p className="text-text-secondary dark:text-gray-400 mt-2 max-w-2xl mx-auto">{t('routinePlanner.description')}</p>
            </div>
            
            {view === 'select' && !loading && renderSelection()}
            {view === 'display' && renderResults()}
        </div>
    );
};

export default SkincareRoutinePlannerPage;