import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import SearchVehicle from '../components/landing/SearchVehicle';
import VehicleCategories from '../components/landing/VehicleCategories';
import PopularBrands from '../components/landing/PopularBrands';
import LandingFeaturedVehicles from '../components/landing/LandingFeaturedVehicles';
import HowItWorks from '../components/landing/HowItWorks';
import WhySecondRide from '../components/landing/WhySecondRide';
import SafetyTips from '../components/landing/SafetyTips';
import SellVehicleCTA from '../components/landing/SellVehicleCTA';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-white"></div>; // Prevents flashing
  }

  if (isAuthenticated && user) {
    const role = user.role || 'USER';
    return <Navigate to={`/dashboard/${role.toLowerCase()}`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        {/* <SearchVehicle /> */}
        <VehicleCategories />
        {/* <PopularBrands /> */}
        <LandingFeaturedVehicles />
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
