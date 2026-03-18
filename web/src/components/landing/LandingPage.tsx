import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { UseCases } from './UseCases';
import { FigmaSection } from './FigmaSection';
import { CodeDemo } from './CodeDemo';
import { Testimonials } from './Testimonials';
import { PricingSection } from './PricingSection';
import { FinalCTASection } from './FinalCTASection';
import { Footer } from './Footer';

const APP_URL = 'https://app.openflowkit.com';

export function LandingPage(): React.ReactElement {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunch = () => {
    window.open(APP_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-canvas">
      <Navbar isScrolled={isScrolled} onLaunch={handleLaunch} />
      <HeroSection onLaunch={handleLaunch} />
      <ProblemSection />
      <SolutionSection />

      {/* Code Demo Section */}
      <section className="py-24 bg-brand-canvas border-t border-brand-border/60">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary/60 mb-6 font-mono text-[10px] uppercase tracking-widest font-bold">
              Live Preview
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter leading-[0.9] mb-6">
              Simple for sketching. <br />
              <span className="font-serif italic font-normal text-brand-primary">Ready for production.</span>
            </h2>
            <p className="text-xl text-brand-secondary max-w-2xl mx-auto font-medium">
              Sketch your ideas fast. Export them production-ready.
            </p>
          </div>
          <CodeDemo />
        </div>
      </section>

      <FigmaSection />
      <UseCases />
      <Testimonials />
      <PricingSection onLaunch={handleLaunch} />
      <FinalCTASection onLaunch={handleLaunch} />
      <Footer onLaunch={handleLaunch} />
    </div>
  );
}
