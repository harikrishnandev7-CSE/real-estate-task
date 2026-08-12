import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Key, Save, Camera, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const ProfilePage = () => {
  const { currentUser, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Venkatesh Iyer',
    email: currentUser?.email || 'venkatesh.iyer@example.com',
    phone: currentUser?.phone || '+91 98765 43210',
    city: 'Chennai',
    preferredCategory: 'Architectural Villas'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    showToast("Profile details updated.");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans pb-20">
      <PageHero
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Profile' }
        ]}
        eyebrow="VIP MEMBER CONSOLE"
        heading="Account Settings"
        description="Manage your private profile details, VIP client tier credentials, contact preferences, and security settings."
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 font-sans">
        <div className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-8 md:p-10 shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-8">
          <div className="flex items-center gap-6 border-b border-[rgba(93,100,114,0.15)] pb-6">
            <div className="w-20 h-20 rounded-full bg-[#E0EEE9] border-2 border-[#CFB6A8] flex items-center justify-center text-[#363C46] font-bold text-2xl">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h3
                className="text-2xl font-bold text-[#363C46]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                {formData.name}
              </h3>
              <p className="text-xs text-[#CFB6A8] font-bold uppercase tracking-wider">Private Member</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-bold">
              <div>
                <label className="block text-[10px] uppercase text-[#5D6472] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#5D6472] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#5D6472] mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                  className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#5D6472] mb-1.5">Primary Location</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg p-3 text-[#363C46] outline-none focus:border-[#CFB6A8]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#363C46] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-[#CFB6A8]" />}
                {saved ? 'Changes Saved' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
