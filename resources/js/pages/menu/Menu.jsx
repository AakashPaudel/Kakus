import { Head } from '@inertiajs/react';
import MenuSection from '../../components/restaurant/MenuSection';

export default function Index({ items }) {
    return (
        <>
            <Head title="Menu" />
            <MenuSection items={items} />
        </>
    );
}
