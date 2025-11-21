import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { Spinner } from '../components/ui/Spinner';
import { analyzeSkincareProduct } from '../services/geminiService';
import { ProductAnalysisResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const ProductAnalyzerPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ProductAnalysisResult | null>(null);
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
            const analysis = await analyzeSkincareProduct(file, i18n.language);
            setResult(analysis);
        } catch (err) {
            console.error(err);
            setError(t('productAnalyzer.error'));
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto" />
                    <p className="mt-4 text-text-secondary">{t('productAnalyzer.analyzing')}</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 text-center">{error}</p>;
        }

        if (result && capturedImage) {
            return (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader><CardTitle>{t('productAnalyzer.productImage')}</CardTitle></CardHeader>
                            <CardContent>
                                <img src={capturedImage} alt="Skincare product" className="rounded-lg w-full" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{result.productName}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-text-primary dark:text-gray-200">{t('productAnalyzer.suitableFor')}</h3>
                                    <p className="text-text-secondary dark:text-gray-400">{result.suitableFor}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary dark:text-gray-200">{t('productAnalyzer.usageInstructions')}</h3>
                                    <p className="text-text-secondary dark:text-gray-400">{result.usageInstructions}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary dark:text-gray-200">{t('productAnalyzer.keyIngredients')}</h3>
                                    <ul className="space-y-2 mt-2">
                                        {result.keyIngredients.map((ing, i) => (
                                            <li key={i} className="p-2 bg-base-200/50 dark:bg-gray-800/50 rounded-md">
                                                <p className="font-medium text-text-primary dark:text-gray-200">{ing.name}</p>
                                                <p className="text-sm text-text-secondary dark:text-gray-400">{ing.benefit}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                        {/* FIX: Added new card to display potential ingredient flags and eco-friendly alternatives. */}
                        <Card>
                             <CardContent className="pt-6 space-y-6">
                                {result.potentialFlags && result.potentialFlags.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-text-primary dark:text-gray-200 flex items-center gap-2">
                                            <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />
                                            Potential Flags
                                        </h3>
                                        <ul className="space-y-2 mt-2">
                                            {result.potentialFlags.map((flag, i) => (
                                                <li key={i} className={`p-2 rounded-md flex items-start gap-2 text-sm ${flag.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}`}>
                                                    <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    {flag.message}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {result.ecoFriendlyAlternatives && result.ecoFriendlyAlternatives.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-text-primary dark:text-gray-200 flex items-center gap-2">
                                           <LeafIcon className="w-5 h-5 text-green-500" />
                                           Eco-Friendly Alternatives
                                        </h3>
                                        <ul className="space-y-2 mt-2">
                                            {result.ecoFriendlyAlternatives.map((alt, i) => (
                                                <li key={i} className="p-2 bg-base-200/50 dark:bg-gray-800/50 rounded-md">
                                                    <p className="font-medium text-text-primary dark:text-gray-200">{alt.productType}</p>
                                                    <p className="text-sm text-text-secondary dark:text-gray-400">{alt.reason}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                             </CardContent>
                        </Card>
                    </div>
                </div>
            );
        }
        
        return (
            <>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-text-primary">{t('productAnalyzer.title')}</h1>
                    <p className="text-text-secondary mt-2">{t('productAnalyzer.description')}</p>
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

// SVG Icons for new sections
function AlertTriangleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
}
function InfoIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>;
}
function LeafIcon({ className = "h-5 w-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13q0-3.5 2.5-6.5A10 10 0 0 1 20 4a7 7 0 0 1-7 7q-3.5 0-6.5 2.5Z"/><path d="M12 21a7 7 0 0 0 7-7q0-3.5-2.5-6.5A10 10 0 0 0 4 4a7 7 0 0 0 7 7q3.5 0 6.5 2.5Z"/></svg>;
}

export default ProductAnalyzerPage;