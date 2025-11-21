import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { Spinner } from '../components/ui/Spinner';
// FIX: Imported the new 'generateVirtualTryOn' service function.
import { getHairAdvice, generateVirtualTryOn } from '../services/geminiService';
import { HairAdvisorResult, HairstyleSuggestion, HairColorSuggestion } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const SuggestionCard: React.FC<{ suggestion: HairstyleSuggestion | HairColorSuggestion, type: 'style' | 'color', isFirstStyle?: boolean }> = ({ suggestion, type, isFirstStyle = false }) => {
    const { t } = useTranslation();
    const title = type === 'style' ? (suggestion as HairstyleSuggestion).name : (suggestion as HairColorSuggestion).colorName;
    const hairstyleSuggestion = type === 'style' ? (suggestion as HairstyleSuggestion) : null;

    return (
        <div className="bg-base-200/50 dark:bg-gray-800/50 p-4 rounded-lg">
            {/* FIX: Added a dedicated section for the virtual try-on image. */}
            {isFirstStyle && hairstyleSuggestion && (
                <div className="mb-3">
                    {hairstyleSuggestion.virtualTryOn === 'loading' && (
                        <div className="w-full aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center text-center">
                            <Spinner size="md" />
                            <p className="text-sm mt-2 text-text-secondary dark:text-gray-400">Applying new style...</p>
                        </div>
                    )}
                    {hairstyleSuggestion.virtualTryOn && hairstyleSuggestion.virtualTryOn !== 'loading' && (
                        <img src={hairstyleSuggestion.virtualTryOn} alt={`Virtual try-on for ${title}`} className="rounded-lg w-full aspect-square object-cover" />
                    )}
                </div>
            )}
            <h4 className="font-bold text-brand-text dark:text-brand-secondary">{title}</h4>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">{suggestion.description}</p>
            <div className="mt-2 text-xs p-2 bg-brand-light/50 dark:bg-brand-primary/10 rounded-md">
                <span className="font-semibold text-brand-dark dark:text-brand-secondary/80">{t('hairAdvisor.reasoning')}:</span>
                <span className="text-text-secondary dark:text-gray-400"> {suggestion.reasoning}</span>
            </div>
        </div>
    );
};

const HairAdvisorPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<HairAdvisorResult | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { t, i18n } = useTranslation();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setResult(null);
            setCapturedImage(null);
            setError(null);
        }
    }, [i18n.language]);

    const handleCapture = async (file: File) => {
        setLoading(true);
        setError(null);
        setResult(null);
        setCapturedImage(URL.createObjectURL(file));

        try {
            const hairResult = await getHairAdvice(file, i18n.language);
            setResult(hairResult);

            // FIX: After getting text advice, kick off the virtual try-on generation for the first suggestion.
            if (hairResult.hairstyleSuggestions.length > 0) {
                // Set a loading state specifically for the virtual try-on image
                setResult(prevResult => {
                    if (!prevResult) return null;
                    const newSuggestions = [...prevResult.hairstyleSuggestions];
                    newSuggestions[0] = { ...newSuggestions[0], virtualTryOn: 'loading' };
                    return { ...prevResult, hairstyleSuggestions: newSuggestions };
                });
                
                try {
                    const firstSuggestion = hairResult.hairstyleSuggestions[0];
                    const tryOnImage = await generateVirtualTryOn(file, firstSuggestion.description);
                    
                    // Update the state with the generated image
                    setResult(prevResult => {
                        if (!prevResult) return null;
                        const newSuggestions = [...prevResult.hairstyleSuggestions];
                        newSuggestions[0] = { ...newSuggestions[0], virtualTryOn: tryOnImage };
                        return { ...prevResult, hairstyleSuggestions: newSuggestions };
                    });
                } catch (e) {
                    console.error("Failed to generate virtual try-on:", e);
                    // Silently fail is okay, just remove the loading state
                     setResult(prevResult => {
                        if (!prevResult) return null;
                        const newSuggestions = [...prevResult.hairstyleSuggestions];
                        newSuggestions[0] = { ...newSuggestions[0], virtualTryOn: undefined };
                        return { ...prevResult, hairstyleSuggestions: newSuggestions };
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setError(t('hairAdvisor.error'));
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto" />
                    <p className="mt-4 text-text-secondary">{t('hairAdvisor.analyzing')}</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 text-center">{error}</p>;
        }

        if (result && capturedImage) {
            return (
                <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up">
                    <div className="lg:col-span-1 space-y-6">
                       <Card>
                        <CardHeader><CardTitle>{t('hairAdvisor.yourPhoto')}</CardTitle></CardHeader>
                        <CardContent>
                          <img src={capturedImage} alt="User for hair analysis" className="rounded-lg w-full" />
                        </CardContent>
                       </Card>
                        <Card>
                            <CardHeader><CardTitle>{t('hairAdvisor.analysisTitle')}</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase text-text-secondary dark:text-gray-500">{t('hairAdvisor.hairType')}</h3>
                                    <p className="font-medium text-text-primary dark:text-gray-200">{result.hairTypeAnalysis}</p>
                                </div>
                                 <div>
                                    <h3 className="text-sm font-semibold uppercase text-text-secondary dark:text-gray-500">{t('hairAdvisor.faceShape')}</h3>
                                    <p className="font-medium text-text-primary dark:text-gray-200">{result.faceShape}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                       <Card>
                        <CardHeader><CardTitle>{t('hairAdvisor.hairstylesTitle')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           {result.hairstyleSuggestions.map((style, index) => (
                               <SuggestionCard key={index} suggestion={style} type="style" isFirstStyle={index === 0} />
                           ))}
                        </CardContent>
                       </Card>
                       <Card>
                        <CardHeader><CardTitle>{t('hairAdvisor.colorsTitle')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           {result.hairColorSuggestions.map((color, index) => (
                               <SuggestionCard key={index} suggestion={color} type="color" />
                           ))}
                        </CardContent>
                       </Card>
                       <Card>
                        <CardHeader><CardTitle>{t('hairAdvisor.tipsTitle')}</CardTitle></CardHeader>
                        <CardContent>
                           <ul className="list-disc list-inside space-y-2 text-text-secondary dark:text-gray-300">
                                {result.hairCareTips.map((tip, index) => <li key={index}>{tip}</li>)}
                           </ul>
                        </CardContent>
                       </Card>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-text-primary">{t('hairAdvisor.title')}</h1>
                    <p className="text-text-secondary mt-2">{t('hairAdvisor.description')}</p>
                </div>
                <CameraCapture onCapture={handleCapture} loading={loading} />
            </>
        );
    };

    return <div className="container mx-auto">{renderContent()}</div>;
};

export default HairAdvisorPage;