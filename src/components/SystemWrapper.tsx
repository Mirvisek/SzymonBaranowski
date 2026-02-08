'use client';

import { usePathname } from 'next/navigation';
import MaintenancePage from './MaintenancePage';
import CookieConsent from './CookieConsent';
import AccessibilityWidget from './AccessibilityWidget';

export default function SystemWrapper({
    children,
    settings,
    isAdmin
}: {
    children: React.ReactNode,
    settings: Record<string, string>,
    isAdmin: boolean
}) {
    const pathname = usePathname();
    const isMaintenance = settings.maintenance_mode === 'true';
    // Allow access to login page and API routes even in maintenance mode
    const isAllowedPath = pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname === '/login';

    if (isMaintenance && !isAdmin && !isAllowedPath) {
        return <MaintenancePage />;
    }

    return (
        <>
            {children}
            {settings.cookie_banner === 'true' && (
                <CookieConsent content={settings.policy_cookies_content} />
            )}
            {settings.accessibility_widget === 'true' && (
                <AccessibilityWidget />
            )}
        </>
    );
}
