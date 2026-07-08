import React from 'react';
import { MapPin, Fuel, Gauge, Settings2, ShieldCheck } from 'lucide-react';

const CarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={car.image} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
          {car.year}
        </div>
        {car.verified && (
          <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1">
            <ShieldCheck size={14} /> Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-slate-500">{car.variant}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">₹{car.price}</div>
            <div className="text-xs font-medium text-slate-400">Fixed Price</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-4 mt-2 border-y border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Gauge size={16} className="text-slate-400" />
            <span>{car.kilometers} km</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Fuel size={16} className="text-slate-400" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings2 size={16} className="text-slate-400" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={16} className="text-slate-400" />
            <span className="truncate">{car.location}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          <button className="w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white py-2.5 rounded-xl font-semibold transition-colors duration-300">
            View Details
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default CarCard;
