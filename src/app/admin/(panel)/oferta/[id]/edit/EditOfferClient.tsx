'use client';

import { useActionState } from 'react';
import { updateOffer } from '@/app/lib/actions';
import Link from 'next/link';
import { OfferServices } from '@prisma/client';
import ImageUploader from '../../../../components/ImageUploader';
import { useState } from 'react';

export default function EditOfferClient({ offer }: { offer: OfferServices }) {
    const bindedUpdateOffer = updateOffer.bind(null, offer.id);
    const [state, formAction] = useActionState(bindedUpdateOffer, null);
    const [imageUrl, setImageUrl] = useState(offer.imageUrl || '');

    // Parse questions back to string
    let questionsString = '';
    try {
        if (offer.questions) {
            const parsed = JSON.parse(offer.questions);
            if (Array.isArray(parsed)) {
                questionsString = parsed.join('\n');
            }
        }
    } catch (e) {
        // Fallback if not valid JSON
        questionsString = offer.questions || '';
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Edytuj usługę: {offer.title}</h1>
                <Link href="/admin/oferta" className="text-sm text-gray-600 hover:text-dark">Wróć</Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form action={formAction} className="space-y-6">
                    {state?.message && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{state.message}</div>
                    )}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategoria</label>
                        <select
                            name="category"
                            id="category"
                            defaultValue={offer.category}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                            <option value="fotografia">Fotografia</option>
                            <option value="grafika">Grafika</option>
                            <option value="marketing">Marketing</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tytuł</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            defaultValue={offer.title}
                            required
                            placeholder="np. Pakiet Standard"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Cena</label>
                        <input
                            type="text"
                            name="price"
                            id="price"
                            defaultValue={offer.price}
                            required
                            placeholder="np. 500 PLN"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Opis</label>
                        <textarea
                            name="description"
                            id="description"
                            defaultValue={offer.description}
                            required
                            rows={3}
                            placeholder="Krótki opis usługi..."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="features" className="block text-sm font-medium text-gray-700">Cechy (opcjonalne, oddziel przecinkami)</label>
                        <textarea
                            name="features"
                            id="features"
                            defaultValue={offer.features}
                            rows={3}
                            placeholder="np. 10 zdjęć, 2h sesji, obróbka graficzna"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">Te cechy będą wyświetlane jako lista punktowana (tylko dla fotografii).</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Czas trwania</label>
                            <input
                                type="text"
                                name="duration"
                                id="duration"
                                defaultValue={offer.duration || ''}
                                placeholder="np. 1 godzina"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zdjęcie usługi</label>
                            <input type="hidden" name="imageUrl" value={imageUrl} />
                            <ImageUploader onUpload={setImageUrl} value={imageUrl} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="questions" className="block text-sm font-medium text-gray-700">Pytania do zamawiającego (po 1 w linii)</label>
                        <textarea
                            name="questions"
                            id="questions"
                            defaultValue={questionsString}
                            rows={5}
                            placeholder="Czy potrzebujesz wizażystki?&#10;Jaki jest cel sesji?"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">Każde pytanie w nowej linii. Te pytania pojawią się w formularzu rezerwacji.</p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Zapisz Zmiany
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
