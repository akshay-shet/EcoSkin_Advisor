import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = {
  en: { nativeName: 'English' },
  kn: { nativeName: 'ಕನ್ನಡ' },
  te: { nativeName: 'తెలుగు' },
  ta: { nativeName: 'தமிழ்' },
  hi: { nativeName: 'हिन्दी' },
};

export const LanguageSwitcher: React.FC<{ variant?: 'sidebar' | 'header' | 'settings' | 'header-icon' }> = ({ variant = 'sidebar' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (variant === 'header-icon') {
    return (
        <div className="relative" ref={switcherRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Change language"
            >
                <GlobeIcon className="h-5 w-5 text-text-secondary dark:text-gray-400" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-10">
                    {Object.keys(languages).map((lng) => (
                        <button
                            key={lng}
                            className={`block w-full text-left px-4 py-2 text-sm ${i18n.resolvedLanguage === lng ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} text-text-primary dark:text-gray-200`}
                            onClick={() => handleLanguageChange(lng)}
                        >
                            {languages[lng as keyof typeof languages].nativeName}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
  }

  if (variant === 'header') {
    return (
        <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                 {Object.keys(languages).map((lng) => (
                    <button
                        key={lng}
                        onClick={() => handleLanguageChange(lng)}
                        disabled={i18n.resolvedLanguage === lng}
                        className={`block w-full text-left px-4 py-2 text-sm ${i18n.resolvedLanguage === lng ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}
                        role="menuitem"
                    >
                        {languages[lng as keyof typeof languages].nativeName}
                    </button>
                ))}
        </div>
    );
  }

  if (variant === 'settings') {
    return (
        <fieldset>
            <legend className="sr-only">Language selection</legend>
            <div className="space-y-2">
                {Object.keys(languages).map((lng) => (
                    <label key={lng} htmlFor={`language-${lng}`} className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700 has-[:checked]:border-brand-primary dark:has-[:checked]:border-brand-primary cursor-pointer">
                        <span>{languages[lng as keyof typeof languages].nativeName}</span>
                        <input
                            type="radio"
                            id={`language-${lng}`}
                            name="language"
                            value={lng}
                            checked={i18n.resolvedLanguage === lng}
                            onChange={() => handleLanguageChange(lng)}
                            className="h-4 w-4 border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                    </label>
                ))}
            </div>
        </fieldset>
    );
  }

  return (
    <div className="relative" ref={switcherRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-secondary dark:text-gray-400 transition-all hover:text-text-primary dark:hover:text-gray-200 w-full"
      >
        <GlobeIcon />
        {t('sidebar.language')}
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-10">
          {Object.keys(languages).map((lng) => (
            <button
              key={lng}
              className={`block w-full text-left px-4 py-2 text-sm ${i18n.resolvedLanguage === lng ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} text-text-primary dark:text-gray-200`}
              onClick={() => handleLanguageChange(lng)}
            >
              {languages[lng as keyof typeof languages].nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function GlobeIcon({ className = "h-4 w-4" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
