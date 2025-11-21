import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { Spinner } from '../components/ui/Spinner';
import { createFacialTimeLapse } from '../services/geminiService';
import { Button } from '../components/ui/Button';

// FIX: Removed conflicting global declaration for window.aistudio.
// The type was conflicting with a globally defined 'AIStudio' type.

const AgeProgressionPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const loadingMessages = [
        t('ageProgression.loading1'),
        t('ageProgression.loading2'),
        t('ageProgression.loading3'),
        t('ageProgression.loading4'),
        t('ageProgression.loading5'),
    ];

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [transformation, setTransformation] = useState<'childhood' | 'old age' | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const isInitialMount = useRef(true);
    
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // Reset state if language changes while on this page
            setVideoUrl(null);
            setCapturedFile(null);
            setError(null);
            setTransformation(null);
        }
    }, [i18n.language]);


    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            } else {
                 // Fallback for environments where aistudio is not present
                console.warn("aistudio not found. Assuming API key is set via environment.");
                setApiKeySelected(true);
            }
        };
        checkApiKey();
    }, []);

    useEffect(() => {
        let interval: number;
        if (loading) {
            interval = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    return loadingMessages[(currentIndex + 1) % loadingMessages.length];
                });
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [loading, t]);

    const handleSelectApiKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume selection is successful to avoid race conditions.
            setApiKeySelected(true);
        }
    };

    const handleCapture = (file: File) => {
        setCapturedFile(file);
    };

    const handleGenerateVideo = async (transform: 'childhood' | 'old age') => {
        if (!capturedFile) return;

        setTransformation(transform);
        setLoading(true);
        setError(null);
        setVideoUrl(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            const url = await createFacialTimeLapse(capturedFile, transform, i18n.language);
            setVideoUrl(url);
        } catch (err: any) {
            console.error(err);
            if (err.message && err.message.includes("Requested entity was not found")) {
                setError(t('ageProgression.invalidKey'));
                setApiKeySelected(false);
            } else {
                setError(t('ageProgression.videoError'));
            }
        } finally {
            setLoading(false);
        }
    };

    if (!apiKeySelected) {
        return (
             <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-text-primary mb-4">{t('ageProgression.apiKeyRequired')}</h1>
                <p className="text-text-secondary mb-6">{t('ageProgression.apiKeyInfo')} <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">the billing documentation</a> for more information.</p>
                <Button onClick={handleSelectApiKey}>{t('ageProgression.selectKey')}</Button>
            </div>
        );
    }
    
    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto" />
                    <p className="mt-4 text-text-secondary text-lg">{loadingMessage}</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 text-center">{error}</p>;
        }

        if (videoUrl) {
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('ageProgression.videoReady')}</h2>
                    <video src={videoUrl} controls autoPlay loop className="max-w-md mx-auto rounded-lg shadow-lg"></video>
                    <div className="flex justify-center gap-4 mt-6">
                      <Button onClick={() => { setVideoUrl(null); }} variant="secondary">{t('ageProgression.differentTransformation')}</Button>
                      <Button onClick={() => { setVideoUrl(null); setCapturedFile(null); }}>{t('ageProgression.startOver')}</Button>
                    </div>
                </div>
            );
        }
        
        if (capturedFile) {
             return (
                 <div className="text-center">
                    <img src={URL.createObjectURL(capturedFile)} alt="Captured for time-lapse" className="max-w-xs mx-auto rounded-lg mb-6"/>
                    <h2 className="text-xl font-semibold mb-4">{t('ageProgression.chooseTransformation')}</h2>
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => handleGenerateVideo('childhood')}>{t('ageProgression.toChildhood')}</Button>
                        <Button onClick={() => handleGenerateVideo('old age')}>{t('ageProgression.toOldAge')}</Button>
                    </div>
                 </div>
             )
        }

        return (
            <>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-text-primary">{t('ageProgression.title')}</h1>
                    <p className="text-text-secondary mt-2">{t('ageProgression.description')}</p>
                </div>
                <CameraCapture onCapture={handleCapture} loading={loading} />
            </>
        );
    };

    return <div className="container mx-auto">{renderContent()}</div>;
};

export default AgeProgressionPage;