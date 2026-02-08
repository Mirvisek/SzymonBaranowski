
'use client';

import { useState, useRef, useEffect } from 'react';
import { sendReservationMessage } from '@/app/lib/reservation-actions';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Send, User, ShieldCheck } from 'lucide-react';

interface Message {
    id: string;
    sender: string;
    content: string;
    createdAt: Date;
}

interface ReservationChatProps {
    reservationId: string;
    initialMessages: any[];
    role: 'client' | 'admin';
}

export default function ReservationChat({ reservationId, initialMessages, role }: ReservationChatProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        const result = await sendReservationMessage(reservationId, role, newMessage.trim());

        if (result.success) {
            // Optimistic update or just wait for revalidate. 
            // In a real app we might use websockets, but here we'll just add it to local state
            setMessages([...messages, {
                id: Date.now().toString(),
                sender: role,
                content: newMessage.trim(),
                createdAt: new Date()
            }]);
            setNewMessage('');
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
                                            {msg.sender === 'admin' ? 'Szymon' : 'Ty'} • {format(new Date(msg.createdAt), 'HH:mm', { locale: pl })}
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
