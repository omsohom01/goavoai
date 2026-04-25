import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE_NAME } from "@/lib/jwt";
import Hero from "@/components/landingPage/hero";
import LandingAnimation from "@/components/LandingAnimation";
import { Feature } from "@/components/landingPage/feature";
import { HowItWorks } from "@/components/landingPage/howItWorks";
import FinalCta from "@/components/landingPage/finalCta";
import Footer from "@/components/landingPage/footer";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);

  if (token) {
    redirect("/dashboard");
  }

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
