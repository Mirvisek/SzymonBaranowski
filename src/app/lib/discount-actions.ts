'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function getDiscountCodes() {
    return await prisma.discountCode.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function createDiscountCode(prevState: any, formData: FormData) {
    const code = formData.get('code') as string;
    const type = formData.get('type') as string;
    const value = parseInt(formData.get('value') as string);
    const isActive = formData.get('isActive') === 'on';

    if (!code || !type || !value) {
        return { message: 'Missing required fields' };
    }

    try {
        await prisma.discountCode.create({
            data: {
                code,
                type,
                value,
                isActive
            }
        });
        revalidatePath('/admin/settings');
        return { message: 'Kod dodany pomyślnie!', success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Kod o tej nazwie już istnieje lub wystąpił błąd.' };
    }
}

export async function deleteDiscountCode(id: string) {
    try {
        await prisma.discountCode.delete({
            where: { id }
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
}

export async function toggleDiscountCodeStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.discountCode.update({
            where: { id },
            data: { isActive: !currentStatus }
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
}
