import { PrismaClient } from '@prisma/client';
import { deleteMessage, toggleMessageReadStatus } from '@/app/lib/actions';
import { Mail, Trash2, CheckCircle, Circle, Clock } from 'lucide-react';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div className="pb-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Skrzynka Odbiorcza</h1>
                    <p className="text-gray-500 mt-1">
                        Zarządzaj wiadomościami z formularza kontaktowego.
                        {unreadCount > 0 && <span className="font-bold text-primary ml-1">({unreadCount} nieprzeczytanych)</span>}
                    </p>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 mb-4">
                        <Mail size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pusta skrzynka</h3>
                    <p className="text-gray-500">Brak nowych wiadomości.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-white rounded-xl p-6 border transition-all hover:shadow-md ${msg.isRead ? 'border-gray-100 opacity-75' : 'border-primary/30 shadow-sm ring-1 ring-primary/5'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Status Icon */}
                                <div className="mt-1">
                                    <form action={toggleMessageReadStatus.bind(null, msg.id, msg.isRead)}>
                                        <button
                                            title={msg.isRead ? "Oznacz jako nieprzeczytane" : "Oznacz jako przeczytane"}
                                            className={`p-2 rounded-full transition-colors ${msg.isRead ? 'text-gray-300 hover:text-primary hover:bg-primary/10' : 'text-primary bg-primary/10 hover:bg-primary hover:text-white'
                                                }`}
                                        >
                                            {msg.isRead ? <CheckCircle size={20} /> : <Circle size={20} fill="currentColor" className="opacity-20" />}
                                        </button>
                                    </form>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
                                        <h3 className={`text-lg ${msg.isRead ? 'font-medium text-gray-700' : 'font-bold text-dark'}`}>
                                            {msg.subject || '(Bez tematu)'}
                                        </h3>
                                        <div className="flex items-center text-xs text-gray-400 gap-1">
                                            <Clock size={12} />
                                            {new Date(msg.createdAt).toLocaleDateString('pl-PL', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <span className="font-semibold text-gray-700">{msg.name}</span>
                                        <span>&lt;{msg.email}&gt;</span>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap text-sm leading-relaxed border border-gray-100/50">
                                        {msg.message}
                                    </div>

                                    <div className="mt-4 flex justify-end gap-3">
                                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="text-sm font-medium text-primary hover:text-dark transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                                            Odpowiedz
                                        </a>
                                        <form action={deleteMessage.bind(null, msg.id)}>
                                            <button className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2">
                                                <Trash2 size={16} />
                                                Usuń
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
