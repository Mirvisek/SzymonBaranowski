
import { getReservationByCode } from '@/app/lib/reservation-actions';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import { Mail, Phone, Calendar, Clock, Tag, MessageSquare, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import ReservationChat from '@/components/ReservationChat';
import ReservationAccessGuard from '@/components/ReservationAccessGuard';
import CalendarButtons from '@/components/CalendarButtons';

export const dynamic = 'force-dynamic';

export default async function ReservationManagementPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const reservation = await getReservationByCode(code) as any;

    if (!reservation) {
        notFound();
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Potwierdzona';
            case 'cancelled': return 'Anulowana';
            default: return 'Oczekująca';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle size={20} />;
            case 'cancelled': return <XCircle size={20} />;
            default: return <AlertCircle size={20} />;
        }
    };

    return (
        <ReservationAccessGuard reservationCode={reservation.code} correctPassword={reservation.password}>
            <main className="min-h-screen bg-gray-50">
                <div className="pt-10 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-dark p-8 md:p-12 text-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <span className="text-white/60 text-sm uppercase tracking-widest font-semibold">Numer rezerwacji</span>
                                    <h1 className="text-3xl md:text-4xl font-mono font-bold mt-1 uppercase">{reservation.code}</h1>
                                </div>
                                <div className={`flex items-center gap-2 px-6 py-3 rounded-full border ${getStatusStyle(reservation.status)} font-bold`}>
                                    {getStatusIcon(reservation.status)}
                                    {getStatusLabel(reservation.status)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3">
                            {/* Details Sidebar */}
                            <div className="p-8 border-r border-gray-100 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-dark mb-6">Szczegóły</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                                            <Tag size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Usługa</p>
                                            <p className="font-bold text-dark">{reservation.offer.title}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Data</p>
                                            <p className="font-bold text-dark">{format(new Date(reservation.date), 'dd MMMM yyyy', { locale: pl })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Godzina</p>
                                            <p className="font-bold text-dark">{format(new Date(reservation.date), 'HH:mm')}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 font-semibold uppercase mb-4">Twoje dane</p>
                                        <p className="font-bold text-dark">{reservation.clientName}</p>
                                        <p className="text-gray-600 text-sm">{reservation.clientEmail}</p>
                                        <p className="text-gray-600 text-sm">{reservation.clientPhone}</p>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Płatność</p>
                                        <p className="text-2xl font-black text-primary">{reservation.totalPrice}</p>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <CalendarButtons
                                            title={`Sesja: ${reservation.offer.title} - Szymon Baranowski`}
                                            description={`Twoja rezerwacja na sesję: ${reservation.offer.title}.\nLink do zarządzania: ${process.env.NEXTAUTH_URL}/rezerwacja/${reservation.code}`}
                                            startDate={new Date(reservation.date)}
                                            durationMinutes={reservation.offer.duration ? parseInt(reservation.offer.duration) : 60}
                                            code={reservation.code}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Chat Section */}
                            <div className="lg:col-span-2 p-0 flex flex-col h-[600px]">
                                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                                    <MessageSquare className="text-primary" size={20} />
                                    <h2 className="text-xl font-bold text-dark">Konwersacja</h2>
                                </div>

                                <ReservationChat
                                    reservationId={reservation.id}
                                    initialMessages={reservation.messages}
                                    role="client"
                                />
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-8">
                        Masz problem z rezerwacją? Skontaktuj się bezpośrednio pod adresem {process.env.EMAIL_FROM}
                    </p>
                </div>

                <Footer />
            </main>
        </ReservationAccessGuard>
    );
}
