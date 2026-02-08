import { getPortfolioCategories } from '@/app/lib/data';
import CreatePortfolioItemClient from '@/app/admin/(panel)/portfolio/create/CreatePortfolioItemClient';

export default async function Page() {
    const categoriesPromise = getPortfolioCategories();

    return <CreatePortfolioItemClient categoriesPromise={categoriesPromise} />;
}
