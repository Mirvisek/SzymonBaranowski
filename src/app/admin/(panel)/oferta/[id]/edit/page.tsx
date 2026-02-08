
import { getOfferById } from '@/app/lib/data';
import EditOfferClient from './EditOfferClient';
import { notFound } from 'next/navigation';

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const offer = await getOfferById(id);

    if (!offer) {
        notFound();
    }

    return <EditOfferClient offer={offer} />;
}
