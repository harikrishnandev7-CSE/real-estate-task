import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Compass } from 'lucide-react';

// Skeleton Loader: Shimmer placeholder lines
export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="border border-[#E8E4DA] rounded-3xl p-6 bg-white flex flex-col md:flex-row gap-6 animate-pulse shadow-sm">
          {/* Mock image box */}
          <div className="w-full md:w-[220px] h-[160px] bg-[#E8E4DA] rounded-2xl shrink-0" />
          
          {/* Mock text lines */}
          <div className="flex-1 space-y-4 py-2">
            <div className="h-4 bg-[#E8E4DA] rounded w-1/3" />
            <div className="h-6 bg-[#E8E4DA] rounded w-3/4" />
            <div className="h-3 bg-[#E8E4DA] rounded w-full" />
            <div className="h-3 bg-[#E8E4DA] rounded w-2/3" />
            <div className="h-4 bg-[#E8E4DA] rounded w-1/4 pt-4" />
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
      className="border border-[#E8E4DA] bg-white rounded-3xl p-16 text-center space-y-6 max-w-lg mx-auto shadow-md"
    >
      <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center mx-auto shadow-sm">
        <Compass className="w-6 h-6 animate-pulse" />
      </div>
      <div className="space-y-2 font-sans">
        <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">{title}</h3>
        <p className="text-xs text-[#8A8A85] leading-relaxed font-normal">
          {message}
        </p>
      </div>
      {onAction && actionLabel && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-[11px] font-bold text-white tracking-wider uppercase rounded-full cursor-pointer shadow-md transition-all font-sans"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};
