import Hero from "@/components/landingPage/hero";
import LandingAnimation from "@/components/LandingAnimation";
import { Feature } from "@/components/landingPage/feature";
import { HowItWorks } from "@/components/landingPage/howItWorks";
import FinalCta from "@/components/landingPage/finalCta";
import Footer from "@/components/landingPage/footer";

export default function Home() {
  return (
    <>
      <LandingAnimation />
      <Hero />
      <Feature />
      <HowItWorks />
      <FinalCta />
      <Footer />
    </>
  );
}
