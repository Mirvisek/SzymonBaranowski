import EditLegalDocumentForm from './EditForm';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditLegalDocumentPage({ params }: { params: { id: string } }) {
    const document = await prisma.legalDocument.findUnique({
        where: { id: params.id }
    });

    if (!document) {
        notFound();
    }

    return <EditLegalDocumentForm document={document} />;
}
