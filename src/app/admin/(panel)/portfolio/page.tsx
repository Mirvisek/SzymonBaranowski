import Link from 'next/link';
import { getPortfolioCategories, getPortfolioItems } from '@/app/lib/data';
import { deletePortfolioItem } from '@/app/lib/actions';
import { movePortfolioItemUp, movePortfolioItemDown } from '@/app/lib/portfolio-actions';
import { Plus, Trash2, ChevronUp, ChevronDown, FolderOpen } from 'lucide-react';

export default async function PortfolioAdminPage({
    searchParams
}: {
    searchParams: Promise<{ category?: string }>
}) {
    const params = await searchParams;
    const selectedCategoryId = params?.category;

    const categories = await getPortfolioCategories();
    const allItems = selectedCategoryId
        ? await getPortfolioItems(selectedCategoryId)
        : await getPortfolioItems();

    const selectedCategory = selectedCategoryId
        ? categories.find(c => c.id === selectedCategoryId)
        : null;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        {selectedCategory ? `Zdjęcia: ${selectedCategory.name}` : 'Zarządzaj Portfolio'}
                    </h1>
                    {selectedCategory && (
                        <Link
                            href="/admin/portfolio"
                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                        >
                            ← Powrót do wszystkich kategorii
                        </Link>
                    )}
                </div>
                <div className="flex gap-3">
                    {!selectedCategory && (
                        <Link
                            href="/admin/categories"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <FolderOpen size={20} />
                            Zarządzaj kategoriami
                        </Link>
                    )}
                    <Link
                        href="/admin/portfolio/create"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark transition"
                    >
                        <Plus size={20} />
                        Dodaj Zdjęcie
                    </Link>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                        Najpierw utwórz kategorie w zakładce <strong>Kategorie</strong>.
                    </p>
                </div>
            ) : selectedCategory ? (
                // Showing single category
                <div>
                    {allItems.length === 0 ? (
                        <p className="text-gray-500 italic">Brak zdjęć w tej kategorii</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {allItems.map((item, index) => (
                                <div key={item.id} className="relative group bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className={`${item.orientation === 'vertical' ? 'aspect-[3/4]' : 'aspect-square'} bg-gray-100`}>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title || 'Portfolio image'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Overlay with actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                        {item.title && (
                                            <p className="text-white text-sm font-medium text-center truncate w-full px-2">{item.title}</p>
                                        )}
                                        <span className="text-white/80 text-xs">{item.orientation === 'vertical' ? 'Pionowo' : 'Poziomo'}</span>

                                        <div className="flex gap-2 mt-2">
                                            {/* Move Up */}
                                            <form action={async () => {
                                                'use server';
                                                await movePortfolioItemUp(item.id);
                                            }}>
                                                <button
                                                    type="submit"
                                                    disabled={index === 0}
                                                    className="p-2 bg-white/20 rounded hover:bg-white/30 disabled:opacity-30"
                                                    title="Przenieś wyżej"
                                                >
                                                    <ChevronUp size={16} className="text-white" />
                                                </button>
                                            </form>

                                            {/* Move Down */}
                                            <form action={async () => {
                                                'use server';
                                                await movePortfolioItemDown(item.id);
                                            }}>
                                                <button
                                                    type="submit"
                                                    disabled={index === allItems.length - 1}
                                                    className="p-2 bg-white/20 rounded hover:bg-white/30 disabled:opacity-30"
                                                    title="Przenieś niżej"
                                                >
                                                    <ChevronDown size={16} className="text-white" />
                                                </button>
                                            </form>

                                            {/* Delete */}
                                            <form action={async () => {
                                                'use server';
                                                await deletePortfolioItem(item.id);
                                            }}>
                                                <button
                                                    type="submit"
                                                    className="p-2 bg-red-500 rounded hover:bg-red-600"
                                                    title="Usuń"
                                                >
                                                    <Trash2 size={16} className="text-white" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // Showing all categories overview
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/admin/portfolio?category=${category.id}`}
                            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all"
                        >
                            <div className="aspect-video bg-gray-100">
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Brak okładki
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                                <p className="text-sm text-gray-500">Zdjęć: {category._count.items}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
