'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        content: "Szymon to profesjonalista w każdym calu. Zdjęcia przerosły nasze oczekiwania!",
        author: "Anna Kowalska"
    },
    {
        id: 2,
        content: "Świetne podejście do marketingu. Nasze zasięgi wzrosły dwukrotnie.",
        author: "Jan Nowak"
    },
    {
        id: 3,
        content: "Kreatywność i terminowość. Polecam każdemu współpracę z Szymonem.",
        author: "Firma X"
    }
];

export default function Testimonials() {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((i) => (i + 1) % testimonials.length);
    const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-16">Opinie Klientów</h2>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-gray-50 p-8 md:p-12 rounded-2xl shadow-inner"
                        >
                            <p className="text-xl md:text-2xl italic text-gray-700 mb-6">"{testimonials[index].content}"</p>
                            <h4 className="text-lg font-bold text-primary">- {testimonials[index].author}</h4>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center mt-8 gap-4">
                        <button onClick={prev} className="p-2 rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors">
                            <ChevronLeft />
                        </button>
                        <button onClick={next} className="p-2 rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors">
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
