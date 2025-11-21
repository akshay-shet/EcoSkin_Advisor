import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { Spinner } from '../components/ui/Spinner';
import { recommendOutfitColors } from '../services/geminiService';
import { ColorAdvisorResult, ColorPalette } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const PaletteDisplay: React.FC<{ palette: ColorPalette }> = ({ palette }) => (
    <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-3">{palette.name}</h3>
        <div className="flex flex-col gap-2">
            {palette.hexCodes.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                    ></div>
                    <span className="font-mono text-sm">{color}</span>
                </div>
            ))}
        </div>
    </div>
);

const ColorAdvisorPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ColorAdvisorResult | null>(null);
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
            const colorResult = await recommendOutfitColors(file, i18n.language);
            setResult(colorResult);
        } catch (err) {
            console.error(err);
            setError(t('colorAdvisor.error'));
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto" />
                    <p className="mt-4 text-text-secondary">{t('colorAdvisor.findingColors')}</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-500 text-center">{error}</p>;
        }

        if (result && capturedImage) {
            return (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 flex flex-col items-center">
                           <Card>
                            <CardHeader><CardTitle>{t('colorAdvisor.yourPhoto')}</CardTitle></CardHeader>
                            <CardContent>
                              <img src={capturedImage} alt="User for color analysis" className="rounded-lg max-w-xs w-full" />
                              <div className="mt-4 text-center p-4 bg-brand-light dark:bg-brand-primary/20 rounded-lg">
                                <p className="text-text-secondary dark:text-gray-400">{t('colorAdvisor.yourSeason')}</p>
                                <p className="text-2xl font-bold text-brand-text dark:text-brand-secondary">{result.colorSeason}</p>
                              </div>
                            </CardContent>
                           </Card>
                        </div>
                        <div className="md:col-span-2">
                           <Card>
                            <CardHeader><CardTitle>{t('colorAdvisor.palettesTitle')}</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                               <PaletteDisplay palette={result.palettes.summer} />
                               <PaletteDisplay palette={result.palettes.winter} />
                               <PaletteDisplay palette={result.palettes.monsoon} />
                            </CardContent>
                           </Card>
                        </div>
                    </div>
                    {/* FIX: Added a new card to display the AI-generated outfit suggestions. */}
                    {result.outfitSuggestions && result.outfitSuggestions.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Outfit Suggestions</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {result.outfitSuggestions.map((suggestion, index) => (
                                    <div key={index} className="p-4 bg-base-200/50 dark:bg-gray-800/50 rounded-lg">
                                        <h4 className="font-semibold text-brand-text dark:text-brand-secondary">{suggestion.occasion}</h4>
                                        <p className="text-text-secondary dark:text-gray-300">{suggestion.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            );
        }

        return (
            <>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-text-primary">{t('colorAdvisor.title')}</h1>
                    <p className="text-text-secondary mt-2">{t('colorAdvisor.description')}</p>
                </div>
                <CameraCapture onCapture={handleCapture} loading={loading} />
            </>
        );
    };

    return <div className="container mx-auto">{renderContent()}</div>;
};

export default ColorAdvisorPage;