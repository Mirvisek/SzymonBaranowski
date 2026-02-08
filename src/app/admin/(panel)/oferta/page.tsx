
import Link from 'next/link';
import { getOffers } from '@/app/lib/data';
import { getDiscountCodes } from '@/app/lib/discount-actions';
import { deleteOffer } from '@/app/lib/actions';
import { Plus, Trash2, Pencil } from 'lucide-react';
import DiscountCodesManager from '../../components/DiscountCodesManager';

export default async function AdminOfferPage() {
    const items = await getOffers() || [];
    const discountCodes = await getDiscountCodes();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Oferta</h1>
                <Link
                    href="/admin/oferta/create"
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Dodaj usługę
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tytuł</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategoria</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-3">
                                        <Link href={`/admin/oferta/${item.id}/edit`} className="text-blue-600 hover:text-blue-900">
                                            <Pencil size={18} />
                                        </Link>
                                        <form action={deleteOffer.bind(null, item.id)}>
                                            <button type="submit" className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Brak ofert. Dodaj pierwszą!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mt-12">
                <DiscountCodesManager codes={discountCodes} />
            </div>
        </div>
    );
}
