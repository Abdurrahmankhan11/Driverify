import React from 'react';
import { User, Car, Banknote, ShieldCheck } from 'lucide-react';

const WhySecondRide = () => {
  const features = [
    {
      icon: <User size={24} className="text-[#b70a10]" />,
      title: 'Direct Owner Deals',
      description: 'Connect strictly with real vehicle owners. No dealers, no hidden commissions.'
    },
    {
      icon: <Car size={24} className="text-[#b70a10]" />,
      title: 'Cars & Bikes in One Place',
      description: 'Whether you need a family car or a daily commuter bike, find them both here.'
    },
    {
      icon: <Banknote size={24} className="text-[#b70a10]" />,
      title: 'No Middleman Hassle',
      description: 'Negotiate the best price directly face-to-face and save money.'
    },
    {
      icon: <ShieldCheck size={24} className="text-[#b70a10]" />,
      title: 'Verified Listing Details',
      description: 'Listings are actively moderated to ensure a trustworthy marketplace experience.'
    }
  ];

  return (
    <section className="py-20 bg-[#F5F5F4] border-y border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#18181B] mb-4 tracking-tight">
            Why SecondRide?
          </h2>
          <p className="text-lg text-[#57534E]">
            We've built a platform focused entirely on transparency and connecting genuine people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-[#E7E5E4] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#FAFAF9] flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#18181B] mb-3">{feature.title}</h3>
              <p className="text-[#57534E] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySecondRide;
