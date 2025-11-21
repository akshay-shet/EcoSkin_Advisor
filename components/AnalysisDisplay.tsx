import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SkinAnalysisResult, SkinRemedies } from '../types';
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

interface AnalysisDisplayProps {
  image: string;
  analysis: SkinAnalysisResult;
  remedies: SkinRemedies | null;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ image, analysis, remedies }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>('deep-dive');
  const { t } = useTranslation();

  const handleAccordionToggle = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };
  
  const severityClasses: { [key: string]: string } = {
    Mild: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Severe: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative">
        <Card>
            <CardHeader><CardTitle>{t('skinAnalysis.overviewTitle')}</CardTitle></CardHeader>
            <CardContent>
                <div className="relative w-full">
                    <img src={image} alt="Analyzed face" className="rounded-lg w-full" />
                    {analysis.conditions.map((c, i) => (
                        <div
                        key={i}
                        className="absolute w-6 h-6 bg-red-500/50 border-2 border-white rounded-full flex items-center justify-center text-white font-bold"
                        style={{ left: `${c.location.x * 100}%`, top: `${c.location.y * 100}%`, transform: 'translate(-50%, -50%)' }}
                        title={`${c.condition} (${t('skinAnalysis.confidence')}: ${(c.confidence * 100).toFixed(0)}%)`}
                        >
                            {i+1}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
      <div>
        <Card>
            <CardHeader><CardTitle>{t('skinAnalysis.reportTitle')}</CardTitle></CardHeader>
            <CardContent className="p-0">
                 <div className="p-4 mb-4 bg-base-200/50 dark:bg-gray-800/50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-text-primary dark:text-gray-100">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white dark:bg-gray-700/50 p-3 rounded-md">
                            <p className="text-text-secondary dark:text-gray-400">Skin Type</p>
                            <p className="font-bold text-brand-text dark:text-brand-secondary">{analysis.skinType}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-700/50 p-3 rounded-md">
                            <p className="text-text-secondary dark:text-gray-400">Skin Tone</p>
                            <p className="font-bold text-brand-text dark:text-brand-secondary">{analysis.skinTone}</p>
                        </div>
                    </div>
                </div>

                {/* FIX: Added a new, prominent accordion item for the primary concern deep dive. */}
                 {analysis.primaryConcernDeepDive && (
                     <AccordionItem id="deep-dive" title={`Primary Concern: ${analysis.primaryConcernDeepDive.concern}`} isOpen={openAccordion === 'deep-dive'} setIsOpen={() => handleAccordionToggle('deep-dive')}>
                        <div className="space-y-4">
                            <p className="text-text-secondary dark:text-gray-300">{analysis.primaryConcernDeepDive.description}</p>
                            <div>
                                <h4 className="font-semibold text-text-primary dark:text-gray-200">Potential Causes</h4>
                                <ul className="list-disc pl-5 mt-1 space-y-1 text-text-secondary dark:text-gray-300">
                                    {analysis.primaryConcernDeepDive.potentialCauses.map((cause, i) => <li key={i}>{cause}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-text-primary dark:text-gray-200">Lifestyle Tips</h4>
                                <ul className="list-disc pl-5 mt-1 space-y-1 text-text-secondary dark:text-gray-300">
                                    {analysis.primaryConcernDeepDive.lifestyleTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </div>
                        </div>
                     </AccordionItem>
                 )}

                 <AccordionItem id="assessment" title={t('skinAnalysis.assessment')} isOpen={openAccordion === 'assessment'} setIsOpen={() => handleAccordionToggle('assessment')}>
                    <p className="text-text-secondary dark:text-gray-300">{analysis.overallAssessment}</p>
                 </AccordionItem>
                 
                 <AccordionItem id="conditions" title={t('skinAnalysis.conditions')} isOpen={openAccordion === 'conditions'} setIsOpen={() => handleAccordionToggle('conditions')}>
                    <ul className="space-y-2 text-text-secondary dark:text-gray-300">
                        {analysis.conditions.map((c, i) => (
                           <li key={i} className="flex justify-between items-center">
                               <span>{i+1}. {c.condition} <span className="text-xs">({(c.confidence * 100).toFixed(0)}%)</span></span>
                               <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severityClasses[c.severity] || 'bg-gray-100 text-gray-800'}`}>{c.severity}</span>
                            </li>
                        ))}
                    </ul>
                 </AccordionItem>
                 
                 {remedies && (
                     <>
                        <AccordionItem id="advice" title={t('skinAnalysis.advice')} isOpen={openAccordion === 'advice'} setIsOpen={() => handleAccordionToggle('advice')}>
                            <ul className="list-disc pl-5 space-y-2 text-text-secondary dark:text-gray-300">
                                {remedies.generalAdvice.map((adv, i) => <li key={i}>{adv}</li>)}
                            </ul>
                        </AccordionItem>
                        <AccordionItem id="ayurvedic" title={t('skinAnalysis.ayurvedic')} isOpen={openAccordion === 'ayurvedic'} setIsOpen={() => handleAccordionToggle('ayurvedic')}>
                            <div className="space-y-6">
                            {remedies.ayurvedic.map((r, i) => (
                                <div key={i}>
                                    {r.visual ? (
                                        <img 
                                            src={r.visual} 
                                            alt={`Visual for ${r.name}`} 
                                            className="rounded-lg mb-3 w-full object-cover aspect-video border dark:border-gray-700 shadow-sm animate-fade-in" 
                                        />
                                    ) : (
                                        <div className="rounded-lg mb-3 w-full aspect-video border dark:border-gray-700 bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                                            <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
                                    <h4 className="font-semibold text-text-primary dark:text-gray-200">{r.name}</h4>
                                    <p className="text-text-secondary dark:text-gray-300">{r.description}</p>
                                </div>
                            ))}
                            </div>
                        </AccordionItem>
                        <AccordionItem id="modern" title={t('skinAnalysis.modern')} isOpen={openAccordion === 'modern'} setIsOpen={() => handleAccordionToggle('modern')}>
                            <div className="space-y-6">
                            {remedies.modern.map((r, i) => (
                                <div key={i}>
                                    {r.visual ? (
                                        <img 
                                            src={r.visual} 
                                            alt={`Visual for ${r.name}`} 
                                            className="rounded-lg mb-3 w-full object-cover aspect-video border dark:border-gray-700 shadow-sm animate-fade-in" 
                                        />
                                    ) : (
                                        <div className="rounded-lg mb-3 w-full aspect-video border dark:border-gray-700 bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                                            <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
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

function ImageIcon({ className = "h-6 w-6" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
}