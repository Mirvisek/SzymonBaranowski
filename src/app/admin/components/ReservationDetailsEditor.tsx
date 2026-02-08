
'use client';

import { useState } from 'react';
import { Calendar, Clock, DollarSign, Save, X, Edit2 } from 'lucide-react';
import { updateReservationDetails } from '@/app/lib/reservation-actions';
import { format } from 'date-fns';

interface ReservationDetailsEditorProps {
    reservationId: string;
    initialDate: Date;
    initialPrice: string;
}

export default function ReservationDetailsEditor({
    reservationId,
    initialDate,
    initialPrice
}: ReservationDetailsEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [date, setDate] = useState(format(new Date(initialDate), 'yyyy-MM-dd'));
    const [time, setTime] = useState(format(new Date(initialDate), 'HH:mm'));
    const [price, setPrice] = useState(initialPrice);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const newDate = new Date(`${date}T${time}`);
            const result = await updateReservationDetails(reservationId, {
                date: newDate,
                totalPrice: price
            });

            if (result.success) {
                setIsEditing(false);
            } else {
                alert('Błąd podczas zapisywania: ' + result.message);
            }
        } catch (error) {
            alert('Wystąpił nieoczekiwany błąd.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isEditing) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
                <Edit2 size={16} /> Edytuj termin i cenę
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div
                    className="relative transform bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-md rounded-3xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 className="text-xl font-bold text-dark">Edytuj rezerwację</h3>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        <p className="text-sm text-gray-500 mb-4">Wprowadź nowe dane dla tej rezerwacji. Zmiana terminu wyśle powiadomienie do klienta.</p>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Data</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Godzina</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cena końcowa</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="np. 300 PLN"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-dark transition-all disabled:opacity-70 shadow-lg shadow-primary/20 hover:shadow-xl"
                        >
                            {isSaving ? 'Zapisywanie...' : <><Save size={18} /> Zapisz zmiany</>}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
