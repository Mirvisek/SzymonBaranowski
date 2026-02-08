
'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

type FAQ = {
    id: string;
    question: string;
    answer: string;
};

export default function FAQList({ items }: { items: FAQ[] }) {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    if (items.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">FAQ</span>
                    <h2 className="text-4xl font-bold text-dark mt-2">Często Zadawane Pytania</h2>
                </div>

                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <button
                                onClick={() => toggle(item.id)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="text-lg font-bold text-dark">{item.question}</span>
                                <span className={`p-2 rounded-full transition-colors ${openId === item.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {openId === item.id ? <Minus size={16} /> : <Plus size={16} />}
                                </span>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out ${openId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-8 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
