
'use client';

import { Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarButtonsProps {
    title: string;
    description: string;
    startDate: Date;
    durationMinutes: number;
    code: string;
}

export default function CalendarButtons({ title, description, startDate, durationMinutes, code }: CalendarButtonsProps) {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    const formatISOWithTime = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatISOWithTime(start)}/${formatISOWithTime(end)}&details=${encodeURIComponent(description)}&location=&sf=true&output=xml`;

    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${encodeURIComponent(description)}`;

    const generateIcal = () => {
        const icalContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${formatISOWithTime(start)}`,
            `DTEND:${formatISOWithTime(end)}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `rezerwacja-${code}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dodaj do kalendarza</p>
            <div className="flex flex-wrap gap-2">
                <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 shadow-sm"
                >
                    <Plus size={14} className="text-primary" /> Google
                </a>
                <a
                    href={outlookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 shadow-sm"
                >
                    <Plus size={14} className="text-primary" /> Outlook
                </a>
                <button
                    onClick={generateIcal}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-xs font-bold text-gray-700 shadow-sm"
                >
                    <Plus size={14} className="text-primary" /> Apple / iCloud
                </button>
            </div>
        </div>
    );
}
