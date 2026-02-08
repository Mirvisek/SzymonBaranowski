import { PrismaClient } from '@prisma/client';
import { TrendingUp, Users, Image, MessageSquare, Calendar, Eye } from 'lucide-react';

const prisma = new PrismaClient();

export default async function AnalyticsPage() {
    // Fetch statistics
    const [
        portfolioCount,
        offersCount,
        reservationsCount,
        messagesCount,
        testimonialsCount,
        clientsCount,
        recentReservations,
        recentMessages
    ] = await Promise.all([
        prisma.portfolioItem.count(),
        prisma.offerServices.count(),
        prisma.reservation.count(),
        prisma.contactMessage.count(),
        prisma.testimonial.count(),
        prisma.trustedClient.count(),
        prisma.reservation.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { offer: true }
        }),
        prisma.contactMessage.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        })
    ]);

    const stats = [
        { label: 'Projekty', value: portfolioCount, icon: Image, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Usługi', value: offersCount, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Rezerwacje', value: reservationsCount, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Wiadomości', value: messagesCount, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Opinie', value: testimonialsCount, icon: Eye, color: 'text-pink-600', bg: 'bg-pink-50' },
        { label: 'Klienci', value: clientsCount, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Statystyki</h1>
                <p className="text-gray-500 mt-1">Przegląd aktywności strony</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Reservations */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Ostatnie Rezerwacje</h2>
                    {recentReservations.length === 0 ? (
                        <p className="text-gray-500 text-sm">Brak rezerwacji</p>
                    ) : (
                        <div className="space-y-3">
                            {recentReservations.map((reservation) => (
                                <div key={reservation.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="text-primary flex-shrink-0 mt-0.5" size={18} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 truncate">{reservation.clientName}</p>
                                        <p className="text-xs text-gray-500">{reservation.offer.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(reservation.createdAt).toLocaleDateString('pl-PL')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Messages */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Ostatnie Wiadomości</h2>
                    {recentMessages.length === 0 ? (
                        <p className="text-gray-500 text-sm">Brak wiadomości</p>
                    ) : (
                        <div className="space-y-3">
                            {recentMessages.map((message) => (
                                <div key={message.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <MessageSquare className="text-primary flex-shrink-0 mt-0.5" size={18} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 truncate">{message.name}</p>
                                        <p className="text-xs text-gray-500 line-clamp-2">{message.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(message.createdAt).toLocaleDateString('pl-PL')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
