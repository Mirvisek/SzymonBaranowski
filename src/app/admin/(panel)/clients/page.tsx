
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { deleteTrustedClient } from '@/app/lib/actions';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function TrustedClientsPage() {
    const clients = await prisma.trustedClient.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Zaufali mi (Loga)</h1>
                <Link
                    href="/admin/clients/create"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark transition-colors"
                >
                    <Plus size={20} />
                    Dodaj Klienta
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clients.map((client) => (
                    <div key={client.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                        <div className="h-24 w-full flex items-center justify-center bg-gray-50 rounded-lg mb-4 overflow-hidden p-4">
                            <img src={client.logoUrl} alt={client.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <h3 className="font-bold text-dark mb-2">{client.name}</h3>
                        <form action={deleteTrustedClient.bind(null, client.id)} className="mt-auto">
                            <button className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                                <Trash2 size={16} /> Usuń
                            </button>
                        </form>
                    </div>
                ))}
                {clients.length === 0 && (
                    <p className="col-span-full text-center text-gray-500 py-12">Brak dodanych klientów.</p>
                )}
            </div>
        </div>
    );
}
