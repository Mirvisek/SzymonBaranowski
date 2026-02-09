import { getLegalDocumentBySlug, getVisibleLegalDocuments } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSettings } from '@/app/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const document = await getLegalDocumentBySlug(params.slug);
    const settings = await getSettings();

    if (!document) {
        return {
            title: 'Dokument nie znaleziony',
        };
    }

    return {
        title: `${document.title} | ${settings.site_title || 'Szymon Baranowski'}`,
        description: `Dokument prawny: ${document.title}`,
    };
}

export default async function LegalDocumentPage({ params }: { params: { slug: string } }) {
    const document = await getLegalDocumentBySlug(params.slug);

    if (!document || !document.visible) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-4xl mx-auto animate-fade-in">
                <article className="prose prose-lg prose-slate mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                        {document.title}
                    </h1>

                    <div
                        className="text-gray-700 leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: document.content }}
                    />
                </article>

                <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500">
                    Ostatnia aktualizacja: {new Date(document.updatedAt).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>
        </main>
    );
}

// Generate static params for visible documents
export async function generateStaticParams() {
    const documents = await getVisibleLegalDocuments();
    return documents.map((doc: any) => ({
        slug: doc.slug,
    }));
}
