
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // Import async Server Component Footer
import ContactFormWrapper from '@/components/ContactFormWrapper'; // Make separate client wrapper
import Breadcrumbs from '@/components/Breadcrumbs';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { getSettings } from '@/app/lib/data';
import { Metadata } from 'next';

// Since this is a Server Component page, we can fetch data directly
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    return {
        title: settings.seo_contact_title || 'Kontakt | Szymon',
        description: settings.seo_contact_desc || 'Skontaktuj się ze mną.',
    };
}

export default async function Kontakt() {
    const settings = await getSettings();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
            </div>

            <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Info Side */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Kontakt</h1>
                            <p className="text-xl text-gray-500 leading-relaxed">
                                Jestem do Twojej dyspozycji. Skontaktuj się ze mną,
                                aby omówić Twój projekt lub zapytać o szczegóły oferty.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="p-4 bg-primary/10 rounded-full text-primary mr-6">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-dark">Telefon</h3>
                                    <a href={`tel:${settings.phone_number?.replace(/\s/g, '')}`} className="text-gray-600 hover:text-primary mt-1 block text-lg font-medium">
                                        {settings.phone_number || 'Brak numeru'}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="p-4 bg-primary/10 rounded-full text-primary mr-6">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-dark">Email</h3>
                                    <a href={`mailto:${settings.email_address}`} className="text-gray-600 hover:text-primary mt-1 block text-lg font-medium">
                                        {settings.email_address || 'Brak emaila'}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="p-4 bg-primary/10 rounded-full text-primary mr-6">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-dark">Lokalizacja</h3>
                                    <p className="text-gray-600 mt-1 text-lg font-medium">{settings.address || 'Polska'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-dark mb-4">Social Media</h3>
                            <div className="flex space-x-4">
                                {settings.social_facebook && (
                                    <a href={settings.social_facebook} target="_blank" className="p-3 bg-gray-100 rounded-lg text-dark hover:bg-primary hover:text-white transition-colors">
                                        <Facebook />
                                    </a>
                                )}
                                {settings.social_instagram && (
                                    <a href={settings.social_instagram} target="_blank" className="p-3 bg-gray-100 rounded-lg text-dark hover:bg-primary hover:text-white transition-colors">
                                        <Instagram />
                                    </a>
                                )}
                                {settings.social_tiktok && (
                                    <a href={settings.social_tiktok} target="_blank" className="p-3 bg-gray-100 rounded-lg text-dark hover:bg-primary hover:text-white transition-colors font-bold px-4">
                                        TT
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <Suspense fallback={<div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />}>
                        <ContactFormWrapper />
                    </Suspense>

                </div>
            </div>

            <Footer />
        </main>
    );
}
