import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ImageCarousel } from "@/components/home/ImageCarousel";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsEvents } from "@/components/home/NewsEvents";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <ImageCarousel />
        <Features />
        <Testimonials />
        <NewsEvents />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
