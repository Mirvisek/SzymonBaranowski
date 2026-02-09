import { getLegalDocuments } from '@/app/lib/data';
import { deleteLegalDocument, updateLegalDocumentOrder } from '@/app/lib/actions';
import Link from 'next/link';
import { FileText, Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LegalDocumentsPage() {
    const documents = await getLegalDocuments();

    return (
        <div className="pb-24">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dokumenty Prawne</h1>
                    <p className="text-gray-500">Zarządzaj dokumentami wyświetlanymi w stopce</p>
                </div>
                <Link
                    href="/admin/legal-documents/create"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-xl hover:bg-dark transition-all shadow-lg font-semibold"
                >
                    <Plus size={20} />
                    Dodaj Dokument
                </Link>
            </div>

            {documents.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak dokumentów</h3>
                    <p className="text-gray-500 mb-4">Zacznij od dodania pierwszego dokumentu prawnego</p>
                    <Link
                        href="/admin/legal-documents/create"
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark transition-all"
                    >
                        <Plus size={18} />
                        Dodaj Dokument
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Kolejność</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tytuł</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Slug</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {documents.map((doc, index) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{doc.order + 1}</span>
                                            <div className="flex flex-col gap-1">
                                                {index > 0 && (
                                                    <form action={async () => {
                                                        'use server';
                                                        await updateLegalDocumentOrder(doc.id, doc.order - 1);
                                                        await updateLegalDocumentOrder(documents[index - 1].id, documents[index - 1].order + 1);
                                                    }}>
                                                        <button className="text-gray-400 hover:text-primary">
                                                            <ArrowUp size={14} />
                                                        </button>
                                                    </form>
                                                )}
                                                {index < documents.length - 1 && (
                                                    <form action={async () => {
                                                        'use server';
                                                        await updateLegalDocumentOrder(doc.id, doc.order + 1);
                                                        await updateLegalDocumentOrder(documents[index + 1].id, documents[index + 1].order - 1);
                                                    }}>
                                                        <button className="text-gray-400 hover:text-primary">
                                                            <ArrowDown size={14} />
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{doc.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">/{doc.slug}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        {doc.visible ? (
                                            <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-lg text-sm font-medium">
                                                <Eye size={14} />
                                                Widoczny
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-lg text-sm font-medium">
                                                <EyeOff size={14} />
                                                Ukryty
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/legal-documents/${doc.id}/edit`}
                                                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                await deleteLegalDocument(doc.id);
                                            }}>
                                                <button
                                                    type="submit"
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    onClick={(e) => {
                                                        if (!confirm('Czy na pewno chcesz usunąć ten dokument?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
