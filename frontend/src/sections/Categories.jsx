import React from 'react';
import CircularGallery from '../components/common/CircularGallery';

const Categories = () => {
  return (
    <section className="pt-16 pb-6 md:pt-20 md:pb-8 lg:pt-24 lg:pb-10 bg-[#F7F6F3] border-t border-[rgba(22,22,26,0.08)] font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6 md:mb-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="eyebrow">COLLECTION SPECTRUM</span>
            <h2
              className="text-3xl md:text-5xl font-medium text-[#16161a] tracking-tight leading-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Curated Asset <br />
              <span className="font-normal text-[#4a4a4f]">Portfolios</span>
            </h2>
          </div>
          <p className="text-[#4a4a4f] font-normal text-sm md:text-base max-w-md leading-relaxed">
            Explore diverse real estate categories tailored for private ownership, long-term capital preservation, and institutional yield placement.
          </p>
        </div>
      </div>

      {/* ReactBits Circular Gallery Component */}
      <CircularGallery />
    </section>
  );
};

export default Categories;
