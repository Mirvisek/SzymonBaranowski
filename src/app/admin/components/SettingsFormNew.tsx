'use client';

import { updateSettings } from '@/app/lib/actions';
import { useActionState, useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import AccountSettingsForm from './AccountSettingsForm';
import Toast from '@/components/Toast';
import {
    Save, Globe, User, Share2, FileText, Code, Layout,
    ShieldCheck, Settings as SettingsIcon, Eye, Mail,
    Image as ImageIcon, Palette
} from 'lucide-react';

export default function SettingsFormNew({ settings, currentUserEmail }: { settings: Record<string, string>, currentUserEmail: string }) {
    const [state, formAction] = useActionState(updateSettings, null);
    const [activeTab, setActiveTab] = useState('general');
    const [showToast, setShowToast] = useState(false);

    // Local state for specialized inputs
    const [aboutContent, setAboutContent] = useState(settings.about_content || '');
    const [aboutImage, setAboutImage] = useState(settings.about_image || '');
    const [privacyContent, setPrivacyContent] = useState(settings.policy_privacy_content || '');
    const [cookiesContent, setCookiesContent] = useState(settings.policy_cookies_content || '');
    const [navbarLogoUrl, setNavbarLogoUrl] = useState(settings.navbar_logo_url || '');

    // Show toast when state changes
    useEffect(() => {
        if (state?.message) {
            setShowToast(true);
        }
    }, [state]);

    // Reusable input component
    const InputGroup = ({ label, name, defaultValue, type = "text", rows, hint }: {
        label: string,
        name: string,
        defaultValue?: string,
        type?: string,
        rows?: number,
        hint?: string
    }) => (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            {rows ? (
                <textarea
                    name={name}
                    rows={rows}
                    defaultValue={defaultValue}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
            )}
            {hint && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
    );

    // Toggle switch component
    const ToggleSwitch = ({ label, name, defaultChecked, hint }: {
        label: string,
        name: string,
        defaultChecked: boolean,
        hint?: string
    }) => (
        <div className="space-y-2">
            <input type="hidden" name={name} value="false" />
            <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex-1">
                    <span className="font-semibold text-gray-700 text-sm">{label}</span>
                    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
                </div>
                <div className="relative">
                    <input
                        type="checkbox"
                        name={name}
                        value="true"
                        defaultChecked={defaultChecked}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
            </label>
        </div>
    );

    // Card component for grouping
    const Card = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                {Icon && <Icon size={20} className="text-primary" />}
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );

    const tabs = [
        { id: 'general', label: 'Ogólne', icon: SettingsIcon, desc: 'Podstawowa konfiguracja' },
        { id: 'branding', label: 'Wygląd', icon: Palette, desc: 'Logo, kolory, nawigacja' },
        { id: 'seo', label: 'SEO', icon: Globe, desc: 'Meta tagi, optymalizacja' },
        { id: 'about', label: 'O Mnie', icon: User, desc: 'Treści biograficzne' },
        { id: 'services', label: 'Usługi', icon: Layout, desc: 'Opisy oferty' },
        { id: 'contact', label: 'Kontakt', icon: Share2, desc: 'Dane i social media' },
        { id: 'legal', label: 'Prawne', icon: FileText, desc: 'Polityki i regulaminy' },
        { id: 'account', label: 'Konto', icon: ShieldCheck, desc: 'Ustawienia admina' },
    ];

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ustawienia Strony</h1>
                <p className="text-gray-600">Zarządzaj konfiguracją i wyglądem swojej witryny</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-4">
                        <div className="space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all text-left group ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-primary'} />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm">{tab.label}</div>
                                        <div className={`text-xs ${activeTab === tab.id ? 'text-white/80' : 'text-gray-500'}`}>
                                            {tab.desc}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Save Button */}
                        {activeTab !== 'account' && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    form="site-settings-form"
                                    className="w-full flex items-center justify-center gap-2 bg-dark text-white px-4 py-3 rounded-lg hover:bg-primary transition-all font-bold shadow-lg"
                                >
                                    <Save size={18} />
                                    Zapisz Zmiany
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'account' ? (
                        <AccountSettingsForm currentUserEmail={currentUserEmail} />
                    ) : (
                        <form id="site-settings-form" action={formAction}>

                            {/* OGÓLNE */}
                            {activeTab === 'general' && (
                                <div className="space-y-6 animate-fade-in">
                                    <Card title="Funkcje Systemowe" icon={Code}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ToggleSwitch
                                                label="Tryb Serwisowy"
                                                name="maintenance_mode"
                                                defaultChecked={settings.maintenance_mode === 'true'}
                                                hint="Wyświetla komunikat o pracach technicznych"
                                            />
                                            <ToggleSwitch
                                                label="Widget Dostępności (WCAG)"
                                                name="accessibility_widget"
                                                defaultChecked={settings.accessibility_widget === 'true'}
                                                hint="Opcje dla osób niepełnosprawnych"
                                            />
                                            <ToggleSwitch
                                                label="Banner Cookies"
                                                name="cookie_banner"
                                                defaultChecked={settings.cookie_banner === 'true'}
                                                hint="Zgoda na pliki cookie (RODO)"
                                            />
                                        </div>
                                    </Card>

                                    <Card title="Podstawowe Informacje">
                                        <InputGroup
                                            label="Adres URL Strony"
                                            name="site_url"
                                            defaultValue={settings.site_url}
                                            hint="Pełny adres Twojej witryny (np. https://example.com)"
                                        />
                                    </Card>
                                </div>
                            )}

                            {/* WYGLĄD */}
                            {activeTab === 'branding' && (
                                <div className="space-y-6 animate-fade-in">
                                    <Card title="Logo i Nazwa Marki" icon={Palette}>
                                        <InputGroup
                                            label="Nazwa marki w nawigacji"
                                            name="navbar_brand_name"
                                            defaultValue={settings.navbar_brand_name || 'Szymon'}
                                        />
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Logo w nawigacji (opcjonalnie)
                                            </label>
                                            <ImageUploader value={navbarLogoUrl} onUpload={setNavbarLogoUrl} />
                                            <input type="hidden" name="navbar_logo_url" value={navbarLogoUrl} />
                                            <p className="text-xs text-gray-500 mt-2">
                                                Rekomendowany rozmiar: 200x50px (proporcje 4:1)
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* SEO */}
                            {activeTab === 'seo' && (
                                <div className="space-y-6 animate-fade-in">
                                    <Card title="Strona Główna" icon={Globe}>
                                        <InputGroup label="Meta Title" name="site_title" defaultValue={settings.site_title} />
                                        <InputGroup label="Meta Description" name="site_description" rows={3} defaultValue={settings.site_description} />
                                        <InputGroup label="Słowa kluczowe" name="site_keywords" defaultValue={settings.site_keywords} />
                                    </Card>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card title="Podstrona: Oferta">
                                            <InputGroup label="Meta Title" name="seo_offer_title" defaultValue={settings.seo_offer_title} />
                                            <InputGroup label="Meta Description" name="seo_offer_desc" rows={2} defaultValue={settings.seo_offer_desc} />
                                        </Card>
                                        <Card title="Podstrona: Portfolio">
                                            <InputGroup label="Meta Title" name="seo_portfolio_title" defaultValue={settings.seo_portfolio_title} />
                                            <InputGroup label="Meta Description" name="seo_portfolio_desc" rows={2} defaultValue={settings.seo_portfolio_desc} />
                                        </Card>
                                        <Card title="Podstrona: Kontakt">
                                            <InputGroup label="Meta Title" name="seo_contact_title" defaultValue={settings.seo_contact_title} />
                                            <InputGroup label="Meta Description" name="seo_contact_desc" rows={2} defaultValue={settings.seo_contact_desc} />
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* O MNIE */}
                            {activeTab === 'about' && (
                                <div className="space-y-6 animate-fade-in">
                                    <Card title="Sekcja na Stronie Głównej">
                                        <InputGroup label="Nagłówek" name="home_about_heading" defaultValue={settings.home_about_heading} />
                                        <InputGroup label="Krótki tekst" name="home_about_text" rows={3} defaultValue={settings.home_about_text} />
                                    </Card>

                                    <Card title="Podstrona O Mnie">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Treść Główna</label>
                                            <RichTextEditor value={aboutContent} onChange={setAboutContent} />
                                            <input type="hidden" name="about_content" value={aboutContent} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Zdjęcie Profilowe</label>
                                            <ImageUploader value={aboutImage} onUpload={setAboutImage} />
                                            <input type="hidden" name="about_image" value={aboutImage} />
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* USŁUGI */}
                            {activeTab === 'services' && (
                                <div className="space-y-6 animate-fade-in">
                                    <Card title="Usługa: Fotografia" icon={ImageIcon}>
                                        <InputGroup label="Tytuł" name="service_photo_title" defaultValue={settings.service_photo_title} />
                                        <InputGroup label="Opis" name="service_photo_desc" rows={4} defaultValue={settings.service_photo_desc} />
                                    </Card>
                                    <Card title="Usługa: Grafika">
                                        <InputGroup label="Tytuł" name="service_graphics_title" defaultValue={settings.service_graphics_title} />
                                        <InputGroup label="Opis" name="service_graphics_desc" rows={4} defaultValue={settings.service_graphics_desc} />
                                    </Card>
                                    <Card title="Usługa: Marketing">
                                        <InputGroup label="Tytuł" name="service_marketing_title" defaultValue={settings.service_marketing_title} />
                                        <InputGroup label="Opis" name="service_marketing_desc" rows={4} defaultValue={settings.service_marketing_desc} />
                                    </Card>
                                </div>
                            )}

                            {/* KONTAKT */}
                            {activeTab === 'contact' && (
                                <div className="space-y-6 animate-fade-in">
                                    <Card title="Dane Kontaktowe" icon={Mail}>
                                        <InputGroup label="Email" name="email_address" type="email" defaultValue={settings.email_address} />
                                        <InputGroup label="Telefon" name="phone_number" defaultValue={settings.phone_number} />
                                        <InputGroup label="Adres" name="address" defaultValue={settings.address} />
                                        <InputGroup label="Tekst w stopce" name="footer_copyright" defaultValue={settings.footer_copyright} hint="Dodatkowy tekst w stopce (np. NIP)" />
                                    </Card>

                                    <Card title="Social Media">
                                        <InputGroup label="Facebook" name="social_facebook" defaultValue={settings.social_facebook} hint="Pełny link do profilu" />
                                        <InputGroup label="Instagram" name="social_instagram" defaultValue={settings.social_instagram} hint="Pełny link do profilu" />
                                        <InputGroup label="TikTok" name="social_tiktok" defaultValue={settings.social_tiktok} hint="Pełny link do profilu" />
                                    </Card>
                                </div>
                            )}

                            {/* PRAWNE */}
                            {activeTab === 'legal' && (
                                <div className="space-y-6 animate-fade-in">
                                    <Card title="Polityka Prywatności">
                                        <RichTextEditor value={privacyContent} onChange={setPrivacyContent} />
                                        <input type="hidden" name="policy_privacy_content" value={privacyContent} />
                                    </Card>

                                    <Card title="Polityka Cookies">
                                        <RichTextEditor value={cookiesContent} onChange={setCookiesContent} />
                                        <input type="hidden" name="policy_cookies_content" value={cookiesContent} />
                                    </Card>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && state?.message && (
                <Toast
                    message={state.message.replace('✅ ', '').replace('❌ ', '')}
                    type={state.message.includes('success') ? 'success' : 'error'}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
