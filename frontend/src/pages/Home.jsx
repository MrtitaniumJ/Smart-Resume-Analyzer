import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import WhyChooseUs from '../components/WhyChooseUs';
import Analyse from '../components/Analyse';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

function Home({ authService }) {
  return (
    <div className="min-h-screen">
      <Navbar authService={authService} />
      <HeroSection />
      <WhyChooseUs />
      <Analyse />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default Home;
