import React from 'react';
import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-10 pb-0">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/85"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.12] mb-6">
          Buy and Sell Used Cars & Bikes{' '}
          <span className="text-primary">Directly With Owners</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          SecondRide helps you discover nearby owner-listed vehicles, compare real prices,
          and connect directly with genuine sellers — without middlemen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button onClick={() => navigate('/login')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background px-8 py-4 rounded-xl font-medium transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            Browse Vehicles <ArrowRight size={18} />
          </button>

          <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-background hover:bg-muted text-foreground border border-border px-8 py-4 rounded-xl font-medium transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            Post Free Ad
          </button>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-6 border-t border-border max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              Owner Listed Vehicles
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              Direct Contact
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              Safer Enquiry Flow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
