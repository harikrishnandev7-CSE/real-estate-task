import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const OnboardingPreferencesPage = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useApp();

  const [formData, setFormData] = useState({
    purpose: currentUser?.purpose || 'Buy',
    propertyTypes: currentUser?.propertyTypes || ['Villa'],
    budget: currentUser?.budget || '₹2Cr–₹5Cr',
    locations: currentUser?.locations || ['ECR', 'Chennai']
  });

  const propertyTypesOptions = ['Villa', 'Apartment', 'Plot', 'Commercial'];
  const budgetOptions = ['Below ₹50L', '₹50L – ₹1Cr', '₹1Cr – ₹2Cr', '₹2Cr – ₹5Cr', '₹5Cr+'];
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

  const handleContinue = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    // Route to Step 3: Welcome Page
    navigate('/welcome');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#E0EEE9] text-[#363C46] flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full mx-auto px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block">
            STEP 2 OF 3 — LIFESTYLE PROFILER
          </span>
          <h1
            className="text-3xl sm:text-4xl font-medium text-[#363C46] tracking-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Let's personalize your experience.
          </h1>
          <p className="text-xs text-[#5D6472] font-normal max-w-md mx-auto leading-relaxed">
            Help us recommend properties that match your lifestyle.
          </p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleContinue} className="p-8 sm:p-10 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-8">
          
          {/* 1. Purpose */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block">Primary Purpose</label>
            <div className="grid grid-cols-2 gap-4">
              {['Buy', 'Rent'].map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setFormData({ ...formData, purpose: p })}
                  className={`py-3.5 rounded-lg border text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${formData.purpose === p ? 'bg-[#363C46] text-white border-[#363C46]' : 'bg-[#E0EEE9]/50 text-[#5D6472] border-[rgba(93,100,114,0.20)] hover:text-[#363C46]'}`}
                >
                  {p === 'Buy' ? 'Acquire / Buy' : 'Lease / Rent'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interested Property Types */}
          <div className="space-y-3 font-sans">
            <label className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block">Interested Property Types (Select Multiple)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {propertyTypesOptions.map(t => {
                const isSelected = formData.propertyTypes.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => handleTypeToggle(t)}
                    className={`p-3.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isSelected ? 'bg-[#363C46] text-white border-[#363C46] shadow-xs' : 'bg-[#E0EEE9]/50 border-[rgba(93,100,114,0.20)] text-[#5D6472] hover:text-[#363C46]'}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#CFB6A8] stroke-[3]" />}
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Preferred Budget */}
          <div className="space-y-3 font-sans">
            <label className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block">Preferred Budget</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {budgetOptions.map(b => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setFormData({ ...formData, budget: b })}
                  className={`p-3 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${formData.budget === b ? 'bg-[#363C46] text-white border-[#363C46] shadow-xs' : 'bg-[#E0EEE9]/50 border-[rgba(93,100,114,0.20)] text-[#5D6472] hover:text-[#363C46]'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Preferred Locations */}
          <div className="space-y-3 font-sans">
            <label className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block">Preferred Locations (Select Multiple)</label>
            <div className="flex flex-wrap gap-2.5">
              {locationOptions.map(l => {
                const isSelected = formData.locations.includes(l);
                return (
                  <button
                    type="button"
                    key={l}
                    onClick={() => handleLocationToggle(l)}
                    className={`px-3.5 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected ? 'bg-[#363C46] text-white border-[#363C46] shadow-xs' : 'bg-[#E0EEE9]/50 border-[rgba(93,100,114,0.20)] text-[#5D6472] hover:text-[#363C46]'}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#CFB6A8] stroke-[3]" />}
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="px-6 py-3.5 border border-[rgba(93,100,114,0.20)] text-[#5D6472] hover:text-[#363C46] hover:border-[#363C46] text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#363C46] hover:bg-[#1A1A1A] text-white font-bold text-xs tracking-[0.2em] uppercase rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-[#CFB6A8]" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OnboardingPreferencesPage;
