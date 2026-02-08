
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import { MapPin, Mail, Phone, Calendar, Clock, Tag, MessageSquare, ChevronLeft } from 'lucide-react';
import ReservationChat from '@/components/ReservationChat';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await prisma.reservation.findUnique({
        where: { id },
        include: {
            offer: true,
            messages: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    if (!res) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto">
            <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium">
                <ChevronLeft size={20} /> Powrót do listy
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">#{res.code}</span>
                            <h1 className="text-3xl font-bold text-dark">{res.clientName}</h1>
                        </div>
                        <p className="text-gray-500">Zarządzaj rezerwacją i rozmawiaj z klientem.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="p-8 border-r border-gray-100 bg-gray-50/50 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Informacje</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Tag size={18} className="text-primary" />
                                    <span className="font-bold text-dark">{res.offer.title}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar size={18} />
                                    <span>{format(new Date(res.date), 'dd MMMM yyyy', { locale: pl })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock size={18} />
                                    <span>{format(new Date(res.date), 'HH:mm')}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Kontakt do klienta</h3>
                            <div className="space-y-3">
                                <a href={`mailto:${res.clientEmail}`} className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                                    <Mail size={18} /> {res.clientEmail}
                                </a>
                                <a href={`tel:${res.clientPhone}`} className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                                    <Phone size={18} /> {res.clientPhone}
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Konfiguracja</h3>
                            <div className="p-4 bg-white rounded-2xl border border-gray-200">
                                <p className="text-xs text-gray-400 mb-1">Cena końcowa</p>
                                <p className="text-2xl font-black text-primary">{res.totalPrice}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col h-[700px]">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
                            <MessageSquare className="text-primary" size={20} />
                            <h2 className="text-xl font-bold text-dark">Wiadomości z klientem</h2>
                        </div>
                        <ReservationChat
                            reservationId={res.id}
                            initialMessages={res.messages}
                            role="admin"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
