import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import RestaurantLayout from '@/layouts/RestaurantLayout';
import type { ComponentType } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob<{
    default: ComponentType<any>;
}>('./pages/**/*.{jsx,tsx}');

const resolvePage = async (name: string): Promise<ComponentType<any>> => {
    const extensions = ['jsx', 'tsx'];

    for (const extension of extensions) {
        const path = `./pages/${name}.${extension}`;
        const loader = pages[path];

        if (loader) {
            const module = await loader();

            return module.default;
        }
    }

    throw new Error(`Page not found: ${name}`);
};
void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: resolvePage,

    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;

            case name === 'Home':
            case name === 'menu/Menu':
            case name === 'cart/Cart':
            case name === 'orders/Index':
            case name === 'orders/ShowOrder':
            case name === 'admin/reservations/create':
            case name === 'About':
            case name === 'Contact':
            case name === 'customer/reservations/Index':
            case name === 'customer/reservations/Show':
            case name === 'customer/reservations/Edit':
                return RestaurantLayout;

            case name.startsWith('auth/'):
                return AuthLayout;

            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
