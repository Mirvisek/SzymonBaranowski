
'use client';

import { updateSettings } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import { ChevronDown, Save, Globe, User, Share2, FileText, Code, Layout } from 'lucide-react';

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
    const [state, formAction] = useActionState(updateSettings, null);
    const [activeTab, setActiveTab] = useState('general');

    // Local state for specialized inputs
    const [aboutContent, setAboutContent] = useState(settings.about_content || '');
    const [aboutImage, setAboutImage] = useState(settings.about_image || '');
    const [privacyContent, setPrivacyContent] = useState(settings.policy_privacy_content || '');
    const [cookiesContent, setCookiesContent] = useState(settings.policy_cookies_content || '');

    const InputGroup = ({ label, name, defaultValue, type = "text", rows }: { label: string, name: string, defaultValue?: string, type?: string, rows?: number }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {rows ? (
                <textarea
                    name={name}
                    rows={rows}
                    defaultValue={defaultValue}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y bg-gray-50 focus:bg-white"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                />
            )}
        </div>
    );

    const tabs = [
        { id: 'general', label: 'SEO & Główne', icon: Globe },
        { id: 'about', label: 'O Mnie', icon: User },
        { id: 'files', label: 'Opisy Usług', icon: Layout },
        { id: 'contact', label: 'Dane & Social', icon: Share2 },
        { id: 'legal', label: 'Prawne', icon: FileText },
        { id: 'advanced', label: 'Zaawansowane', icon: Code },
    ];

    return (
        <form action={formAction} className="pb-24">
            {state?.message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-fade-in ${state.message.includes('success') ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'}`}>
                    {state.message.includes('success') ? '✅' : '❌'} {state.message}
                </div>
            )}

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Ustawienia</h1>
                <p className="text-gray-500">Konfiguracja strony</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Navigation Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-2 sticky top-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${activeTab === tab.id ? 'bg-white text-primary shadow-sm ring-1 ring-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-dark text-white px-4 py-3 rounded-xl shadow-lg hover:bg-primary transition-all font-bold"
                        >
                            <Save size={18} />
                            Zapisz
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">

                    {/* 1. Główne & SEO */}
                    <div className={activeTab === 'general' ? 'block animate-fade-in' : 'hidden'}>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Globe className="text-primary" size={24} /> Główne & SEO
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            {/* System Functions */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Code size={20} className="text-primary" /> Funkcje Systemowe
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Maintenance Mode */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-medium text-gray-700">Tryb Serwisowy</label>
                                        <div className="flex items-center gap-3">
                                            <input type="hidden" name="maintenance_mode" value="false" />
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="maintenance_mode"
                                                    value="true"
                                                    defaultChecked={settings.maintenance_mode === 'true'}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-600">Włączony</span>
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">Gdy włączony, strona publiczna wyświetla komunikat o pracach technicznych.</p>
                                    </div>

                                    {/* Accessibility */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-medium text-gray-700">Widget Dostępności (WCAG)</label>
                                        <div className="flex items-center gap-3">
                                            <input type="hidden" name="accessibility_widget" value="false" />
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="accessibility_widget"
                                                    value="true"
                                                    defaultChecked={settings.accessibility_widget === 'true'}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-600">Pokaż widget</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cookie Banner */}
                                    <div className="flex flex-col gap-2">
                                        <label className="font-medium text-gray-700">Banner Cookies</label>
                                        <div className="flex items-center gap-3">
                                            <input type="hidden" name="cookie_banner" value="false" />
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="cookie_banner"
                                                    value="true"
                                                    defaultChecked={settings.cookie_banner === 'true'}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-600">Pokaż banner</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-primary/5 rounded-xl border border-primary/10">
                                <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wide">STRONA GŁÓWNA</h3>
                                <div className="space-y-4">
                                    <InputGroup label="Tytuł (Meta Title)" name="site_title" defaultValue={settings.site_title} />
                                    <InputGroup label="Opis (Meta Description)" name="site_description" rows={3} defaultValue={settings.site_description} />
                                    <InputGroup label="Słowa kluczowe" name="site_keywords" defaultValue={settings.site_keywords} />
                                </div>
                            </div>

                            <InputGroup label="Pełny Adres URL" name="site_url" defaultValue={settings.site_url} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wide">Podstrona: Oferta</div>
                                    <InputGroup label="Meta Title" name="seo_offer_title" defaultValue={settings.seo_offer_title} />
                                    <InputGroup label="Meta Description" name="seo_offer_desc" rows={2} defaultValue={settings.seo_offer_desc} />
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wide">Podstrona: Portfolio</div>
                                    <InputGroup label="Meta Title" name="seo_portfolio_title" defaultValue={settings.seo_portfolio_title} />
                                    <InputGroup label="Meta Description" name="seo_portfolio_desc" rows={2} defaultValue={settings.seo_portfolio_desc} />
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wide">Podstrona: Kontakt</div>
                                    <InputGroup label="Meta Title" name="seo_contact_title" defaultValue={settings.seo_contact_title} />
                                    <InputGroup label="Meta Description" name="seo_contact_desc" rows={2} defaultValue={settings.seo_contact_desc} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. O Mnie */}
                    <div className={activeTab === 'about' ? 'block animate-fade-in' : 'hidden'}>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <User className="text-primary" size={24} /> Sekcja O Mnie
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-bold text-gray-900 mb-4">Strona Główna</h3>
                                <InputGroup label="Nagłówek" name="home_about_heading" defaultValue={settings.home_about_heading || 'Tworzę wizerunek, który działa.'} />
                                <InputGroup label="Krótki tekst" name="home_about_text" rows={3} defaultValue={settings.home_about_text} />
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Podstrona "O Mnie"</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Zdjęcie Profilowe</label>
                                        <ImageUploader value={aboutImage} onUpload={setAboutImage} />
                                        <input type="hidden" name="about_image" value={aboutImage} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pełna biografia</label>
                                        <RichTextEditor value={aboutContent} onChange={setAboutContent} />
                                        <input type="hidden" name="about_content" value={aboutContent} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Opisy Usług */}
                    <div className={activeTab === 'files' ? 'block animate-fade-in' : 'hidden'}>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Layout className="text-primary" size={24} /> Opisy Usług (Home)
                        </h2>
                        <div className="space-y-6">
                            <InputGroup label="Fotografia - Opis" name="service_fotografia_desc" rows={4} defaultValue={settings.service_fotografia_desc} />
                            <InputGroup label="Grafika - Opis" name="service_grafika_desc" rows={4} defaultValue={settings.service_grafika_desc} />
                            <InputGroup label="Marketing - Opis" name="service_marketing_desc" rows={4} defaultValue={settings.service_marketing_desc} />
                        </div>
                    </div>

                    {/* 4. Contact & Socials */}
                    <div className={activeTab === 'contact' ? 'block animate-fade-in' : 'hidden'}>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Share2 className="text-primary" size={24} /> Dane Kontaktowe & Social Media
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <InputGroup label="Email" name="email_address" defaultValue={settings.email_address} />
                            <InputGroup label="Telefon" name="phone_number" defaultValue={settings.phone_number} />
                            <div className="md:col-span-2">
                                <InputGroup label="Adres" name="address" defaultValue={settings.address} />
                            </div>
                            <div className="md:col-span-2">
                                <InputGroup label="Tekst w stopce" name="footer_copyright" defaultValue={settings.footer_copyright} />
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-4 pt-6 border-t border-gray-100">Social Media (Linki)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Facebook" name="social_facebook" defaultValue={settings.social_facebook} />
                            <InputGroup label="Instagram" name="social_instagram" defaultValue={settings.social_instagram} />
                            <InputGroup label="TikTok" name="social_tiktok" defaultValue={settings.social_tiktok} />
                        </div>
                    </div>

                    {/* 5. Legal */}
                    <div className={activeTab === 'legal' ? 'block animate-fade-in' : 'hidden'}>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <FileText className="text-primary" size={24} /> Dokumenty Prawne
                        </h2>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Polityka Prywatności</label>
                                <RichTextEditor value={privacyContent} onChange={setPrivacyContent} />
                                <input type="hidden" name="policy_privacy_content" value={privacyContent} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Polityka Cookies</label>
                                <RichTextEditor value={cookiesContent} onChange={setCookiesContent} />
                                <input type="hidden" name="policy_cookies_content" value={cookiesContent} />
                            </div>
                        </div>
                    </div>

                    {/* 6. Advanced */}
                    <div className={activeTab === 'advanced' ? 'block animate-fade-in' : 'hidden'}>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Code className="text-primary" size={24} /> Zaawansowane
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    📊 Google Analytics
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Śledź ruch na swojej stronie za pomocą Google Analytics. Wprowadź swój identyfikator śledzenia (Measurement ID).
                                </p>
                                <InputGroup
                                    label="Measurement ID"
                                    name="google_analytics_id"
                                    defaultValue={settings.google_analytics_id}
                                />
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
                                    <p className="font-medium mb-1">💡 Wskazówka:</p>
                                    <p>Twój Measurement ID wygląda tak: <code className="bg-blue-100 px-2 py-0.5 rounded">G-XXXXXXXXXX</code></p>
                                    <p className="mt-1">Znajdziesz go w panelu Google Analytics → Admin → Data Streams</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Hidden inputs to preserve state across tabs if needed, though they are inside regions that are just hidden with CSS display:none, so they submit fine */}
        </form>
    );
}
