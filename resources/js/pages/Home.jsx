import HeroSection from '../components/restaurant/HeroSection';
import TodaysSpecialSection from '../components/restaurant/TodyasSpecial';
import DishGallery from '../components/restaurant/DishGallery';


export default function Home({ todaysSpecials,galleryItems }) {
    
    return (
    <>
            <HeroSection />
            <TodaysSpecialSection items={todaysSpecials} />
            <DishGallery items={galleryItems} />

    </>
    )
    
} 