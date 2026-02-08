import { MetadataRoute } from 'next';
import { getPortfolioCategories, getOffers } from './lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://szymonbaranowski.pl';

    // Get dynamic data
    const categories = await getPortfolioCategories();
    const offers = await getOffers();

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/o-mnie`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/kontakt`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/oferta`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/rezerwacja`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/polityka-prywatnosci`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        }
    ];

    // Dynamic category pages
    const categoryPages = categories.map((category) => ({
        url: `${baseUrl}/portfolio/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Offer anchors (Note: Search engines often ignore fragments, but it helps structure)
    // We group by unique category to avoid spamming too many anchors if there are many items per category
    const uniqueCategories = Array.from(new Set((offers || []).map(o => o.category.toLowerCase())));
    const offerPages = uniqueCategories.map((cat) => ({
        url: `${baseUrl}/oferta#${cat}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...offerPages];
}
