import ContactSection from "@/feature/landing/components/ContactSection";
import FeaturesSection from "@/feature/landing/components/FeaturesSection";
import HeroSection from "@/feature/landing/components/HeroSection";
import LandingFooter from "@/feature/landing/components/LandingFooter";
import LandingHeader from "@/feature/landing/components/LandingHeader";
import PositioningSection from "@/feature/landing/components/PositioningSection";
import PricingSection from "@/feature/landing/components/PricingSection";
import ProblemSection from "@/feature/landing/components/ProblemSection";
import SpecialFeaturesSection from "@/feature/landing/components/SpecialFeaturesSection";

export default function Home() {
    return (
        <div className="h-screen w-full overflow-y-auto bg-white text-[#0F172A]">
            <LandingHeader />
            <div className="w-full">
                <HeroSection />
                <ProblemSection />
                <PositioningSection />
                <FeaturesSection />
                <SpecialFeaturesSection />
                <PricingSection />
                <ContactSection />
            </div>
            <LandingFooter />
        </div>
    );
}
