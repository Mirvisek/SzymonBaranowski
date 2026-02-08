'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const data = Object.fromEntries(formData);
        await signIn('credentials', { ...data, redirect: false });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Nieprawidłowe dane logowania.';
                default:
                    return 'Coś poszło nie tak.';
            }
        }
        throw error;
    }

    redirect('/admin/dashboard');
}

export async function handleSignOut() {
    await signOut({ redirectTo: '/admin/login' });
}

export async function createPortfolioItem(prevState: any, formData: FormData) {
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const orientation = formData.get('orientation') as string;

    if (!categoryId || !imageUrl || !orientation) {
        return { message: 'Missing fields' };
    }

    try {
        // Get current max order for this category
        const maxOrderItem = await prisma.portfolioItem.findFirst({
            where: { categoryId },
            orderBy: { order: 'desc' }
        });

        const newOrder = maxOrderItem ? maxOrderItem.order + 1 : 0;

        await prisma.portfolioItem.create({
            data: {
                title,
                categoryId,
                imageUrl,
                orientation,
                order: newOrder
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Create Portfolio Item.' };
    }

    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    redirect('/admin/portfolio');
}

export async function createPortfolioCategory(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!name) return { message: 'Missing Name' };

    // Simple slug generator
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    try {
        await prisma.portfolioCategory.create({
            data: {
                name,
                slug,
                imageUrl
            }
        });
    } catch (error) {
        return { message: 'Error creating category' };
    }

    revalidatePath('/portfolio');
    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function deletePortfolioCategory(id: string) {
    try {
        await prisma.portfolioCategory.delete({ where: { id } });
        revalidatePath('/portfolio');
        revalidatePath('/admin/categories');
        revalidatePath('/admin/portfolio');
    } catch (e) {
        throw new Error('Failed to delete category');
    }
}

export async function deletePortfolioItem(id: string) {
    try {
        await prisma.portfolioItem.delete({
            where: { id }
        });
        revalidatePath('/portfolio');
        revalidatePath('/admin/portfolio');
    } catch (error) {
        throw new Error('Database Error: Failed to Delete Portfolio Item.');
    }
}

export async function updateSettings(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData);

    // We expect settings to be passed as key-value pairs
    // We iterate over keys and update/upsert them
    try {
        for (const [key, value] of Object.entries(rawData)) {
            if (key.startsWith('$Action')) continue; // Ignore internal Next.js form data

            await prisma.siteSetting.upsert({
                where: { key },
                update: { value: value as string },
                create: {
                    key,
                    value: value as string,
                    type: 'text', // Default type
                    group: 'general' // Default group
                }
            });
        }
    } catch (e) {
        return { message: 'Failed to update settings' };
    }

    revalidatePath('/');
    return { message: 'Settings updated successfully' };
}

export async function createOffer(prevState: any, formData: FormData) {
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const features = formData.get('features') as string;
    const duration = formData.get('duration') as string;
    const imageUrl = formData.get('imageUrl') as string;
    // We will assume questions are passed as a newline-separated string for simplicity in the basic form
    const questionsRaw = formData.get('questions') as string;

    let questionsJson = '[]';
    if (questionsRaw) {
        const questionsList = questionsRaw.split('\n').map(q => q.trim()).filter(q => q.length > 0);
        questionsJson = JSON.stringify(questionsList);
    }

    if (!category || !title || !description || !price) {
        return { message: 'Missing required fields' };
    }

    try {
        await prisma.offerServices.create({
            data: {
                category,
                title,
                description,
                price,
                features: features || '',
                duration,
                imageUrl,
                questions: questionsJson
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Create Offer.' };
    }

    revalidatePath('/oferta');
    revalidatePath('/admin/oferta');
    redirect('/admin/oferta');
}

export async function updateOffer(id: string, prevState: any, formData: FormData) {
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const features = formData.get('features') as string;
    const duration = formData.get('duration') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const questionsRaw = formData.get('questions') as string;

    let questionsJson = '[]';
    if (questionsRaw) {
        const questionsList = questionsRaw.split('\n').map(q => q.trim()).filter(q => q.length > 0);
        questionsJson = JSON.stringify(questionsList);
    }

    if (!title || !price) {
        return { message: 'Missing required fields' };
    }

    try {
        await prisma.offerServices.update({
            where: { id },
            data: {
                category,
                title,
                description,
                price,
                features: features || '',
                duration,
                imageUrl,
                questions: questionsJson
            }
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Update Offer.' };
    }

    revalidatePath('/oferta');
    revalidatePath('/admin/oferta');
    redirect('/admin/oferta');
}

export async function deleteOffer(id: string) {
    try {
        await prisma.offerServices.delete({
            where: { id }
        });
        revalidatePath('/oferta');
        revalidatePath('/admin/oferta');
    } catch (error) {
        throw new Error('Database Error: Failed to Delete Offer.');
    }
}

export async function createTrustedClient(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const logoUrl = formData.get('logoUrl') as string;

    if (!name || !logoUrl) {
        return { message: 'Missing required fields' };
    }

    try {
        await prisma.trustedClient.create({
            data: {
                name,
                logoUrl,
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Create Client.' };
    }

    revalidatePath('/o-mnie');
    revalidatePath('/admin/clients');
    redirect('/admin/clients');
}

export async function deleteTrustedClient(id: string) {
    try {
        await prisma.trustedClient.delete({
            where: { id }
        });
        revalidatePath('/o-mnie');
        revalidatePath('/admin/clients');
    } catch (error) {
        throw new Error('Database Error: Failed to Delete Client.');
    }
}

export async function createHeroSlide(prevState: any, formData: FormData) {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const buttonText = formData.get('buttonText') as string;
    const buttonLink = formData.get('buttonLink') as string;

    if (!title || !imageUrl) {
        return { message: 'Missing required fields' };
    }

    try {
        await prisma.heroSlide.create({
            data: {
                title,
                subtitle,
                imageUrl,
                buttonText,
                buttonLink,
                order: 0,
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Create Slide.' };
    }

    revalidatePath('/');
    redirect('/admin/hero');
}

export async function deleteHeroSlide(id: string) {
    try {
        await prisma.heroSlide.delete({
            where: { id }
        });
        revalidatePath('/');
        revalidatePath('/admin/hero');
    } catch (error) {
        throw new Error('Database Error: Failed to Delete Slide.');
    }
}



export async function createTestimonial(prevState: any, formData: FormData) {
    const author = formData.get('author') as string;
    const role = formData.get('role') as string;
    const content = formData.get('content') as string;

    if (!author || !content) {
        return { message: 'Missing required fields' };
    }

    try {
        await prisma.testimonial.create({
            data: {
                author,
                role,
                content,
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Create Testimonial.' };
    }

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    redirect('/admin/testimonials');
}

export async function deleteTestimonial(id: string) {
    try {
        await prisma.testimonial.delete({
            where: { id }
        });
        revalidatePath('/');
    } catch (error) {
        throw new Error('Database Error: Failed to Delete Testimonial.');
    }
}

export async function sendContactMessage(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { message: 'Proszę wypełnić wszystkie wymagane pola.' };
    }

    try {
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message,
            },
        });
        return { message: 'success: Wiadomość została wysłana! Odpowiemy najszybciej jak to możliwe.' };
    } catch (error) {
        console.error(error);
        return { message: 'error: Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.' };
    }
}

export async function deleteMessage(id: string) {
    try {
        await prisma.contactMessage.delete({ where: { id } });
        revalidatePath('/admin/messages');
    } catch (error) {
        throw new Error('Failed to delete message');
    }
}

export async function toggleMessageReadStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.contactMessage.update({
            where: { id },
            data: { isRead: !currentStatus }
        });
        revalidatePath('/admin/messages');
    } catch (error) {
        throw new Error('Failed to update message status');
    }
}

export async function createFAQ(prevState: any, formData: FormData) {
    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;

    if (!question || !answer) {
        return { message: 'Missing required fields' };
    }

    try {
        await prisma.fAQItem.create({
            data: {
                question,
                answer,
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Create FAQ.' };
    }

    revalidatePath('/oferta');
    revalidatePath('/admin/faq');
    redirect('/admin/faq');
}

export async function deleteFAQ(id: string) {
    try {
        await prisma.fAQItem.delete({ where: { id } });
        revalidatePath('/oferta');
        revalidatePath('/admin/faq');
    } catch (error) {
        throw new Error('Failed to delete FAQ');
    }
}
