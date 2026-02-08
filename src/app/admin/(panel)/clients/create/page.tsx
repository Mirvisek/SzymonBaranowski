
'use client';

import { createTrustedClient } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import ImageUploader from '../../../components/ImageUploader';

export default function CreateClientPage() {
    const [state, formAction] = useActionState(createTrustedClient, null);
    const [logoUrl, setLogoUrl] = useState('');

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Dodaj Logo Klienta</h1>

            <form action={formAction} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                {state?.message && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        {state.message}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa Klienta</label>
                    <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg" placeholder="np. Nike" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    <ImageUploader value={logoUrl} onUpload={setLogoUrl} />
                    <input type="hidden" name="logoUrl" value={logoUrl} />
                </div>

                <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-dark transition-colors">
                    Dodaj Klienta
                </button>
            </form>
        </div>
    );
}
