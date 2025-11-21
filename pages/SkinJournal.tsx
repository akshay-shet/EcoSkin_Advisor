import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { JournalEntry } from '../types';
import { compareSkinHealth } from '../services/geminiService';
import { CameraCapture } from '../components/CameraCapture';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Card, CardContent } from '../components/ui/Card';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const AddEntryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t, i18n } = useTranslation();
    const { user, addJournalEntry } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [capturedFile, setCapturedFile] = useState<File | null>(null);

    const handleSubmit = async () => {
        if (!capturedFile) return;

        setLoading(true);
        setError(null);
        try {
            const previousEntry = user?.skinJournal?.[0] || null;
            const aiAnalysis = await compareSkinHealth(capturedFile, previousEntry?.image || null, notes, i18n.language);
            const image = await fileToDataUrl(capturedFile);
            
            const newEntry: JournalEntry = {
                date: new Date().toISOString(),
                image,
                notes,
                aiAnalysis,
            };

            addJournalEntry(newEntry);
            onClose();
        } catch (err) {
            console.error(err);
            setError(t('skinJournal.error'));
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{t('skinJournal.newEntryTitle')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {!capturedFile ? (
                        <CameraCapture onCapture={setCapturedFile} loading={false} />
                    ) : (
                        <div className="space-y-4">
                            <img src={URL.createObjectURL(capturedFile)} alt="Captured for journal" className="rounded-lg max-w-sm mx-auto" />
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('skinJournal.myNotes')}
                                </label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={t('skinJournal.notesPlaceholder')}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm bg-base-100 dark:bg-gray-900"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <div className="flex justify-end gap-4">
                                <Button variant="ghost" onClick={() => { setCapturedFile(null); setNotes(''); }} disabled={loading}>{t('cameraCapture.retake')}</Button>
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading ? <><Spinner size="sm" className="mr-2" />{t('skinJournal.saving')}</> : t('skinJournal.saveEntry')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

const TimelineItem: React.FC<{ entry: JournalEntry, isLast: boolean }> = ({ entry, isLast }) => {
    const { t } = useTranslation();
    return (
        <div className="flex gap-x-3">
            <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-300 dark:after:bg-gray-700">
                <div className="relative z-10 w-7 h-7 flex justify-center items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                </div>
            </div>
            <div className="grow pt-1 pb-8">
                <div className="flex gap-x-2">
                    <time className="font-semibold text-text-primary dark:text-gray-200">
                        {new Date(entry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                </div>
                <Card className="mt-2 p-4 grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <img src={entry.image} alt={`Journal entry for ${entry.date}`} className="rounded-md w-full" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        {entry.notes && (
                            <div>
                                <h4 className="font-semibold text-sm uppercase text-text-secondary dark:text-gray-500">{t('skinJournal.myNotes')}</h4>
                                <p className="text-text-secondary dark:text-gray-300 italic">"{entry.notes}"</p>
                            </div>
                        )}
                         <div>
                            <h4 className="font-semibold text-sm uppercase text-text-secondary dark:text-gray-500">{t('skinJournal.auraAnalysis')}</h4>
                            <p className="text-text-primary dark:text-gray-200 whitespace-pre-wrap">{entry.aiAnalysis}</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const SkinJournalPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const journalEntries = user?.skinJournal || [];

    return (
        <div className="container mx-auto">
            {isModalOpen && <AddEntryModal onClose={() => setIsModalOpen(false)} />}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">{t('skinJournal.title')}</h1>
                    <p className="text-text-secondary dark:text-gray-400 mt-2">{t('skinJournal.description')}</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>{t('skinJournal.addEntry')}</Button>
            </div>

            {journalEntries.length > 0 ? (
                <div>
                    {journalEntries.map((entry, index) => (
                        <TimelineItem key={entry.date} entry={entry} isLast={index === journalEntries.length - 1} />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-16 px-6">
                    <div className="mx-auto w-24 h-24 text-gray-400">
                        <BookOpenIcon />
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold text-text-primary">{t('skinJournal.noEntriesTitle')}</h2>
                    <p className="mt-2 text-text-secondary">{t('skinJournal.noEntriesDescription')}</p>
                    <Button onClick={() => setIsModalOpen(true)} className="mt-6">{t('skinJournal.addEntry')}</Button>
                </Card>
            )}
        </div>
    );
};

// SVG Icons
function XIcon({ className = "w-5 h-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
}
function BookOpenIcon({ className = "" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}

export default SkinJournalPage;