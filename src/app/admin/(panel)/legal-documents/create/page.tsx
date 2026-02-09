'use client';

import { createLegalDocument } from '@/app/lib/actions';
import { useActionState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/app/admin/components/RichTextEditor';
import { useState } from 'react';

export default function CreateLegalDocumentPage() {
    const [state, formAction] = useActionState(createLegalDocument, null);
    const [content, setContent] = useState('');

    return (
        <div className="pb-24">
            <div className="mb-6">
                <Link
                    href="/admin/legal-documents"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
                >
                    <ArrowLeft size={20} />
                    Powrót do listy
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Nowy Dokument Prawny</h1>
                <p className="text-gray-500">Dodaj nowy dokument prawny do stopki</p>
            </div>

            <form action={formAction} className="bg-white rounded-xl border border-gray-200 p-8">
                {state?.message && (
                    <div className={`mb-6 p-4 rounded-xl ${state.message.includes('success')
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {state.message}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tytuł dokumentu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="np. Polityka Prywatności"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Slug zostanie wygenerowany automatycznie z tytułu</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Treść <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor value={content} onChange={setContent} />
                        <input type="hidden" name="content" value={content} />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-dark transition-all font-semibold"
                        >
                            Dodaj Dokument
                        </button>
                        <Link
                            href="/admin/legal-documents"
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold"
                        >
                            Anuluj
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
