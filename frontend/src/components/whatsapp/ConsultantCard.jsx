import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ConsultantCard = ({ consultant, isSelected, onSelect }) => {
  const { name, role, photo, languages, available } = consultant;

  return (
    <motion.button
      onClick={onSelect}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`w-full flex items-center justify-between gap-4 p-[16px] rounded-2xl border text-left cursor-pointer transition-all duration-200 outline-none ${
        isSelected
          ? 'bg-amber-50/70 border-[#F5A623] shadow-sm'
          : 'bg-white border-[#E8E4DA] hover:bg-stone-50 hover:border-[#F5A623]/40'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Profile Photo */}
        <div className="relative shrink-0 w-[42px] h-[42px]">
          <img
            src={photo}
            alt={name}
            className="w-[42px] h-[42px] rounded-full object-cover border border-[#E8E4DA]"
          />
          {available && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          )}
        </div>

        {/* Profile Info */}
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-[#1A1A1A] font-sans truncate">
            {name}
          </h4>
          <p className="text-xs text-[#8A8A85] font-normal font-sans mt-0.5 truncate">{role}</p>

          {/* Languages row */}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {languages.map((lang) => (
              <span
                key={lang}
                className="text-[10px] px-2 py-0.5 bg-[#F4F1EA] text-[#8A8A85] rounded-md border border-[#E8E4DA] font-bold font-sans"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 shrink-0">
        {available && (
          <span className="text-xs text-emerald-600 font-bold font-sans flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Available
          </span>
        )}
        
        {/* Selection Circle */}
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
          isSelected 
            ? 'border-[#F5A623] bg-[#F5A623] text-white shadow-xs' 
            : 'border-[#E8E4DA] bg-transparent'
        }`}>
          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>
    </motion.button>
  );
};

export default ConsultantCard;
