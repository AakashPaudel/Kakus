import Logo from '../restaurant/Logo';
import DesktopNavigation from '../restaurant/DesktopNavigation';
import CartButton from '../restaurant/CartButton';
import UserMenu from '../restaurant/UserMenu';
//import MobileMenu from '../restaurant/MobileMenu';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <Logo />

                    <DesktopNavigation />

                    <div className="flex items-center gap-3">
                        <CartButton />
                        <UserMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
