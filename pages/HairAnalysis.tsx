import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { HairAnalysisDisplay } from '../components/HairAnalysisDisplay';
import { Spinner } from '../components/ui/Spinner';
import { analyzeHair, recommendHairTreatments } from '../services/geminiService';
import { HairAnalysisResult, HairTreatmentsResult } from '../types';

const HairAnalysisPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<HairAnalysisResult | null>(null);
  const [treatments, setTreatments] = useState<HairTreatmentsResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
    } else {
        // Reset state when language changes
        setAnalysisResult(null);
        setTreatments(null);
        setCapturedImage(null);
        setError(null);
    }
  }, [i18n.language]);

  const handleCapture = async (file: File) => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setTreatments(null);
    setCapturedImage(URL.createObjectURL(file));

    try {
      // Step 1: Analyze Hair
      const analysis = await analyzeHair(file, i18n.language);
      setAnalysisResult(analysis);
      
      // Step 2: Fetch treatments
      const treatmentRecommendations = await recommendHairTreatments(analysis, i18n.language);
      setTreatments(treatmentRecommendations);

    } catch (err) {
      console.error(err);
      setError(t('hairAnalysis.error'));
    } finally {
      setLoading(false);
    }
  };


  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
            <Spinner size="lg" className="mx-auto" />
            <p className="mt-4 text-text-secondary">{t('hairAnalysis.analyzing')}</p>
        </div>
      );
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (analysisResult && capturedImage) {
        return (
          <div className="space-y-8">
            <HairAnalysisDisplay image={capturedImage} analysis={analysisResult} treatments={treatments} />
          </div>
        );
    }
    
    return (
        <>
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">{t('hairAnalysis.title')}</h1>
                <p className="text-text-secondary mt-2">{t('hairAnalysis.description')}</p>
            </div>
            <CameraCapture onCapture={handleCapture} loading={loading} analyzeButtonText={t('hairAnalysis.analyzeButton')} />
        </>
    );
  }

  return (
    <div className="container mx-auto">
        {renderContent()}
    </div>
  );
};

export default HairAnalysisPage;