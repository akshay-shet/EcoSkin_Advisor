import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export const HomeHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();
    const location = useLocation();

    const navLinks = [
        { name: t('home.nav.features'), href: '#features' },
        { name: t('home.nav.howItWorks'), href: '#how-it-works' },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (location.pathname === '/' && href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };
    
    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] bg-white/80 dark:bg-gray-900/80">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 font-semibold text-text-primary dark:text-gray-50">
                        <LeafIcon />
                        <span className="">ECOSKIN</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-text-secondary dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="secondary">{t('home.nav.login')}</Button>
                        </Link>
                    </div>

                    {/* Mobile Nav Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                           <MenuIcon />
                        </button>
                    </div>
                </div>

                 {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pt-2 pb-4 space-y-2">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                {link.name}
                            </a>
                        ))}
                         <Link to="/login" className="block w-full">
                            <Button variant="secondary" className="w-full mt-2">{t('home.nav.login')}</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};


// SVG Icons
function LeafIcon({ className = "h-6 w-6 text-brand-primary" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13q0-3.5 2.5-6.5A10 10 0 0 1 20 4a7 7 0 0 1-7 7q-3.5 0-6.5 2.5Z"/><path d="M12 21a7 7 0 0 0 7-7q0-3.5-2.5-6.5A10 10 0 0 0 4 4a7 7 0 0 0 7 7q3.5 0 6.5 2.5Z"/></svg>;
}
function MenuIcon({ className = "h-6 w-6" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
}
