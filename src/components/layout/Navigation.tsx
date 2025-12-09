import React from 'react';
import Link from 'next/link';

export interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
    badge?: string | number;
    active?: boolean;
    permission?: string;
}

interface NavigationProps {
    items: NavItem[];
    direction?: 'horizontal' | 'vertical';
    className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
    items,
    direction = 'horizontal',
    className = '',
}) => {
    const isHorizontal = direction === 'horizontal';

    return (
        <nav className={`bg-white ${isHorizontal ? 'border-b border-gray-200 shadow-sm' : ''} ${className}`.trim()} role="navigation" aria-label="Main navigation">
            <div className={`${isHorizontal ? 'flex overflow-x-auto' : 'flex flex-col space-y-1'}`}>
                {items.map((item) => (
                    <NavLink key={item.href} item={item} direction={direction} />
                ))}
            </div>
        </nav>
    );
};

interface NavLinkProps {
    item: NavItem;
    direction: 'horizontal' | 'vertical';
}

const NavLink: React.FC<NavLinkProps> = ({ item, direction }) => {
    const isHorizontal = direction === 'horizontal';
    const baseStyles = `
        ${isHorizontal ? 'px-6 py-4 border-b-2' : 'px-4 py-3 rounded-lg'}
        flex items-center gap-3 transition-all duration-200 font-medium
        relative
    `;

    const activeStyles = item.active
        ? isHorizontal
            ? 'border-primary-600 text-primary-600 font-semibold bg-primary-50/50'
            : 'bg-primary-50 text-primary-600 font-semibold'
        : isHorizontal
            ? 'border-transparent text-gray-600 hover:text-primary-600 hover:bg-gray-50'
            : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600';

    return (
        <Link 
            href={item.href} 
            className={`${baseStyles} ${activeStyles}`.trim()}
            aria-current={item.active ? 'page' : undefined}
        >
            {item.icon && <span className="text-lg flex-shrink-0">{item.icon}</span>}
            <span className="whitespace-nowrap">{item.label}</span>
            {item.badge && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                    {item.badge}
                </span>
            )}
        </Link>
    );
};
