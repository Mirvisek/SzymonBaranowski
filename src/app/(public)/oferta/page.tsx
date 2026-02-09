
import OfferList from '@/components/OfferList';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQList from '@/components/FAQList';
import ScrollReveal from '@/components/ScrollReveal';
import { getOffers, getFAQs, getSettings } from '@/app/lib/data';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    return {
        title: settings.seo_offer_title || 'Oferta | Szymon',
        description: settings.seo_offer_desc || 'Zapoznaj się z moją ofertą.',
    };
}

export default async function Oferta() {
    const allOffers = await getOffers();
    const faqs = await getFAQs();

    // Group offers by category for easier consumption in Client Component
    const groupedOffers = {
        fotografia: (allOffers || []).filter(o => o.category === 'fotografia'),
        grafika: (allOffers || []).filter(o => o.category === 'grafika'),
        marketing: (allOffers || []).filter(o => o.category === 'marketing'),
    };

    return (
        <main className="min-h-screen bg-white">

            <div className="pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
            </div>

            <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16">Oferta</h1>
                </ScrollReveal>

                <ScrollReveal delay={0.4}>
                    <OfferList offers={groupedOffers} />
                </ScrollReveal>
            </div>

            <ScrollReveal direction="up">
                <FAQList items={faqs} />
            </ScrollReveal>

        </main>
    );
}
