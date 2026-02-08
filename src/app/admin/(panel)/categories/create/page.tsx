'use client';

import { useActionState } from 'react';
import { createPortfolioCategory } from '@/app/lib/actions';
import ImageUploader from '@/app/admin/components/ImageUploader';
import { useState } from 'react';

export default function CreateCategoryPage() {
    const [state, formAction] = useActionState(createPortfolioCategory, null);
    const [imageUrl, setImageUrl] = useState('');

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Dodaj Kategorię Portfolio</h1>

            <form action={formAction} className="max-w-2xl space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Nazwa Kategorii</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="np. Sesje ślubne"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Okładka kategorii</label>
                    <ImageUploader value={imageUrl} onUpload={(url) => setImageUrl(url)} />
                    <input type="hidden" name="imageUrl" value={imageUrl} />
                </div>

                {state?.message && (
                    <p className="text-red-500">{state.message}</p>
                )}

                <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-dark transition"
                >
                    Dodaj Kategorię
                </button>
            </form>
        </div>
    );
}
