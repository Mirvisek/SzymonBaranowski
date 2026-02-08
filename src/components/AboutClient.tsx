'use client';

import { motion } from 'framer-motion';

export default function AboutClient({ content, imageUrl, clients }: { content: string, imageUrl: string, clients: any[] }) {
    return (
        <>
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-primary mb-6"
                >
                    O Mnie
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-500 max-w-2xl mx-auto"
                >
                    Poznajmy się bliżej.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src={imageUrl}
                        alt="Portret"
                        className="rounded-2xl shadow-2xl w-full object-cover max-h-[800px]"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-6 text-lg text-gray-700 leading-relaxed prose prose-lg prose-headings:text-dark prose-p:text-gray-700 prose-a:text-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>

            {/* Trusted By Section */}
            {clients.length > 0 && (
                <div className="mt-32 border-t border-gray-100 pt-16">
                    <div className="text-center mb-12">
                        <span className="text-primary font-semibold tracking-wider uppercase text-sm">Współpraca</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-dark mt-2">Zaufali mi</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                        {clients.map((client) => (
                            <div key={client.id} className="w-full h-32 flex items-center justify-center p-4 bg-white hover:shadow-lg rounded-xl transition-all duration-300 group">
                                <img
                                    src={client.logoUrl}
                                    alt={client.name}
                                    className="max-h-full max-w-full object-contain filter group-hover:brightness-110"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
