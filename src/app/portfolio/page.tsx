import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getPortfolioCategories, getSettings } from '@/app/lib/data';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    return {
        title: settings.seo_portfolio_title || 'Portfolio | Szymon',
        description: settings.seo_portfolio_desc || 'Zobacz moje realizacje.',
    };
}

export default async function Portfolio() {
    const categories = await getPortfolioCategories();

    return (
        <main className="min-h-screen bg-light">
            <Navbar />

            <div className="pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
            </div>

            <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-dark mb-4">Portfolio</h1>
                <p className="text-center text-gray-600 mb-16">Wybierz kategorię aby zobaczyć realizacje</p>

                {categories.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        Brak dostępnych kategorii.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/portfolio/${category.slug}`}
                                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                                        <p className="text-white/80 text-sm">
                                            {category._count.items} {category._count.items === 1 ? 'zdjęcie' : 'zdjęć'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
