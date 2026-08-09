import React from 'react';
import { ShieldCheck, Star, Calendar, Building2, Trophy, Clock, Phone, Mail, MessageCircle, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Property Badge: Amber badge
export const PropertyBadge = ({ label }) => {
  if (!label) return null;
  return (
    <span className="px-3 py-1 rounded-full bg-[#F5A623] text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-sm font-sans">
      {label}
    </span>
  );
};

// Status Badge: RERA check compliance status
export const StatusBadge = ({ rera }) => {
  if (!rera) return null;
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-sans">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      <span>RERA Approved</span>
    </div>
  );
};

// Furnishing Badge: UI Status Label (Full, Semi, None)
export const FurnishingBadge = ({ furnishing }) => {
  if (!furnishing) return null;
  const f = String(furnishing).toLowerCase();

  if (f === 'full' || f.includes('fully')) {
    return (
      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300 font-sans">
        <span className="text-xs">✔</span>
        <span>Fully Furnished</span>
      </div>
    );
  }
  if (f === 'semi' || f.includes('semi')) {
    return (
      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300 font-sans">
        <span className="text-xs">⚠️</span>
        <span>Semi Furnished</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-[10px] font-bold text-stone-700 uppercase tracking-wider bg-stone-200/80 px-3 py-1 rounded-full border border-stone-300 font-sans">
      <span className="text-xs">❌</span>
      <span>Unfurnished</span>
    </div>
  );
};

// Specification Card: Clean light layouts
export const SpecificationCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="border border-[#E8E4DA] bg-white rounded-2xl p-4 text-center font-sans shadow-sm">
      <span className="text-[#8A8A85] text-[10px] uppercase tracking-wider block font-semibold">{label}</span>
      <div className="flex items-center justify-center gap-2 mt-1">
        {Icon && <Icon className="w-4 h-4 text-[#F5A623] shrink-0" />}
        <p className="font-bold text-[#1A1A1A] text-sm">{value}</p>
      </div>
    </div>
  );
};

// Amenity Card: Rich micro-animated icon boxes
export const AmenityCard = ({ icon: Icon, name }) => {
  return (
    <div className="group flex items-center gap-3 p-4 border border-[#E8E4DA] rounded-2xl bg-white hover:border-[#F5A623] shadow-sm transition-all duration-300 cursor-pointer">
      <div className="p-2 rounded-xl bg-amber-50 text-[#F5A623] group-hover:bg-[#F5A623] group-hover:text-white transition-all duration-300 shrink-0">
        {Icon ? <Icon className="w-4.5 h-4.5 stroke-[2]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />}
      </div>
      <span className="text-xs font-sans font-semibold text-[#1A1A1A] transition-colors">
        {name}
      </span>
    </div>
  );
};

// Builder Card: Professional corporate profiles
export const BuilderCard = ({ name, experience, completed, ongoing, awards = [], description }) => {
  return (
    <div className="border border-[#E8E4DA] bg-white rounded-3xl p-6 md:p-8 space-y-6 font-sans shadow-md">
      <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
        <h4 className="text-xs uppercase tracking-widest text-[#8A8A85] font-bold">Master Builder Profile</h4>
        <div className="flex items-center gap-1.5 text-xs text-[#F5A623] font-bold">
          <Trophy className="w-4 h-4" />
          <span>Awards Winner</span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-4 rounded-2xl bg-amber-50 text-[#F5A623] border border-amber-100 shrink-0">
          <Building2 className="w-6 h-6 stroke-[2]" />
        </div>
        <div className="space-y-1">
          <h5 className="text-lg font-bold text-[#1A1A1A]">{name}</h5>
          <p className="text-xs text-[#8A8A85] font-medium">{experience} Years of Luxury Construction</p>
        </div>
      </div>

      <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
        {description}
      </p>

      {/* Builder metrics */}
      <div className="grid grid-cols-2 gap-4 border-t border-[#E8E4DA] pt-4">
        <div className="text-center bg-[#F4F1EA] rounded-xl p-3 border border-[#E8E4DA]">
          <span className="text-[9px] text-[#8A8A85] uppercase block font-semibold">Completed Projects</span>
          <span className="text-base font-bold text-[#1A1A1A]">{completed}+ Landmark Estates</span>
        </div>
        <div className="text-center bg-[#F4F1EA] rounded-xl p-3 border border-[#E8E4DA]">
          <span className="text-[9px] text-[#8A8A85] uppercase block font-semibold">Ongoing Projects</span>
          <span className="text-base font-bold text-[#1A1A1A]">{ongoing} active constructions</span>
        </div>
      </div>
    </div>
  );
};

// Agent Card: Designated concierge brokerage profiles
export const AgentCard = ({ name, designation = 'Luxury Real Estate Advisor', experience = 8, languages = [], phone, email }) => {
  const { openWhatsApp, showToast } = useApp();

  const isAssigned = Boolean(name && name !== 'Unassigned');

  const handleCall = () => {
    showToast(`Connecting to concierge desk for ${name || 'Advisor'}: ${phone || 'N/A'}`);
  };

  const handleWhatsapp = () => {
    openWhatsApp(name || 'Advisor', `Hello ${name || 'Advisor'}, I am interested in consulting regarding your luxury listings.`);
  };

  const handleEmail = () => {
    showToast(`Drafting private client brief to ${email || 'advisor@imperiaestates.com'}`);
  };

  if (!isAssigned) {
    return (
      <div className="border border-[#E8E4DA] bg-white rounded-3xl p-6 md:p-8 space-y-4 font-sans shadow-md text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] font-bold flex items-center justify-center mx-auto text-lg">
          👤
        </div>
        <div className="space-y-1">
          <h5 className="text-sm font-bold text-[#1A1A1A]">Consultant will be assigned shortly</h5>
          <p className="text-[#8A8A85] text-xs font-medium">Book a site visit to get paired with an available consultant in your city.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#E8E4DA] bg-white rounded-3xl p-6 md:p-8 space-y-6 font-sans shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#F5A623] bg-amber-100 text-[#F5A623] font-extrabold flex items-center justify-center text-lg shrink-0">
          {name.charAt(0)}
        </div>
        <div className="space-y-1">
          <h5 className="text-sm font-bold text-[#1A1A1A]">{name}</h5>
          <p className="text-[#8A8A85] text-xs font-medium">{designation}</p>
          {experience > 0 && (
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#8A8A85]">
              <Clock className="w-3.5 h-3.5 text-[#F5A623]" />
              <span>{experience} Years experience</span>
            </div>
          )}
        </div>
      </div>

      {/* Language certifications */}
      {languages && languages.length > 0 && (
        <div className="space-y-1">
          <span className="text-[9px] text-[#8A8A85] uppercase tracking-widest font-bold">Languages</span>
          <div className="flex flex-wrap gap-1.5">
            {languages.map(lang => (
              <span key={lang} className="px-2.5 py-0.5 rounded border border-[#E8E4DA] bg-[#F4F1EA] text-[9px] font-semibold text-[#1A1A1A]">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Concierge buttons */}
      <div className="space-y-3 pt-2 text-xs">
        <button 
          onClick={handleCall}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A1A] hover:bg-black text-white transition-colors cursor-pointer font-bold"
        >
          <Phone className="w-4 h-4 text-[#F5A623]" />
          Call Agent Desk
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleWhatsapp}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E8E4DA] bg-white hover:bg-emerald-50 text-emerald-700 font-bold transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            WhatsApp
          </button>
          <button 
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E8E4DA] bg-white hover:bg-amber-50 text-[#1A1A1A] font-bold transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#F5A623]" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};
