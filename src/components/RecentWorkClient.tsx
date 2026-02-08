'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

type Item = {
    id: string;
    title: string | null;
    imageUrl: string;
    category: {
        name: string;
        slug: string;
    };
};

export default function RecentWorkClient({ items }: { items: Item[] }) {
    if (items.length === 0) {
        return null; // Don't show section if no items
    }

    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-dark mb-12">
                    Najświeższe ujęcia
                </h2>

                {/* Horizontal scroll container */}
                <div className="relative">
                    <motion.div
                        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                        drag="x"
                        dragConstraints={{ right: 0, left: -1000 }}
                    >
                        {items.map((item) => (
                            <Link
                                key={item.id}
                                href={`/portfolio/${item.category.slug}`}
                                className="group min-w-[280px] md:min-w-[320px] h-[450px] snap-center rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title || 'Portfolio image'}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 280px, 320px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        {item.title && (
                                            <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                                        )}
                                        <p className="text-white/80 text-sm">{item.category.name}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
