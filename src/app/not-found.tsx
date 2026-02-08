
import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-light flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <FileQuestion size={48} className="text-primary" />
                </div>
                <h1 className="text-8xl font-black text-dark mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Strona nie została znaleziona</h2>
                <p className="text-gray-500 mb-10 leading-relaxed">
                    Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona pod inny adres.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-dark text-white px-8 py-4 rounded-full font-bold hover:bg-primary transition-all shadow-lg hover:shadow-primary/30"
                >
                    <Home size={20} />
                    Wróć do strony głównej
                </Link>
            </div>
        </div>
    );
}
