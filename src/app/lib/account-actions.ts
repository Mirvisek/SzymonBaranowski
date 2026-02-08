'use server'

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendAdminPasswordChangedEmail } from './email';

export async function updateAdminAccount(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { message: 'Błąd autoryzacji: Brak sesji użytkownika.' };
    }

    const currentEmail = session.user.email;
    const newEmail = formData.get('email') as string;
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword) {
        return { message: 'Wprowadź aktualne hasło, aby potwierdzić zmiany.' };
    }

    // Verify current user
    const user = await prisma.user.findUnique({
        where: { email: currentEmail }
    });

    if (!user) {
        return { message: 'Nie znaleziono użytkownika.' };
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
        return { message: 'Nieprawidłowe aktualne hasło.' };
    }

    const updateData: any = {};
    let passwordChanged = false;

    // Handle Email Change
    if (newEmail && newEmail !== currentEmail) {
        const existingUser = await prisma.user.findUnique({
            where: { email: newEmail }
        });
        if (existingUser) {
            return { message: 'Ten adres email jest już zajęty.' };
        }
        updateData.email = newEmail;
    }

    // Handle Password Change
    if (newPassword) {
        if (newPassword !== confirmPassword) {
            return { message: 'Nowe hasła nie są identyczne.' };
        }
        if (newPassword.length < 6) {
            return { message: 'Hasło musi mieć co najmniej 6 znaków.' };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateData.password = hashedPassword;
        passwordChanged = true;
    }

    if (Object.keys(updateData).length === 0) {
        return { message: 'Nie wprowadzono żadnych zmian.' };
    }

    try {
        await prisma.user.update({
            where: { email: currentEmail },
            data: updateData
        });

        if (passwordChanged) {
            const targetEmail = process.env.ADMIN_EMAIL || updateData.email || currentEmail;
            await sendAdminPasswordChangedEmail(targetEmail, newPassword);
        }

        return { message: 'success: Dane zostały zaktualizowane. ' + (updateData.email ? 'Zaloguj się ponownie nowym mailem.' : '') };
    } catch (error) {
        console.error('Update account error:', error);
        return { message: 'Wystąpił błąd podczas aktualizacji danych.' };
    }
}
