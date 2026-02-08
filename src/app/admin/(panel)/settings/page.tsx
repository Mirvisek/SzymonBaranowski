
import { getSettings } from '@/app/lib/data';
import SettingsForm from '../../components/SettingsForm';

// We force dynamic rendering to fetch fresh settings
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div>
            <SettingsForm settings={settings} />
        </div>
    );
}
