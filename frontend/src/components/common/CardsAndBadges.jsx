import React from 'react';
import { ShieldCheck, Star, Calendar, Building2, Trophy, Clock, Phone, Mail, MessageCircle, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Property Badge: Dark Vanilla badge
export const PropertyBadge = ({ label }) => {
  if (!label) return null;
  return (
    <span className="px-3 py-1 rounded-md bg-[#CFB6A8] text-[10px] font-bold uppercase tracking-[0.15em] text-[#363C46] shadow-xs font-sans">
      {label}
    </span>
  );
};

// Status Badge: RERA check compliance status
export const StatusBadge = ({ rera }) => {
  if (!rera) return null;
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 font-sans">
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
      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/80 px-3 py-1 rounded-md border border-emerald-300 font-sans">
        <span className="text-xs">✔</span>
        <span>Fully Furnished</span>
      </div>
    );
  }
  if (f === 'semi' || f.includes('semi')) {
    return (
      <div className="flex items-center gap-1 text-[10px] font-bold text-[#CFB6A8] uppercase tracking-wider bg-[rgba(207,182,168,0.15)] px-3 py-1 rounded-md border border-[#CFB6A8] font-sans">
        <span className="text-xs">⚠️</span>
        <span>Semi Furnished</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-[10px] font-bold text-[#5D6472] uppercase tracking-wider bg-stone-200/80 px-3 py-1 rounded-md border border-stone-300 font-sans">
      <span className="text-xs">❌</span>
      <span>Unfurnished</span>
    </div>
  );
};

// Specification Card: Clean light layouts
export const SpecificationCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="border border-[rgba(93,100,114,0.15)] bg-white rounded-xl p-4 text-center font-sans shadow-xs">
      <span className="text-[#5D6472] text-[10px] uppercase tracking-wider block font-bold">{label}</span>
      <div className="flex items-center justify-center gap-2 mt-1">
        {Icon && <Icon className="w-4 h-4 text-[#CFB6A8] shrink-0" />}
        <p className="font-bold text-[#363C46] text-sm">{value}</p>
      </div>
    </div>
  );
};

// Amenity Card: Rich micro-animated icon boxes
export const AmenityCard = ({ icon: Icon, name }) => {
  return (
    <div className="group flex items-center gap-3 p-4 border border-[rgba(93,100,114,0.15)] rounded-xl bg-white hover:border-[#CFB6A8] shadow-xs transition-all duration-300 cursor-pointer">
      <div className="p-2 rounded-lg bg-[rgba(207,182,168,0.15)] text-[#CFB6A8] group-hover:bg-[#CFB6A8] group-hover:text-[#363C46] transition-all duration-300 shrink-0">
        {Icon ? <Icon className="w-4.5 h-4.5 stroke-[2]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#CFB6A8]" />}
      </div>
      <span className="text-xs font-sans font-bold text-[#363C46] transition-colors">
        {name}
      </span>
    </div>
  );
};

// Builder Card: Professional corporate profiles
export const BuilderCard = ({ name, experience, completed, ongoing, awards = [], description }) => {
  return (
    <div className="border border-[rgba(93,100,114,0.15)] bg-white rounded-xl p-6 md:p-8 space-y-6 font-sans shadow-xs">
      <div className="flex items-center justify-between border-b border-[rgba(93,100,114,0.15)] pb-4">
        <h4 className="text-xs uppercase tracking-widest text-[#5D6472] font-bold">Master Builder Profile</h4>
        <div className="flex items-center gap-1.5 text-xs text-[#CFB6A8] font-bold">
          <Trophy className="w-4 h-4" />
          <span>Awards Winner</span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-4 rounded-xl bg-[rgba(207,182,168,0.15)] text-[#CFB6A8] border border-[rgba(207,182,168,0.25)] shrink-0">
          <Building2 className="w-6 h-6 stroke-[2]" />
        </div>
        <div className="space-y-1">
          <h5
            className="text-lg font-bold text-[#363C46]"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            {name}
          </h5>
          <p className="text-xs text-[#5D6472] font-medium">{experience} Years of Luxury Construction</p>
        </div>
      </div>

      <p className="text-xs text-[#5D6472] font-normal leading-relaxed">
        {description}
      </p>

      {/* Builder metrics */}
      <div className="grid grid-cols-2 gap-4 border-t border-[rgba(93,100,114,0.15)] pt-4">
        <div className="text-center bg-[#E0EEE9]/50 rounded-lg p-3 border border-[rgba(93,100,114,0.15)]">
          <span className="text-[9px] text-[#5D6472] uppercase block font-bold">Completed Projects</span>
          <span className="text-base font-bold text-[#363C46]">{completed}+ Landmark Estates</span>
        </div>
        <div className="text-center bg-[#E0EEE9]/50 rounded-lg p-3 border border-[rgba(93,100,114,0.15)]">
          <span className="text-[9px] text-[#5D6472] uppercase block font-bold">Ongoing Projects</span>
          <span className="text-base font-bold text-[#363C46]">{ongoing} active constructions</span>
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
      <div className="border border-[rgba(93,100,114,0.15)] bg-white rounded-xl p-6 md:p-8 space-y-4 font-sans shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(207,182,168,0.15)] border border-[#CFB6A8] text-[#CFB6A8] font-bold flex items-center justify-center mx-auto text-lg">
          👤
        </div>
        <div className="space-y-1">
          <h5
            className="text-sm font-bold text-[#363C46]"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Consultant will be assigned shortly
          </h5>
          <p className="text-[#5D6472] text-xs font-medium">Book a site visit to get paired with an available consultant in your city.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[rgba(93,100,114,0.15)] bg-white rounded-xl p-6 md:p-8 space-y-6 font-sans shadow-xs">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#CFB6A8] bg-[rgba(207,182,168,0.15)] text-[#CFB6A8] font-bold flex items-center justify-center text-lg shrink-0">
          {name.charAt(0)}
        </div>
        <div className="space-y-1">
          <h5
            className="text-sm font-bold text-[#363C46]"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            {name}
          </h5>
          <p className="text-[#5D6472] text-xs font-medium">{designation}</p>
          {experience > 0 && (
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#5D6472]">
              <Clock className="w-3.5 h-3.5 text-[#CFB6A8]" />
              <span>{experience} Years experience</span>
            </div>
          )}
        </div>
      </div>

      {/* Language certifications */}
      {languages && languages.length > 0 && (
        <div className="space-y-1">
          <span className="text-[9px] text-[#5D6472] uppercase tracking-widest font-bold">Languages</span>
          <div className="flex flex-wrap gap-1.5">
            {languages.map(lang => (
              <span key={lang} className="px-2.5 py-0.5 rounded border border-[rgba(93,100,114,0.15)] bg-[#E0EEE9]/50 text-[9px] font-semibold text-[#363C46]">
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
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#363C46] hover:bg-[#1A1A1A] text-white transition-colors cursor-pointer font-bold"
        >
          <Phone className="w-4 h-4 text-[#CFB6A8]" />
          Call Agent Desk
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleWhatsapp}
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-[rgba(93,100,114,0.15)] bg-white hover:bg-emerald-50 text-emerald-700 font-bold transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            WhatsApp
          </button>
          <button 
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-[rgba(93,100,114,0.15)] bg-white hover:bg-[rgba(207,182,168,0.15)] text-[#363C46] font-bold transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#CFB6A8]" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};
