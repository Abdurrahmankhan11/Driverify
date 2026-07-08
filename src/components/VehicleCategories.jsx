// import React from 'react';
// import { ArrowRight, Car, Bike } from 'lucide-react';

// const VehicleCategories = () => {
//   return (
//     <section className="py-12 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
//           {/* Used Cars Card */}
//           <div className="group relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white p-6  transition-all duration-300">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <div className="w-12 h-12 bg-[#F5F5F4] rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
//                   <Car size={24} className="text-[#b70a10]" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-[#18181B] mb-2">Used Cars</h3>
//                 <p className="text-[#57534E] max-w-xs">
//                   Browse verified second-hand cars from genuine owners in your city.
//                 </p>
//               </div>
//             </div>
            
//             <button className="flex items-center gap-2 text-[#b70a10] font-medium group-hover:text-[#A66548] transition-colors">
//               Browse Cars <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
//             </button>

//             <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/4 translate-y-1/4">
//               <Car size={180} />
//             </div>
//           </div>

//           {/* Used Bikes Card */}
//           <div className="group relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white p-6  transition-all duration-300">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <div className="w-12 h-12 bg-[#F5F5F4] rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
//                   <Bike size={24} className="text-[#b70a10]" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-[#18181B] mb-2">Used Bikes</h3>
//                 <p className="text-[#57534E] max-w-xs">
//                   Find well-maintained motorcycles and scooters directly from owners.
//                 </p>
//               </div>
//             </div>
            
//             <button className="flex items-center gap-2 text-[#b70a10] font-medium group-hover:text-[#A66548] transition-colors">
//               Browse Bikes <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
//             </button>

//             <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/4 translate-y-1/4">
//               <Bike size={180} />
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default VehicleCategories;


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
    <section id="buy-vehicle" className="py-16 lg:py-20 bg-[#FAFAF9] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#b70a10] bg-[#b70a10]/10 px-3 py-1.5 rounded-full mb-4">
            Explore Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#18181B] tracking-tight mb-3">
            Find Your Perfect Ride
          </h2>
          <p className="text-[#57534E] text-base sm:text-lg">
            Thousands of verified vehicles from trusted owners — all in one place.
          </p>
        </div>

        {/* ── Category Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" onClick={() => navigate('/login')}>
          {categories.map(({ id, icon: Icon, title, description, cta, stats, badge }) => (
            <div id={id} key={id} className="scroll-mt-28">
              <div className="group relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white p-7 lg:p-8">
              {/* Badge */}
              {/* <div className="absolute top-6 right-6 flex items-center gap-1.5 text-xs font-medium
                              text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                <ShieldCheck size={13} />
                {badge}
              </div> */}

              {/* Icon */}
              {/* <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5
                              bg-gradient-to-br from-[#F5F5F4] to-[#EDEBEA]
                              group-hover:from-[#b70a10] group-hover:to-[#A66548]
                              transition-all duration-300">
                <Icon
                  size={26}
                  className="text-[#b70a10] group-hover:text-white transition-colors duration-300"
                />
              </div> */}

              {/* Content */}
              <h3 className="text-2xl font-bold text-[#18181B] mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-[#57534E] leading-relaxed max-w-sm mb-6">
                {description}
              </p>

              {/* Stats */}
              {/* <div className="flex gap-8 pb-6 mb-6 border-b border-[#F0EEED]">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-bold text-[#18181B]">{stat.value}</p>
                    <p className="text-xs text-[#78716C] uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div> */}

              {/* CTA */}
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#b70a10]
                           group-hover:gap-3 group-hover:text-[#A66548] transition-all duration-300"
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

              {/* Top Accent Line */}
              {/* <div className="absolute top-0 left-0 h-1 w-0 group-hover:w-full
                              bg-gradient-to-r from-[#b70a10] to-[#A66548]
                              transition-all duration-500" /> */}
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleCategories;
