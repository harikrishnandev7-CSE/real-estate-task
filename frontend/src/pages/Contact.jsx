import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const Contact = () => {
  const { showToast, addInquiry } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', reason: 'Sourcing Briefing', notes: '' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setIsSubmitting(true);
      try {
        if (addInquiry) {
          await addInquiry({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            type: formData.reason,
            message: formData.notes,
          });
        }
        setIsSubmitting(false);
        setSubmitted(true);
      } catch (err) {
        setIsSubmitting(false);
        if (showToast) showToast(`Submission error: ${err.message}`, 'error');
      }
    }
  };

  const officeLocations = [
    {
      city: "Chennai Corporate HQ",
      address: "Suite 404, Vardhan Towers, Khader Nawaz Khan Rd, Nungambakkam, Chennai - 600006",
      phone: "+91 44 4829 0987",
      email: "chn.concierge@imperiaestates.com"
    },
    {
      city: "Coimbatore Sourcing Hub",
      address: "7B, Residency Corridor, Race Course Road, Coimbatore - 641018",
      phone: "+91 422 2849 0846",
      email: "cbe.concierge@imperiaestates.com"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      
      {/* Hero */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Contact' },
          ]}
          eyebrow="CONTACT US"
          heading={
            <>Initiate a <span className="font-normal text-[#8A8A85]">Briefing</span></>
          }
          description="Connect with our private acquisitions desk. Complete our secure briefing registry below or contact our offices directly."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-24 font-sans">
        
        {/* CONTACT FORM & LOCATIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* FORM COLUMN */}
          <div className="lg:col-span-7 border border-[#E8E4DA] bg-white rounded-3xl p-8 md:p-12 space-y-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold">CLIENT REGISTRY</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">Private Acquisition Brief</h2>
              <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                Submit your requirement details. All submissions are encrypted and routed directly to a senior relationship manager.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-[#F5A623]/30 bg-amber-50 rounded-2xl p-8 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#F5A623] text-white flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-[#1A1A1A]">Acquisition Brief Received</h4>
                <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                  Thank you, {formData.name}. A senior officer will contact you within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[#F5A623] font-bold underline cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Vikramaditya Reddy" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] rounded-xl px-4 py-3.5 text-[#1A1A1A] font-medium outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. redak@familyoffice.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] rounded-xl px-4 py-3.5 text-[#1A1A1A] font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Phone Coordinate</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +91 98765 43210" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] rounded-xl px-4 py-3.5 text-[#1A1A1A] font-medium outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Nature of Inquiry</label>
                    <select 
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] rounded-xl px-4 py-3.5 text-[#1A1A1A] font-bold outline-none cursor-pointer"
                    >
                      <option value="Sourcing Briefing">Villa Sourcing Briefing</option>
                      <option value="Legal Verification">Legal Verification Audit</option>
                      <option value="Home Financing">Private Banking Loan Structuring</option>
                      <option value="Interior Atelier">Interior Design Consultation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Requirements / Specifications</label>
                  <textarea 
                    rows="4" 
                    placeholder="Specify target location, budget parameters, BHK configuration, or timeline..." 
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] rounded-xl p-4 text-[#1A1A1A] font-medium outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#F5A623]" />
                  <span>Transmit Private Brief</span>
                </button>
              </form>
            )}
          </div>

          {/* LOCATIONS COLUMN */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold">REGIONAL OFFICES</span>
              <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Our Advisory Hubs</h3>
              <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                Visit our private client suites for in-person consultations with senior partners.
              </p>
            </div>

            <div className="space-y-6">
              {officeLocations.map((office, idx) => (
                <div key={idx} className="border border-[#E8E4DA] bg-white rounded-3xl p-6 space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-sans">
                  <h4 className="text-base font-bold text-[#1A1A1A] tracking-tight flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F5A623]" />
                    <span>{office.city}</span>
                  </h4>
                  <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">{office.address}</p>
                  
                  <div className="pt-2 border-t border-[#E8E4DA] space-y-1.5 text-xs font-semibold text-[#1A1A1A]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="border border-[#E8E4DA] bg-white p-6 rounded-3xl space-y-3 font-sans text-xs shadow-xs">
              <div className="flex items-center gap-2 text-[#F5A623] font-bold mb-2">
                <Clock className="w-4 h-4 stroke-[2]" />
                <span>Acquisitions Desk Hours</span>
              </div>
              <div className="flex justify-between text-[#8A8A85] font-medium">
                <span>Monday - Friday</span>
                <span className="text-[#1A1A1A] font-bold">09:00 AM - 07:00 PM</span>
              </div>
              <div className="flex justify-between text-[#8A8A85] font-medium">
                <span>Saturday Briefings</span>
                <span className="text-[#1A1A1A] font-bold">10:00 AM - 04:00 PM (Appt)</span>
              </div>
            </div>
          </div>

        </div>

        {/* GOOGLE MAPS PLACEHOLDER */}
        <div className="border border-[#E8E4DA] bg-white rounded-3xl h-[380px] relative overflow-hidden flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
          <div className="w-12 h-12 rounded-full bg-[#F5A623] text-white flex items-center justify-center shadow-xs">
            <MapPin className="w-6 h-6 stroke-[2] animate-bounce" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Interactive Office Locator</h4>
            <p className="text-xs text-[#8A8A85] max-w-sm mx-auto font-sans leading-relaxed font-normal">
              Centrally mapped across prime southern luxury zones. Select an office to calculate directions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 font-sans text-xs">
            <button 
              onClick={() => showToast("Directions to Chennai Corporate HQ initialized")}
              className="px-6 py-3 border border-[#E8E4DA] hover:border-[#F5A623] bg-[#F4F1EA] hover:bg-stone-200/50 rounded-full text-[#1A1A1A] font-bold cursor-pointer transition-colors"
            >
              Directions to Chennai Corporate HQ
            </button>
            <button 
              onClick={() => showToast("Directions to Coimbatore Hub initialized")}
              className="px-6 py-3 border border-[#E8E4DA] hover:border-[#F5A623] bg-[#F4F1EA] hover:bg-stone-200/50 rounded-full text-[#1A1A1A] font-bold cursor-pointer transition-colors"
            >
              Directions to Coimbatore Hub
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
