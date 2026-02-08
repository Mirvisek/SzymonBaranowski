'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';

type Offer = {
    id: string;
    title: string;
    description: string;
    price: string;
    features: string;
};

type GroupedOffers = {
    fotografia: Offer[];
    grafika: Offer[];
    marketing: Offer[];
};

export default function OfferList({ offers }: { offers: GroupedOffers }) {
    const [activeCategory, setActiveCategory] = useState<string>('fotografia');

    // Handle hash navigation on mount
    useEffect(() => {
        const { hash } = window.location;
        if (hash) {
            const category = hash.replace('#', '');
            if (['fotografia', 'grafika', 'marketing'].includes(category)) {
                setActiveCategory(category);
            }
        }
    }, []);

    return (
        <div className="space-y-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                    { id: 'fotografia', label: 'Fotografia' },
                    { id: 'grafika', label: 'Grafika' },
                    { id: 'marketing', label: 'Marketing' }
                ].map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${activeCategory === cat.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105'
                            : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-primary/30'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeCategory === 'fotografia' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {offers.fotografia.map((pkg) => (
                                <div key={pkg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-dark mb-2">{pkg.title}</h3>
                                    <div className="text-3xl font-bold text-primary mb-4">{pkg.price}</div>
                                    <p className="text-gray-500 text-sm mb-6">{pkg.description}</p>

                                    <ul className="space-y-3 mb-8 flex-1">
                                        {pkg.features.split(',').map((feat, i) => (
                                            <li key={i} className="flex items-start text-sm text-gray-600">
                                                <Check className="text-accent mr-2 mt-0.5 flex-shrink-0" size={16} />
                                                <span>{feat.trim()}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href="/rezerwacja"
                                        className="w-full block text-center bg-dark text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        Zarezerwuj teraz
                                    </Link>
                                </div>
                            ))}
                            {offers.fotografia.length === 0 && (
                                <p className="text-gray-500 col-span-full text-center py-12">Brak ofert w tej kategorii.</p>
                            )}
                        </div>
                    )}

                    {activeCategory === 'grafika' && (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {offers.grafika.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-dark">{item.title}</h3>
                                            <p className="text-gray-600 mt-2">{item.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 min-w-max">
                                            <span className="text-2xl font-bold text-primary">{item.price}</span>
                                            <Link href="/kontakt?subject=Grafika" className="text-sm font-bold text-dark hover:text-primary transition-colors flex items-center">
                                                Zapytaj o wycenę &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {offers.grafika.length === 0 && (
                                <p className="text-gray-500 text-center py-12">Brak ofert w tej kategorii.</p>
                            )}
                        </div>
                    )}

                    {activeCategory === 'marketing' && (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {offers.marketing.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-dark">{item.title}</h3>
                                            <p className="text-gray-600 mt-2">{item.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 min-w-max">
                                            <span className="text-2xl font-bold text-primary">{item.price}</span>
                                            <Link href="/kontakt?subject=Marketing" className="text-sm font-bold text-dark hover:text-primary transition-colors flex items-center">
                                                Zapytaj o wycenę &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {offers.marketing.length === 0 && (
                                <p className="text-gray-500 text-center py-12">Brak ofert w tej kategorii.</p>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
