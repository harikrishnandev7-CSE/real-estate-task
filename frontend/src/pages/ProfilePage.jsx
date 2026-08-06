import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Sparkles, Check, ArrowRight, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useApp();

  // Hooks must execute unconditionally at the top level
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    state: currentUser?.state || 'Tamil Nadu',
    city: currentUser?.city || 'Chennai',
    purpose: currentUser?.purpose || 'Buy',
    propertyTypes: currentUser?.propertyTypes || ['Villa'],
    budget: currentUser?.budget || '₹2Cr–₹5Cr',
    locations: currentUser?.locations || ['ECR', 'Chennai']
  });

  const [isSaved, setIsSaved] = useState(false);

  // Conditional rendering placed AFTER all hooks have executed
  if (!currentUser) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] flex flex-col items-center justify-center font-sans px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center shadow-md">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Log In Required</h2>
        <Link to="/login" className="px-8 py-3 bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white uppercase tracking-wider rounded-full shadow-md transition-all">
          Log In
        </Link>
      </div>
    );
  }

  const availableCities = ['Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Goa', 'Ooty', 'Kodaikanal'];
  const availableStates = ['Tamil Nadu', 'Karnataka', 'Telangana', 'Maharashtra', 'Goa', 'Delhi NCR'];
  const propertyTypesOptions = ['Villa', 'Apartment', 'Plot', 'Commercial'];
  const budgetOptions = ['Below ₹50L', '₹50L–₹1Cr', '₹1Cr–₹2Cr', '₹2Cr–₹5Cr', '₹5Cr+'];
  const locationOptions = ['Chennai', 'ECR', 'OMR', 'Bangalore', 'Coimbatore', 'Ooty', 'Kodaikanal', 'Hyderabad', 'Mumbai', 'Goa'];

  const handleTypeToggle = (type) => {
    setFormData(prev => {
      const exists = prev.propertyTypes.includes(type);
      if (exists) {
        if (prev.propertyTypes.length === 1) return prev;
        return { ...prev, propertyTypes: prev.propertyTypes.filter(t => t !== type) };
      } else {
        return { ...prev, propertyTypes: [...prev.propertyTypes, type] };
      }
    });
  };

  const handleLocationToggle = (loc) => {
    setFormData(prev => {
      const exists = prev.locations.includes(loc);
      if (exists) {
        if (prev.locations.length === 1) return prev;
        return { ...prev, locations: prev.locations.filter(l => l !== loc) };
      } else {
        return { ...prev, locations: [...prev.locations, loc] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({
        fullName: formData.name,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        preferences: {
          purpose: formData.purpose,
          propertyTypes: formData.propertyTypes,
          budget: formData.budget,
          locations: formData.locations,
        }
      });
      setIsSaved(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err) {}
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full mx-auto px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5A623] font-bold block">
            PROFILE & INVESTMENT PREFERENCES
          </span>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Edit Your VIP Preferences
          </h1>
          <p className="text-xs text-[#8A8A85] font-normal max-w-md mx-auto">
            Updates to your preferences instantly re-tune your personalized recommendations feed.
          </p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-8">
          
          {/* SECTION 1: PERSONAL INFORMATION */}
          <div className="space-y-4">
            <div className="border-b border-[#E8E4DA] pb-2">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#F5A623] font-sans flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Personal Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-3 text-xs text-[#1A1A1A] font-medium outline-none focus:border-[#F5A623]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-3 text-xs text-[#1A1A1A] font-medium outline-none focus:border-[#F5A623]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-3 text-xs text-[#1A1A1A] font-medium outline-none focus:border-[#F5A623]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-3 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] cursor-pointer"
                >
                  {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: INVESTMENT PREFERENCES */}
          <div className="space-y-5 border-t border-[#E8E4DA] pt-6">
            <div className="border-b border-[#E8E4DA] pb-2">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#F5A623] font-sans flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Recommendation Criteria
              </h3>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">Primary Purpose</label>
              <div className="grid grid-cols-2 gap-3">
                {['Buy', 'Rent'].map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setFormData({ ...formData, purpose: p })}
                    className={`py-3 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${formData.purpose === p ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-[#F4F1EA] text-[#8A8A85] border-[#E8E4DA] hover:text-[#1A1A1A]'}`}
                  >
                    {p === 'Buy' ? 'Acquire / Buy' : 'Lease / Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Interested Property Types */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">Property Types</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans">
                {propertyTypesOptions.map(t => {
                  const isSelected = formData.propertyTypes.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleTypeToggle(t)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isSelected ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs' : 'bg-[#F4F1EA] border-[#E8E4DA] text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#F5A623] stroke-[3]" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">Budget Range</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-sans">
                {budgetOptions.map(b => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setFormData({ ...formData, budget: b })}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${formData.budget === b ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs' : 'bg-[#F4F1EA] border-[#E8E4DA] text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Locations */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">Preferred Locations</label>
              <div className="flex flex-wrap gap-2 font-sans">
                {locationOptions.map(l => {
                  const isSelected = formData.locations.includes(l);
                  return (
                    <button
                      type="button"
                      key={l}
                      onClick={() => handleLocationToggle(l)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs' : 'bg-[#F4F1EA] border-[#E8E4DA] text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#F5A623] stroke-[3]" />}
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Save className="w-4 h-4 text-[#F5A623]" />
              {isSaved ? 'SAVING CHANGES...' : 'SAVE & REFRESH FEED'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-4 border border-[#E8E4DA] text-[#8A8A85] hover:text-[#1A1A1A] hover:border-[#1A1A1A] text-xs font-bold rounded-full cursor-pointer transition-all"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProfilePage;
