
import { getSettings } from '@/app/lib/data';
import SettingsForm from '../../components/SettingsForm';
import { auth } from '@/auth';

// We force dynamic rendering to fetch fresh settings
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const settings = await getSettings();
    const session = await auth();

    return (
        <div>
            <SettingsForm
                settings={settings}
                currentUserEmail={session?.user?.email || ''}
            />
        </div>
    );
}
