import HeroSection from '../components/restaurant/HeroSection';
import TodaysSpecialSection from '../components/restaurant/TodyasSpecial';
import DishGallery from '../components/restaurant/DishGallery';
import FAQSection from '../components/restaurant/Faq';
import AboutSection from '../components/restaurant/AboutHome';
import ContactCTA from '../components/restaurant/CTA';
import MenuSection from '../components/restaurant/MenuSection';


export default function Home({ todaysSpecials,galleryItems }) {
    
    return (
    <>
            <HeroSection />
            <MenuSection items={galleryItems} />
            <TodaysSpecialSection items={todaysSpecials} />
            <DishGallery items={galleryItems} />
            <AboutSection />
            <ContactCTA />
            <FAQSection />



    </>
    )
    
} 