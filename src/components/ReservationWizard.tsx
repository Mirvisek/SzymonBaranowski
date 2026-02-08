'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Calendar, Clock, CreditCard, User, MessageSquare } from 'lucide-react';
import { verifyDiscountCode, submitReservation } from '@/app/lib/reservation-actions';
import Image from 'next/image';

type Offer = {
    id: string;
    title: string;
    price: string; // "500 PLN"
    duration: string | null;
    imageUrl: string | null;
    questions: string | null; // JSON string
};

export default function ReservationWizard({ offers }: { offers: Offer[] }) {
    const [step, setStep] = useState(1);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [date, setDate] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [hasDiscount, setHasDiscount] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountData, setDiscountData] = useState<{ type: string; value: number; id: string } | null>(null);
    const [discountMessage, setDiscountMessage] = useState('');
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const questions = selectedOffer?.questions ? JSON.parse(selectedOffer.questions) : [];

    const handleNext = () => {
        if (step === 1 && (!selectedOffer || !date)) return;
        if (step === 2 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone)) return;
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const checkDiscount = async () => {
        if (!discountCode) return;
        const result = await verifyDiscountCode(discountCode);
        if (result.valid) {
            setDiscountData({ type: result.type!, value: result.value!, id: result.id! });
            setDiscountMessage('Kod zastosowany!');
        } else {
            setDiscountData(null);
            setDiscountMessage(result.message || 'Błąd kodu');
        }
    };

    const calculateTotal = () => {
        if (!selectedOffer) return '0 PLN';
        let price = parseInt(selectedOffer.price.replace(/\D/g, '')) || 0;

        if (discountData) {
            if (discountData.type === 'percent') {
                price = price - (price * discountData.value / 100);
            } else if (discountData.type === 'amount') {
                price = price - discountData.value;
            }
        }

        return Math.max(0, price) + ' PLN';
    };

    const handleSubmit = async () => {
        if (!selectedOffer || !acceptedTerms) return;
        setIsSubmitting(true);

        const result = await submitReservation({
            offerId: selectedOffer.id,
            date: new Date(date),
            clientName: `${formData.firstName} ${formData.lastName}`,
            clientEmail: formData.email,
            clientPhone: formData.phone,
            answers,
            discountCodeId: discountData?.id,
            finalPrice: calculateTotal()
        });

        setIsSubmitting(false);
        if (result.success) {
            setIsSuccess(true);
        } else {
            alert(result.message);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20 px-4">
                <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Check className="text-green-600 w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-dark mb-4">Rezerwacja przyjęta!</h2>
                <p className="text-gray-600 mb-8">Dziękujemy za rezerwację. Na Twój adres email ({formData.email}) wysłaliśmy potwierdzenie wraz ze szczegółami.</p>
                <button onClick={() => window.location.href = '/'} className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Wróć na stronę główną
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Progress Bar */}
            <div className="bg-gray-50 py-4 px-8 border-b border-gray-100">
                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                    <div className={`flex items-center ${step >= 1 ? 'text-primary' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
                        Oferta
                    </div>
                    <div className="h-px bg-gray-200 flex-1 mx-4"></div>
                    <div className={`flex items-center ${step >= 2 ? 'text-primary' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
                        Dane
                    </div>
                    <div className="h-px bg-gray-200 flex-1 mx-4"></div>
                    <div className={`flex items-center ${step >= 3 ? 'text-primary' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
                        Szczegóły
                    </div>
                    <div className="h-px bg-gray-200 flex-1 mx-4"></div>
                    <div className={`flex items-center ${step >= 4 ? 'text-primary' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 4 ? 'bg-primary text-white' : 'bg-gray-200'}`}>4</div>
                        Finalizacja
                    </div>
                </div>
            </div>

            <div className="p-8">
                <AnimatePresence mode="wait">
                    {/* STEP 1: CHOICE */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Wybierz usługę i termin</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {offers.map((offer) => (
                                    <div
                                        key={offer.id}
                                        onClick={() => setSelectedOffer(offer)}
                                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${selectedOffer?.id === offer.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}
                                    >
                                        <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                                            {offer.imageUrl ? (
                                                <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300">Brak zdjęcia</div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-dark">{offer.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{offer.duration || 'Czas trwania nieznany'}</p>
                                        <p className="font-bold text-primary">{offer.price}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-8">
                                <label className="block font-medium text-gray-700 mb-2">Data i godzina sesji</label>
                                <input
                                    type="datetime-local"
                                    className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleNext}
                                    disabled={!selectedOffer || !date}
                                    className="bg-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    Dalej <ChevronRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DATA */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Twoje dane</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={hasDiscount}
                                        onChange={(e) => {
                                            setHasDiscount(e.target.checked);
                                            if (!e.target.checked) {
                                                setDiscountCode('');
                                                setDiscountData(null);
                                                setDiscountMessage('');
                                            }
                                        }}
                                        className="rounded text-primary focus:ring-primary"
                                    />
                                    <span className="text-gray-700 font-medium">Mam kod rabatowy</span>
                                </label>
                                {hasDiscount && (
                                    <div className="mt-3 flex items-start gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Wpisz kod"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                value={discountCode}
                                                onChange={(e) => setDiscountCode(e.target.value)}
                                            />
                                            {discountMessage && <p className={`text-sm mt-1 ${discountData ? 'text-green-600' : 'text-red-500'}`}>{discountMessage}</p>}
                                        </div>
                                        <button
                                            onClick={checkDiscount}
                                            type="button"
                                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                                        >
                                            Sprawdź
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <button onClick={handleBack} className="text-gray-500 hover:text-dark px-4 py-2 flex items-center">
                                    <ChevronLeft size={20} className="mr-2" /> Wróć
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                                    className="bg-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition-colors disabled:opacity-50 flex items-center"
                                >
                                    Dalej <ChevronRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: QUESTIONS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Pytania do zamówienia</h2>
                            <div className="space-y-6 mb-8">
                                {questions.length > 0 ? questions.map((q: string, i: number) => (
                                    <div key={i}>
                                        <label className="block font-medium text-gray-700 mb-2">{q}</label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                                            value={answers[q] || ''}
                                            onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
                                        ></textarea>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 italic">Brak dodatkowych pytań dla tej usługi.</p>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <button onClick={handleBack} className="text-gray-500 hover:text-dark px-4 py-2 flex items-center">
                                    <ChevronLeft size={20} className="mr-2" /> Wróć
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="bg-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition-colors flex items-center"
                                >
                                    Dalej <ChevronRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: SUMMARY */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Podsumowanie</h2>

                            <div className="bg-gray-50 p-6 rounded-xl mb-8 space-y-4">
                                <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-dark">{selectedOffer?.title}</h3>
                                        <p className="text-gray-500 text-sm">{selectedOffer?.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 line-through text-sm">{discountData ? selectedOffer?.price : ''}</p>
                                        <p className="text-xl font-bold text-primary">{calculateTotal()}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Data:</p>
                                        <p className="font-medium">{new Date(date).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Klient:</p>
                                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                                        <p className="text-gray-500">{formData.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-8 text-sm">
                                <p>Wyślę do Ciebie maila o potwierdzeniu terminu sesji. Proszę oczekiwać na kontakt.</p>
                            </div>

                            <div className="mb-8">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="mt-1 rounded text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Akceptuję regulamin usługi <span className="font-semibold">{selectedOffer?.title}</span> oraz politykę prywatności.
                                    </span>
                                </label>
                            </div>

                            <div className="flex justify-between">
                                <button onClick={handleBack} className="text-gray-500 hover:text-dark px-4 py-2 flex items-center">
                                    <ChevronLeft size={20} className="mr-2" /> Wróć
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!acceptedTerms || isSubmitting}
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? 'Przetwarzanie...' : 'Zarezerwuj termin'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
