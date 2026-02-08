
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import { MapPin, Mail, Phone, Calendar, Clock, Tag, MessageSquare, ChevronLeft } from 'lucide-react';
import ReservationChat from '@/components/ReservationChat';
import Link from 'next/link';
import ReservationDetailsEditor from '@/app/admin/components/ReservationDetailsEditor';

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
    }) as any;

    if (!res) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-12">
            <div className="shrink-0 mb-4">
                <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
                    <ChevronLeft size={20} /> Powrót do listy
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">#{res.code}</span>
                            <h1 className="text-2xl md:text-3xl font-bold text-dark">{res.clientName}</h1>
                        </div>
                        <p className="text-gray-500 text-sm md:text-base">Zarządzaj rezerwacją i rozmawiaj z klientem.</p>
                    </div>

                    <div className="w-full md:w-auto">
                        <ReservationDetailsEditor
                            reservationId={res.id}
                            initialDate={res.date}
                            initialPrice={res.totalPrice || ''}
                        />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch min-h-[450px]">
                    {/* Sidebar - natural height determines grid height */}
                    <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50 flex flex-col gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Informacje</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Tag size={18} className="text-primary" />
                                    <span className="font-bold text-dark">{res.offer?.title || 'Nieznana oferta'}</span>
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
                                <p className="text-2xl font-black text-primary">{String(res.totalPrice)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section - height matches sidebar */}
                    <div className="lg:col-span-2 flex flex-col border-gray-100 bg-white relative">
                        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-3 shrink-0">
                            <MessageSquare className="text-primary" size={20} />
                            <h2 className="text-lg md:text-xl font-bold text-dark">Wiadomości z klientem</h2>
                        </div>
                        <div className="flex-1 overflow-hidden relative min-h-[400px] lg:min-h-0">
                            <div className="absolute inset-0">
                                <ReservationChat
                                    reservationId={res.id}
                                    initialMessages={res.messages}
                                    role="admin"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
