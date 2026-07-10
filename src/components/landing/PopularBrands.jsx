import React, { useState } from 'react';

const PopularBrands = () => {
  const [activeTab, setActiveTab] = useState('cars');

  const carBrands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda'];
  const bikeBrands = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha'];

  const brands = activeTab === 'cars' ? carBrands : bikeBrands;

  return (
    <section id="popular-brands" className="py-12 bg-[#F5F5F4] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            Explore Popular Brands
          </h2>
          
          <div className="flex bg-white p-1 rounded-xl border border-[#E7E5E4] shadow-sm">
            <button 
              onClick={() => setActiveTab('cars')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'cars' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#57534E] hover:text-[#18181B]'}`}
            >
              Popular Cars
            </button>
            <button 
              onClick={() => setActiveTab('bikes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'bikes' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#57534E] hover:text-[#18181B]'}`}
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
              className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex items-center justify-center text-center hover:border-[#b70a10] hover:shadow-md transition-all group"
            >
              <span className="font-semibold text-[#18181B] group-hover:text-[#b70a10] transition-colors">
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
