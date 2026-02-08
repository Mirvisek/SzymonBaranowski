import Link from 'next/link';
import { getPortfolioCategories } from '@/app/lib/data';
import { deletePortfolioCategory } from '@/app/lib/actions';
import { Plus, Trash2, Edit, FolderOpen } from 'lucide-react';
import CategoryActions from '@/app/admin/(panel)/categories/CategoryActions';

export default async function CategoriesPage() {
    const categories = await getPortfolioCategories();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Kategorie Portfolio</h1>
                <Link
                    href="/admin/categories/create"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark transition"
                >
                    <Plus size={20} />
                    Dodaj Kategorię
                </Link>
            </div>

            {categories.length === 0 ? (
                <p className="text-gray-500">Brak kategorii. Dodaj pierwszą kategorię.</p>
            ) : (
                <div className="space-y-4">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex items-center gap-6"
                        >
                            {/* Thumbnail */}
                            <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FolderOpen size={48} />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                                <p className="text-sm text-gray-500">Zdjęć: {category._count.items}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {/* Move Up/Down */}
                                <CategoryActions
                                    categoryId={category.id}
                                    isFirst={index === 0}
                                    isLast={index === categories.length - 1}
                                />

                                {/* Edit */}
                                <Link
                                    href={`/admin/categories/${category.id}/edit`}
                                    className="p-2 text-blue-600 hover:text-blue-800"
                                    title="Edytuj kategorię"
                                >
                                    <Edit size={20} />
                                </Link>

                                {/* Manage Photos */}
                                <Link
                                    href={`/admin/portfolio?category=${category.id}`}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                                >
                                    Zarządzaj zdjęciami
                                </Link>

                                {/* Delete */}
                                <form action={async () => {
                                    'use server';
                                    await deletePortfolioCategory(category.id);
                                }}>
                                    <button
                                        type="submit"
                                        className="p-2 text-red-600 hover:text-red-800"
                                        title="Usuń kategorię"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
