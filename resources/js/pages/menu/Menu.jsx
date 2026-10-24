import Menu from '../../components/restaurant/MenuSection';
export default function MenuPage({ categories, items }) {
    return (
        <main className="restaurant-shell min-h-screen transition-colors">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                <Menu items={items} categories={categories} />
            </div>
        </main>
    );
}
