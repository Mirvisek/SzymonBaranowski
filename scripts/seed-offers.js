const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seedowanie ofert i kodów rabatowych...');

    const offers = [
        {
            category: 'fotografia',
            title: 'Sesja Portretowa Standard',
            description: 'Profesjonalna sesja zdjęciowa w plenerze lub studiu. 10 obrobionych zdjęć.',
            price: '500 PLN',
            features: '1h sesji, 10 zdjęć, studio lub plener',
            duration: '1 godzina',
            imageUrl: 'https://placehold.co/600x400?text=Sesja+Portretowa',
            questions: JSON.stringify([
                'Czy masz preferowane miejsce sesji?',
                'Jaki jest cel sesji (wizerunkowa, prywatna)?'
            ])
        },
        {
            category: 'fotografia',
            title: 'Sesja Portretowa Premium',
            description: 'Rozbudowana sesja z wizażystką i stylizacją. 25 obrobionych zdjęć.',
            price: '1200 PLN',
            features: '3h sesji, 25 zdjęć, wizażystka, stylizacja',
            duration: '3 godziny',
            imageUrl: 'https://placehold.co/600x400?text=Sesja+Premium',
            questions: JSON.stringify([
                'Czy potrzebujesz wizażystki?',
                'Jaki styl zdjęć cię interesuje?'
            ])
        },
        {
            category: 'grafika',
            title: 'Projekt Logo Standard',
            description: 'Projekt logotypu z księgą znaku.',
            price: '800 PLN',
            features: '3 propozycje, księga znaku, pliki wektorowe',
            duration: '7 dni',
            imageUrl: 'https://placehold.co/600x400?text=Logo+Standard',
            questions: JSON.stringify([
                'Jaka jest nazwa firmy?',
                'Jaka jest branża?'
            ])
        }
    ];

    for (const offer of offers) {
        // Simple way to avoid duplicates, though strict de-dupe logic might be better
        const existing = await prisma.offerServices.findFirst({
            where: { title: offer.title }
        });

        if (!existing) {
            await prisma.offerServices.create({
                data: offer
            });
            console.log(`✓ Dodano ofertę: ${offer.title}`);
        }
    }

    // Seed Discount Code
    try {
        await prisma.discountCode.upsert({
            where: { code: 'START10' },
            update: {},
            create: {
                code: 'START10',
                type: 'percent',
                value: 10,
                isActive: true
            }
        });
        console.log('✓ Dodano kod rabatowy: START10 (10%)');
    } catch (e) {
        // Ignore if exists
    }

    console.log('\nSeedowanie ofert zakończone!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
