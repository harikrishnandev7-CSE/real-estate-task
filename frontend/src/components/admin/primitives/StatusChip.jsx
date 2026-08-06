import React from 'react';

/**
 * StatusChip — Admin Status Badge Primitive
 *
 * Design Specs:
 *  - Pill radius: rounded-full
 *  - Typography: text-[9-10px] uppercase font-bold tracking-wide
 *  - Color mapping:
 *      Published / Completed / Active / Confirmed -> emerald-50/700
 *      Draft / Pending / Under Construction      -> stone-100/600
 *      Archived / Cancelled / No-show            -> red-50/600
 *      Scheduled / Rent / In Progress            -> sky-50/600
 */
const StatusChip = ({ status, variant, className = '' }) => {
  const getStyle = () => {
    const key = (variant || status || '').toString().toLowerCase();

    if (['published', 'completed', 'active', 'ready to move', 'confirmed', 'verified', 'buy'].some(k => key.includes(k))) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (['draft', 'pending', 'under construction', 'unverified'].some(k => key.includes(k))) {
      return 'bg-stone-100 text-stone-600 border-stone-200';
    }
    if (['archived', 'cancelled', 'no-show', 'inactive', 'deleted', 'blocked'].some(k => key.includes(k))) {
      return 'bg-red-50 text-red-600 border-red-200';
    }
    if (['scheduled', 'rent', 'in progress', 'review', 'leased'].some(k => key.includes(k))) {
      return 'bg-sky-50 text-sky-600 border-sky-200';
    }

    return 'bg-stone-100 text-stone-600 border-stone-200';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border font-sans whitespace-nowrap ${getStyle()} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusChip;
