import React from 'react';
import { MapPin, Fuel, Gauge, Settings2, ShieldCheck, Car, Bike, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const isCar = vehicle.type === 'Car';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E7E5E4] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F4]">
        <img 
          src={vehicle.image} 
          alt={`${vehicle.brand} ${vehicle.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-[#18181B] shadow-sm uppercase tracking-wider flex items-center gap-1 border border-[#E7E5E4]/50">
            {isCar ? <Car size={12} /> : <Bike size={12} />} {vehicle.type}
          </div>
        </div>
        
        {/* <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-[11px] font-bold text-[#b70a10] shadow-sm flex items-center gap-1 border border-[#b70a10]/20">
          <Shield size={12} /> Owner Listed
        </div> */}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="pr-2">
            <h3 className="text-lg font-bold text-[#18181B] leading-tight mb-1 group-hover:text-[#b70a10] transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-[#57534E]">{vehicle.year}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-bold text-[#b70a10]">{vehicle.price}</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-4 mb-4 border-y border-[#E7E5E4] mt-auto">
          <div className="flex items-center gap-2 text-sm text-[#57534E]">
            <Gauge size={16} className="text-[#A8A29E]" />
            <span className="font-medium text-[#18181B]">{vehicle.kilometers}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#57534E]">
            <Fuel size={16} className="text-[#A8A29E]" />
            <span className="font-medium text-[#18181B]">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#57534E]">
            <Settings2 size={16} className="text-[#A8A29E]" />
            <span className="font-medium text-[#18181B]">{isCar ? vehicle.transmission : vehicle.engineCc}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#57534E]">
            <MapPin size={16} className="text-[#A8A29E]" />
            <span className="font-medium text-[#18181B] truncate">{vehicle.city}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="flex-1 bg-white hover:bg-[#F5F5F4] text-[#18181B] border border-[#E7E5E4] py-2.5 rounded-lg font-medium transition-colors text-sm">
            View Details
          </button>
          <button onClick={() => navigate('/login')} className="flex-1 bg-[#18181B] hover:bg-[#27272A] text-white py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm">
            Contact Owner
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default VehicleCard;
