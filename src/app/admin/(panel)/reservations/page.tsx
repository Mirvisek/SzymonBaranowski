
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Calendar, Mail, Phone, Clock, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { deleteReservation, updateReservationStatus } from '@/app/lib/reservation-actions';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function ReservationsPage() {
    const reservations = await prisma.reservation.findMany({
        include: {
            offer: true
        },
        orderBy: {
            date: 'desc'
        }
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-dark">Rezerwacje</h1>
                    <p className="text-gray-500 mt-1">Zarządzaj terminami i rezerwacjami klientów.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="text-sm font-medium text-gray-600">{reservations.filter(r => r.status === 'pending').length} Nowych</span>
                </div>
            </div>

            {reservations.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Brak rezerwacji</h3>
                    <p className="text-gray-500">Gdy klienci zarezerwują termin, pojawią się one tutaj.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {reservations.map((res) => {
                        const answers = res.answers ? JSON.parse(res.answers) : {};

                        return (
                            <div key={res.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden hidden sm:block">
                                                {res.offer.imageUrl ? (
                                                    <img src={res.offer.imageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ShoppingBag size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-dark">{res.clientName}</h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                    <span className="font-semibold text-primary">{res.offer.title}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Clock size={14} /> {format(new Date(res.date), 'd MMMM yyyy, HH:mm', { locale: pl })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 uppercase tracking-wider ${getStatusStyle(res.status)}`}>
                                            {getStatusIcon(res.status)}
                                            {res.status === 'pending' ? 'Oczekujący' : res.status === 'confirmed' ? 'Potwierdzony' : 'Anulowany'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-gray-50 rounded-2xl">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dane kontaktowe</h4>
                                            <div className="space-y-2">
                                                <a href={`mailto:${res.clientEmail}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                                                    <Mail size={16} /> {res.clientEmail}
                                                </a>
                                                <a href={`tel:${res.clientPhone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                                                    <Phone size={16} /> {res.clientPhone}
                                                </a>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Szczegóły płatności</h4>
                                            <p className="text-lg font-bold text-dark">{res.totalPrice}</p>
                                            <p className="text-xs text-gray-500 mt-1">Metoda: Płatność przy sesji</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dodatkowe informacje</h4>
                                            {Object.keys(answers).length > 0 ? (
                                                <div className="space-y-2">
                                                    {Object.entries(answers).map(([q, a], i) => (
                                                        <div key={i} className="text-sm">
                                                            <span className="text-gray-400 block text-[10px]">{q}</span>
                                                            <span className="text-gray-700">{a as string}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">Brak dodatkowych uwag</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex gap-2">
                                            {res.status !== 'confirmed' && (
                                                <form action={async () => { 'use server'; await updateReservationStatus(res.id, 'confirmed'); }}>
                                                    <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors">
                                                        Potwierdź
                                                    </button>
                                                </form>
                                            )}
                                            {res.status !== 'cancelled' && (
                                                <form action={async () => { 'use server'; await updateReservationStatus(res.id, 'cancelled'); }}>
                                                    <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-semibold transition-colors">
                                                        Anuluj
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                        <form action={async () => { 'use server'; if (confirm('Czy na pewno chcesz usunąć tę rezerwację?')) await deleteReservation(res.id); }}>
                                            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm font-semibold transition-colors">
                                                <Trash2 size={16} /> Usuń trwale
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ShoppingBag({ size }: { size: number }) {
    return <BriefcaseBusiness size={size} />;
}
import { BriefcaseBusiness } from 'lucide-react';
