import React from 'react';
import { ShieldAlert, FileText, Search, CreditCard } from 'lucide-react';

const SafetyTips = () => {
  const tips = [
    {
      icon: <ShieldAlert size={20} className="text-[#b70a10]" />,
      text: 'Meet in a public, well-lit place for test drives and inspections.'
    },
    {
      icon: <FileText size={20} className="text-[#b70a10]" />,
      text: 'Verify the original RC (Registration Certificate) and active insurance.'
    },
    {
      icon: <Search size={20} className="text-[#b70a10]" />,
      text: 'Thoroughly inspect the vehicle or bring a trusted mechanic before payment.'
    },
    {
      icon: <CreditCard size={20} className="text-[#b70a10]" />,
      text: 'Never make advance payments before seeing the vehicle in person.'
    }
  ];

  return (
    <section id="safety" className="py-16 bg-white scroll-mt-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFAF9] rounded-[24px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 border border-[#E7E5E4]">
          
          <div className="md:w-1/3 text-center md:text-left">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 shadow-sm border border-[#E7E5E4]">
              <ShieldAlert size={32} className="text-[#b70a10]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#18181B] mb-4 tracking-tight">
              Buy and Sell Safely
            </h2>
            <p className="text-[#18181B]">
              Your security is our priority. Follow these essential safety guidelines for a smooth transaction.
            </p>
          </div>

          <div className="md:w-2/3">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E7E5E4]">
              <ul className="space-y-5">
                {tips.map((tip, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <div className="mt-1 shrink-0 bg-[#F5F5F4] p-2 rounded-lg border border-[#E7E5E4]">
                      {tip.icon}
                    </div>
                    <span className="text-[#18181B] font-medium pt-1">
                      {tip.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SafetyTips;
