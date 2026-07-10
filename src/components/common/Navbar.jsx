import React, { useState, useEffect } from 'react';
import { Menu, X, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    // { name: 'Brand', href: '#popular-brands' },
    { name: 'Featured', href: '#featured-vehicles' },
    { name: 'Buy vehicles ', href: '#buy-vehicle' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Safety', href: '#safety' },
    { name: 'Sell', href: '#sell-vehicle' },
    // { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-md border-[#E7E5E4] shadow-sm py-3' : 'bg-white border-transparent py-5'}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            {/* <div className="text-[#b70a10]">
              <Car size={26} strokeWidth={2.5} />
            </div> */}
            <i class="fa-regular fa-handshake text-xl text-[#b70a10]"></i>
            <span className="text-2xl font-bold tracking-tight text-[#18181B]">
              Second<span className="text-[#b70a10]">Ride</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#57534E] hover:text-[#b70a10] font-medium transition-colors duration-200 "
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-[#57534E] hover:text-[#18181B] font-semibold transition-colors text-sm focus:outline-none cursor-pointer py-2">
                  <span className="w-8 h-8 rounded-full bg-[#b70a10]/10 text-[#b70a10] flex items-center justify-center font-bold uppercase select-none">
                    {user?.full_name ? user.full_name[0] : (user?.phone ? '#' : '@')}
                  </span>
                  <span className="max-w-[120px] truncate">{user?.full_name || 'My Profile'}</span>
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block transition-all z-50">
                  <div className="bg-white border border-[#E7E5E4] rounded-xl shadow-lg py-2">
                    <button
                      onClick={() => navigate('/complete-profile')}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#18181B] hover:bg-[#F5F5F4] transition-colors flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <i className="fa-regular fa-user"></i>
                      {user?.profile_complete ? 'Edit Profile' : 'Complete Profile'}
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/${(user?.role || 'USER').toLowerCase()}`)}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#18181B] hover:bg-[#F5F5F4] transition-colors flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <i className="fa-solid fa-table-columns"></i>
                      Dashboard
                    </button>
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-[#F5F5F4] transition-colors flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-[#18181B] hover:bg-[#27272A] text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer">
                Login <i className="fa-solid fa-arrow-right-to-bracket"></i>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#57534E] hover:text-[#b70a10] focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out border-b border-[#E7E5E4] ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden border-transparent'}`}>
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-3 rounded-lg text-sm font-medium text-[#18181B] hover:text-[#b70a10] hover:bg-[#F5F5F4]"
            >
              {link.name}
            </a>
          ))}
          {isAuthenticated ? (
            <div className="pt-4 flex flex-col gap-2 border-t border-[#E7E5E4] mt-4">
              <div className="px-3 py-1 text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                Account ({user?.full_name || 'Active Session'})
              </div>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/complete-profile'); }}
                className="w-full text-left px-3 py-3 rounded-lg font-medium text-[#18181B] hover:bg-[#F5F5F4] transition-colors text-sm flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-regular fa-user"></i>
                {user?.profile_complete ? 'Edit Profile' : 'Complete Profile'}
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate(`/dashboard/${(user?.role || 'USER').toLowerCase()}`); }}
                className="w-full text-left px-3 py-3 rounded-lg font-medium text-[#18181B] hover:bg-[#F5F5F4] transition-colors text-sm flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-table-columns"></i>
                Dashboard
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/'); }}
                className="w-full text-left px-3 py-3 rounded-lg font-medium text-red-600 hover:bg-[#F5F5F4] transition-colors text-sm flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 flex flex-col gap-3 border-t border-[#E7E5E4] mt-4">
              <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="w-full text-center px-4 py-3 rounded-lg font-medium text-white bg-[#18181B] hover:bg-[#27272A] transition-colors text-sm cursor-pointer">
                Login <i className="fa-solid fa-arrow-right-to-bracket"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
