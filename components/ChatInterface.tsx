import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ChatMessage } from '../types';
import { chatWithAuraStream } from '../services/geminiService';

// Check for browser support for the Web Speech API
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionSupported = !!SpeechRecognitionAPI;

// Helper function for Text-to-Speech
const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window && text) {
        window.speechSynthesis.cancel(); // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang; // Set language for the voice
        window.speechSynthesis.speak(utterance);
    }
};

export const ChatInterface: React.FC<{ isMuted?: boolean }> = ({ isMuted = false }) => {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: t('aiAssistant.initialMessage'), citations: [] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isInitialMount = useRef(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    // Effect to cancel speech on unmount or when muted
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        if (isMuted && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, [isMuted]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // Reset chat when language changes
            setMessages([{ role: 'model', text: t('aiAssistant.initialMessage'), citations: [] }]);
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }
    }, [i18n.language, t]);

    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        // Stop any currently speaking utterance when a new message is sent
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        const userMessage: ChatMessage = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chatWithAuraStream(messageText, i18n.language);
            let modelResponse = '';
            let citations: { uri: string; title: string }[] = [];
            const collectedUris = new Set<string>();

            setMessages(prev => [...prev, { role: 'model', text: '', citations: [] }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;

                if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                    for (const groundingChunk of chunk.candidates[0].groundingMetadata.groundingChunks) {
                        if (groundingChunk.web) {
                            if (!collectedUris.has(groundingChunk.web.uri)) {
                                citations.push({ uri: groundingChunk.web.uri, title: groundingChunk.web.title || groundingChunk.web.uri });
                                collectedUris.add(groundingChunk.web.uri);
                            }
                        }
                    }
                }

                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage) {
                        lastMessage.text = modelResponse;
                        lastMessage.citations = citations;
                    }
                    return newMessages;
                });
            }

            // After the full response is received, speak it out if not muted
            if (!isMuted) {
                speak(modelResponse, i18n.language);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = t('aiAssistant.chatError');
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
            if (!isMuted) {
                speak(errorMessage, i18n.language);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, i18n.language, t, isMuted]);


    useEffect(() => {
        if (!recognitionSupported) {
            console.warn("Speech recognition not supported by this browser.");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.lang = i18n.language;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript); // Set input for immediate visual feedback
            sendMessage(transcript); // Automatically send the message
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

    }, [i18n.language, sendMessage]);

    const handleToggleListening = () => {
        if (!recognitionRef.current) return;
        
        // Implement "barge-in": stop TTS before starting STT
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInput(''); // Clear input before listening
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };
    
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">A</div>}
                        <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2 rounded-2xl max-w-sm md:max-w-md ${msg.role === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                               <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-2 text-xs max-w-sm md:max-w-md">
                                    <h4 className="font-semibold mb-1 text-gray-600 dark:text-gray-400">{t('aiAssistant.sources')}</h4>
                                    <div className="space-y-1.5">
                                        {msg.citations.map((citation, idx) => {
                                            let hostname = citation.uri;
                                            try {
                                                hostname = new URL(citation.uri).hostname.replace(/^www\./, '');
                                            } catch (e) {
                                                // Keep original uri if it's not a valid URL
                                            }
                                            
                                            return (
                                                <a 
                                                    key={idx} 
                                                    href={citation.uri} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    title={citation.title} 
                                                    className="flex items-start gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-600/50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
                                                >
                                                    <div className="flex-shrink-0 mt-0.5 w-4 h-4 bg-gray-200 dark:bg-gray-500 rounded-full text-center text-xs leading-4 text-gray-600 dark:text-gray-300">{idx + 1}</div>
                                                    <div className="flex-grow overflow-hidden">
                                                        <p className="truncate font-medium text-text-primary dark:text-gray-200 group-hover:text-brand-primary dark:group-hover:text-brand-secondary">{citation.title}</p>
                                                        <p className="truncate text-gray-500 dark:text-gray-400 text-xs">{hostname}</p>
                                                    </div>
                                                </a>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t dark:border-gray-700">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('aiAssistant.placeholder')}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    {!isMuted && recognitionSupported && (
                        <Button
                            type="button"
                            onClick={handleToggleListening}
                            variant="ghost"
                            className={`p-2 rounded-full ${isListening ? 'bg-red-100 dark:bg-red-900/50 text-red-500' : 'text-gray-500 hover:text-gray-800'}`}
                            aria-label={isListening ? t('aiAssistant.stopVoiceInput') : t('aiAssistant.startVoiceInput')}
                        >
                            <MicrophoneIcon />
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        {isLoading ? '...' : <SendIcon />}
                    </Button>
                </form>
            </div>
        </div>
    );
};


function SendIcon({ className = "w-5 h-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
}

function MicrophoneIcon({ className = "w-5 h-5" }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
}