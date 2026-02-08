
'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deletePortfolioCategory } from '@/app/lib/actions';

interface DeleteCategoryButtonProps {
    categoryId: string;
    categoryName: string;
}

export default function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Czy na pewno chcesz usunąć kategorię "${categoryName}"? Wszystkie zdjęcia w tej kategorii również zostaną usunięte.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePortfolioCategory(categoryId);
        } catch (error) {
            alert('Wystąpił błąd podczas usuwania kategorii.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
            title="Usuń kategorię"
        >
            {isDeleting ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Trash2 size={20} />
            )}
        </button>
    );
}
