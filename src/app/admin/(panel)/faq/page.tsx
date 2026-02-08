
import Link from 'next/link';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { deleteFAQ } from '@/app/lib/actions';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
    // Note: ensure model name casing matches your prisma client generation
    // usually FAQItem -> fAQItem
    const faqs = await prisma.fAQItem.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">FAQ (Pytania i Odpowiedzi)</h1>
                    <p className="text-gray-500 mt-1">Zarządzaj sekcją najczęściej zadawanych pytań.</p>
                </div>
                <Link
                    href="/admin/faq/create"
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-dark transition-all shadow-lg hover:shadow-xl font-medium"
                >
                    <Plus size={20} />
                    Dodaj Pytanie
                </Link>
            </div>

            <div className="space-y-4">
                {faqs.map((faq) => (
                    <div key={faq.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative group">

                        <div className="flex-1">
                            <div className="flex items-start gap-4 mb-2">
                                <div className="mt-1 text-primary">
                                    <HelpCircle size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-dark">{faq.question}</h3>
                            </div>
                            <p className="text-gray-600 pl-9 border-l-2 border-gray-100 ml-2.5">
                                {faq.answer}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                            <form action={deleteFAQ.bind(null, faq.id)}>
                                <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Usuń">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {faqs.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 mb-4">
                        <HelpCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Brak pytań</h3>
                    <p className="text-gray-500 mb-6">Sekcja FAQ jest pusta.</p>
                    <Link
                        href="/admin/faq/create"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                    >
                        <Plus size={18} />
                        Dodaj pierwsze pytanie
                    </Link>
                </div>
            )}
        </div>
    );
}
