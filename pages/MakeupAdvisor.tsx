import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { Spinner } from '../components/ui/Spinner';
import { recommendMakeup } from '../services/geminiService';
// FIX: Imported the new MakeupAdvisorResult type to handle the enhanced API response.
import { MakeupAdvisorResult, MakeupRecommendation } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { SkincareMap } from '../components/SkincareMap';

const MakeupAdvisorPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // FIX: Updated state to hold the entire MakeupAdvisorResult object.
    const [result, setResult] = useState<MakeupAdvisorResult | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { t, i18n } = useTranslation();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // FIX: Corrected state reset to use setResult.
            setResult(null);
            setCapturedImage(null);
            setError(null);
        }
    }, [i18n.language]);

    const handleCapture = async (file: File) => {
        setLoading(true);
        setError(null);
        // FIX: Corrected state reset to use setResult.
        setResult(null);
        setCapturedImage(URL.createObjectURL(file));

        try {
            const makeupResult = await recommendMakeup(file, i18n.language);
            // FIX: Set the entire result object in state.
            setResult(makeupResult);
        } catch (err) {
            console.error(err);
            setError(t('makeupAdvisor.error'));
        } finally {
            setLoading(false);
        }
    };
    
    const groupRecommendations = (recs: MakeupRecommendation[]) => {
        return recs.reduce((acc, rec) => {
            const key = rec.product.toLowerCase();
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(rec);
            return acc;
        }, {} as Record<string, MakeupRecommendation[]>);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto" />
                    <p className="mt-4 text-text-secondary">{t('makeupAdvisor.findingShades')}</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 text-center">{error}</p>;
        }

        if (result && capturedImage) {
            // FIX: Group recommendations from the 'recommendations' property of the result object.
            const groupedRecs = groupRecommendations(result.recommendations);
            return (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                           <CardHeader><CardTitle>{t('makeupAdvisor.yourPhoto')}</CardTitle></CardHeader>
                           <CardContent>
                             <img src={capturedImage} alt="User for makeup analysis" className="rounded-lg w-full" />
                           </CardContent>
                        </Card>
                        {/* FIX: Added a new card to display the AI-suggested makeup look and application steps. */}
                        {result.suggestedLook && (
                           <Card>
                                <CardHeader>
                                    <CardTitle>{result.suggestedLook.lookName}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-text-secondary dark:text-gray-400">{result.suggestedLook.description}</p>
                                    <div>
                                        <h4 className="font-semibold mb-2">Application Steps:</h4>
                                        <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary dark:text-gray-300">
                                            {result.suggestedLook.applicationSteps.map((step, i) => <li key={i}>{step}</li>)}
                                        </ol>
                                    </div>
                                </CardContent>
                           </Card>
                        )}
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                           <CardHeader><CardTitle>{t('makeupAdvisor.paletteTitle')}</CardTitle></CardHeader>
                           <CardContent>
                            <div className="space-y-6">
                                {Object.entries(groupedRecs).map(([product, items]) => (
                                    <div key={product}>
                                        <h3 className="text-xl font-semibold capitalize mb-3 text-brand-text dark:text-brand-secondary">{product}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {items.map((rec, index) => (
                                                <div key={index} className="flex flex-col items-center text-center">
                                                    <div className="w-16 h-16 rounded-full border-2 dark:border-gray-600" style={{ backgroundColor: rec.hexCode }}></div>
                                                    <p className="mt-2 font-medium">{rec.shadeName}</p>
                                                    <p className="text-xs text-gray-500">{rec.hexCode}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                           </CardContent>
                        </Card>
                         <Card className="mt-6">
                            <CardHeader><CardTitle>{t('makeupAdvisor.storesTitle')}</CardTitle></CardHeader>
                            <CardContent>
                                <SkincareMap />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-text-primary">{t('makeupAdvisor.title')}</h1>
                    <p className="text-text-secondary mt-2">{t('makeupAdvisor.description')}</p>
                </div>
                <CameraCapture onCapture={handleCapture} loading={loading} />
            </>
        );
    };

    return <div className="container mx-auto">{renderContent()}</div>;
};

export default MakeupAdvisorPage;