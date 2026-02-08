import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import EditCategoryClient from '@/app/admin/(panel)/categories/[id]/edit/EditCategoryClient';

const prisma = new PrismaClient();

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
