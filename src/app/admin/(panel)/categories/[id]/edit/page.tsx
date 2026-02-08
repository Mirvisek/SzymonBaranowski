import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditCategoryClient from '@/app/admin/(panel)/categories/[id]/edit/EditCategoryClient';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const category = await prisma.portfolioCategory.findUnique({
        where: { id }
    });

    if (!category) {
        notFound();
    }

    return <EditCategoryClient category={category} />;
}
