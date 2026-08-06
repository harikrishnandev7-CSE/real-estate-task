import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, ArrowRight, MapPin, Phone, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Thank you for subscribing to IMPERIA ESTATES Private Newsletter.');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const columnVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 15 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  const linkUnderlineVariants = {
    hidden: { width: 0 },
    hover: { 
      width: "100%",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const footerLinksCompany = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Properties', href: '/buy' },
    { name: 'Projects', href: '/projects' },
    { name: 'Insights / Blog', href: '/blog' }
  ];

  const footerLinksServices = [
    { name: 'Services Suite', href: '/services' },
    { name: 'Legal Verification', href: '/services/legal-verification' },
    { name: 'Home Financing', href: '/services/home-financing' },
    { name: 'Interior Design', href: '/services/interior-design' }
  ];

  const footerLinksLegal = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ Support', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ];

  return (
    <footer className="bg-[#1A1A1A] border-t border-neutral-800 pt-20 pb-10 text-neutral-400 font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-16"
      >
        
        {/* Brand Description Column */}
        <motion.div variants={columnVariants} className="lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <span className="font-sans text-2xl font-bold tracking-[0.25em] text-white group-hover:text-[#F5A623] transition-colors">
              IMPERIA ESTATES
            </span>
            <span className="h-2 w-2 rounded-full bg-[#F5A623]"></span>
          </Link>
          <p className="text-sm font-normal text-neutral-400 leading-relaxed max-w-sm">
            Curators of the world's most exceptional residential real estate. We deliver bespoke brokerage services, legal advisory, and high-capital growth asset allocations for discerning individuals.
          </p>
          <div className="flex space-x-4">
            <motion.a 
              whileHover={{ scale: 1.1, backgroundColor: "#F5A623", color: "#1A1A1A" }}
              whileTap={{ scale: 0.95 }}
              href="#" 
              className="p-2.5 rounded-full bg-white/10 text-white transition-colors duration-300 flex items-center justify-center cursor-pointer" 
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, backgroundColor: "#F5A623", color: "#1A1A1A" }}
              whileTap={{ scale: 0.95 }}
              href="#" 
              className="p-2.5 rounded-full bg-white/10 text-white transition-colors duration-300 flex items-center justify-center cursor-pointer" 
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.625L17 8h-4V6.5c0-.828.672-1 1-1h3V1h-4c-3.314 0-5 1.686-5 5V8z" />
              </svg>
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, backgroundColor: "#F5A623", color: "#1A1A1A" }}
              whileTap={{ scale: 0.95 }}
              href="#" 
              className="p-2.5 rounded-full bg-white/10 text-white transition-colors duration-300 flex items-center justify-center cursor-pointer" 
              aria-label="Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, backgroundColor: "#F5A623", color: "#1A1A1A" }}
              whileTap={{ scale: 0.95 }}
              href="#" 
              className="p-2.5 rounded-full bg-white/10 text-white transition-colors duration-300 flex items-center justify-center cursor-pointer" 
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </motion.a>
          </div>
        </motion.div>

        {/* Company Links Column */}
        <motion.div variants={columnVariants}>
          <h4 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-6">Company</h4>
          <ul className="space-y-3.5 text-sm font-normal">
            {footerLinksCompany.map((link, idx) => (
              <li key={idx}>
                <Link 
                  to={link.href}
                  className="relative inline-block hover:text-[#F5A623] transition-colors duration-300 py-0.5 cursor-pointer group"
                >
                  {link.name}
                  <motion.span 
                    variants={linkUnderlineVariants}
                    className="absolute bottom-0 left-0 h-[2px] bg-[#F5A623] group-hover:w-full w-0"
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Services Links Column */}
        <motion.div variants={columnVariants}>
          <h4 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-6">Services</h4>
          <ul className="space-y-3.5 text-sm font-normal">
            {footerLinksServices.map((link, idx) => (
              <li key={idx}>
                <Link 
                  to={link.href}
                  className="relative inline-block hover:text-[#F5A623] transition-colors duration-300 py-0.5 cursor-pointer group"
                >
                  {link.name}
                  <motion.span 
                    variants={linkUnderlineVariants}
                    className="absolute bottom-0 left-0 h-[2px] bg-[#F5A623] group-hover:w-full w-0"
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Legal Links Column */}
        <motion.div variants={columnVariants}>
          <h4 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-6">Support & Legal</h4>
          <ul className="space-y-3.5 text-sm font-normal">
            {footerLinksLegal.map((link, idx) => (
              <li key={idx}>
                <Link 
                  to={link.href}
                  className="relative inline-block hover:text-[#F5A623] transition-colors duration-300 py-0.5 cursor-pointer group"
                >
                  {link.name}
                  <motion.span 
                    variants={linkUnderlineVariants}
                    className="absolute bottom-0 left-0 h-[2px] bg-[#F5A623] group-hover:w-full w-0"
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter Signup Column */}
        <motion.div variants={columnVariants} className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.2em] text-white font-bold">Newsletter</h4>
          <p className="text-sm font-normal text-neutral-400 leading-relaxed">
            Subscribe to receive private previews of off-market listings and architectural insights.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-neutral-700 focus-within:border-[#F5A623] py-1 transition-colors">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full py-1 text-white placeholder-neutral-500 font-sans"
              required
            />
            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.1, color: "#F5A623" }}
              whileTap={{ scale: 0.9 }}
              className="text-neutral-400 transition-colors cursor-pointer"
              aria-label="Subscribe"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>
          {subscribed && (
            <p className="text-xs text-[#F5A623] animate-fade-in font-semibold">Thank you for subscribing to IMPERIA ESTATES newsletter.</p>
          )}
        </motion.div>

      </motion.div>

      {/* Contact info and Copyright bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-neutral-800 pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-normal tracking-wide text-neutral-400">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>72 Park Avenue, New York, NY 10021</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>+1 (800) 555-IMPERIA</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>concierge@imperiaestates.com</span>
        </div>
        <div className="lg:text-right mt-4 md:mt-0">
          <span>&copy; {new Date().getFullYear()} IMPERIA ESTATES. All rights reserved. RERA Regd: NY-0038495.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
