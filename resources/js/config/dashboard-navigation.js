export const dashboardNavigation = {
    admin: [
        { title: 'Overview', href: '/dashboard' },
        { title: 'Menu Management', href: '/admin/menu' },
        { title: 'Orders', href: '/admin/orders' },
        { title: 'Reservations', href: '/admin/reservations' },
        { title: 'Settings', href: '/settings/profile' },
    ],

    staff: [
        { title: 'Overview', href: '/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
        { title: 'Reservations', href: '/admin/reservations' },
    ],

    customer: [
        { title: 'Overview', href: '/dashboard' },
        { title: 'My Orders', href: '/orders' },
        { title: 'My Reservations', href: '/reservations/customer' },
        { title: 'My Profile', href: '/settings/profile' },
    ],
};
