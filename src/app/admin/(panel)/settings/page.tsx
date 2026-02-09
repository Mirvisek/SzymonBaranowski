
import { getSettings } from '@/app/lib/data';
import SettingsFormNew from '../../components/SettingsFormNew';
import { auth } from '@/auth';

// We force dynamic rendering to fetch fresh settings
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const settings = await getSettings();
    const session = await auth();

    return (
        <div>
            <SettingsFormNew
                settings={settings}
                currentUserEmail={session?.user?.email || ''}
            />
        </div>
    );
}
