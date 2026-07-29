import React from 'react';
import { MapPin, Fuel, Gauge, Settings2, ShieldCheck, Car, Bike, Shield, Share2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VehicleCard = ({ vehicle, onViewDetails, isWishlisted, onToggleWishlist }) => {
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
        <div className="absolute top-2 left-2 flex gap-2">
          <div className="bg-background/95 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-foreground shadow-sm uppercase tracking-wider flex items-center gap-1 border border-border/50">
            {isCar ? <Car size={10} /> : <Bike size={10} />} {vehicle.type}
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const url = `${window.location.origin}/listings/${vehicle.id}`;
              const text = `Check out this ${vehicle.brand} ${vehicle.model} on SecondRide!\n\n${url}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="bg-background/95 backdrop-blur-sm p-1.5 rounded-full text-foreground shadow-sm  transition-colors border border-border/50 focus-visible:outline-none"
            title="Share on WhatsApp"
          >
            <Share2 size={14} />
          </button>
          <button
            onClick={onToggleWishlist || ((e) => {
              e.stopPropagation();
              navigate('/login');
            })}
            className={`bg-background/95 backdrop-blur-sm p-1.5 rounded-full shadow-sm transition-colors border border-border/50 focus-visible:outline-none ${isWishlisted ? 'text-red-500 hover:bg-background' : 'text-foreground hover:bg-background'}`}
            title={isWishlisted ? "Remove from Favorites" : "Add to Favorites"}>
            <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground leading-tight mb-0.5 group-hover:text-primary transition-colors truncate">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-xs text-muted-foreground">{vehicle.year}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-primary">{vehicle.price}</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-2 py-3 mb-3 border-y border-border mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gauge size={14} className="text-muted-foreground/50 shrink-0" />
            <span className="font-medium text-foreground truncate">{vehicle.kilometers}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Fuel size={14} className="text-muted-foreground/50 shrink-0" />
            <span className="font-medium text-foreground truncate">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Settings2 size={14} className="text-muted-foreground/50 shrink-0" />
            <span className="font-medium text-foreground truncate">{isCar ? vehicle.transmission : vehicle.engineCc}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={14} className="text-muted-foreground/50 shrink-0" />
            <span className="font-medium text-foreground truncate">{vehicle.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button onClick={() => onViewDetails ? onViewDetails(vehicle.id) : navigate(`/listings/${vehicle.id}`)} className="w-full bg-foreground hover:bg-foreground/90 text-background py-1.5 rounded-lg font-medium transition-colors text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            View Details
          </button>
        </div>
      </div>

    </div>
  );
};

export default VehicleCard;
