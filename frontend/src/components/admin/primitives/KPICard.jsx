import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({
  title,
  value,
  icon: Icon,
  delta,
  sparkline = [],
  className = ''
}) => {
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible stroke-[#CFB6A8] fill-none stroke-[2]">
        <polyline points={points} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div
      className={`bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-5 shadow-[0_12px_32px_rgba(54,60,70,0.06)] hover:-translate-y-0.5 transition-transform duration-200 font-sans flex flex-col justify-between space-y-4 ${className}`}
    >
      {/* Top Row: Icon badge + Delta / Sparkline */}
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-full bg-[rgba(207,182,168,0.15)] border border-[#CFB6A8] text-[#CFB6A8] flex items-center justify-center shrink-0">
          {React.isValidElement(Icon) ? (
            Icon
          ) : Icon ? (
            <Icon className="w-4 h-4 stroke-[2]" />
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {renderSparkline()}
          {delta && (
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide flex items-center gap-1 border ${
                delta.positive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}
            >
              {delta.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {delta.value}
            </span>
          )}
        </div>
      </div>

      {/* Main Numeral & Label */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block font-sans">
          {title}
        </span>
        <div
          className="text-2xl md:text-3xl font-bold text-[#363C46] tracking-tight font-sans"
          style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
