import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function RestaurantLayout({ children }) {
    return (
        <div className="restaurant-shell flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}
