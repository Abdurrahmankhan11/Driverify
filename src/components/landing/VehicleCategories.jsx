import React from 'react';
import { ArrowRight, Car, Bike, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'cars',
    icon: Car,
    title: 'Used Cars',
    description: 'Browse verified second-hand cars from genuine owners in your city.',
    cta: 'Browse Cars',
    stats: [
      { value: '12,000+', label: 'Active Listings' },
      { value: '500+', label: 'Cities Covered' },
    ],
    // badge: 'Verified Sellers',
  },
  {
    id: 'bikes',
    icon: Bike,
    title: 'Used Bikes',
    description: 'Find well-maintained motorcycles and scooters directly from owners.',
    cta: 'Browse Bikes',
    stats: [
      { value: '8,500+', label: 'Active Listings' },
      { value: '450+', label: 'Cities Covered' },
    ],
    // badge: 'Owner Direct',
  },
];

const VehicleCategories = () => {
  const navigate = useNavigate();
  return (
    <section id="buy-vehicle" className="py-16 lg:py-20 bg-background scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
            Explore Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
            Find Your Perfect Ride
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Thousands of verified vehicles from trusted owners — all in one place.
          </p>
        </div>

        {/* ── Category Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" onClick={() => navigate('/login')}>
          {categories.map(({ id, icon: Icon, title, description, cta, stats, badge }) => (
            <div id={id} key={id} className="scroll-mt-28 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-2xl">
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 lg:p-8 cursor-pointer hover:border-primary/50 transition-colors">
              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mb-6">
                {description}
              </p>

              {/* CTA */}
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary
                           group-hover:gap-3 group-hover:text-primary/80 transition-all duration-300 focus-visible:outline-none"
                aria-label={cta}
              >
                {cta}
                <span className="w-8 h-8  flex items-center justify-center
                                 ">
                  <ArrowRight size={15} />
                </span>
              </button>

              {/* Background Watermark */}
              <div className="absolute -right-6 -bottom-6 opacity-[0.04] group-hover:opacity-[0.08]
                              group-hover:scale-110 group-hover:-rotate-6
                              transition-all duration-500 pointer-events-none">
                <Icon size={200} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleCategories;
