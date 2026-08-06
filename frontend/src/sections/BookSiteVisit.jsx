import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calendar, Phone, User, Check, ArrowRight } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';

const BookSiteVisit = () => {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    propertyType: 'Villa'
  });
  const [submitted, setSubmitted] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20, 
      scale: 0.98 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03, 
      boxShadow: "0 10px 25px rgba(245, 166, 35, 0.3)",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { 
      scale: 0.97,
      transition: { duration: 0.1 }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setSubmitted(true);
      showToast(`Site visit tour reserved for ${formData.name}!`);
    }
  };

  return (
    <section className="relative py-24 md:py-28 lg:py-32 w-full flex items-center justify-center overflow-hidden border-t border-[#E8E4DA] bg-[#F4F1EA]">
      {/* Background cinematic rendering */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ImageWithSkeleton 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80" 
          alt="Signature Luxury Estate Entrance" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#F4F1EA]/80 z-10" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Editorial Copy Column */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block font-sans">PRIVATE CONCIERGE</span>
          <h2 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] leading-tight font-sans tracking-tight">
            Begin Your Signature <br />
            <span className="font-normal text-[#F5A623]">Acquisition</span>
          </h2>
          <p className="text-[#8A8A85] text-sm md:text-base font-normal tracking-wide leading-relaxed max-w-lg font-sans">
            Schedule a private, chauffeur-driven site visit to our exclusive gated estates. An expert property advisor will accompany you to detail zoning, title due diligence, and capital yields.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-4 text-xs text-[#1A1A1A] font-bold font-sans">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#F5A623]" />
              <span>Chauffeur-Driven Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#F5A623]" />
              <span>One-on-One Partner Briefing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#F5A623]" />
              <span>Confidentiality Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Dynamic Reservation Form Column */}
        <div className="lg:col-span-6">
          <div className="w-full max-w-md ml-auto bg-white text-[#1A1A1A] p-8 md:p-10 rounded-3xl border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative font-sans">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-6 font-sans">
                    Schedule Private Tour
                  </h3>

                  {/* Name Input */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5A623]" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#1A1A1A] placeholder-[#8A8A85] font-sans font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5A623]" />
                    <input 
                      type="tel" 
                      placeholder="Contact Number" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#1A1A1A] placeholder-[#8A8A85] font-sans font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Date Input */}
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5A623]" />
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] outline-none rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#1A1A1A] placeholder-[#8A8A85] font-sans font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Property Type Dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A8A85] mb-2 font-bold font-sans">Asset Preference</label>
                    <select 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] outline-none rounded-2xl py-3.5 px-4 text-sm text-[#1A1A1A] font-sans font-bold transition-all cursor-pointer"
                    >
                      <option value="Villa">Architectural Villa</option>
                      <option value="Apartment">Sky Apartment</option>
                      <option value="Plot">Premium Land Plot</option>
                      <option value="Commercial">Commercial Asset</option>
                      <option value="Signature">Signature Collection</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit" 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-md cursor-pointer pt-3.5 transition-all font-sans"
                  >
                    CONFIRM BOOKING
                    <ArrowRight className="w-4 h-4 text-[#F5A623]" />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 space-y-6 font-sans"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-[#F5A623]/10 border border-[#F5A623] text-[#F5A623] flex items-center justify-center">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Tour Reserved</h3>
                    <p className="text-[#8A8A85] text-xs font-normal leading-relaxed max-w-xs mx-auto">
                      Thank you, <span className="text-[#1A1A1A] font-bold">{formData.name}</span>. A senior wealth advisor will call you within 15 minutes to coordinate your chauffeur transit.
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', date: '', propertyType: 'Villa' });
                    }}
                    className="px-6 py-2.5 border border-[#E8E4DA] hover:border-[#1A1A1A] text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-[#F4F1EA] rounded-full bg-white transition-all duration-300 cursor-pointer shadow-xs"
                  >
                    BOOK ANOTHER TOUR
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default BookSiteVisit;
