/* eslint-disable no-unused-vars */
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="font-poppins bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <FeatureSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
