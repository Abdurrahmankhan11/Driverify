import React from 'react';
import { Car } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer">
              <i className="fa-regular fa-handshake text-xl text-primary"></i>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Second<span className="text-primary">Ride</span>
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm pr-4">
              SecondRide is an owner-to-owner marketplace for buying and selling used cars and bikes. Direct deals, verified listings, and zero commissions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Buy Cars</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Buy Bikes</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Sell Vehicle</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">How It Works</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Safety Tips</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Terms & Conditions</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li>support@secondride.com</li>
              <li>+91 1800 123 4567</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm font-medium">
            © 2026 SecondRide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
