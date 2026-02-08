
'use client';

import { useActionState } from 'react';
import { createTestimonial } from '@/app/lib/actions';
import { User, Briefcase, MessageSquare } from 'lucide-react';

export default function CreateTestimonialPage() {
    const [state, formAction] = useActionState(createTestimonial, null);

    return (
        <div className="max-w-2xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dodaj Opinię</h1>
                <p className="text-gray-500 mt-1">Podziel się sukcesem i referencjami od klienta.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form action={formAction} className="space-y-6">
                    {state?.message && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                            {state.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <User size={16} className="text-primary" />
                                Imię i Nazwisko / Firma
                            </label>
                            <input
                                type="text"
                                name="author"
                                required
                                placeholder="np. Jan Kowalski"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Briefcase size={16} className="text-primary" />
                                Rola / Stanowisko (opcjonalne)
                            </label>
                            <input
                                type="text"
                                name="role"
                                placeholder="np. CEO, Marketing Manager"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <MessageSquare size={16} className="text-primary" />
                            Treść Opinii
                        </label>
                        <textarea
                            name="content"
                            required
                            rows={5}
                            placeholder="Wpisz treść referencji..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white resize-y"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <a href="/admin/testimonials" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                            Anuluj
                        </a>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-dark font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Dodaj Opinię
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
