import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from '../components/ChatInterface';

const AIAssistantPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">{t('aiAssistant.title')}</h1>
                <p className="text-text-secondary mt-2">{t('aiAssistant.description')}</p>
            </div>
            <ChatInterface />
        </div>
    );
};

export default AIAssistantPage;
