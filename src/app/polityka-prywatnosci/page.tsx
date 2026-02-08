import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSettings } from '@/app/lib/data';

export const dynamic = 'force-dynamic';

export default async function PolitykaPrywatnosci() {
    const settings = await getSettings();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-dark mb-8">Polityka Prywatności</h1>
                <div className="prose prose-lg text-gray-600 max-w-none">
                    {settings.policy_privacy_content ? (
                        <div dangerouslySetInnerHTML={{ __html: settings.policy_privacy_content }} />
                    ) : (
                        <>
                            <p>Tutaj znajdzie się treść polityki prywatności.</p>
                            <p className="text-sm bg-yellow-50 p-4 rounded text-yellow-800 border border-yellow-200">
                                <strong>Info dla admina:</strong> Uzupełnij treść w panelu "Ustawienia".
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
