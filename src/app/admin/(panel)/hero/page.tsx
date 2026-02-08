
import Link from 'next/link';
import { getHeroSlides } from '@/app/lib/data';
import { deleteHeroSlide } from '@/app/lib/actions';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default async function AdminHeroPage() {
    const slides = await getHeroSlides();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Slider Strony Głównej</h1>
                <Link
                    href="/admin/hero/create"
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Dodaj slajd
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Podgląd</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tytuł</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Przycisk</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {slides.map((slide) => (
                            <tr key={slide.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={slide.imageUrl} alt={slide.title} className="h-16 w-24 object-cover rounded-md" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{slide.title}</div>
                                    <div className="text-sm text-gray-500">{slide.subtitle}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {slide.buttonText ? (
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{slide.buttonText} -&gt; {slide.buttonLink}</span>
                                    ) : <span className="text-gray-400 italic">Brak</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <form action={deleteHeroSlide.bind(null, slide.id)}>
                                        <button type="submit" className="text-red-600 hover:text-red-900 ml-4">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {slides.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Brak slajdów. Dodaj pierwszy, aby ożywić stronę główną!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
