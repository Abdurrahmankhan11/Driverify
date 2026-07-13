import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellVehicleCTA = () => {
  const navigate = useNavigate();
  return (
    <section id="sell-vehicle" className="py-24 bg-background relative overflow-hidden scroll-mt-28">
      <div className="absolute inset-0 bg-muted skew-y-3 origin-bottom-left -z-10 border-y border-border"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
          Ready to sell your car or bike?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Post your vehicle for free and connect with genuine buyers near you. Get the best price for your vehicle with zero hassle.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            Post Free Ad
          </button>
          <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-background hover:bg-muted text-foreground border border-border px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            Browse Vehicles
          </button>
        </div>
      </div>
    </section>
  );
};

export default SellVehicleCTA;
