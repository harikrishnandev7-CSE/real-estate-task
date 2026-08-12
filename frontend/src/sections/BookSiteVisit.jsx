import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calendar, Phone, User, Check, ArrowRight } from 'lucide-react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setSubmitted(true);
      showToast(`Site visit tour reserved for ${formData.name}!`);
    }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#F8F6F2] text-[#111111] border-t border-[rgba(198,166,107,0.2)] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-4">
          <span className="eyebrow-accent">PRIVATE CONCIERGE</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
          >
            Begin Your Private <br />
            <span className="font-normal text-[#6B6B6B]">Residence Acquisition</span>
          </h2>
          <p className="text-[#6B6B6B] text-sm md:text-base font-normal leading-relaxed max-w-lg">
            Schedule a private, chauffeur-driven site visit to our exclusive gated estates. An expert property advisor will accompany you to detail zoning, title due diligence, and capital yields.
          </p>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-6">
          <div className="w-full max-w-md ml-auto bg-white p-8 md:p-10 rounded-2xl border border-[rgba(198,166,107,0.25)] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3
                    className="text-2xl font-bold text-[#0B0B0B] tracking-tight mb-4"
                    style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
                  >
                    Schedule Private Tour
                  </h3>

                  {/* Underline Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#111111] block">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-luxury"
                      required
                    />
                  </div>

                  {/* Underline Phone Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#111111] block">Phone Number</label>
                    <input 
                      type="tel" 
                      maxLength={10}
                      placeholder="9876543210" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                      className="input-luxury"
                      required
                    />
                  </div>

                  {/* Underline Date Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#111111] block">Preferred Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="input-luxury"
                      required
                    />
                  </div>

                  {/* Asset Dropdown */}
                  <div className="space-y-1 pt-2">
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#111111] block">Asset Preference</label>
                    <select 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="input-luxury cursor-pointer"
                    >
                      <option value="Villa">Architectural Villa</option>
                      <option value="Apartment">Sky Apartment</option>
                      <option value="Plot">Premium Land Plot</option>
                      <option value="Commercial">Commercial Asset</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-primary w-full mt-4 py-3.5"
                  >
                    <span>Reserve Chauffeur Visit</span>
                    <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4 font-sans">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] text-[#16161a] flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium text-[#16161a]" style={{ fontFamily: "'Fraunces', serif" }}>Tour Reserved</h3>
                    <p className="text-xs text-[#4a4a4f]">
                      Thank you, <span className="text-[#16161a] font-bold">{formData.name}</span>. A senior wealth advisor will contact you shortly to coordinate your private transit.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSiteVisit;
