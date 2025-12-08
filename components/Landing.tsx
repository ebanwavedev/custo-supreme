import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { AboutSection } from "./AboutSection";
import { ProductGuarantee } from "./ProductGuarantee";
import { InspectionsSection } from "./InspectionsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import { CareersSection } from "./CareersSection";
import { Chatbot } from "./Chatbot";

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <QuoteSection />
        <ProductGuarantee />
        <InspectionsSection />
        <TestimonialsSection />
        <FAQSection />
        
        <ContactSection />
        <CareersSection />
      </main>
      <Footer />
      {/* <Chatbot /> */}
    </div>
  );
}
