import React from 'react';
import { Search, MapPin, IndianRupee, Fuel, Car } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-4 md:p-6 border border-slate-100">
        <form className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Brand/Model Search */}
          <div className="w-full md:w-1/3 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <Car className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search brand or model..." 
              className="w-full bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-slate-200"></div>

          {/* Location Select */}
          <div className="w-full md:w-1/5 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <MapPin className="text-slate-400 shrink-0" size={20} />
            <select className="w-full bg-transparent border-none focus:outline-none text-slate-700 font-medium appearance-none cursor-pointer">
              <option value="">City</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="hyderabad">Hyderabad</option>
            </select>
          </div>

          {/* Budget Select */}
          <div className="w-full md:w-1/5 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <IndianRupee className="text-slate-400 shrink-0" size={20} />
            <select className="w-full bg-transparent border-none focus:outline-none text-slate-700 font-medium appearance-none cursor-pointer">
              <option value="">Budget</option>
              <option value="under_5">Under 5 Lakhs</option>
              <option value="5_to_10">5 - 10 Lakhs</option>
              <option value="10_to_20">10 - 20 Lakhs</option>
              <option value="above_20">Above 20 Lakhs</option>
            </select>
          </div>

          {/* Fuel Select */}
          <div className="w-full md:w-1/5 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <Fuel className="text-slate-400 shrink-0" size={20} />
            <select className="w-full bg-transparent border-none focus:outline-none text-slate-700 font-medium appearance-none cursor-pointer">
              <option value="">Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG</option>
              <option value="electric">Electric</option>
            </select>
          </div>

          {/* Search Button */}
          <button 
            type="button" 
            className="w-full md:w-auto md:shrink-0 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Search size={20} />
            <span className="md:hidden">Search Cars</span>
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
