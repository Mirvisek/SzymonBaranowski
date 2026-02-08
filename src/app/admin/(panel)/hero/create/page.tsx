'use client';

import { useActionState } from 'react';
import { createHeroSlide } from '@/app/lib/actions';
import Link from 'next/link';
import ImageUploader from '@/app/admin/components/ImageUploader';
import { useState } from 'react';

export default function CreateHeroPage() {
    const [state, formAction] = useActionState(createHeroSlide, null);
    const [imageUrl, setImageUrl] = useState('');

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dodaj slajd</h1>
                <Link href="/admin/hero" className="text-sm text-gray-600 hover:text-dark">Wróć</Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form action={formAction} className="space-y-6">
                    {state?.message && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{state.message}</div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zdjęcie w tle (wymagane)</label>
                        <ImageUploader onUpload={setImageUrl} />
                        <input type="hidden" name="imageUrl" value={imageUrl} required />
                        <p className="mt-1 text-xs text-gray-500">Rekomendowany rozmiar: 1920x1080px lub większy. Format poziomy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tytuł główny</label>
                            <input type="text" name="title" id="title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" placeholder="np. Profesjonalna Fotografia Biznesowa" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Podtytuł (opcjonalny)</label>
                            <input type="text" name="subtitle" id="subtitle" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" placeholder="np. Zbuduj swój wizerunek z nami" />
                        </div>

                        <div>
                            <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">Tekst przycisku (opcjonalny)</label>
                            <input type="text" name="buttonText" id="buttonText" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" placeholder="np. Zobacz ofertę" />
                        </div>

                        <div>
                            <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700">Link przycisku (opcjonalny)</label>
                            <input type="text" name="buttonLink" id="buttonLink" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" placeholder="np. /oferta" />
                        </div>
                    </div>

                    <div className="pt-4 border-t mt-4">
                        <button
                            type="submit"
                            disabled={!imageUrl}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Dodaj slajd
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
