import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full transform hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wrench className="text-primary w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Przerwa Techniczna</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Strona jest obecnie w trakcie aktualizacji.
                    <br />
                    Wracamy już za chwilę!
                </p>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full opacity-50"></div>
            </div>
        </div>
    );
}
