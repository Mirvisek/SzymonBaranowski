
'use client';

import { useState } from 'react';
import { Lock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

interface ReservationAccessGuardProps {
    reservationCode: string;
    correctPassword: string;
    children: React.ReactNode;
}

export default function ReservationAccessGuard({
    reservationCode,
    correctPassword,
    children
}: ReservationAccessGuardProps) {
    const [passwordInput, setPasswordInput] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(false);

        // Symulacja krótkiego ładowania dla UX
        setTimeout(() => {
            if (passwordInput.trim().toLowerCase() === correctPassword.toLowerCase()) {
                setIsAuthorized(true);
            } else {
                setError(true);
            }
            setIsSubmitting(false);
        }, 600);
    };

    if (isAuthorized) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-dark text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-dark/20">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-dark">Dostęp chroniony</h1>
                    <p className="text-gray-500 mt-2">Wprowadź hasło otrzymane w wiadomości e-mail, aby uzyskać dostęp do rezerwacji <span className="font-mono font-bold text-primary uppercase">#{reservationCode}</span>.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Hasło dostępu</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Wpisz hasło..."
                                    className={`w-full bg-gray-50 border ${error ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 focus:border-primary'} rounded-2xl py-4 pl-6 pr-12 text-lg focus:outline-none transition-all`}
                                    autoFocus
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </div>
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle size={14} /> Błędne hasło. Spróbuj ponownie.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!passwordInput.trim() || isSubmitting}
                            className="w-full bg-dark hover:bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Odblokuj dostęp
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-xs mt-8">
                    Nie masz hasła? Sprawdź folder SPAM lub skontaktuj się z administratorem.
                </p>
            </div>
        </div>
    );
}
