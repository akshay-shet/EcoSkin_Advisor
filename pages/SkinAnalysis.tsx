import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { AnalysisDisplay } from '../components/AnalysisDisplay';
import { Spinner } from '../components/ui/Spinner';
import { analyzeSkin, recommendSkinRemedies, generateVisualForRemedy } from '../services/geminiService';
import { JournalEntry, SkinAnalysisResult, SkinRemedies } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Helper to convert a file to a base64 data URL for storage
const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Checkmark icon for success messages
function CheckCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}

const SkinAnalysisPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [remedies, setRemedies] = useState<SkinRemedies | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [journalNotes, setJournalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { updateSkinProfile, addJournalEntry } = useAuth();
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
    } else {
        // Reset state when language changes to force re-analysis in the new language
        setAnalysisResult(null);
        setRemedies(null);
        setCapturedImage(null);
        setCapturedFile(null);
        setError(null);
    }
  }, [i18n.language]);

  const handleCapture = async (file: File) => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setRemedies(null);
    setCapturedImage(URL.createObjectURL(file));
    setCapturedFile(file);
    setJournalNotes('');
    setIsSaved(false);

    try {
      // Step 1: Analyze Skin for conditions, type, and tone
      const analysis = await analyzeSkin(file, i18n.language);
      setAnalysisResult(analysis);
      updateSkinProfile(analysis);

      // Step 2: Fetch text remedies, now personalized with skin type
      const conditionNames = analysis.conditions.map(c => c.condition);
      
      const textRemedies = await recommendSkinRemedies(conditionNames, analysis.skinType, i18n.language);

      // Step 3: Generate visuals for all remedies concurrently
      // Use Promise.allSettled to ensure that even if one image fails, the others can still be displayed.
      const visualPromises = [
          ...textRemedies.ayurvedic.map(r => generateVisualForRemedy(r.name, i18n.language)),
          ...textRemedies.modern.map(r => generateVisualForRemedy(r.name, i18n.language))
      ];

      const visualResults = await Promise.allSettled(visualPromises);
      
      // Step 4: Combine text remedies with their visuals
      const ayurvedicRemediesWithVisuals = textRemedies.ayurvedic.map((remedy, index) => {
          const visualResult = visualResults[index];
          return {
              ...remedy,
              visual: visualResult.status === 'fulfilled' ? visualResult.value : undefined
          };
      });

      const modernRemediesWithVisuals = textRemedies.modern.map((remedy, index) => {
          const visualResult = visualResults[textRemedies.ayurvedic.length + index];
          return {
              ...remedy,
              visual: visualResult.status === 'fulfilled' ? visualResult.value : undefined
          };
      });

      const finalRemedies = {
          ...textRemedies,
          ayurvedic: ayurvedicRemediesWithVisuals,
          modern: modernRemediesWithVisuals
      };

      setRemedies(finalRemedies);

    } catch (err) {
      console.error(err);
      setError(t('skinAnalysis.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToJournal = async () => {
    if (!capturedFile || !analysisResult) return;

    setIsSaving(true);
    try {
        const image = await fileToDataUrl(capturedFile);

        const conditionsSummary = analysisResult.conditions.map(c => `${c.condition} (${c.severity})`).join(', ');
        const aiAnalysis = `**Overall Assessment:** ${analysisResult.overallAssessment}\n\n**Identified Conditions:** ${conditionsSummary || 'None'}`;

        const newEntry: JournalEntry = {
            date: new Date().toISOString(),
            image,
            notes: journalNotes,
            aiAnalysis,
        };

        addJournalEntry(newEntry);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
        console.error("Failed to save to journal", err);
        setError(t('skinJournal.error'));
    } finally {
        setIsSaving(false);
    }
  };


  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
            <Spinner size="lg" className="mx-auto" />
            <p className="mt-4 text-text-secondary">{t('skinAnalysis.analyzing')}</p>
        </div>
      );
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (analysisResult && capturedImage) {
        return (
          <div className="space-y-8">
            <AnalysisDisplay image={capturedImage} analysis={analysisResult} remedies={remedies} />
            <Card>
              <CardHeader>
                <CardTitle>{t('skinJournal.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-4">{t('skinJournal.description')}</p>
                 <div>
                    <label htmlFor="journal-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('skinJournal.myNotes')}
                    </label>
                    <textarea
                        id="journal-notes"
                        value={journalNotes}
                        onChange={(e) => setJournalNotes(e.target.value)}
                        placeholder={t('skinJournal.notesPlaceholder')}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm bg-base-100 dark:bg-gray-900"
                    />
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Button onClick={handleSaveToJournal} disabled={isSaving}>
                      {isSaving ? <Spinner size="sm" className="mr-2" /> : null}
                      {t('skinJournal.saveEntry')}
                  </Button>
                  {isSaved && 
                    <div className="flex items-center text-sm text-green-600 animate-fade-in">
                      <CheckCircleIcon />
                      <span className="ml-2">{t('profile.savedSuccess')}</span>
                    </div>
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
    
    return (
        <>
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">{t('skinAnalysis.title')}</h1>
                <p className="text-text-secondary mt-2">{t('skinAnalysis.description')}</p>
            </div>
            <CameraCapture onCapture={handleCapture} loading={loading} />
        </>
    );
  }

  return (
    <div className="container mx-auto">
        {renderContent()}
    </div>
  );
};

export default SkinAnalysisPage;