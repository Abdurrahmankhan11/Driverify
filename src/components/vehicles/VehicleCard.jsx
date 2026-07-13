import React from 'react';
import { MapPin, Fuel, Gauge, Settings2, ShieldCheck, Car, Bike, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const isCar = vehicle.type === 'Car';

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={vehicle.image} 
          alt={`${vehicle.brand} ${vehicle.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-background/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-foreground shadow-sm uppercase tracking-wider flex items-center gap-1 border border-border/50">
            {isCar ? <Car size={12} /> : <Bike size={12} />} {vehicle.type}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="pr-2">
            <h3 className="text-lg font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-bold text-primary">{vehicle.price}</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-4 mb-4 border-y border-border mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge size={16} className="text-muted-foreground/50" />
            <span className="font-medium text-foreground">{vehicle.kilometers}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel size={16} className="text-muted-foreground/50" />
            <span className="font-medium text-foreground">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings2 size={16} className="text-muted-foreground/50" />
            <span className="font-medium text-foreground">{isCar ? vehicle.transmission : vehicle.engineCc}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="text-muted-foreground/50" />
            <span className="font-medium text-foreground truncate">{vehicle.city}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="flex-1 bg-background hover:bg-muted text-foreground border border-border py-2.5 rounded-lg font-medium transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            View Details
          </button>
          <button onClick={() => navigate('/login')} className="flex-1 bg-foreground hover:bg-foreground/90 text-background py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            Contact Owner
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default VehicleCard;
