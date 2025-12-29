import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import Quote from "@/components/landing/Quote";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Quote />
      <Footer />
    </main>
  );
};

export default Index;
