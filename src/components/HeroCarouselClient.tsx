'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
    id: string;
    image: string;
    title: string;
    text: string;
    cta: string;
    link: string;
};

export default function HeroCarouselClient({ slides }: { slides: Slide[] }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrent((c) => (c + 1) % slides.length);
    const prevSlide = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

    if (!slides || slides.length === 0) return null;

    return (
        <div className="relative h-[80vh] w-full overflow-hidden bg-dark">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 capitalize"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    />

                    {/* Overlay with Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
                        <motion.h1
                            initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
                        >
                            {slides[current].title}
                        </motion.h1>
                        {slides[current].text && (
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl"
                            >
                                {slides[current].text}
                            </motion.p>
                        )}
                        {slides[current].cta && slides[current].link && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Link
                                    href={slides[current].link}
                                    className="inline-block bg-accent hover:bg-primary text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
                                >
                                    {slides[current].cta}
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>


        </div>
    );
}
