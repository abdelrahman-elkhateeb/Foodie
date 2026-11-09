import HomeCategories from "@/components/home/HomeCategories";
import HomeHero from "@/components/home/HomeHero";
import HomeTracking from "@/components/home/HomeTracking";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeCategories />
      <HowItWorks />
      <HomeTracking />
    </>
  );
}
