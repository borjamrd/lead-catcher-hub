
import Hero from '@/components/landing/Hero';
import EmailForm from '@/components/landing/EmailForm';
import Features from '@/components/landing/Features';
import DetailedFeatures from '@/components/landing/DetailedFeatures';
import Gamification from '@/components/landing/Gamification';
import Pricing from '@/components/landing/Pricing';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <Hero />
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            ¿Te interesa?
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Sé el primero en enterarte cuando lancemos
          </p>
          <EmailForm />
        </div>

        <div className="max-w-6xl mx-auto space-y-24">
          <Features />
          <DetailedFeatures />
          <Gamification />
          <Pricing />
        </div>
      </div>

      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
