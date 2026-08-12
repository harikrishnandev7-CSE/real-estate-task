import React from 'react';
import { ShieldCheck, Star, Calendar, Building2, Trophy, Clock, Phone, Mail, MessageCircle, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Property Badge: High-contrast gold badge
export const PropertyBadge = ({ label }) => {
  if (!label) return null;
  return (
    <span className="px-3 py-1 rounded-md bg-[#C9A96E] text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#0B0B0B] shadow-xs font-sans">
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
      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/90 px-3 py-1 rounded-md border border-emerald-300 font-sans">
        <span className="text-xs">✔</span>
        <span>Fully Furnished</span>
      </div>
    );
  }
  if (f === 'semi' || f.includes('semi')) {
    return (
      <div className="flex items-center gap-1 text-[10px] font-bold text-[#C9A96E] uppercase tracking-wider bg-[rgba(201,169,110,0.15)] px-3 py-1 rounded-md border border-[rgba(201,169,110,0.35)] font-sans">
        <span className="text-xs">⚠️</span>
        <span>Semi Furnished</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-[10px] font-bold text-[#555555] uppercase tracking-wider bg-stone-200/90 px-3 py-1 rounded-md border border-stone-300 font-sans">
      <span className="text-xs">❌</span>
      <span>Unfurnished</span>
    </div>
  );
};

// Specification Card: Clean light layouts with bold high-contrast text
export const SpecificationCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="border border-[rgba(201,169,110,0.30)] bg-white rounded-xl p-4 text-center font-sans shadow-xs hover:border-[#C9A96E] transition-all">
      <span className="text-[#6B6B6B] text-[10px] uppercase tracking-wider block font-bold">{label}</span>
      <div className="flex items-center justify-center gap-2 mt-1.5">
        {Icon && <Icon className="w-4 h-4 text-[#C9A96E] shrink-0" />}
        <p className="font-extrabold text-[#0B0B0B] text-sm sm:text-base">{value}</p>
      </div>
    </div>
  );
};

// Amenity Card: Rich micro-animated icon boxes with crisp text
export const AmenityCard = ({ icon: Icon, name }) => {
  return (
    <div className="group flex items-center gap-3 p-4 border border-[rgba(201,169,110,0.30)] rounded-xl bg-white hover:border-[#C9A96E] shadow-xs transition-all duration-300 cursor-pointer">
      <div className="p-2.5 rounded-lg bg-[rgba(201,169,110,0.15)] text-[#C9A96E] group-hover:bg-[#C9A96E] group-hover:text-[#0B0B0B] transition-all duration-300 shrink-0">
        {Icon ? <Icon className="w-4.5 h-4.5 stroke-[2]" /> : <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
      </div>
      <span className="text-xs font-sans font-bold text-[#0B0B0B] transition-colors">
        {name}
      </span>
    </div>
  );
};

// Builder Card: Professional corporate profiles
export const BuilderCard = ({ name, experience, completed, ongoing, awards = [], description }) => {
  return (
    <div className="border border-[rgba(201,169,110,0.30)] bg-white rounded-xl p-6 md:p-8 space-y-6 font-sans shadow-xs">
      <div className="flex items-center justify-between border-b border-[rgba(201,169,110,0.20)] pb-4">
        <h4 className="text-xs uppercase tracking-widest text-[#6B6B6B] font-extrabold">Master Builder Profile</h4>
        <div className="flex items-center gap-1.5 text-xs text-[#C9A96E] font-extrabold">
          <Trophy className="w-4 h-4" />
          <span>Awards Winner</span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-4 rounded-xl bg-[rgba(201,169,110,0.15)] text-[#C9A96E] border border-[rgba(201,169,110,0.30)] shrink-0">
          <Building2 className="w-6 h-6 stroke-[2]" />
        </div>
        <div className="space-y-1">
          <h5
            className="text-lg font-bold text-[#0B0B0B]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {name}
          </h5>
          <p className="text-xs text-[#555555] font-bold">{experience} Years of Luxury Construction</p>
        </div>
      </div>

      <p className="text-xs text-[#555555] font-medium leading-relaxed">
        {description}
      </p>

      {/* Builder metrics */}
      <div className="grid grid-cols-2 gap-4 border-t border-[rgba(201,169,110,0.20)] pt-4">
        <div className="text-center bg-[#F7F6F3] rounded-lg p-3 border border-[rgba(201,169,110,0.25)]">
          <span className="text-[9px] text-[#6B6B6B] uppercase block font-extrabold">Completed Projects</span>
          <span className="text-base font-extrabold text-[#0B0B0B]">{completed}+ Landmark Estates</span>
        </div>
        <div className="text-center bg-[#F7F6F3] rounded-lg p-3 border border-[rgba(201,169,110,0.25)]">
          <span className="text-[9px] text-[#6B6B6B] uppercase block font-extrabold">Ongoing Projects</span>
          <span className="text-base font-extrabold text-[#0B0B0B]">{ongoing} active constructions</span>
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
      <div className="border border-[rgba(201,169,110,0.30)] bg-white rounded-xl p-6 md:p-8 space-y-4 font-sans shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(201,169,110,0.15)] border border-[rgba(201,169,110,0.30)] text-[#C9A96E] font-bold flex items-center justify-center mx-auto text-lg">
          👤
        </div>
        <div className="space-y-1">
          <h5
            className="text-sm font-bold text-[#0B0B0B]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Consultant will be assigned shortly
          </h5>
          <p className="text-[#555555] text-xs font-semibold">Book a site visit to get paired with an available consultant in your city.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[rgba(201,169,110,0.30)] bg-white rounded-xl p-6 md:p-8 space-y-6 font-sans shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#C9A96E] bg-[rgba(201,169,110,0.15)] text-[#C9A96E] font-extrabold flex items-center justify-center text-xl shrink-0">
          {name.charAt(0)}
        </div>
        <div className="space-y-1">
          <h5
            className="text-base font-bold text-[#0B0B0B]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {name}
          </h5>
          <p className="text-[#C9A96E] text-xs font-extrabold uppercase tracking-wider">{designation}</p>
          {experience > 0 && (
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[#555555] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>{experience} Years experience</span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={handleCall}
          className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#0E0E10] text-[#F4F1EA] hover:bg-[#C9A96E] hover:text-[#0B0B0B] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm border border-[rgba(201,169,110,0.30)]"
        >
          <Phone className="w-3.5 h-3.5 text-[#C9A96E]" />
          <span>Call Desk</span>
        </button>

        <button
          onClick={handleWhatsapp}
          className="flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
