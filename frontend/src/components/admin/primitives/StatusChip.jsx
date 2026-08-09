import React from 'react';

const StatusChip = ({ status, variant, className = '' }) => {
  const getStyle = () => {
    const key = (variant || status || '').toString().toLowerCase();

    if (['published', 'completed', 'active', 'ready to move', 'confirmed', 'verified', 'buy'].some(k => key.includes(k))) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (['draft', 'pending', 'under construction', 'unverified'].some(k => key.includes(k))) {
      return 'bg-[#E0EEE9]/60 text-[#5D6472] border-[rgba(93,100,114,0.20)]';
    }
    if (['archived', 'cancelled', 'no-show', 'inactive', 'deleted', 'blocked'].some(k => key.includes(k))) {
      return 'bg-red-50 text-red-600 border-red-200';
    }
    if (['scheduled', 'rent', 'in progress', 'review', 'leased'].some(k => key.includes(k))) {
      return 'bg-[rgba(207,182,168,0.15)] text-[#363C46] border-[#CFB6A8]';
    }

    return 'bg-[#E0EEE9]/60 text-[#5D6472] border-[rgba(93,100,114,0.20)]';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border font-sans whitespace-nowrap ${getStyle()} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusChip;
