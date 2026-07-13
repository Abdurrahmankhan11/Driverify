import React, { useState } from 'react';

const PopularBrands = () => {
  const [activeTab, setActiveTab] = useState('cars');

  const carBrands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda'];
  const bikeBrands = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha'];

  const brands = activeTab === 'cars' ? carBrands : bikeBrands;

  return (
    <section id="popular-brands" className="py-12 bg-muted scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Explore Popular Brands
          </h2>
          
          <div className="flex bg-background p-1 rounded-xl border border-border shadow-sm">
            <button 
              onClick={() => setActiveTab('cars')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'cars' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Popular Cars
            </button>
            <button 
              onClick={() => setActiveTab('bikes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'bikes' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Popular Bikes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <a 
              key={index} 
              href="#" 
              className="bg-background border border-border rounded-xl p-4 flex items-center justify-center text-center hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {brand}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;
