
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-light flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertTriangle size={48} className="text-red-600" />
                </div>
                <h1 className="text-4xl font-black text-dark mb-4">Wystąpił błąd aplikacji</h1>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left inline-block w-full">
                    <p className="text-red-700 font-bold mb-1">Szczegóły błędu:</p>
                    <p className="text-red-600 text-sm font-mono break-all italic">
                        {error.message || 'Nieoczekiwany wyjątek serwera (Internal Server Error)'}
                    </p>
                    {error.digest && (
                        <p className="text-xs text-gray-400 mt-2 font-mono">
                            ID błędu: {error.digest}
                        </p>
                    )}
                </div>
                <p className="text-gray-500 mb-10 leading-relaxed">
                    Przepraszamy za utrudnienia. Możesz spróbować odświeżyć stronę lub wrócić do panelu głównego.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg"
                    >
                        <RefreshCcw size={20} />
                        Spróbuj ponownie
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all shadow-lg"
                    >
                        <Home size={20} />
                        Strona główna
                    </Link>
                </div>
            </div>
        </div>
    );
}
