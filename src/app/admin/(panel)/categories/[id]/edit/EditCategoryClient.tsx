'use client';

import { useActionState, useState } from 'react';
import { updatePortfolioCategory } from '@/app/lib/portfolio-actions';
import ImageUploader from '@/app/admin/components/ImageUploader';

type Category = {
    id: string;
    name: string;
    imageUrl: string | null;
};

export default function EditCategoryClient({ category }: { category: Category }) {
    const [state, formAction] = useActionState(updatePortfolioCategory, null);
    const [imageUrl, setImageUrl] = useState(category.imageUrl || '');

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Edytuj Kategorię: {category.name}</h1>

            <form action={formAction} className="max-w-2xl space-y-6">
                <input type="hidden" name="id" value={category.id} />

                <div>
                    <label className="block text-sm font-medium mb-2">Nazwa Kategorii</label>
                    <input
                        type="text"
                        name="name"
                        required
                        defaultValue={category.name}
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

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-dark transition"
                    >
                        Zapisz zmiany
                    </button>
                    <a
                        href="/admin/categories"
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Anuluj
                    </a>
                </div>
            </form>
        </div>
    );
}
