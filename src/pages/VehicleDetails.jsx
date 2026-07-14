import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/api';
import { Loader2, ArrowLeft, MapPin, Fuel, Gauge, Settings2, Calendar, Phone, CheckCircle, Car } from 'lucide-react';

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
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {vehicle.brand} {vehicle.model} <span className="text-muted-foreground font-medium text-xl">{vehicle.variant}</span>
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin size={16} /> {vehicle.location}
                </p>
              </div>

              <div className="text-3xl font-bold text-primary mb-6 pb-6 border-b border-border">
                {formatPrice(vehicle.price)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-1 p-3 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"><Calendar size={14}/> Year</span>
                  <span className="font-bold text-foreground">{vehicle.year}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"><Gauge size={14}/> Driven</span>
                  <span className="font-bold text-foreground">{vehicle.kilometers_driven ? `${vehicle.kilometers_driven.toLocaleString('en-IN')} km` : 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"><Fuel size={14}/> Fuel</span>
                  <span className="font-bold text-foreground">{vehicle.fuel_type}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-muted rounded-xl">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"><Settings2 size={14}/> Trans.</span>
                  <span className="font-bold text-foreground">{vehicle.transmission}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <button className="w-full bg-foreground hover:bg-foreground/90 text-background py-3.5 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-lg">
                  <Phone size={20} /> Contact Seller
                </button>
              </div>
            </div>

            {/* Additional Details Card */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-border">Vehicle Highlights</h3>
              <ul className="space-y-3">
                <li className="flex items-start justify-between">
                  <span className="text-muted-foreground">Ownership</span>
                  <span className="font-semibold text-foreground">{vehicle.ownership}</span>
                </li>
                <li className="flex items-start justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-500" /> {vehicle.status}
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
            
            {/* Description Card */}
            {vehicle.description && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4 pb-3 border-b border-border">Description</h3>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
