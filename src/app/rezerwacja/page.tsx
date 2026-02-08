import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ReservationWizard from '@/components/ReservationWizard';
import { getOffersForReservation } from '@/app/lib/reservation-actions';
import { getSettings } from '@/app/lib/data';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    return {
        title: settings.seo_title ? `Rezerwacja | ${settings.seo_title}` : 'Rezerwacja terminu | Szymon',
        description: 'Zarezerwuj termin sesji fotograficznej lub konsultacji marketingowej online.',
    };
}

export default async function Rezerwacja() {
    const offers = await getOffersForReservation();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
            </div>

            <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Zarezerwuj termin</h1>
                    <p className="text-xl text-gray-600">Wybierz interesującą Cię usługę i znajdź dogodny termin.</p>
                </div>

                <ReservationWizard offers={offers} />
            </div>

            <Footer />
        </main>
    );
}
