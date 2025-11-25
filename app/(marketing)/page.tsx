import CtaSection from "../components/CtaSection";
import FAQSection from "../components/FAQs";
import FooterSection from "../components/FooterSection";
import FourthSection from "../components/FourthSection";
import NavBar from "../components/NavBar";
import PricingSection from "../components/PricingSection";
import ProductDisplay from "../components/ProductDisplay";
import SecondSection from "../components/SecondSection";
import TestimonialSection from "../components/TestimonialSection";
import ThirdSection from "../components/ThirdSection";
import TopSection from "../components/TopSection";

const Home = () => {
  return (
    <main>
      <NavBar />
      {/* Hero Section */}
      <header className="min-h-screen bg-[#D35A0F] px-6">
        <TopSection />
      </header>

      {/* Second Section */}
      <section>
        <SecondSection />
        <ThirdSection />
        <FourthSection />
        <TestimonialSection />
        <PricingSection />
        <ProductDisplay />
        <CtaSection />
        <FAQSection />
        <FooterSection />
      </section>
    </main>
  );
};

export default Home;
