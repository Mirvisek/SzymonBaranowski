import { MetadataRoute } from 'next';
import { getPortfolioCategories, getOffers, getVisibleLegalDocuments } from './lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://szymonbaranowski.pl';

    // Get dynamic data
    const categories = await getPortfolioCategories();
    const offers = await getOffers();
    const documents = await getVisibleLegalDocuments();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/o-mnie`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/kontakt`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/oferta`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/rezerwacja`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/polityka-prywatnosci`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/cookies`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        }
    ];

    // Dynamic category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/portfolio/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Legal documents dynamic pages
    const docPages: MetadataRoute.Sitemap = documents.map((doc: any) => ({
        url: `${baseUrl}/dokumenty/${doc.slug}`,
        lastModified: new Date(doc.updatedAt || new Date()),
        changeFrequency: 'monthly',
        priority: 0.5,
    }));

    // Offer anchors (Note: Search engines often ignore fragments, but it helps structure)
    // We group by unique category to avoid spamming too many anchors if there are many items per category
    const uniqueCategories = Array.from(new Set((offers || []).map(o => o.category.toLowerCase())));
    const offerPages: MetadataRoute.Sitemap = uniqueCategories.map((cat) => ({
        url: `${baseUrl}/oferta#${cat}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...docPages, ...offerPages];
}
