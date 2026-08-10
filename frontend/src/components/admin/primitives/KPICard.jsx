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
    const width = 70;
    const height = 20;

    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible stroke-[#A98A5B] fill-none stroke-[1.8]">
        <polyline points={points} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div
      className={`bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] font-sans flex flex-col justify-between space-y-4 hover:border-[#C6A66B] hover:shadow-[0_15px_35px_rgba(198,166,107,0.15)] hover:scale-[1.02] transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#F8F6F2] border border-[rgba(198,166,107,0.3)] text-[#0B0B0B] flex items-center justify-center shrink-0 shadow-xs">
          {React.isValidElement(Icon) ? (
            Icon
          ) : Icon ? (
            <Icon className="w-5 h-5 text-[#C6A66B]" />
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {renderSparkline()}
          {delta && (
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide flex items-center gap-1 border ${
                delta.positive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {delta.positive ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-rose-600" />}
              {delta.value}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <span className="eyebrow-accent block text-[10px]">
          {title}
        </span>
        <div
          className="text-2xl md:text-3xl font-extrabold text-[#0B0B0B] tracking-tight"
          style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
