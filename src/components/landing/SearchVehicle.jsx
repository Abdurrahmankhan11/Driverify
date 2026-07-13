import React from 'react';
import { Search, MapPin, IndianRupee, Car, Bike } from 'lucide-react';

const SearchVehicle = () => {
  return (
    <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
      <div className="bg-card rounded-[24px] shadow-sm border border-border p-4 md:p-6">
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Vehicle Type Toggle */}
          <div className="col-span-1 md:col-span-3 flex bg-muted rounded-xl p-1 border border-border">
            <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-background shadow-sm rounded-lg text-sm font-medium text-primary transition-all">
              <Car size={16} /> Car
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
              <Bike size={16} /> Bike
            </button>
          </div>

          {/* Brand/Model Search */}
          <div className="col-span-1 md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Brand or Model..." 
                className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground text-sm font-medium py-3 pl-10 pr-4 rounded-xl transition-all"
              />
            </div>
          </div>

          {/* Location Select */}
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <select className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground text-sm font-medium py-3 pl-10 pr-4 rounded-xl appearance-none cursor-pointer transition-all">
                <option value="">Select City</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
              </select>
            </div>
          </div>

          {/* Budget Select */}
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <select className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground text-sm font-medium py-3 pl-10 pr-4 rounded-xl appearance-none cursor-pointer transition-all">
                <option value="">Budget</option>
                <option value="under_5">Under 5 Lakh</option>
                <option value="5_to_10">5 - 10 Lakh</option>
                <option value="10_plus">10+ Lakh</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="col-span-1 md:col-span-2">
            <button 
              type="button" 
              className="w-full bg-foreground hover:bg-foreground/90 text-background py-3 px-4 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default SearchVehicle;
