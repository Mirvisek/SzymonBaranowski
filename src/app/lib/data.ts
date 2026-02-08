import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPortfolioItems(categoryId?: string) {
    try {
        const where = categoryId ? { categoryId } : {};
        const items = await prisma.portfolioItem.findMany({
            where,
            include: { category: true },
            orderBy: { order: 'asc' },
        });
        return items;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function getPortfolioCategories() {
    try {
        const categories = await prisma.portfolioCategory.findMany({
            orderBy: { order: 'asc' },
            include: { _count: { select: { items: true } } }
        });
        return categories;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function getPortfolioCategory(slug: string) {
    try {
        const category = await prisma.portfolioCategory.findUnique({
            where: { slug }
        });
        return category;
    } catch (error) {
        console.error('Database Error:', error);
        return null;
    }
}

export async function getOffers() {
    try {
        const items = await prisma.offerServices.findMany({
            orderBy: { category: 'asc' },
        });
        return items;
    } catch (error) {
        console.error('Database Error:', error);
    }
}

export async function getOfferById(id: string) {
    try {
        const item = await prisma.offerServices.findUnique({
            where: { id },
        });
        return item;
    } catch (error) {
        console.error('Database Error:', error);
        return null; // Return null instead of throwing for smoother handling
    }
}

export async function getSettings() {
    try {
        const settings = await prisma.siteSetting.findMany();
        return settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        return {};
    }
}

export async function getSiteSettings() {
    try {
        const settings = await prisma.siteSetting.findMany();
        // Convert array of objects to a single record object
        return settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        console.error('Database Error:', error);
        return {};
    }
}

export async function getHeroSlides() {
    try {
        const slides = await prisma.heroSlide.findMany({
            orderBy: { order: 'asc' },
        });
        return slides;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function getFAQs() {
    try {
        const faqs = await prisma.fAQItem.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return faqs;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}
