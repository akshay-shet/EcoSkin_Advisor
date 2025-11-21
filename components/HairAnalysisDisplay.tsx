import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HairAnalysisResult, HairTreatmentsResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface AccordionItemProps {
  title: string;
  id: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, id, children, isOpen, setIsOpen }) => (
  <div className="border-b dark:border-gray-700">
    <h2 id={`${id}-header`}>
      <button 
        type="button" 
        className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 dark:text-gray-300" 
        onClick={setIsOpen}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <span>{title}</span>
        <svg className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
        </svg>
      </button>
    </h2>
    {isOpen && (
      <div 
        id={`${id}-content`} 
        role="region" 
        aria-labelledby={`${id}-header`}
        className="p-5 border-t dark:border-gray-700"
      >
        {children}
      </div>
    )}
  </div>
);


interface HairAnalysisDisplayProps {
  image: string;
  analysis: HairAnalysisResult;
  treatments: HairTreatmentsResult | null;
}

export const HairAnalysisDisplay: React.FC<HairAnalysisDisplayProps> = ({ image, analysis, treatments }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>('deep-dive');
  const { t } = useTranslation();

  const handleAccordionToggle = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };
  
  const analysisItems = [
      { label: t('hairAnalysis.hairType'), value: analysis.hairType },
      { label: t('hairAnalysis.texture'), value: analysis.texture },
      { label: t('hairAnalysis.porosity'), value: analysis.porosity },
      { label: t('hairAnalysis.scalpHealth'), value: analysis.scalpHealth },
      { label: t('hairAnalysis.faceShape'), value: analysis.faceShape },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
      <div className="relative">
        <Card>
            <CardHeader><CardTitle>{t('hairAnalysis.overviewTitle')}</CardTitle></CardHeader>
            <CardContent>
                <img src={image} alt={t('hairAnalysis.analyzedHairAlt')} className="rounded-lg w-full" />
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {analysisItems.map(item => (
                        <div key={item.label} className="p-3 bg-base-200/50 dark:bg-gray-800/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-text-secondary dark:text-gray-400">{item.label}</h4>
                            <p className="text-md font-medium text-text-primary dark:text-gray-200">{item.value}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
      <div>
        <Card>
            <CardHeader><CardTitle>{t('hairAnalysis.reportTitle')}</CardTitle></CardHeader>
            <CardContent className="p-0">
                {/* FIX: Added a new, prominent accordion item for the primary concern deep dive. */}
                 {analysis.primaryConcernDeepDive && (
                     <AccordionItem id="deep-dive" title={`Primary Concern: ${analysis.primaryConcernDeepDive.concern}`} isOpen={openAccordion === 'deep-dive'} setIsOpen={() => handleAccordionToggle('deep-dive')}>
                        <div className="space-y-4">
                            <p className="text-text-secondary dark:text-gray-300">{analysis.primaryConcernDeepDive.explanation}</p>
                            <div>
                                <h4 className="font-semibold text-text-primary dark:text-gray-200">Ingredients to Look For</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {analysis.primaryConcernDeepDive.ingredientsToLookFor.map((ing, i) => (
                                      <span key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">{ing}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                     </AccordionItem>
                 )}

                 <AccordionItem id="assessment" title={t('hairAnalysis.assessment')} isOpen={openAccordion === 'assessment'} setIsOpen={() => handleAccordionToggle('assessment')}>
                    <p className="text-text-secondary dark:text-gray-300">{analysis.overallAssessment}</p>
                 </AccordionItem>
                 
                 {treatments && (
                     <>
                        <AccordionItem id="generalTips" title={t('hairAnalysis.generalTips')} isOpen={openAccordion === 'generalTips'} setIsOpen={() => handleAccordionToggle('generalTips')}>
                            <ul className="list-disc pl-5 space-y-2 text-text-secondary dark:text-gray-300">
                                {treatments.generalTips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </AccordionItem>
                        <AccordionItem id="homeRemedies" title={t('hairAnalysis.homeRemedies')} isOpen={openAccordion === 'homeRemedies'} setIsOpen={() => handleAccordionToggle('homeRemedies')}>
                            <div className="space-y-4">
                            {treatments.homeRemedies.map((r, i) => (
                                <div key={i}>
                                    <h4 className="font-semibold text-text-primary dark:text-gray-200">{r.name}</h4>
                                    <p className="text-text-secondary dark:text-gray-300">{r.description}</p>
                                </div>
                            ))}
                            </div>
                        </AccordionItem>
                        <AccordionItem id="productRecs" title={t('hairAnalysis.productRecs')} isOpen={openAccordion === 'productRecs'} setIsOpen={() => handleAccordionToggle('productRecs')}>
                            <div className="space-y-4">
                            {treatments.productRecommendations.map((r, i) => (
                                <div key={i}>
                                    <h4 className="font-semibold text-text-primary dark:text-gray-200">{r.productType}</h4>
                                    <p className="text-text-secondary dark:text-gray-300">{r.reason}</p>
                                </div>
                            ))}
                            </div>
                        </AccordionItem>
                         <AccordionItem id="profTreatments" title={t('hairAnalysis.profTreatments')} isOpen={openAccordion === 'profTreatments'} setIsOpen={() => handleAccordionToggle('profTreatments')}>
                            <div className="space-y-4">
                            {treatments.professionalTreatments.map((r, i) => (
                                <div key={i}>
                                    <h4 className="font-semibold text-text-primary dark:text-gray-200">{r.name}</h4>
                                    <p className="text-text-secondary dark:text-gray-300">{r.description}</p>
                                </div>
                            ))}
                            </div>
                        </AccordionItem>
                    </>
                 )}

            </CardContent>
        </Card>
      </div>
    </div>
  );
};