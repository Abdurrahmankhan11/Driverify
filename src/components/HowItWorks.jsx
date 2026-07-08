import React from 'react';
import { Search, Phone, CheckCircle, Camera } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#18181B] mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-[#57534E]">
            Simple, transparent, and direct owner-to-owner deals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
          
          {/* Buyer Flow */}
          <div className="bg-[#F5F5F4] rounded-[24px] p-8 md:p-10 border border-[#E7E5E4]">
            <h3 className="text-xl font-bold text-[#18181B] mb-8">For Buyers</h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-[#E7E5E4] shadow-sm flex items-center justify-center text-[#b70a10] font-bold text-lg">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#18181B] mb-1">Search nearby vehicles</h4>
                  <p className="text-[#57534E]">Find cars and bikes listed directly by owners in your city without dealer margins.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-[#E7E5E4] shadow-sm flex items-center justify-center text-[#b70a10] font-bold text-lg">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#18181B] mb-1">Contact owner directly</h4>
                  <p className="text-[#57534E]">Use our platform to call or message the owner securely and schedule a viewing.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-[#E7E5E4] shadow-sm flex items-center justify-center text-[#b70a10] font-bold text-lg">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#18181B] mb-1">Inspect and finalize deal</h4>
                  <p className="text-[#57534E]">Check the vehicle, negotiate face-to-face, and finalize the paperwork directly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Flow */}
          <div className="bg-white rounded-[24px] p-8 md:p-10 border border-[#E7E5E4] shadow-sm">
            <h3 className="text-xl font-bold text-[#18181B] mb-8">For Sellers</h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F5F5F4] flex items-center justify-center text-[#b70a10]">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#18181B] mb-1">Post details</h4>
                  <p className="text-[#57534E]">Enter your vehicle's make, model, year, and condition in just a few clicks.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F5F5F4] flex items-center justify-center text-[#b70a10]">
                  <Camera size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#18181B] mb-1">Add photos and price</h4>
                  <p className="text-[#57534E]">Upload clear photos and set your expected price. Posting an ad is completely free.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F5F5F4] flex items-center justify-center text-[#b70a10]">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#18181B] mb-1">Receive buyer enquiries</h4>
                  <p className="text-[#57534E]">Get connected with genuine local buyers interested in your vehicle.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
