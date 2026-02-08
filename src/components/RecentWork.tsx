import { getPortfolioItems } from '@/app/lib/data';
import RecentWorkClient from './RecentWorkClient';

export default async function RecentWork() {
    const items = await getPortfolioItems();
    const recentItems = items.slice(0, 8); // Show last 8 images

    return <RecentWorkClient items={recentItems} />;
}
