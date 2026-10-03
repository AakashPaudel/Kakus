import HeroSection from '../components/restaurant/HeroSection';
import TodaysSpecialSection from '../components/restaurant/TodyasSpecial';


export default function Home({ todaysSpecials }) {
    
    return (
    <>
            <HeroSection />;
            <TodaysSpecialSection items={todaysSpecials} />

    </>
    )
    
}   