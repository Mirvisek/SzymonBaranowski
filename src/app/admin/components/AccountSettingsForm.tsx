'use client';

import { useActionState, useEffect } from 'react';
import { updateAdminAccount } from '@/app/lib/account-actions';
import { Save, User, Lock, Mail } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AccountSettingsForm({ currentUserEmail }: { currentUserEmail: string }) {
    const [state, formAction] = useActionState(updateAdminAccount, null);

    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                signOut({ callbackUrl: '/admin/login' });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state?.success]);

    return (
        <form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in min-h-[500px]">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                <User className="text-primary" size={24} /> Ustawienia Konta
            </h2>

            {state?.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${state.message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {state.message.includes('success') ? '✅' : '❌'} {state.message}
                </div>
            )}

            <div className="space-y-6 max-w-2xl">
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <Mail size={18} /> Zmiana adresu Email
                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twój adres email</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={currentUserEmail}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-2">Używany do logowania oraz otrzymywania powiadomień.</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock size={18} /> Zmiana Hasła
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Aktualne hasło (wymagane)</label>
                            <input
                                type="password"
                                name="currentPassword"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nowe hasło</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Powtórz nowe hasło</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 bg-dark text-white px-8 py-3 rounded-xl shadow-lg hover:bg-primary transition-all font-bold"
                    >
                        <Save size={18} />
                        Zaktualizuj konto
                    </button>
                </div>
            </div>
        </form>
    );
}
