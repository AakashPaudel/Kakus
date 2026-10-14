import { usePage, Link } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    FolderGit2,
    LayoutGrid,
    ShoppingBag,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { dashboard } from '@/routes';
import { dashboardNavigation } from '@/config/dashboard-navigation';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const iconMap = {
    Dashboard: LayoutGrid,
    Orders: ShoppingBag,
    Reservations: CalendarDays,
    'My Orders': ShoppingBag,
    'My Reservations': CalendarDays,
};

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth: {
            user: {
                role?: string;
            } | null;
        };
    };

    const role = auth?.user?.role ?? 'customer';

    const navigationItems =
        dashboardNavigation[role as keyof typeof dashboardNavigation] ??
        dashboardNavigation.customer;

    const mainNavItems: NavItem[] = navigationItems.map((item) => ({
        ...item,
        icon: iconMap[item.title as keyof typeof iconMap] ?? LayoutGrid,
    }));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter
                    items={footerNavItems}
                    className="mt-auto"
                />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}