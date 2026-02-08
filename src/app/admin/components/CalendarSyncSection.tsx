
'use client';

import { useState } from 'react';
import { Calendar, Copy, Check, ExternalLink } from 'lucide-react';

export default function CalendarSyncSection({ feedUrl }: { feedUrl: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(feedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <Calendar size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-dark">Synchronizacja z kalendarzem</h3>
                    <p className="text-gray-500 text-sm">Automatycznie wyświetlaj rezerwacje w Google Calendar, iCloud lub Outlook.</p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Twój unikalny link do subskrypcji (iCal)</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        readOnly
                        value={feedUrl}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-600 focus:outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-6 py-3 bg-dark text-white rounded-xl hover:bg-primary transition-all text-sm font-bold shadow-lg"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'Skopiowano' : 'Kopiuj'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h4 className="font-bold text-dark text-sm">Jak dodać do Google Calendar?</h4>
                    <ol className="text-sm text-gray-600 space-y-2 list-decimal ml-4">
                        <li>Otwórz Google Calendar na komputerze.</li>
                        <li>Kliknij „+” przy „Inne kalendarze”.</li>
                        <li>Wybierz „Z adresu URL”.</li>
                        <li>Wklej skopiowany wyżej link.</li>
                    </ol>
                </div>
                <div className="space-y-3">
                    <h4 className="font-bold text-dark text-sm">Jak dodać do iPhone / Mac?</h4>
                    <ol className="text-sm text-gray-600 space-y-2 list-decimal ml-4">
                        <li>Otwórz aplikację Kalendarz.</li>
                        <li>Wybierz Plik {'>'} Nowa subskrypcja kalendarza.</li>
                        <li>Wklej skopiowany wyżej link.</li>
                        <li>Ustaw odświeżanie na „Co godzinę”.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
