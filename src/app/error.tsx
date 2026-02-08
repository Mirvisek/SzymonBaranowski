
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
                <h1 className="text-4xl font-black text-dark mb-4">Ups! Coś poszło nie tak</h1>
                <p className="text-gray-500 mb-10 leading-relaxed">
                    Wystąpił nieoczekiwany błąd. Został on zarejestrowany i postaramy się go naprawić jak najszybciej.
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
