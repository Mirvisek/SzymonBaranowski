'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type NavLink = {
    name: string;
    href: string;
    submenu?: { name: string; href: string }[];
};

const navLinks: NavLink[] = [
    { name: 'Strona główna', href: '/' },
    { name: 'Oferta', href: '/oferta' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Rezerwacja', href: '/rezerwacja' },
    { name: 'O mnie', href: '/o-mnie' },
    { name: 'Kontakt', href: '/kontakt' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleSubmenu = (name: string) => {
        setActiveSubmenu(activeSubmenu === name ? null : name);
    };

    return (
        <nav className="fixed top-0 md:top-4 w-full md:w-[95%] md:left-1/2 md:-translate-x-1/2 z-50 transition-all duration-300">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-glass rounded-none md:rounded-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-dark font-sans tracking-tight">
                            Szymon<span className="text-primary">.</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {navLinks.map((link) => (
                                <div key={link.name} className="relative group">
                                    {link.submenu ? (
                                        <button
                                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-dark hover:text-primary transition-colors focus:outline-none"
                                        >
                                            {link.name}
                                            <ChevronDown className="ml-1 w-4 h-4" />
                                        </button>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="px-3 py-2 rounded-md text-sm font-medium text-dark hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    )}

                                    {/* Dropdown Desktop */}
                                    {link.submenu && (
                                        <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50">
                                            {link.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-dark hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    {link.submenu ? (
                                        <>
                                            <button
                                                onClick={() => toggleSubmenu(link.name)}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-dark hover:text-primary hover:bg-gray-50"
                                            >
                                                {link.name}
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {activeSubmenu === link.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="pl-6 space-y-1"
                                                    >
                                                        {link.submenu.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                href={subItem.href}
                                                                onClick={() => setIsOpen(false)}
                                                                className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-primary hover:bg-gray-50"
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-dark hover:text-primary hover:bg-gray-50"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
