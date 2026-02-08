import NavbarClient from './NavbarClient';
import { getSettings } from '@/app/lib/data';

export default async function Navbar() {
    const settings = await getSettings();

    return (
        <NavbarClient
            brandName={settings.navbar_brand_name || 'Szymon'}
            logoUrl={settings.navbar_logo_url || ''}
        />
    );
}
