
export const dashboardNavigation = {
    admin: [
        { title: 'Overview', href: '/dashboard' },
        { title: 'Menu Management', href: '/admin/menu' },
        { title: 'Orders', href: '/admin/orders' },
        { title: 'Reservations', href: '/admin/reservations' },
        { title: 'Inventory', href: '/admin/inventory' },
        { title: 'Customers', href: '/admin/customers' },
        { title: 'Reports', href: '/admin/reports' },
        { title: 'Settings', href: '/settings/profile' },
    ],

    staff: [
        { title: 'Overview', href: '/dashboard' },
        { title: 'Orders', href: '/staff/orders' },
        { title: 'Reservations', href: '/staff/reservations' },
        { title: 'Inventory', href: '/staff/inventory' },
    ],

    customer: [
        { title: 'Overview', href: '/dashboard' },
        { title: 'My Orders', href: '/my-orders' },
        { title: 'My Reservations', href: '/my-reservations' },
        { title: 'My Profile', href: '/settings/profile' },
    ],
};
