
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Simple security: check against ENV variable or hardcoded for now 
    // In production, this should be a per-user secret from DB
    if (!token || token !== process.env.CALENDAR_FEED_TOKEN) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                status: {
                    in: ['confirmed', 'pending']
                },
                date: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // Last month onwards
                }
            },
            include: {
                offer: true
            }
        }) as any[];

        let ical = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Szymon Baranowski//NONSGML Calendar//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:Rezerwacje - Szymon Baranowski',
            'X-WR-TIMEZONE:Europe/Warsaw'
        ];

        reservations.forEach(res => {
            const start = new Date(res.date);
            // Default duration 1h if not specified
            const durationMinutes = res.offer.duration ? parseInt(res.offer.duration) : 60;
            const end = new Date(start.getTime() + durationMinutes * 60000);

            const formatIcalDate = (date: Date) => {
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };

            const uid = `${res.id}@szymonbaranowski.pl`;
            const summary = `[Rezerwacja] ${res.offer.title} - ${res.clientName}`;
            const description = `Klient: ${res.clientName}\\nEmail: ${res.clientEmail}\\nTelefon: ${res.clientPhone}\\nKod: ${res.code}\\nStrona: ${process.env.NEXTAUTH_URL}/rezerwacja/${res.code}`;

            ical.push('BEGIN:VEVENT');
            ical.push(`UID:${uid}`);
            ical.push(`DTSTAMP:${formatIcalDate(new Date())}`);
            ical.push(`DTSTART:${formatIcalDate(start)}`);
            ical.push(`DTEND:${formatIcalDate(end)}`);
            ical.push(`SUMMARY:${summary}`);
            ical.push(`DESCRIPTION:${description}`);
            ical.push(`STATUS:${res.status === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE'}`);
            ical.push('END:VEVENT');
        });

        ical.push('END:VCALENDAR');

        const response = new Response(ical.join('\r\n'), {
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': 'attachment; filename="reservations.ics"'
            }
        });

        return response;
    } catch (error) {
        return new Response('Internal Server Error', { status: 500 });
    }
}
