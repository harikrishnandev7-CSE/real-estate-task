import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImperiaLogo from './ImperiaLogo';

const Footer = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Thank you for subscribing to IMPERIA ESTATES Private Newsletter.');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const footerLinksCompany = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Properties', href: '/buy' },
    { name: 'Projects', href: '/projects' },
    { name: 'Insights / Journal', href: '/blog' }
  ];

  const footerLinksPortal = [
    { name: 'My Wishlist', href: '/wishlist' },
    { name: 'Compare Estates', href: '/compare' },
    { name: 'My Bookings', href: '/my-bookings' },
    { name: 'VIP Dashboard', href: '/dashboard' }
  ];

  const footerLinksServices = [
    { name: 'Services Suite', href: '/services' },
    { name: 'Legal Verification', href: '/services/legal-verification' },
    { name: 'Home Financing', href: '/services/home-financing' },
    { name: 'Interior Architecture', href: '/services/interior-design' }
  ];

  const footerLinksLegal = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ Support', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ];

  const FooterLink = ({ href, children }) => (
    <li>
      <Link
        to={href}
        className="text-xs md:text-sm text-[#E5E5E5] font-medium transition-all duration-300 hover:text-[#C6A66B] hover:translate-x-1 inline-block"
      >
        {children}
      </Link>
    </li>
  );

  return (
    <footer className="bg-[#0B0B0B] text-white pt-20 pb-12 border-t border-[rgba(198,166,107,0.3)] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-16">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-5">
          <Link to="/" className="inline-block" aria-label="IMPERIA Home">
            <ImperiaLogo layout="lockup" variant="light" height={34} />
          </Link>
          <p className="text-xs md:text-sm text-[#D4D4D4] leading-relaxed max-w-sm font-normal">
            Curators of fine luxury real estate, architectural estates, and commercial yield portfolios across premier South Indian micro-markets.
          </p>

          <div className="pt-2 space-y-2 text-xs text-[#E5E5E5] font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0" />
              <span>Boat Club & ECR Road, Chennai, Tamil Nadu</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C6A66B] shrink-0" />
              <span>+91 98765 43210 / Concierge desk</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C6A66B] shrink-0" />
              <span>private@imperiaestates.com</span>
            </div>
          </div>
        </div>

        {/* Client Portal Links */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold">Client Portal</h4>
          <ul className="space-y-3">
            {footerLinksPortal.map((link, idx) => (
              <FooterLink key={idx} href={link.href}>{link.name}</FooterLink>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold">Company</h4>
          <ul className="space-y-3">
            {footerLinksCompany.map((link, idx) => (
              <FooterLink key={idx} href={link.href}>{link.name}</FooterLink>
            ))}
          </ul>
        </div>

        {/* Services Links */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold">Services</h4>
          <ul className="space-y-3">
            {footerLinksServices.map((link, idx) => (
              <FooterLink key={idx} href={link.href}>{link.name}</FooterLink>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold">Legal</h4>
          <ul className="space-y-3">
            {footerLinksLegal.map((link, idx) => (
              <FooterLink key={idx} href={link.href}>{link.name}</FooterLink>
            ))}
          </ul>
        </div>

      </div>

      {/* Confidential Newsletter Row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <div className="p-8 rounded-2xl bg-white/5 border border-[rgba(198,166,107,0.25)] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Subscribe for Confidential Market Intelligence
            </h4>
            <p className="text-xs text-[#D4D4D4]">Receive quarterly private valuation reports and off-market estate notifications.</p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-3">
            <input
              type="email"
              placeholder="Enter your private email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-80 bg-[#111111] border border-[#BFA76F] focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-white/50 font-medium outline-none transition-all"
              required
            />
            <button
              type="submit"
              className="bg-[#C6A66B] hover:bg-white hover:text-[#0B0B0B] text-[#0B0B0B] font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-[rgba(198,166,107,0.2)] flex flex-col md:flex-row justify-between items-center text-xs text-[#D4D4D4] gap-4">
        <p className="font-medium">© {new Date().getFullYear()} IMPERIA ESTATES. All rights reserved.</p>
        <div className="flex gap-8 font-medium">
          <Link to="/privacy" className="hover:text-[#C6A66B] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#C6A66B] transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-[#C6A66B] transition-colors">Concierge Help</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
