
'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deletePortfolioItem } from '@/app/lib/actions';

interface DeletePortfolioItemButtonProps {
    itemId: string;
}

export default function DeletePortfolioItemButton({ itemId }: DeletePortfolioItemButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Czy na pewno chcesz usunąć to zdjęcie?')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePortfolioItem(itemId);
        } catch (error) {
            alert('Wystąpił błąd podczas usuwania zdjęcia.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-red-500 rounded hover:bg-red-600 disabled:opacity-50"
            title="Usuń"
        >
            {isDeleting ? (
                <Loader2 size={16} className="animate-spin text-white" />
            ) : (
                <Trash2 size={16} className="text-white" />
            )}
        </button>
    );
}
