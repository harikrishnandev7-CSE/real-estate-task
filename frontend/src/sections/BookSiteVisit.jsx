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
      boxShadow: "0 10px 25px rgba(207, 182, 168, 0.3)",
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
    <section className="relative py-24 md:py-28 lg:py-32 w-full flex items-center justify-center overflow-hidden border-t border-[rgba(93,100,114,0.15)] bg-[#E0EEE9] font-sans">
      {/* Background cinematic rendering */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ImageWithSkeleton 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80" 
          alt="Signature Luxury Estate Entrance" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#E0EEE9]/85 z-10" />
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
          <span className="text-xs uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block font-sans">PRIVATE CONCIERGE</span>
          <h2
            className="text-4xl md:text-6xl font-medium text-[#363C46] leading-tight tracking-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Begin Your Signature <br />
            <span className="font-normal text-[#CFB6A8]">Acquisition</span>
          </h2>
          <p className="text-[#5D6472] text-sm md:text-base font-normal tracking-wide leading-relaxed max-w-lg font-sans">
            Schedule a private, chauffeur-driven site visit to our exclusive gated estates. An expert property advisor will accompany you to detail zoning, title due diligence, and capital yields.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-4 text-xs text-[#363C46] font-bold font-sans">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#CFB6A8]" />
              <span>Chauffeur-Driven Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#CFB6A8]" />
              <span>One-on-One Partner Briefing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#CFB6A8]" />
              <span>Confidentiality Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Dynamic Reservation Form Column */}
        <div className="lg:col-span-6">
          <div className="w-full max-w-md ml-auto bg-white text-[#363C46] p-8 md:p-10 rounded-xl border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] relative font-sans">
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
                  <h3
                    className="text-2xl font-medium text-[#363C46] tracking-tight mb-6"
                    style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                  >
                    Schedule Private Tour
                  </h3>

                  {/* Name Input */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFB6A8]" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8] outline-none rounded-lg py-3.5 pl-12 pr-4 text-sm text-[#363C46] placeholder-[#5D6472]/60 font-sans font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFB6A8]" />
                    <input 
                      type="tel" 
                      placeholder="Contact Number" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8] outline-none rounded-lg py-3.5 pl-12 pr-4 text-sm text-[#363C46] placeholder-[#5D6472]/60 font-sans font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Date Input */}
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFB6A8]" />
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8] outline-none rounded-lg py-3.5 pl-12 pr-4 text-sm text-[#363C46] placeholder-[#5D6472]/60 font-sans font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Property Type Dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5D6472] mb-2 font-bold font-sans">Asset Preference</label>
                    <select 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8] outline-none rounded-lg py-3.5 px-4 text-sm text-[#363C46] font-sans font-bold transition-all cursor-pointer"
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
                    className="w-full py-4 bg-[#363C46] hover:bg-[#1A1A1A] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs cursor-pointer pt-3.5 transition-all font-sans"
                  >
                    CONFIRM BOOKING
                    <ArrowRight className="w-4 h-4 text-[#CFB6A8]" />
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
                  <div className="mx-auto w-16 h-16 rounded-full bg-[rgba(207,182,168,0.15)] border border-[#CFB6A8] text-[#CFB6A8] flex items-center justify-center">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[#363C46] tracking-tight">Tour Reserved</h3>
                    <p className="text-[#5D6472] text-xs font-normal leading-relaxed max-w-xs mx-auto">
                      Thank you, <span className="text-[#363C46] font-bold">{formData.name}</span>. A senior wealth advisor will call you within 15 minutes to coordinate your chauffeur transit.
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', date: '', propertyType: 'Villa' });
                    }}
                    className="px-6 py-2.5 border border-[rgba(93,100,114,0.20)] hover:border-[#363C46] text-xs font-bold uppercase tracking-wider text-[#363C46] hover:bg-[#E0EEE9] rounded-lg bg-white transition-all duration-300 cursor-pointer shadow-xs"
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
