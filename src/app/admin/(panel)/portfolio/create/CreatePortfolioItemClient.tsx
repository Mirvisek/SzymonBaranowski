'use client';

import { useActionState, useState, use } from 'react';
import { createPortfolioItem } from '@/app/lib/actions';
import ImageUploader from '@/app/admin/components/ImageUploader';

export default function CreatePortfolioItemPage({ categoriesPromise }: { categoriesPromise: Promise<any[]> }) {
    const categories = use(categoriesPromise);
    const [state, formAction] = useActionState(createPortfolioItem, null);
    const [imageUrl, setImageUrl] = useState('');

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Dodaj Zdjęcie do Portfolio</h1>

            {categories.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        Najpierw utwórz kategorię w zakładce <strong>Kategorie</strong>.
                    </p>
                </div>
            ) : (
                <form action={formAction} className="max-w-2xl space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Tytuł (opcjonalny)</label>
                        <input
                            type="text"
                            name="title"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            placeholder="np. Sesja ślubna Ani i Marka"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Kategoria</label>
                        <select
                            name="categoryId"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Wybierz kategorię...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Orientacja</label>
                        <select
                            name="orientation"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="horizontal">Poziomo</option>
                            <option value="vertical">Pionowo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Zdjęcie</label>
                        <ImageUploader value={imageUrl} onUpload={(url) => setImageUrl(url)} />
                        <input type="hidden" name="imageUrl" value={imageUrl} required />
                    </div>

                    {state?.message && (
                        <p className="text-red-500">{state.message}</p>
                    )}

                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-dark transition"
                    >
                        Dodaj Zdjęcie
                    </button>
                </form>
            )}
        </div>
    );
}
