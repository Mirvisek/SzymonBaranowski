'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { sendReservationEmail } from './email';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const prisma = new PrismaClient();

export async function getOffersForReservation() {
    return await prisma.offerServices.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            duration: true,
            imageUrl: true,
            questions: true,
            category: true,
        },
        orderBy: { title: 'asc' }
    });
}

export async function verifyDiscountCode(code: string) {
    const discount = await prisma.discountCode.findUnique({
        where: { code, isActive: true }
    });

    if (!discount) return { valid: false, message: 'Kod nieprawidłowy lub wygasł.' };
    return { valid: true, type: discount.type, value: discount.value, id: discount.id };
}

export async function submitReservation(data: {
    offerId: string;
    date: Date;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    answers: Record<string, string>;
    discountCodeId?: string;
    finalPrice?: string;
}) {
    try {
        await prisma.reservation.create({
            data: {
                offerId: data.offerId,
                date: data.date,
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                clientPhone: data.clientPhone,
                answers: JSON.stringify(data.answers),
                discountCodeId: data.discountCodeId,
                totalPrice: data.finalPrice,
                status: 'pending'
            }
        });

        // Send email confirmation
        try {
            const offer = await prisma.offerServices.findUnique({ where: { id: data.offerId } });
            await sendReservationEmail({
                to: data.clientEmail,
                clientName: data.clientName,
                date: format(data.date, 'd MMMM yyyy, HH:mm', { locale: pl }),
                offerTitle: offer?.title || 'Usługa',
                totalPrice: data.finalPrice || '0 PLN'
            });
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
            // We don't fail the whole request if only email fails
        }

        revalidatePath('/admin/reservations');
        return { success: true };
    } catch (error) {
        console.error('Reservation error:', error);
        return { success: false, message: 'Błąd podczas tworzenia rezerwacji.' };
    }
}

export async function deleteReservation(id: string) {
    try {
        await prisma.reservation.delete({ where: { id } });
        revalidatePath('/admin/reservations');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Nie udało się usunąć rezerwacji.' };
    }
}

export async function updateReservationStatus(id: string, status: string) {
    try {
        await prisma.reservation.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/admin/reservations');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Nie udało się zaktualizować statusu.' };
    }
}
