import React from 'react';
import VehicleCard from '../vehicles/VehicleCard';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dummyVehicles = [
  {
    id: 1,
    type: 'Car',
    brand: 'Maruti Suzuki',
    model: 'Swift VXi',
    price: '₹5.45 Lakh',
    city: 'Bhopal',
    fuelType: 'Petrol',
    kilometers: '42,000 km',
    year: '2021',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    type: 'Car',
    brand: 'Hyundai',
    model: 'Creta SX',
    price: '₹11.80 Lakh',
    city: 'Indore',
    fuelType: 'Diesel',
    kilometers: '58,000 km',
    year: '2020',
    transmission: 'Manual',
    image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    type: 'Car',
    brand: 'Mahindra',
    model: 'Thar LX',
    price: '₹14.50 Lakh',
    city: 'Bhopal',
    fuelType: 'Diesel',
    kilometers: '27,000 km',
    year: '2022',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    type: 'Bike',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    price: '₹1.65 Lakh',
    city: 'Bhopal',
    fuelType: 'Petrol',
    kilometers: '18,000 km',
    year: '2021',
    engineCc: '350cc',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    type: 'Bike',
    brand: 'Yamaha',
    model: 'MT 15',
    price: '₹1.25 Lakh',
    city: 'Indore',
    fuelType: 'Petrol',
    kilometers: '12,500 km',
    year: '2022',
    engineCc: '155cc',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    type: 'Bike',
    brand: 'TVS',
    model: 'Apache RTR 160',
    price: '₹85,000',
    city: 'Nagpur',
    fuelType: 'Petrol',
    kilometers: '22,000 km',
    year: '2020',
    engineCc: '160cc',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const FeaturedVehicles = () => {
  const navigate = useNavigate();
  return (
    <section id="featured-vehicles" className="py-16 bg-white scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-[#E7E5E4] pb-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-2 tracking-tight">
              Featured Owner-Listed Vehicles
            </h2>
            <p className="text-[#57534E]">
              Browse cars and bikes posted directly by vehicle owners.
            </p>
          </div>
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-[#b70a10] font-medium hover:text-[#A66548] transition-colors group pb-1">
            View All Vehicles 
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedVehicles;
