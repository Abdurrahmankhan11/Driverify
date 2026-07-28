import React from 'react';
import { ShieldCheck, IndianRupee, Handshake, AlertCircle, Check, ArrowRight, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const MiddlemanServices = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12 pt-4">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-3 max-w-2xl">
          {/* <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Shield size={14} /> Trust & Safety
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Middleman Services
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Eliminate the risks of buying or selling used vehicles. Our verified professionals handle inspections, documentation, and secure fund transfers.
          </p>
        </div>
        <div className="shrink-0 hidden md:block">
          <div className="h-20 w-20 bg-muted/30 rounded-2xl flex items-center justify-center border border-border">
            <ShieldCheck size={36} className="text-primary/80" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-stretch">
        
        {/* Features - Left Column (takes up 3/5 on large screens) */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              Why use our Middleman Service?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Transacting directly with unknown parties can lead to fraud or misrepresentation. We step in as a neutral third party to protect both buyer and seller.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Thorough Inspection",
                desc: "Comprehensive physical and mechanical checks."
              },
              {
                title: "Secure Payments",
                desc: "Escrow-like handling of all financial transfers."
              },
              {
                title: "Paperwork Handled",
                desc: "RTO documentation and transfer assistance."
              },
              {
                title: "Fraud Prevention",
                desc: "Identity verification and strict safety protocols."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col gap-2 transition-colors">
                <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center mb-1">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing - Right Column (takes up 2/5 on large screens) */}
        <div className="lg:col-span-2">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border h-full flex flex-col p-6 sm:p-8">
            <div className="mb-6 pb-6 border-b border-border/50">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-1">
                <IndianRupee className="text-primary" size={20} /> 
                Service Fees
              </h2>
              <p className="text-xs text-muted-foreground">Transparent, flat-rate pricing.</p>
            </div>
            
            <div className="space-y-6 flex-1">
              
              {/* Success Fee */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Handshake className="h-5 w-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Successful Deal</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Charged only if the transaction completes successfully.</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-foreground">₹2,000</div>
                </div>
              </div>

              <div className="w-full h-px bg-border/50"></div>

              {/* Failure Fee */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Failed Deal</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Charged for inspection time if deal cancels mid-process.</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-foreground">₹500</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* CTA Section */}
      <div className="mt-8 bg-card border border-border rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-bold text-foreground">Ready to hire a Middleman?</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Go to any vehicle listing and click the <strong>"Hire a Middleman"</strong> button to initiate a secure transaction.
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <Button 
            className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background font-semibold"
            size="lg"
            onClick={() => window.location.href = '/#featured-vehicles'}
          >
            Browse Vehicles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};

export default MiddlemanServices;
