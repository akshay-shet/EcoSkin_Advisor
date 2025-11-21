import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from './ChatInterface';

export const FloatingChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="w-[350px] h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-300 dark:border-gray-700">
                   <div className="p-4 bg-brand-primary text-white rounded-t-xl flex justify-between items-center">
                       <h3 className="font-bold">{t('aiAssistant.title')}</h3>
                       <div className="flex items-center gap-2">
                           <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-gray-200" aria-label={isMuted ? t('aiAssistant.unmuteVoice') : t('aiAssistant.muteVoice')}>
                               {isMuted ? <MicrophoneOffIcon /> : <MicrophoneIcon />}
                           </button>
                           <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200" aria-label="Close chat">
                               <XIcon />
                           </button>
                       </div>
                   </div>
                   <div className="flex-grow overflow-hidden">
                     <ChatInterface isMuted={isMuted} />
                   </div>
                </div>
            )}
            
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-brand-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-transform hover:scale-110"
                    aria-label={t('aiAssistant.title')}
                >
                    <MessageCircleIcon />
                </button>
            )}
        </div>
    );
};

// FIX: Updated icon component to accept className prop.
function MessageCircleIcon({ className = "w-8 h-8" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;
}

// FIX: Updated icon component to accept className prop.
function XIcon({ className = "w-6 h-6" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
}

function MicrophoneIcon({ className = "w-6 h-6" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
}

function MicrophoneOffIcon({ className = "w-6 h-6" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
}