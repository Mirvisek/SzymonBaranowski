import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function DashboardPage() {
    const session = await auth();

    // Fetch real counts from database
    const portfolioCount = await prisma.portfolioItem.count();
    const offersCount = await prisma.offerServices.count();
    const testimonialsCount = await prisma.testimonial.count();
    const clientsCount = await prisma.trustedClient.count();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Witaj, {session?.user?.name}!</h1>
                <p className="text-gray-500 mt-1">Oto podsumowanie Twojej strony.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Projekty w Portfolio</h3>
                    <p className="text-4xl font-extrabold text-primary">{portfolioCount}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Aktywne Usługi</h3>
                    <p className="text-4xl font-extrabold text-dark">{offersCount}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Opinie Klientów</h3>
                    <p className="text-4xl font-extrabold text-accent">{testimonialsCount}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Zaufani Klienci</h3>
                    <p className="text-4xl font-extrabold text-gray-400">{clientsCount}</p>
                </div>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-dark to-gray-900 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-4">Szybkie Akcje</h2>
                    <div className="flex gap-4">
                        <a href="/admin/portfolio/create" className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                            + Dodaj Projekt
                        </a>
                        <a href="/admin/hero" className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                            Zarządzaj Sliderem
                        </a>
                    </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
