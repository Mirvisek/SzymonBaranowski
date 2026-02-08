
'use client';

import { useActionState } from 'react';
import { createFAQ } from '@/app/lib/actions';
import { HelpCircle, AlignLeft } from 'lucide-react';

export default function CreateFAQPage() {
    const [state, formAction] = useActionState(createFAQ, null);

    return (
        <div className="max-w-2xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dodaj Pytanie (FAQ)</h1>
                <p className="text-gray-500 mt-1">Uzupełnij bazę wiedzy dla klientów.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form action={formAction} className="space-y-6">
                    {state?.message && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                            {state.message}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <HelpCircle size={16} className="text-primary" />
                            Pytanie
                        </label>
                        <input
                            type="text"
                            name="question"
                            required
                            placeholder="np. Jak długo czeka się na zdjęcia?"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <AlignLeft size={16} className="text-primary" />
                            Odpowiedź
                        </label>
                        <textarea
                            name="answer"
                            required
                            rows={5}
                            placeholder="Wpisz wyczerpującą odpowiedź..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white resize-y"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <a href="/admin/faq" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                            Anuluj
                        </a>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-dark font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Dodaj Pytanie
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
