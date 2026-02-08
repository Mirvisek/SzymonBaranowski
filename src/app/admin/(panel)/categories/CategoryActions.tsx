'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { movePortfolioCategoryUp, movePortfolioCategoryDown } from '@/app/lib/portfolio-actions';
import { useTransition } from 'react';

export default function CategoryActions({
    categoryId,
    isFirst,
    isLast
}: {
    categoryId: string;
    isFirst: boolean;
    isLast: boolean;
}) {
    const [isPending, startTransition] = useTransition();

    const handleMoveUp = () => {
        startTransition(async () => {
            await movePortfolioCategoryUp(categoryId);
        });
    };

    const handleMoveDown = () => {
        startTransition(async () => {
            await movePortfolioCategoryDown(categoryId);
        });
    };

    return (
        <div className="flex flex-col gap-1">
            <button
                onClick={handleMoveUp}
                disabled={isFirst || isPending}
                className="p-2 text-gray-600 hover:text-primary disabled:opacity-30"
                title="Przenieś wyżej"
            >
                <ChevronUp size={20} />
            </button>
            <button
                onClick={handleMoveDown}
                disabled={isLast || isPending}
                className="p-2 text-gray-600 hover:text-primary disabled:opacity-30"
                title="Przenieś niżej"
            >
                <ChevronDown size={20} />
            </button>
        </div>
    );
}
