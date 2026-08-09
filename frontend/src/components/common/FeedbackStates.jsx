import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Compass } from 'lucide-react';

// Skeleton Loader: Shimmer placeholder lines
export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="border border-[rgba(93,100,114,0.15)] rounded-xl p-6 bg-white flex flex-col md:flex-row gap-6 animate-pulse shadow-xs">
          {/* Mock image box */}
          <div className="w-full md:w-[220px] h-[160px] bg-[#E0EEE9] rounded-lg shrink-0" />
          
          {/* Mock text lines */}
          <div className="flex-1 space-y-4 py-2">
            <div className="h-4 bg-[#E0EEE9] rounded w-1/3" />
            <div className="h-6 bg-[#E0EEE9] rounded w-3/4" />
            <div className="h-3 bg-[#E0EEE9] rounded w-full" />
            <div className="h-3 bg-[#E0EEE9] rounded w-2/3" />
            <div className="h-4 bg-[#E0EEE9] rounded w-1/4 pt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty State: Fallback search/wishlist panel
export const EmptyState = ({ title, message, actionLabel, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="border border-[rgba(93,100,114,0.15)] bg-white rounded-xl p-16 text-center space-y-6 max-w-lg mx-auto shadow-[0_12px_32px_rgba(54,60,70,0.06)]"
    >
      <div className="w-14 h-14 rounded-full bg-[rgba(207,182,168,0.15)] border border-[#CFB6A8] text-[#CFB6A8] flex items-center justify-center mx-auto shadow-xs">
        <Compass className="w-6 h-6 animate-pulse" />
      </div>
      <div className="space-y-2 font-sans">
        <h3
          className="text-xl font-bold text-[#363C46] tracking-tight"
          style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
        >
          {title}
        </h3>
        <p className="text-xs text-[#5D6472] leading-relaxed font-normal">
          {message}
        </p>
      </div>
      {onAction && actionLabel && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 bg-[#363C46] hover:bg-[#1A1A1A] text-[11px] font-bold text-white tracking-wider uppercase rounded-lg cursor-pointer shadow-xs transition-all font-sans"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};
