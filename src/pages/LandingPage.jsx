import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchVehicle from '../components/SearchVehicle';
import VehicleCategories from '../components/VehicleCategories';
import PopularBrands from '../components/PopularBrands';
import FeaturedVehicles from '../components/FeaturedVehicles';
import HowItWorks from '../components/HowItWorks';
import WhySecondRide from '../components/WhySecondRide';
import SafetyTips from '../components/SafetyTips';
import SellVehicleCTA from '../components/SellVehicleCTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        {/* <SearchVehicle /> */}
        <VehicleCategories />
        {/* <PopularBrands /> */}
        <FeaturedVehicles />
        <HowItWorks />
        <WhySecondRide />
        <SafetyTips />
        <SellVehicleCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
