'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCcw, Home, ChevronDown, ChevronUp, Code, MapPin, Bug } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);
    const isDevelopment = process.env.NODE_ENV === 'development';

    useEffect(() => {
        console.error('Error boundary caught:', error);
        console.error('Stack:', error.stack);
    }, [error]);

    // Extract helpful information
    const errorName = error.name || 'Error';
    const errorMessage = error.message || 'Nieoczekiwany wyjątek serwera';
    const errorStack = error.stack || '';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Suggest solutions based on error type
    const getSuggestion = () => {
        const msg = errorMessage.toLowerCase();
        if (msg.includes('fetch') || msg.includes('network')) {
            return 'Sprawdź połączenie internetowe lub spróbuj ponownie za chwilę.';
        }
        if (msg.includes('not found') || msg.includes('404')) {
            return 'Zasób nie został znaleziony. Spróbuj wrócić do strony głównej.';
        }
        if (msg.includes('unauthorized') || msg.includes('401')) {
            return 'Brak uprawnień. Zaloguj się ponownie.';
        }
        if (msg.includes('database') || msg.includes('prisma')) {
            return 'Problem z bazą danych. Skontaktuj się z administratorem.';
        }
        return 'Spróbuj odświeżyć stronę lub wrócić do poprzedniej strony.';
    };

    return (
        <div className="min-h-screen bg-light flex items-center justify-center px-4 py-8">
            <div className="max-w-3xl w-full">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <AlertTriangle size={48} className="text-red-600" />
                    </div>
                    <h1 className="text-4xl font-black text-dark mb-2">Wystąpił błąd aplikacji</h1>
                    <p className="text-gray-500 text-lg">
                        {getSuggestion()}
                    </p>
                </div>

                {/* Main Error Info */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                        <Bug className="text-red-600 flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-red-700 font-bold mb-1">{errorName}</p>
                            <p className="text-red-600 text-sm font-mono break-words">
                                {errorMessage}
                            </p>
                        </div>
                    </div>

                    {error.digest && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                            <Code size={14} />
                            <span className="font-mono">ID błędu: {error.digest}</span>
                        </div>
                    )}

                    {currentUrl && isDevelopment && (
                        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg mt-2">
                            <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                            <span className="font-mono break-all">{currentUrl}</span>
                        </div>
                    )}
                </div>

                {/* Developer Details (only in development) */}
                {isDevelopment && errorStack && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Code className="text-gray-600" size={18} />
                                <span className="font-bold text-gray-900">Szczegóły techniczne (deweloper)</span>
                            </div>
                            {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {showDetails && (
                            <div className="px-6 pb-6 border-t border-gray-100">
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-4 overflow-x-auto">
                                    <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                                        {errorStack}
                                    </pre>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    💡 Stack trace jest widoczny tylko w trybie deweloperskim
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                    >
                        <RefreshCcw size={20} />
                        Spróbuj ponownie
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl"
                    >
                        <Home size={20} />
                        Strona główna
                    </Link>
                </div>

                {!isDevelopment && (
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Jeśli problem się powtarza, skontaktuj się z administratorem podając ID błędu.
                    </p>
                )}
            </div>
        </div>
    );
}
