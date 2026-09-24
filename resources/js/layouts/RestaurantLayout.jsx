import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function RestaurantLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-stone-50">
            <Navbar />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}
