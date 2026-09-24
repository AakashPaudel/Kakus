import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}

// in this file we receive the children and breadcrumbs props from the AppLayout component and pass them down to the AppSidebarHeader component. The AppSidebarHeader component is responsible for rendering the breadcrumbs in the sidebar header.
// the dashboard page will use this layout to render the dashboard content inside the shared application layout. The breadcrumbs prop will be used to show the current navigation path in the sidebar header.
