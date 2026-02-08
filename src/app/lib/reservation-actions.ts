'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendReservationEmail, sendStatusUpdateEmail } from './email';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

function generateReservationCode(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

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
        const code = generateReservationCode();
        const password = generateReservationCode(6); // 6-znakowe hasło

        const reservation = await prisma.reservation.create({
            data: {
                code: code,
                password: password,
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
                totalPrice: data.finalPrice || '0 PLN',
                reservationCode: reservation.code || '',
                password: reservation.password || ''
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
    } catch (error: any) {
        console.error('Błąd podczas usuwania rezerwacji:', error);
        const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd bazy danych';
        return { success: false, message: `Błąd systemowy: ${errorMessage}` };
    }
}

export async function updateReservationStatus(id: string, status: string) {
    try {
        const reservation = await prisma.reservation.update({
            where: { id },
            data: { status },
            include: {
                offer: true
            }
        });

        // Send email notification to client about status update
        await sendStatusUpdateEmail({
            to: reservation.clientEmail,
            clientName: reservation.clientName,
            date: format(new Date(reservation.date), 'dd MMMM yyyy', { locale: pl }),
            offerTitle: reservation.offer.title,
            status: status
        });

        revalidatePath('/admin/reservations');
        return { success: true };
    } catch (error) {
        console.error('Update status error:', error);
        return { success: false, message: 'Nie udało się zaktualizować statusu.' };
    }
}
export async function getReservationByCode(code: string) {
    try {
        return await prisma.reservation.findUnique({
            where: { code },
            include: {
                offer: true,
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
    } catch (error) {
        return null;
    }
}

export async function sendReservationMessage(reservationId: string, sender: 'client' | 'admin', content: string) {
    try {
        const message = await prisma.reservationMessage.create({
            data: {
                reservationId,
                sender,
                content
            },
            include: {
                reservation: {
                    include: {
                        offer: true
                    }
                }
            }
        });

        // Send email notification about new message
        try {
            const isToAdmin = sender === 'client';
            const recipientEmail = isToAdmin
                ? (process.env.ADMIN_EMAIL || process.env.EMAIL_FROM)
                : message.reservation.clientEmail;

            const subject = isToAdmin
                ? `Nowa wiadomość od klienta: ${message.reservation.clientName}`
                : `Nowa wiadomość od Szymon Baranowski - Rezerwacja ${message.reservation.code}`;

            const link = `${process.env.NEXTAUTH_URL}/rezerwacja/${message.reservation.code}`;
            const adminLink = `${process.env.NEXTAUTH_URL}/admin/reservations/${message.reservation.id}`;

            // We should use a helper for this later, but for now simple nodemailer
            // Since this is a server action, we can import things
        } catch (e) {
            console.error('Message notification failed');
        }

        revalidatePath(`/rezerwacja/${message.reservation.code}`);
        revalidatePath(`/admin/reservations`);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
