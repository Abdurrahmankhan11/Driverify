import React from 'react';
import { ShieldCheck, SlidersHorizontal, MessageSquare, Zap, Search, PhoneCall, Car } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <ShieldCheck size={28} className="text-blue-600" />,
      title: 'Verified Listings',
      description: 'Every car goes through a rigorous background check and physical inspection before being listed.'
    },
    {
      icon: <SlidersHorizontal size={28} className="text-orange-500" />,
      title: 'Easy Search Filters',
      description: 'Find your dream car easily with our advanced search filters including budget, brand, and fuel type.'
    },
    {
      icon: <MessageSquare size={28} className="text-blue-600" />,
      title: 'Trusted Seller Enquiries',
      description: 'Connect directly with verified sellers. No hidden fees or middleman commissions.'
    },
    {
      icon: <Zap size={28} className="text-orange-500" />,
      title: 'Fast Car Posting',
      description: 'Sell your car faster. Create a listing in less than 5 minutes and reach thousands of buyers.'
    }
  ];

  const steps = [
    {
      icon: <Search size={24} className="text-white" />,
      title: 'Search Your Car',
      desc: 'Browse through thousands of verified cars.'
    },
    {
      icon: <PhoneCall size={24} className="text-white" />,
      title: 'Contact Seller',
      desc: 'Connect directly to negotiate the best deal.'
    },
    {
      icon: <Car size={24} className="text-white" />,
      title: 'Drive Your SecondRide',
      desc: 'Complete the paperwork and take your car home.'
    }
  ];

  return (
    <>
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Your journey to finding the perfect second-hand car is simple and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-6 transform hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Why Choose SecondRide
            </h2>
            <p className="text-lg text-slate-600">
              We provide a premium experience for both buyers and sellers, ensuring trust and quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 group">
                <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;
