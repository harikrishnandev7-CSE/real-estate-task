import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, DollarSign, Camera, CheckCircle, ArrowRight, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const SellPropertyPage = () => {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    city: 'Chennai',
    type: 'Villa',
    expectedPrice: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Property listing submission received.");
  };

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Sell Property' }
          ]}
          eyebrow="DISCRETIONARY MARKETING"
          heading={
            <>List Your Signature <span className="font-normal text-[#5D6472]">Estate</span></>
          }
          description="Access our confidential private client network of high-net-worth investors and family offices."
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 font-sans">
        <div className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-8 md:p-10 shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3
                className="text-2xl font-bold text-[#363C46]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                Property Listing Form
              </h3>

              <div className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-[10px] uppercase text-[#5D6472] mb-1">Property Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sea-facing Villa in ECR"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-[#5D6472] mb-1">City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                    >
                      <option value="Chennai">Chennai</option>
                      <option value="Coimbatore">Coimbatore</option>
                      <option value="Bangalore">Bangalore</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#5D6472] mb-1">Expected Price</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹12.5 Cr"
                      value={formData.expectedPrice}
                      onChange={(e) => setFormData({...formData, expectedPrice: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#5D6472] mb-1">Contact Phone</label>
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

              <button
                type="submit"
                className="w-full py-4 bg-[#363C46] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Submit for Valuation Audit
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-xl font-bold text-[#363C46]">Submission Registered</h4>
              <p className="text-xs text-[#5D6472]">Our private client desk will get in touch within 24 hours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellPropertyPage;
