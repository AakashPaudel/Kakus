import HeroSection from '../components/restaurant/HeroSection';
import TodaysSpecialSection from '../components/restaurant/TodyasSpecial';
import DishGallery from '../components/restaurant/DishGallery';
import FAQSection from '../components/restaurant/Faq';
import AboutSection from '../components/restaurant/AboutHome';


export default function Home({ todaysSpecials,galleryItems }) {
    
    return (
    <>
            <HeroSection />
            <TodaysSpecialSection items={todaysSpecials} />
            <DishGallery items={galleryItems} />
            
            <AboutSection />
            <FAQSection />


    </>
    )
    
} 