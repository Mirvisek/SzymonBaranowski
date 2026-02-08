'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Akcje zmiany kolejności kategorii
export async function movePortfolioCategoryUp(id: string) {
    'use server';
    try {
        const category = await prisma.portfolioCategory.findUnique({ where: { id } });
        if (!category) return;

        const previousCategory = await prisma.portfolioCategory.findFirst({
            where: { order: { lt: category.order } },
            orderBy: { order: 'desc' }
        });

        if (previousCategory) {
            // Swap orders
            await prisma.$transaction([
                prisma.portfolioCategory.update({
                    where: { id: category.id },
                    data: { order: previousCategory.order }
                }),
                prisma.portfolioCategory.update({
                    where: { id: previousCategory.id },
                    data: { order: category.order }
                })
            ]);
        }

        revalidatePath('/portfolio');
        revalidatePath('/admin/categories');
    } catch (e) {
        console.error('Error moving category:', e);
    }
}

export async function movePortfolioCategoryDown(id: string) {
    'use server';
    try {
        const category = await prisma.portfolioCategory.findUnique({ where: { id } });
        if (!category) return;

        const nextCategory = await prisma.portfolioCategory.findFirst({
            where: { order: { gt: category.order } },
            orderBy: { order: 'asc' }
        });

        if (nextCategory) {
            // Swap orders
            await prisma.$transaction([
                prisma.portfolioCategory.update({
                    where: { id: category.id },
                    data: { order: nextCategory.order }
                }),
                prisma.portfolioCategory.update({
                    where: { id: nextCategory.id },
                    data: { order: category.order }
                })
            ]);
        }

        revalidatePath('/portfolio');
        revalidatePath('/admin/categories');
    } catch (e) {
        console.error('Error moving category:', e);
    }
}

// Akcje zmiany kolejności zdjęć
export async function movePortfolioItemUp(id: string) {
    'use server';
    try {
        const item = await prisma.portfolioItem.findUnique({ where: { id } });
        if (!item) return;

        const previousItem = await prisma.portfolioItem.findFirst({
            where: {
                categoryId: item.categoryId,
                order: { lt: item.order }
            },
            orderBy: { order: 'desc' }
        });

        if (previousItem) {
            await prisma.$transaction([
                prisma.portfolioItem.update({
                    where: { id: item.id },
                    data: { order: previousItem.order }
                }),
                prisma.portfolioItem.update({
                    where: { id: previousItem.id },
                    data: { order: item.order }
                })
            ]);
        }

        revalidatePath('/portfolio');
        revalidatePath('/admin/portfolio');
    } catch (e) {
        console.error('Error moving item:', e);
    }
}

export async function movePortfolioItemDown(id: string) {
    'use server';
    try {
        const item = await prisma.portfolioItem.findUnique({ where: { id } });
        if (!item) return;

        const nextItem = await prisma.portfolioItem.findFirst({
            where: {
                categoryId: item.categoryId,
                order: { gt: item.order }
            },
            orderBy: { order: 'asc' }
        });

        if (nextItem) {
            await prisma.$transaction([
                prisma.portfolioItem.update({
                    where: { id: item.id },
                    data: { order: nextItem.order }
                }),
                prisma.portfolioItem.update({
                    where: { id: nextItem.id },
                    data: { order: item.order }
                })
            ]);
        }

        revalidatePath('/portfolio');
        revalidatePath('/admin/portfolio');
    } catch (e) {
        console.error('Error moving item:', e);
    }
}

// Akcja edycji kategorii
export async function updatePortfolioCategory(prevState: any, formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!id || !name) return { message: 'Missing required fields' };

    // Lepszy slug generator (obsługa polskich znaków)
    const slugify = (text: string) => {
        const charMap: { [key: string]: string } = {
            'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
            'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n', 'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
        };
        return text.split('').map(char => charMap[char] || char).join('')
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    const slug = slugify(name);

    try {
        await prisma.portfolioCategory.update({
            where: { id },
            data: { name, slug, imageUrl }
        });
    } catch (error: any) {
        console.error('Update category error:', error);
        return { message: `Błąd podczas aktualizacji: ${error instanceof Error ? error.message : 'Nieznany błąd'}` };
    }

    revalidatePath('/portfolio');
    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}
