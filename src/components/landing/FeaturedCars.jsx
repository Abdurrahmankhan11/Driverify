import React from 'react';
import { ArrowRight } from 'lucide-react';
import CarCard from '../vehicle/CarCard';

const dummyCars = [
  {
    id: 1,
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) 1.5 Diesel Automatic',
    price: '15.5 Lakh',
    year: 2021,
    kilometers: '32,000',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'Andheri West, Mumbai',
    verified: true,
    image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    brand: 'Honda',
    model: 'City',
    variant: 'ZX MT Petrol',
    price: '9.8 Lakh',
    year: 2019,
    kilometers: '45,500',
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Koramangala, Bangalore',
    verified: true,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    brand: 'Kia',
    model: 'Seltos',
    variant: 'HTX 1.5 Petrol',
    price: '12.2 Lakh',
    year: 2022,
    kilometers: '18,200',
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Saket, Delhi',
    verified: true,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const FeaturedCars = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Featured Cars
            </h2>
            <p className="text-lg text-slate-600">
              Explore handpicked used cars available near you. Verified for quality and reliability.
            </p>
          </div>
          <button className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
            View All Cars 
            <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCars;
