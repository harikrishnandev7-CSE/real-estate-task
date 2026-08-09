import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, X, Check, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { PropertyBadge, StatusBadge } from '../components/common/CardsAndBadges';
import { SectionHeader, AnimatedButton } from '../components/common/InteractiveWidgets';
import { EmptyState } from '../components/common/FeedbackStates';
import PageHero from '../components/PageHero';

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, addToWishlist, wishlist, properties, currentUser } = useApp();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
        <div className="pt-[64px] lg:pt-[72px]">
          <PageHero
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Compare' },
            ]}
            eyebrow="VIP ACCESS REQUIRED"
            heading={
              <>Compare <span className="font-normal text-[#8A8A85]">Estates</span></>
            }
            description="Log in to access side-by-side estate comparisons, technical specs, and investment analytics."
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center space-y-6 font-sans">
          <div className="max-w-md mx-auto p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center mx-auto shadow-xs">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Please Log In to Continue</h3>
            <p className="text-xs text-[#8A8A85] leading-relaxed font-normal">
              Property comparison features are reserved for logged-in VIP members. Please sign in to compare property specifications side-by-side.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
              >
                Continue to Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3 border border-[#E8E4DA] bg-[#F4F1EA] text-[#1A1A1A] hover:border-[#F5A623] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-all cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const PROPERTY_TYPES = [
    { id: 'Apartment', label: 'Apartment', icon: '🏢' },
    { id: 'Villa', label: 'Villa', icon: '🏡' },
    { id: 'Plot', label: 'Plot', icon: '🏞️' },
  ];

  const normalizeType = (t) => {
    if (!t) return 'Apartment';
    const l = String(t).toLowerCase();
    if (l.includes('villa')) return 'Villa';
    if (l.includes('plot') || l.includes('land')) return 'Plot';
    if (l.includes('apartment') || l.includes('penthouse') || l.includes('flat')) return 'Apartment';
    return 'Apartment';
  };

  const getPropId = (p) => {
    if (!p) return '';
    if (typeof p === 'string') return p;
    return String(p.id || p._id || p.title || '');
  };

  const resolvedCompareList = useMemo(() => {
    return compareList.map(item => {
      let propObj = item;
      if (typeof item === 'string') {
        const itemStr = String(item);
        propObj = properties.find(p => getPropId(p) === itemStr) || {};
      }
      const validId = getPropId(propObj) || String(item);
      return {
        id: validId,
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

  const [selectedType, setSelectedType] = React.useState('Apartment');

  // Auto-sync selectedType to compare list if items exist
  React.useEffect(() => {
    if (resolvedCompareList.length > 0) {
      const activeType = normalizeType(resolvedCompareList[0].type);
      setSelectedType(activeType);
    }
  }, [resolvedCompareList]);

  // Filter available properties by active type tab
  const filteredProperties = useMemo(() => {
    return properties.filter(p => normalizeType(p.type) === selectedType);
  }, [properties, selectedType]);

  const compareSectionRef = React.useRef(null);

  const handleAddToCompareWithScroll = async (prop) => {
    const ok = await addToCompare(prop);
    if (ok) {
      setTimeout(() => {
        compareSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

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
            <>Smart Side-by-Side <span className="font-normal text-[#8A8A85]">Comparison</span></>
          }
          description="Select a property type below to compare matching luxury residences, penthouses, villas, or investment plots side by side."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
        
        {/* STEP 1 & 2: TYPE SELECTOR & PROPERTY PICKER HEADER */}
        <div className="bg-white border border-[#E8E4DA] rounded-3xl p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-6 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DA] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
                SMART FILTER SYSTEM
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight mt-1">
                Select Property Type to Compare
              </h3>
              <p className="text-xs text-[#8A8A85] font-normal mt-0.5">
                Strict rule: Only properties of the same type can be compared together (Max 3).
              </p>
            </div>
            {resolvedCompareList.length > 0 && (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] text-xs font-bold font-sans">
                  Active Filter: {selectedType} ({resolvedCompareList.length}/3)
                </span>
              </div>
            )}
          </div>

          {/* Step 1 Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {PROPERTY_TYPES.map((tObj) => {
              const isActive = selectedType === tObj.id;
              const isLocked = resolvedCompareList.length > 0 && normalizeType(resolvedCompareList[0].type) !== tObj.id;
              return (
                <button
                  key={tObj.id}
                  onClick={() => {
                    if (isLocked) {
                      const activeType = normalizeType(resolvedCompareList[0].type);
                      showToast(`❌ ${tObj.id} and ${activeType} cannot be compared. Remove items to switch type.`, "error");
                      return;
                    }
                    setSelectedType(tObj.id);
                  }}
                  className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer font-sans ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-md'
                      : isLocked
                      ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-60'
                      : 'bg-[#F4F1EA] text-[#1A1A1A] border border-[#E8E4DA] hover:border-[#F5A623]'
                  }`}
                >
                  <span>{tObj.icon}</span>
                  <span>{tObj.label}</span>
                </button>
              );
            })}
          </div>

          {/* Step 2 Property Quick Selector */}
          <div className="pt-2 border-t border-[#E8E4DA]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-[#8A8A85] uppercase tracking-wider">
                Available {selectedType}s ({filteredProperties.length})
              </span>
              <span className="text-[11px] text-[#8A8A85]">
                {resolvedCompareList.length}/3 properties added
              </span>
            </div>

            {filteredProperties.length === 0 ? (
              <p className="text-xs text-[#8A8A85] py-4 text-center">No properties available for {selectedType}.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map((prop, pIdx) => {
                  const propId = getPropId(prop) || `prop-type-${pIdx}`;
                  const isAdded = propId && Array.isArray(compareList) ? compareList.some(item => item && getPropId(item) === propId) : false;

                  return (
                    <div
                      key={propId}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isAdded ? 'bg-amber-50/80 border-[#F5A623]' : 'bg-[#F4F1EA]/60 border-[#E8E4DA] hover:border-[#F5A623]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                          <ImageWithSkeleton src={prop.image || prop.imageUrl} alt={prop.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1A1A1A] truncate">{prop.title}</h4>
                          <p className="text-[11px] text-[#8A8A85] truncate">{prop.location}</p>
                          <p className="text-xs font-bold text-[#F5A623]">{prop.price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isAdded) {
                            removeFromCompare(prop);
                          } else {
                            handleAddToCompareWithScroll(prop);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                          isAdded
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                            : 'bg-[#1A1A1A] hover:bg-black text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? 'Added ✔' : '+ ADD'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* STEP 7: COMPARE VIEW (SIDE BY SIDE TABLE) */}
        <div ref={compareSectionRef} className="scroll-mt-24">
          {resolvedCompareList.length === 0 ? (
            <div className="py-8">
              <EmptyState 
                title={`Select a ${selectedType} to Compare`}
                message={`Choose up to 3 ${selectedType.toLowerCase()}s above to see a detailed side-by-side comparison of pricing, location, configuration, investment ratings, pros, cons, and amenities.`}
                actionLabel="Explore Properties"
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
                    <p className="text-xs text-[#8A8A85] uppercase tracking-widest font-bold">Side-by-Side Analysis</p>
                    <p className="text-sm text-[#1A1A1A] font-medium mt-2">Currently comparing <span className="text-[#F5A623] font-bold">{resolvedCompareList.length}</span> {selectedType}s.</p>
                  </div>
                  
                  {resolvedCompareList.map((item) => {
                    const colSpan = Math.floor(9 / resolvedCompareList.length);
                    const isWishlisted = Array.isArray(wishlist) && wishlist.some(w => w && (typeof w === 'string' ? w === item.id : (w.id || w._id) === item.id));
                    return (
                      <div key={item.id} className="relative border border-[#E8E4DA] bg-white rounded-2xl p-4 flex flex-col justify-between group overflow-hidden shadow-xs" style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
                        {/* Remove Action */}
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute right-3 top-3 px-2 py-1 rounded-full bg-stone-100 hover:bg-red-500 text-[#8A8A85] hover:text-white transition-all z-20 cursor-pointer text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                          aria-label="Remove"
                        >
                          <X className="w-3 h-3" />
                          <span>Remove</span>
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
                  <div key={`spec-${spec.key || spec.label}-${specIdx}`} className="grid grid-cols-12 gap-6 py-4 items-center font-sans">
                    {/* Row Label */}
                    <div className="col-span-3">
                      <span className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">{spec.label}</span>
                    </div>

                    {/* Row Values */}
                    {resolvedCompareList.map((item, itemIdx) => {
                      const colSpan = Math.floor(9 / resolvedCompareList.length);
                      const value = spec.render ? spec.render(item) : item[spec.key];
                      return (
                        <div key={`val-${item.id || itemIdx}-${specIdx}`} className="text-xs text-[#1A1A1A] font-semibold" style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}>
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
    </div>
  );
};

export default Compare;
