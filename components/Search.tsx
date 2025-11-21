import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from './ui/Input';

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactElement<{ className?: string }>;
}

export const Search: React.FC<{ navItems: NavItem[] }> = ({ navItems }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const filteredItems = query
        ? navItems.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase())
        )
        : [];
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setQuery('');
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSelect = (path: string) => {
        navigate(path);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="search"
                    placeholder={t('search.placeholder')}
                    className="w-full pl-9"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
            </div>
            {isOpen && query && (
                <div className="absolute z-50 top-full mt-2 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700">
                    <div className="p-2 max-h-60 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => handleSelect(item.path)}
                                    className="w-full text-left flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {React.cloneElement(item.icon, { className: 'h-4 w-4 text-text-secondary dark:text-gray-400' })}
                                    <span>{item.label}</span>
                                </button>
                            ))
                        ) : (
                            <p className="p-4 text-center text-sm text-text-secondary dark:text-gray-400">{t('search.noResults')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

function SearchIcon({ className = '' }: { className?: string}) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
}
