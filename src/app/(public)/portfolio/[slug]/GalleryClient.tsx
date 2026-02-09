'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type Item = {
    id: string;
    title: string | null;
    imageUrl: string;
};

export default function GalleryClient({ items }: { items: Item[] }) {
    const [selectedImage, setSelectedImage] = useState<Item | null>(null);

    return (
        <>
            <motion.div
                layout
                className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
                {items.map((item) => (
                    <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="group relative break-inside-avoid mb-6 bg-gray-100 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
                        onClick={() => setSelectedImage(item)}
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.title || 'Portfolio image'}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {item.title && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <h3 className="text-white font-semibold">{item.title}</h3>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} />
                        </button>

                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={selectedImage.imageUrl}
                            alt={selectedImage.title || 'Portfolio image'}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {selectedImage.title && (
                            <div className="absolute bottom-8 left-0 right-0 text-center">
                                <p className="text-white text-lg font-semibold">
                                    {selectedImage.title}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
