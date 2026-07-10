// import React from 'react';
// import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

// const HeroSection = () => {
//   return (
//     <div className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-white overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          
//           {/* Left Content */}
//           <div className="flex-1 z-10 w-full max-w-2xl lg:max-w-none mx-auto text-center lg:text-left">
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F4] border border-[#E7E5E4] text-[#b70a10] text-xs font-semibold mb-6 shadow-sm">
//               <ShieldCheck size={14} />
//               <span>Owner-to-Owner Cars & Bikes Marketplace</span>
//             </div>
            
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#18181B] tracking-tight leading-[1.15] mb-6">
//               Buy and Sell Used Cars & Bikes <span className="text-[#b70a10]">Directly With Owners</span>
//             </h1>
            
//             <p className="text-lg text-[#57534E] mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
//               SecondRide helps you discover nearby owner-listed vehicles, compare real prices, and connect directly with genuine sellers — without middlemen.
//             </p>
            
//             <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
//               <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#18181B] hover:bg-[#27272A] text-white px-7 py-3.5 rounded-lg font-medium transition-all shadow-sm">
//                 Browse Vehicles <ArrowRight size={18} />
//               </button>
//               <button className="w-full sm:w-auto bg-white hover:bg-[#F5F5F4] text-[#18181B] border border-[#E7E5E4] px-7 py-3.5 rounded-lg font-medium transition-all shadow-sm">
//                 Post Free Ad
//               </button>
//             </div>
            
//             {/* Trust Row */}
//             <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 pt-6 border-t border-[#E7E5E4]">
//               <div className="flex items-center gap-2">
//                 <CheckCircle size={16} className="text-[#b70a10]" />
//                 <span className="text-sm font-medium text-[#18181B]">Owner Listed Vehicles</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle size={16} className="text-[#b70a10]" />
//                 <span className="text-sm font-medium text-[#18181B]">Direct Contact</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle size={16} className="text-[#b70a10]" />
//                 <span className="text-sm font-medium text-[#18181B]">Safer Enquiry Flow</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Visual Composition */}
//           <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto mt-8 lg:mt-0">
//             <div className="relative z-10 rounded-2xl overflow-hidden border border-[#E7E5E4] shadow-xl bg-white p-2">
//               <img 
//                 src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
//                 alt="Premium Car" 
//                 className="w-full h-auto object-cover rounded-xl aspect-[4/3]"
//               />
              
//               {/* Overlapping Bike Card */}
//               <div className="absolute -bottom-8 -left-8 lg:-left-12 w-48 md:w-56 bg-white p-2 rounded-2xl shadow-lg border border-[#E7E5E4]">
//                 <img 
//                   src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
//                   alt="Premium Bike" 
//                   className="w-full h-auto object-cover rounded-xl aspect-[4/3]"
//                 />
//               </div>

//               {/* Floating Badges */}
//               <div className="absolute top-6 -right-6 bg-white px-4 py-2.5 rounded-xl shadow-lg border border-[#E7E5E4] flex items-center gap-2 z-20">
//                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                 <span className="text-xs font-semibold text-[#18181B]">Owner Listed</span>
//               </div>
              
//               <div className="absolute bottom-16 -right-4 bg-white px-4 py-2.5 rounded-xl shadow-lg border border-[#E7E5E4] flex items-center gap-2 z-20">
//                 <ShieldCheck size={16} className="text-[#b70a10]" />
//                 <span className="text-xs font-semibold text-[#18181B]">Verified Details</span>
//               </div>
//             </div>
            
//             {/* Soft decorative background shape */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#F5F5F4] rounded-full blur-3xl -z-10 scale-110"></div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;


import React from 'react';
import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAF9] pt-10 pb-0">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* <img
          src="https://images.unsplash.com/photo-1557598628-bdd7d0767917?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="SecondRide Cars and Bikes Marketplace"
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="absolute inset-0 bg--to-b from-white via-white/80 to-[#FAFAF9]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E7E5E4] text-[#b70a10] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <ShieldCheck size={16} />
          <span>Owner-to-Owner Cars & Bikes Marketplace</span>
        </div> */}

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#18181B] tracking-tight leading-[1.12] mb-6">
          Buy and Sell Used Cars & Bikes{' '}
          <span className="text-[#b70a10]">Directly With Owners</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-[#57534E] max-w-3xl mx-auto mb-8 leading-relaxed">
          SecondRide helps you discover nearby owner-listed vehicles, compare real prices,
          and connect directly with genuine sellers — without middlemen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button onClick={() => navigate('/login')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#18181B] hover:bg-[#27272A] text-white px-8 py-4 rounded-xl font-medium transition-all shadow-md">
            Browse Vehicles <ArrowRight size={18} />
          </button>

          <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-white hover:bg-[#F5F5F4] text-[#18181B] border border-[#E7E5E4] px-8 py-4 rounded-xl font-medium transition-all shadow-md">
            Post Free Ad
          </button>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-6 border-t border-[#E7E5E4] max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[#b70a10]" />
            <span className="text-sm font-medium text-[#18181B]">
              Owner Listed Vehicles
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[#b70a10]" />
            <span className="text-sm font-medium text-[#18181B]">
              Direct Contact
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[#b70a10]" />
            <span className="text-sm font-medium text-[#18181B]">
              Safer Enquiry Flow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
