'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Images, ShoppingBag, LogOut, Settings, BriefcaseBusiness, User, MessageSquare, FileQuestion, BarChart, Calendar } from 'lucide-react';
import { handleSignOut } from '@/app/lib/actions';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/analytics', icon: BarChart, label: 'Statystyki' },
        { href: '/admin/reservations', icon: Calendar, label: 'Rezerwacje' },
        { href: '/admin/portfolio', icon: Images, label: 'Portfolio' },
        { href: '/admin/oferta', icon: ShoppingBag, label: 'Oferta' },
        { href: '/admin/settings', icon: Settings, label: 'Ustawienia' },
        { href: '/admin/messages', icon: MessageSquare, label: 'Wiadomości' },
        { href: '/admin/faq', icon: FileQuestion, label: 'FAQ' },
        { href: '/admin/clients', icon: BriefcaseBusiness, label: 'Zaufali mi' },
        { href: '/admin/testimonials', icon: User, label: 'Opinie' },
        { href: '/admin/hero', icon: Images, label: 'Slider Hero' },
    ];

    return (
        <div className="w-72 bg-dark border-r border-white/5 min-h-screen flex flex-col p-6 shadow-2xl z-50">
            {/* Logo Area */}
            <div className="mb-12 flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                    S
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">Panel Admina</h2>
                    <p className="text-xs text-gray-400">by RiseGen.pl</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-4 border-primary shadow-inner'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon
                                size={22}
                                className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'group-hover:text-white'}`}
                            />
                            <span className="font-medium tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="mt-auto pt-8 border-t border-white/10">
                <form action={handleSignOut}>
                    <button
                        type="submit"
                        className="flex items-center space-x-3 px-4 py-3.5 w-full text-left rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-300 group"
                    >
                        <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Wyloguj</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
