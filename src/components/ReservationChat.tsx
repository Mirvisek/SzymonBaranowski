'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { sendReservationMessage, getReservationMessages } from '@/app/lib/reservation-actions';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Send, User, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    sender: string;
    content: string;
    createdAt: Date | string;
}

interface ReservationChatProps {
    reservationId: string;
    initialMessages: Message[];
    role: 'client' | 'admin';
}

export default function ReservationChat({
    reservationId,
    initialMessages,
    role
}: ReservationChatProps) {
    // Ensure initialMessages is always an array
    const [messages, setMessages] = useState<Message[]>(Array.isArray(initialMessages) ? initialMessages : []);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Function to fetch latest messages
    const fetchMessages = useCallback(async () => {
        if (!reservationId) return;

        const result = await getReservationMessages(reservationId);
        if (result.success && Array.isArray(result.messages)) {
            setMessages(prev => {
                // Check if we need to update to avoid loops/flickers
                // We compare length and the ID of the last message
                if (prev.length !== result.messages.length) return result.messages;
                if (prev.length > 0 && result.messages.length > 0) {
                    const lastPrev = prev[prev.length - 1];
                    const lastNew = result.messages[result.messages.length - 1];
                    if (lastPrev.id !== lastNew.id) return result.messages;
                }
                // If the content is identical, keep previous to preserve state/focus if any
                if (JSON.stringify(prev) === JSON.stringify(result.messages)) return prev;

                return result.messages;
            });
        }
    }, [reservationId]);

    // Initial fetch on mount to ensure we have data, especially if SSR data was stale
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Update on prop change
    useEffect(() => {
        if (Array.isArray(initialMessages)) {
            setMessages(initialMessages);
        }
    }, [initialMessages]);

    // Polling interval
    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        const content = newMessage.trim();
        setNewMessage('');
        setIsSending(true);

        // Optimistic update
        const optimisticMsg: Message = {
            id: 'temp-' + Date.now(),
            sender: role,
            content: content,
            createdAt: new Date().toISOString() // Use ISO string to match server format likely
        };

        setMessages(prev => [...prev, optimisticMsg]);

        const result = await sendReservationMessage(reservationId, role, content);

        if (result.success) {
            // Immediately fetch to sync with server/DB ID
            await fetchMessages();
        } else {
            alert('Nie udało się wysłać wiadomości.');
            // Revert state by fetching real messages
            await fetchMessages();
        }
        setIsSending(false);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                            <Send size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">Brak wiadomości. Przywitaj się!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.sender === role;
                        // Handle date parsing safely for both Date objects and ISO strings
                        const dateObj = typeof msg.createdAt === 'string' ? new Date(msg.createdAt) : msg.createdAt;

                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] sm:max-w-[70%] flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'admin' ? 'bg-dark text-white' : 'bg-primary/20 text-primary'
                                        }`}>
                                        {msg.sender === 'admin' ? <ShieldCheck size={16} /> : <User size={16} />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className={`p-4 rounded-2xl text-sm ${isMe
                                            ? 'bg-primary text-white rounded-tr-none shadow-md'
                                            : 'bg-gray-100 text-dark rounded-tl-none border border-gray-200'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <p className={`text-[10px] text-gray-400 font-semibold uppercase ${isMe ? 'text-right' : 'text-left'}`}>
                                            {msg.sender === 'admin' ? 'Szymon' : 'Ty'} • {format(dateObj, 'HH:mm', { locale: pl })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Wpisz wiadomość..."
                        className="w-full bg-white border border-gray-200 rounded-full py-4 pl-6 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="absolute right-2 p-3 bg-primary text-white rounded-full hover:bg-dark transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
