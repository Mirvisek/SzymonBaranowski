
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({
    items = []
}: {
    items?: { label: string, href?: string }[]
}) {
    const pathname = usePathname();

    // Default breadcrumb logic based on path if no items provided
    const generateBreadcrumbs = () => {
        const segments = pathname.split('/').filter(p => p);
        let currentPath = '';

        const crumbs = segments.map((segment, index) => {
            currentPath += `/${segment}`;

            // Format label: "o-mnie" -> "O Mnie"
            let label = segment.replace(/-/g, ' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);

            return {
                label,
                href: index === segments.length - 1 ? undefined : currentPath // Last item has no link
            };
        });

        return crumbs;
    };

    const breadcrumbs = items.length > 0 ? items : generateBreadcrumbs();

    if (pathname === '/') return null;

    return (
        <nav aria-label="Breadcrumb" className="py-4 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="hover:text-primary transition-colors flex items-center">
                        <Home size={16} />
                    </Link>
                </li>
                {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight size={14} className="text-gray-400" />
                        {crumb.href ? (
                            <Link href={crumb.href} className="hover:text-primary transition-colors font-medium">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 font-semibold">{crumb.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
