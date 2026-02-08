import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getPortfolioCategory, getPortfolioItems } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import GalleryClient from '@/app/portfolio/[slug]/GalleryClient';

export const dynamic = 'force-dynamic';

export default async function CategoryGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await getPortfolioCategory(slug);

    if (!category) {
        notFound();
    }

    const items = await getPortfolioItems(category.id);

    return (
        <main className="min-h-screen bg-light">
            <Navbar />

            <div className="pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[
                    { label: 'Portfolio', href: '/portfolio' },
                    { label: category.name }
                ]} />
            </div>

            <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-dark mb-4">{category.name}</h1>
                <p className="text-center text-gray-600 mb-16">
                    {items.length} {items.length === 1 ? 'zdjęcie' : 'zdjęć'}
                </p>

                {items.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        Brak zdjęć w tej kategorii.
                    </div>
                ) : (
                    <GalleryClient items={items} />
                )}
            </div>

            <Footer />
        </main>
    );
}
