import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const Contact = () => {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message transmitted to IMPERIA Advisory Desk.");
  };

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Contact' }
          ]}
          eyebrow="PRIVATE ADVISORY DESK"
          heading={
            <>Connect With <span className="font-normal text-[#5D6472]">IMPERIA</span></>
          }
          description="Direct access to our senior real estate advisors, private client desk, and commercial yield specialists."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Office Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3
                className="text-2xl font-bold text-[#363C46]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                Global Headquarters
              </h3>
              <p className="text-xs text-[#5D6472] leading-relaxed">
                Schedule a personal consultation at our private client lounge in Chennai or request an advisor visit to your location.
              </p>
            </div>

            <div className="space-y-4 text-xs font-bold text-[#363C46]">
              <div className="flex items-center gap-3 p-4 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl shadow-xs">
                <MapPin className="w-5 h-5 text-[#CFB6A8]" />
                <div>
                  <p className="text-[10px] uppercase text-[#5D6472]">Address</p>
                  <p>IMPERIA Tower, ECR Road, Neelankarai, Chennai 600115</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl shadow-xs">
                <Phone className="w-5 h-5 text-[#CFB6A8]" />
                <div>
                  <p className="text-[10px] uppercase text-[#5D6472]">Phone Hotline</p>
                  <p>+91 (044) 4800 9000 / +91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl shadow-xs">
                <Mail className="w-5 h-5 text-[#CFB6A8]" />
                <div>
                  <p className="text-[10px] uppercase text-[#5D6472]">Direct Email</p>
                  <p>concierge@imperiaestates.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-8 md:p-10 shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3
                  className="text-2xl font-bold text-[#363C46]"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  Transmit Private Inquiry
                </h3>

                <div className="space-y-4 text-xs font-bold">
                  <div>
                    <label className="block text-[10px] uppercase text-[#5D6472] mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-[#5D6472] mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#5D6472] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#5D6472] mb-1">Inquiry Message</label>
                    <textarea
                      rows={4}
                      placeholder="Specify your investment parameters or property preferences..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#363C46] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <Check className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-bold text-[#363C46]">Inquiry Transmitted</h4>
                <p className="text-xs text-[#5D6472]">A senior advisor will contact you within 2 hours.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
