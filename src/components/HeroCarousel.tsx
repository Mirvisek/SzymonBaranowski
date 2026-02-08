
import HeroCarouselClient from './HeroCarouselClient';
import { getHeroSlides } from '@/app/lib/data';

// Server Component fetching data
export default async function HeroCarousel() {
    const slidesFromDb = await getHeroSlides();

    // If DB is empty, fallback to default slides
    const slides = slidesFromDb.length > 0 ? slidesFromDb.map(s => ({
        id: s.id,
        image: s.imageUrl,
        title: s.title,
        text: s.subtitle || '',
        cta: s.buttonText || '',
        link: s.buttonLink || '',
    })) : [
        {
            id: '1',
            image: 'https://placehold.co/1920x1080/2d3309/ffffff?text=Fotografia',
            title: 'Uchwyć Piękno Chwili',
            text: 'Profesjonalne sesje zdjęciowe dla Ciebie i Twojej firmy.',
            cta: 'Zobacz Portfolio',
            link: '/portfolio',
        },
        {
            id: '2',
            image: 'https://placehold.co/1920x1080/5e641e/ffffff?text=Grafika',
            title: 'Twój Wizerunek',
            text: 'Spójna identyfikacja wizualna, która przyciąga klientów.',
            cta: 'Sprawdź Ofertę',
            link: '/oferta',
        },
        {
            id: '3',
            image: 'https://placehold.co/1920x1080/9b9f35/ffffff?text=Marketing',
            title: 'Skuteczny Marketing',
            text: 'Dotrzyj do szerszego grona odbiorców dzięki naszym strategiom.',
            cta: 'Skontaktuj się',
            link: '/kontakt',
        },
    ];

    return <HeroCarouselClient slides={slides} />;
}
