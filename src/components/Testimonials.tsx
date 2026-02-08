import prisma from '@/lib/prisma';
import TestimonialsClient from './TestimonialsClient';

export default async function Testimonials() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            author: true,
            content: true,
        }
    });

    // Jeśli nie ma opinii, nie pokazuj sekcji
    if (testimonials.length === 0) {
        return null;
    }

    return <TestimonialsClient testimonials={testimonials} />;
}
