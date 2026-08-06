import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, X, Check, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { PropertyBadge, StatusBadge } from '../components/common/CardsAndBadges';
import { SectionHeader, AnimatedButton } from '../components/common/InteractiveWidgets';
import { EmptyState } from '../components/common/FeedbackStates';
import PageHero from '../components/PageHero';

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, addToWishlist, wishlist, properties } = useApp();

  const resolvedCompareList = useMemo(() => {
    return compareList.map(item => {
      let propObj = item;
      if (typeof item === 'string') {
        propObj = properties.find(p => p.id === item || p._id === item) || {};
      }
      return {
        id: propObj.id || propObj._id || String(item),
        title: propObj.title || 'Luxury Estate',
        tag: propObj.tag || 'SIGNATURE',
        price: propObj.price || propObj.priceDisplay || '₹0',
        type: propObj.type || 'Villa',
        location: propObj.location || 'Chennai',
        builder: propObj.builder || 'Imperia Infra',
        beds: propObj.beds || 0,
        baths: propObj.baths || 0,
        area: propObj.area || propObj.areaDisplay || 'N/A',
        investmentRating: propObj.investmentRating || 'AAA+',
        image: propObj.image || propObj.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        rera: Boolean(propObj.rera || propObj.reraApproved),
        specs: propObj.specs || {},
        pros: Array.isArray(propObj.pros) ? propObj.pros : [],
        cons: Array.isArray(propObj.cons) ? propObj.cons : [],
        amenities: Array.isArray(propObj.amenities) ? propObj.amenities : [],
      };
    });
  }, [compareList, properties]);

  const specsList = [
    { label: "Price Range", key: "price" },
    { label: "Bespoke Typology", key: "type" },
    { label: "Location", key: "location" },
    { label: "Developer", key: "builder" },
    { label: "Configuration", render: (p) => p.beds > 0 ? `${p.beds} BHK` : 'Commercial Suite' },
    { label: "Bathrooms", key: "baths" },
    { label: "Estate Area", key: "area" },
    { label: "Investment Rating", key: "investmentRating" },
    { label: "Year Built", render: (p) => p.specs?.["Year Built"] || p.specs?.yearBuilt || "2025" },
    { label: "Furnishing Status", render: (p) => p.specs?.["Furnished"] || p.specs?.furnished || "Fully Furnished" },
    { label: "Security Level", render: (p) => p.specs?.["Security"] || p.specs?.security || "24/7 Security" }
  ];

  const handleTour = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">

      {/* PageHero — clean architectural contrast image */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Compare' },
          ]}
          eyebrow="BESPOKE ANALYSIS"
          heading={
            <>Side-by-Side Property <span className="font-normal text-[#8A8A85]">Comparison</span></>
          }
          description="Evaluate and contrast premium properties across location, configuration, pricing, and investment metrics — side by side in one view."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {resolvedCompareList.length === 0 ? (
          <div className="py-12">
            <EmptyState 
              title="No Properties Selected"
              message="Explore our premium collection of villas, apartments, plots, commercial properties, luxury residences, and investment opportunities across multiple cities, add up to 4 properties, and analyze their specifications side-by-side."
              actionLabel="Add Properties"
              onAction={() => navigate('/buy')}
            />
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* COMPARISON GRID BLOCK */}
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-[800px] divide-y divide-[#E8E4DA]">
                
                {/* Header Cards Row */}
                <div className="grid grid-cols-12 gap-6 py-6 items-stretch">
                  <div className="col-span-3 flex flex-col justify-center pr-4 font-sans">
                    <p className="text-xs text-[#8A8A85] uppercase tracking-widest font-bold">Bespoke Spec Comparison</p>
                    <p className="text-sm text-[#1A1A1A] font-medium mt-2">Currently comparing <span className="text-[#F5A623] font-bold">{resolvedCompareList.length}</span> signature estates.</p>
                  </div>
                  
                  {resolvedCompareList.map((item) => {
                    const colSpan = Math.floor(9 / resolvedCompareList.length);
                    const isWishlisted = wishlist.some(w => (typeof w === 'string' ? w === item.id : w.id === item.id));
                    return (
                      <div key={item.id} className="relative border border-[#E8E4DA] bg-white rounded-2xl p-4 flex flex-col justify-between group overflow-hidden shadow-xs" style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
                        {/* Remove Action */}
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute right-3 top-3 p-1.5 rounded-full bg-stone-100 hover:bg-red-500 text-[#8A8A85] hover:text-white transition-all z-20 cursor-pointer"
                          aria-label="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="space-y-3 font-sans">
                          <div className="h-[120px] rounded-xl overflow-hidden bg-stone-100 relative">
                            <ImageWithSkeleton src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <PropertyBadge label={item.tag} />
                              <StatusBadge rera={item.rera} />
                            </div>
                            <h4 className="text-sm font-bold text-[#1A1A1A] tracking-tight line-clamp-1 mt-1">{item.title}</h4>
                          </div>
                        </div>

                        <div className="pt-4 flex gap-2 text-[10px] font-sans">
                          <button
                            onClick={() => handleTour(item.id)}
                            className="flex-grow py-2 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-full text-center cursor-pointer transition-all"
                          >
                            Bespoke Tour
                          </button>
                          <button
                            onClick={() => addToWishlist(item.id)}
                            className={`p-2 rounded-full border transition-all cursor-pointer ${isWishlisted ? 'border-[#F5A623] text-[#F5A623] bg-amber-50' : 'border-[#E8E4DA] text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                          >
                            <svg className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : 'stroke-current'}`} viewBox="0 0 24 24">
                              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Specification Rows */}
                {specsList.map((spec, specIdx) => (
                  <div key={specIdx} className="grid grid-cols-12 gap-6 py-4 items-center font-sans">
                    {/* Row Label */}
                    <div className="col-span-3">
                      <span className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">{spec.label}</span>
                    </div>

                    {/* Row Values */}
                    {resolvedCompareList.map((item) => {
                      const colSpan = Math.floor(9 / resolvedCompareList.length);
                      const value = spec.render ? spec.render(item) : item[spec.key];
                      return (
                        <div key={item.id} className="text-xs text-[#1A1A1A] font-semibold" style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
                          {value || "N/A"}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Pros Row */}
                <div className="grid grid-cols-12 gap-6 py-4 items-start font-sans">
                  <div className="col-span-3">
                    <span className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Key Advantages (Pros)</span>
                  </div>
                  {resolvedCompareList.map((item) => {
                    const colSpan = Math.floor(9 / resolvedCompareList.length);
                    return (
                      <div key={item.id} className="space-y-1.5 font-sans" style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
                        {(item.pros || []).map((pro, index) => (
                          <div key={index} className="flex items-start gap-1.5 text-xs text-[#1A1A1A] font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Cons Row */}
                <div className="grid grid-cols-12 gap-6 py-4 items-start font-sans">
                  <div className="col-span-3">
                    <span className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Considerations (Cons)</span>
                  </div>
                  {resolvedCompareList.map((item) => {
                    const colSpan = Math.floor(9 / resolvedCompareList.length);
                    return (
                      <div key={item.id} className="space-y-1.5 font-sans" style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
                        {(item.cons || []).map((con, index) => (
                          <div key={index} className="flex items-start gap-1.5 text-xs text-[#8A8A85] font-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0 mt-1.5" />
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Amenities checklist row */}
                <div className="grid grid-cols-12 gap-6 py-4 items-start font-sans">
                  <div className="col-span-3">
                    <span className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Amenities</span>
                  </div>
                  {resolvedCompareList.map((item) => {
                    const colSpan = Math.floor(9 / resolvedCompareList.length);
                    return (
                      <div key={item.id} className="flex flex-wrap gap-1.5 font-sans" style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
                        {(item.amenities || []).map((amenity, index) => (
                          <span key={index} className="px-2.5 py-1 rounded-full bg-stone-100 text-[10px] text-[#1A1A1A] font-medium border border-[#E8E4DA]">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
