import React from 'react';
import AnimatedCardCarousel from '../components/common/AnimatedCardCarousel';

const InvestmentLocations = () => {
  return (
    <section className="py-20 md:py-28 bg-[#F7F6F3] text-[#16161a] border-t border-[rgba(22,22,26,0.08)] font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="eyebrow">PRIME TARGETS</span>
            <h2
              className="text-3xl md:text-5xl font-medium text-[#16161a] tracking-tight leading-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              High-Growth <br />
              <span className="font-normal text-[#4a4a4f]">Investment Markets</span>
            </h2>
          </div>
          <p className="text-[#4a4a4f] font-normal text-sm md:text-base max-w-md leading-relaxed">
            We target micro-markets across premier metropolitan hubs showcasing solid capital appreciation and developer pipelines.
          </p>
        </div>
      </div>

      {/* Elliman Animated Horizontal Carousel */}
      <AnimatedCardCarousel />
    </section>
  );
};

export default InvestmentLocations;
