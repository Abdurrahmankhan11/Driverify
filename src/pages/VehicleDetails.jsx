import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/api';
import { Loader2, ArrowLeft, MapPin, Fuel, Gauge, Settings2, Calendar, Phone, CheckCircle, Car, ChevronLeft, ChevronRight } from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getListing(id);
        setVehicle(data);
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
        setError('Failed to load vehicle details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center px-4 min-h-[60vh]">
        <p className="text-xl text-muted-foreground mb-4">{error || 'Vehicle not found.'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary font-medium hover:underline"
        >
          <ArrowLeft size={20} /> Go Back
        </button>
      </div>
    );
  }

  const formatPrice = (price) => {
    const val = parseFloat(price);
    if (isNaN(val)) return `₹${price}`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const images = vehicle.images?.length > 0 
    ? vehicle.images 
    : [{ image_url: 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image' }];

  return (
    <div className="flex-1 w-full animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-muted border border-border relative">
              <img 
                src={images[activeImage].image_url} 
                alt={`${vehicle.brand} ${vehicle.model}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-foreground shadow-sm uppercase tracking-wider flex items-center gap-2 border border-border/50">
                <Car size={16} /> {vehicle.vehicle_type || 'Car'}
              </div>
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-24 h-24 sm:w-32 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img.image_url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col h-full max-h-[75vh] overflow-y-auto hide-scrollbar">
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                  {vehicle.brand} {vehicle.model} <span className="text-muted-foreground font-medium text-lg">{vehicle.variant}</span>
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={14} /> {vehicle.location}
                </p>
              </div>

              <div className="text-2xl font-bold text-primary mb-4 pb-4 border-b border-border">
                {formatPrice(vehicle.price)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex flex-col gap-0.5 p-2.5 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"><Calendar size={12}/> Year</span>
                  <span className="font-bold text-sm text-foreground">{vehicle.year}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"><Gauge size={12}/> Driven</span>
                  <span className="font-bold text-sm text-foreground">{vehicle.kilometers_driven ? `${vehicle.kilometers_driven.toLocaleString('en-IN')} km` : 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"><Fuel size={12}/> Fuel</span>
                  <span className="font-bold text-sm text-foreground">{vehicle.fuel_type}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"><Settings2 size={12}/> Trans.</span>
                  <span className="font-bold text-sm text-foreground">{vehicle.transmission}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-foreground mb-2 pb-2 border-b border-border">Vehicle Highlights</h3>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-start justify-between">
                    <span className="text-muted-foreground">Ownership</span>
                    <span className="font-semibold text-foreground">{vehicle.ownership}</span>
                  </li>
                  <li className="flex items-start justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <CheckCircle size={14} className="text-green-500" /> {vehicle.status}
                    </span>
                  </li>
                  {vehicle.seller_phone && (
                    <li className="flex items-start justify-between">
                      <span className="text-muted-foreground">Seller Phone</span>
                      <span className="font-semibold text-foreground">{vehicle.seller_phone}</span>
                    </li>
                  )}
                </ul>
              </div>

              {vehicle.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-foreground mb-2 pb-2 border-b border-border">Description</h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-xs">
                    {vehicle.description}
                  </p>
                </div>
              )}
              
              <div className="mt-auto pt-4 border-t border-border">
                <button className="w-full bg-foreground hover:bg-foreground/90 text-background py-3 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-base">
                  <Phone size={18} /> Contact Seller
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
