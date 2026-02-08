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

    // Allow access to admin panel and API routes even in maintenance mode
    const isAdminPath = pathname?.startsWith('/admin');
    const isApiPath = pathname?.startsWith('/api');

    // Show maintenance page only if:
    // - maintenance mode is enabled
    // - user is NOT an admin
    // - current path is NOT admin or API
    if (isMaintenance && !isAdmin && !isAdminPath && !isApiPath) {
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
