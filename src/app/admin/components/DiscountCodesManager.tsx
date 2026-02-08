'use client';

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Trash2, Power, Percent, DollarSign, Plus } from 'lucide-react';
import { createDiscountCode, deleteDiscountCode, toggleDiscountCodeStatus } from '@/app/lib/discount-actions';
import { useRouter } from 'next/navigation';

type DiscountCode = {
    id: string;
    code: string;
    type: string;
    value: number;
    isActive: boolean;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50"
        >
            <Plus size={18} className="mr-2" />
            {pending ? 'Dodawanie...' : 'Dodaj Kod'}
        </button>
    );
}

export default function DiscountCodesManager({ codes }: { codes: DiscountCode[] }) {
    const [msg, setMsg] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    async function handleCreate(formData: FormData) {
        const result = await createDiscountCode(null, formData);
        setMsg(result.message || '');
        if (result.success) {
            formRef.current?.reset();
            router.refresh();
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Czy na pewno chcesz usunąć ten kod?')) {
            await deleteDiscountCode(id);
            router.refresh();
        }
    }

    async function handleToggle(id: string, currentStatus: boolean) {
        await toggleDiscountCodeStatus(id, currentStatus);
        router.refresh();
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Kody Rabatowe</h2>

            {/* Add New Code Form */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                <form ref={formRef} action={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kod</label>
                        <input
                            name="code"
                            type="text"
                            placeholder="np. LATO2024"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
                        <select
                            name="type"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="percent">Procentowy (%)</option>
                            <option value="amount">Kwotowy (PLN)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Wartość</label>
                        <input
                            name="value"
                            type="number"
                            placeholder="np. 10"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div>
                        <SubmitButton />
                    </div>
                </form>
                {msg && <p className="text-sm mt-2 text-primary font-medium">{msg}</p>}
            </div>

            {/* Codes List */}
            <div className="grid gap-4">
                {codes.length === 0 ? (
                    <p className="text-gray-500 italic">Brak aktywnych kodów rabatowych.</p>
                ) : (
                    codes.map((code) => (
                        <div key={code.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${code.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {code.type === 'percent' ? <Percent size={20} /> : <DollarSign size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{code.code}</h4>
                                    <p className="text-sm text-gray-500">
                                        Zniżka: {code.value}{code.type === 'percent' ? '%' : ' PLN'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggle(code.id, code.isActive)}
                                    className={`p-2 rounded-lg transition-colors ${code.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                    title={code.isActive ? 'Dezaktywuj' : 'Aktywuj'}
                                >
                                    <Power size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(code.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Usuń"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
