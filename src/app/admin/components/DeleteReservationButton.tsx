
'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteReservation } from '@/app/lib/reservation-actions';

interface DeleteReservationButtonProps {
    reservationId: string;
}

export default function DeleteReservationButton({ reservationId }: DeleteReservationButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Czy na pewno chcesz trwale usunąć tę rezerwację? Tej operacji nie można cofnąć.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteReservation(reservationId);
            if (!result.success) {
                alert('Błąd podczas usuwania: ' + result.message);
            }
        } catch (error) {
            alert('Wystąpił nieoczekiwany błąd.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
            {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Trash2 size={16} />
            )}
            Usuń trwale
        </button>
    );
}
