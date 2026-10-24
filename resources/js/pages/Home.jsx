import HeroSection from '../components/restaurant/HeroSection';
import TodaysSpecialSection from '../components/restaurant/TodyasSpecial';
import DishGallery from '../components/restaurant/DishGallery';
import FAQSection from '../components/restaurant/Faq';
import AboutSection from '../components/restaurant/AboutHome';
import ContactCTA from '../components/restaurant/CTA';
import Menu from '../components/restaurant/MenuSection';
import FlashMessage from '../components/layout/FlashMessages';
import ThisWeekSpecialsSection from '../components/restaurant/ThisWeekSpecials';

export default function Home({
    todaysSpecial,
    galleryItems,
    categories,
    weeklySpecials,
    todayDate,
}) {
    return (
        <>
            <HeroSection />
            <TodaysSpecialSection special={todaysSpecial} />
            <ThisWeekSpecialsSection
                specials={weeklySpecials}
                special_date={todayDate}
            />
            <FlashMessage />
            <Menu items={galleryItems} categories={categories} />
            <DishGallery items={galleryItems} />
            <AboutSection />
            <ContactCTA />
            <FAQSection />
        </>
    );
}
