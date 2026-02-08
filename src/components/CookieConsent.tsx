'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent({ content }: { content?: string }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[100] p-4 md:p-6 animate-slide-up">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 space-y-2 md:pr-8">
                    <p className="font-semibold text-gray-900">🍪 Dbamy o Twoją prywatność</p>
                    {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <p>
                            Ta strona używa plików cookies, aby zapewnić najlepszą jakość korzystania z serwisu.
                            Dalsze korzystanie ze strony oznacza zgodę na ich użycie.
                        </p>
                    )}
                </div>
                <div className="flex gap-3 whitespace-nowrap">
                    <Link href="/polityka-prywatnosci" className="px-4 py-2 text-sm text-gray-600 hover:text-dark underline">
                        Więcej info
                    </Link>
                    <button
                        onClick={accept}
                        className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-dark transition-colors"
                    >
                        Akceptuj
                    </button>
                </div>
            </div>
        </div>
    );
}
