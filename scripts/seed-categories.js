const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seedowanie kategorii portfolio...');

    // Dodaj przykładowe kategorie
    const categories = [
        { name: 'Fotografia', slug: 'fotografia', imageUrl: 'https://placehold.co/800x600?text=Fotografia' },
        { name: 'Grafika', slug: 'grafika', imageUrl: 'https://placehold.co/800x600?text=Grafika' },
        { name: 'Marketing', slug: 'marketing', imageUrl: 'https://placehold.co/800x600?text=Marketing' },
    ];

    for (const cat of categories) {
        await prisma.portfolioCategory.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        console.log(`✓ Dodano kategorię: ${cat.name}`);
    }

    console.log('\nSeedowanie zakończone!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
