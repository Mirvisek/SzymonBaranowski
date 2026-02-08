
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSettings } from '@/app/lib/data';
import AboutClient from '@/components/AboutClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function About() {
    const settings = await getSettings();
    const clients = await prisma.trustedClient.findMany({
        orderBy: { order: 'asc' },
    });

    // Default content if not set
    const content = settings.about_content || `
        <h2>Moja Historia</h2>
        <p>
            Wszystko zaczęło się od starego aparatu, który znalazłem na strychu... (To jest domyślny tekst, edytuj go w panelu administratora).
        </p>
        <p>
            Wierzę, że każde zdjęcie ma swoją duszę, a każda marka kryje historię, którą warto opowiedzieć.
        </p>
    `;

    const imageUrl = settings.about_image || "https://placehold.co/800x1200?text=Twoje+Zdjecie";

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
            </div>
            <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Content Section */}
                <AboutClient content={content} imageUrl={imageUrl} clients={clients} />
            </div>
            <Footer />
        </main>
    );
}
