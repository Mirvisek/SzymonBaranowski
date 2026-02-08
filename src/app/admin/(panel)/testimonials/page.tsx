
import Link from 'next/link';
import { Plus, Trash2, MessageSquareQuote } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { deleteTestimonial } from '@/app/lib/actions';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Opinie Klientów</h1>
                    <p className="text-gray-500 mt-1">Zarządzaj referencjami wyświetlanymi na stronie.</p>
                </div>
                <Link
                    href="/admin/testimonials/create"
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-dark transition-all shadow-lg hover:shadow-xl font-medium"
                >
                    <Plus size={20} />
                    Dodaj Opinię
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col relative group">
                        <div className="absolute top-4 right-4 opacity-50 text-gray-200">
                            <MessageSquareQuote size={40} />
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600 italic line-clamp-4 relative z-10">"{testimonial.content}"</p>
                        </div>

                        <div className="mt-auto flex justify-between items-end border-t border-gray-50 pt-4">
                            <div>
                                <h3 className="font-bold text-dark">{testimonial.author}</h3>
                                {testimonial.role && <p className="text-sm text-primary font-medium">{testimonial.role}</p>}
                            </div>

                            <form action={deleteTestimonial.bind(null, testimonial.id)}>
                                <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {testimonials.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 mb-4">
                        <MessageSquareQuote size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Brak opinii</h3>
                    <p className="text-gray-500 mb-6">Twoja strona jeszcze nie ma dodanych żadnych referencji.</p>
                    <Link
                        href="/admin/testimonials/create"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                    >
                        <Plus size={18} />
                        Dodaj pierwszą opinię
                    </Link>
                </div>
            )}
        </div>
    );
}
