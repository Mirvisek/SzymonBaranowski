'use client';

import { useState, useEffect } from 'react';
import { Type, Moon, Sun, Monitor } from 'lucide-react';

export default function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [contrast, setContrast] = useState(false);

    useEffect(() => {
        // Apply settings
        document.documentElement.style.fontSize = `${fontSize}%`;
        if (contrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [fontSize, contrast]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 p-4 bg-white rounded-xl shadow-2xl border border-gray-200 w-64 animate-fade-in">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Monitor size={18} /> Dostępność
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Rozmiar tekstu: {fontSize}%</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                                >
                                    A-
                                </button>
                                <button
                                    onClick={() => setFontSize(100)}
                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm flex-1"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                                >
                                    A+
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Kontrast</label>
                            <button
                                onClick={() => setContrast(!contrast)}
                                className={`w-full p-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${contrast ? 'bg-yellow-400 text-black font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {contrast ? <Sun size={18} /> : <Moon size={18} />}
                                {contrast ? 'Wysoki Kontrast (Wł.)' : 'Normalny Kontrast'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-dark transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30"
                aria-label="Opcje dostępności"
            >
                <Type size={24} />
            </button>
        </div>
    );
}
