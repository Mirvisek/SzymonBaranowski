'use client';

import { updateLegalDocument } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/app/admin/components/RichTextEditor';

type Props = {
    document: {
        id: string;
        title: string;
        content: string;
        visible: boolean;
    }
};

export default function EditLegalDocumentForm({ document }: Props) {
    const updateDocumentWithId = updateLegalDocument.bind(null, document.id);
    const [state, formAction] = useActionState(updateDocumentWithId, null);

    const [content, setContent] = useState(document.content);
    const [isVisible, setIsVisible] = useState(document.visible);

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
                <h1 className="text-3xl font-bold text-gray-900">Edytuj Dokument</h1>
                <p className="text-gray-500">Edycja dokumentu: {document.title}</p>
            </div>

            <form action={formAction} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                {state?.message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${state.message.includes('success')
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
                            defaultValue={document.title}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Widoczność
                        </label>
                        <div className="flex items-center gap-3">
                            <input type="hidden" name="visible" value={isVisible ? 'true' : 'false'} />
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={(e) => setIsVisible(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                <span className="ml-3 text-sm font-medium text-gray-600">
                                    {isVisible ? 'Widoczny w stopce' : 'Ukryty'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Treść <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor value={content} onChange={setContent} />
                        <input type="hidden" name="content" value={content} />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-8">
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-dark transition-all font-semibold shadow-lg hover:shadow-xl"
                        >
                            <Save size={18} />
                            Zapisz Zmiany
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
