import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search as SearchIcon, MapPin, Map, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { SkeletonLoader, EmptyState } from '../components/common/FeedbackStates';
import { PropertyBadge } from '../components/common/CardsAndBadges';
import { SectionHeader } from '../components/common/InteractiveWidgets';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { properties, wishlist, openBookModal } = useApp();
  const shouldReduceMotion = useReducedMotion();

  // Search input query
  const queryParam = searchParams.get('q') || '';
  const [searchVal, setSearchVal] = useState(queryParam);
  const [activeCityFilter, setActiveCityFilter] = useState('All');
  const [activePurposeFilter, setActivePurposeFilter] = useState('All');

  // Loading skeleton state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchVal(queryParam);
  }, [queryParam]);

  const triggerSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchParams({ q: searchVal });
    setTimeout(() => {
      setLoading(false);
    }, 850);
  };

  // Filter listings
  const searchResults = properties.filter(prop => {
    if (!prop) return false;

    if (activeCityFilter !== 'All' && prop.city !== activeCityFilter) return false;
    if (activePurposeFilter !== 'All' && prop.purpose !== activePurposeFilter) return false;

    if (queryParam) {
      const q = queryParam.trim().toLowerCase();
      if (!q) return true;

      const matchTitle = (prop.title || '').toLowerCase().includes(q);
      const matchLocation = (prop.location || '').toLowerCase().includes(q);
      const matchBuilder = (prop.builder || '').toLowerCase().includes(q);
      const matchType = (prop.type || '').toLowerCase().includes(q);
      const matchCity = (prop.city || '').toLowerCase().includes(q);
      const matchDesc = (prop.desc || prop.description || '').toLowerCase().includes(q);
      const matchTag = (prop.tag || '').toLowerCase().includes(q);
      const matchAmenities = Array.isArray(prop.amenities) && prop.amenities.some(a => (a || '').toLowerCase().includes(q));
      const matchId = String(prop.id || prop._id || '').toLowerCase().includes(q);

      return matchTitle || matchLocation || matchBuilder || matchType || matchCity || matchDesc || matchTag || matchAmenities || matchId;
    }

    return true;
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      
      {/* Editorial Search Head bar */}
      <div className="border-b border-[rgba(93,100,114,0.15)] py-10 relative overflow-hidden bg-white shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionHeader tag="BESPOKE SEARCH INTELLIGENCE" title="Discovery Console" />

          <form onSubmit={triggerSearch} className="relative w-full md:w-[460px] flex gap-3 font-sans">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CFB6A8] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search estates, builders, neighborhoods..." 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg py-3.5 pl-11 pr-5 text-xs font-medium outline-none text-[#363C46] placeholder-[#5D6472]/60 focus:border-[#CFB6A8] transition-all font-sans"
              />
            </div>
            <button 
              type="submit"
              className="px-7 py-3.5 bg-[#363C46] hover:bg-[#1A1A1A] text-xs font-bold text-white tracking-wider uppercase rounded-lg shrink-0 cursor-pointer shadow-xs transition-all font-sans"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        
        {/* Animated Filter Pill Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(93,100,114,0.15)] pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
            
            {/* City select */}
            <div className="flex gap-2 p-1 bg-white border border-[rgba(93,100,114,0.15)] rounded-lg shadow-xs">
              {['All', 'Chennai', 'Coimbatore'].map(city => (
                <button
                  key={city}
                  onClick={() => setActiveCityFilter(city)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${activeCityFilter === city ? 'bg-[#363C46] text-white shadow-xs' : 'text-[#5D6472] hover:text-[#363C46]'}`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Purpose select */}
            <div className="flex gap-2 p-1 bg-white border border-[rgba(93,100,114,0.15)] rounded-lg shadow-xs">
              {['All', 'Buy', 'Rent'].map(purp => (
                <button
                  key={purp}
                  onClick={() => setActivePurposeFilter(purp)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${activePurposeFilter === purp ? 'bg-[#363C46] text-white shadow-xs' : 'text-[#5D6472] hover:text-[#363C46]'}`}
                >
                  {purp === 'All' ? 'Buy & Rent' : purp === 'Buy' ? 'For Sale' : 'For Lease'}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#5D6472] font-sans font-medium">
            Discovered <span className="text-[#363C46] font-bold">{searchResults.length}</span> luxury listings
          </p>
        </div>

        {/* MAP + LISTINGS SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: RESULTS COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <SkeletonLoader count={3} />
                </motion.div>
              ) : searchResults.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12"
                >
                  <EmptyState 
                    title="No Matching Estates Found"
                    message={`No properties matched your criteria "${queryParam}". Try searching for specific property types like "Villa", "Penthouse", or "Apartment", or adjust your city filters.`}
                    actionLabel="Reset Search Filters"
                    onAction={() => {
                      setSearchVal('');
                      setSearchParams({});
                      setActiveCityFilter('All');
                      setActivePurposeFilter('All');
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {searchResults.map((prop) => {
                    const propId = prop.id || prop._id;
                    return (
                      <motion.div
                        key={propId}
                        variants={itemVariants}
                        whileHover="hover"
                        className="group relative border border-[rgba(93,100,114,0.15)] hover:border-[#CFB6A8] rounded-xl overflow-hidden bg-white shadow-[0_12px_32px_rgba(54,60,70,0.06)] flex flex-col md:flex-row items-stretch cursor-pointer transition-all duration-300"
                        onClick={() => navigate(`/property/${propId}`)}
                      >
                        {/* Image */}
                        <div className="relative w-full md:w-[240px] h-[180px] md:h-auto overflow-hidden bg-[#E0EEE9] shrink-0">
                          <ImageWithSkeleton 
                            src={prop.image || prop.imageUrl} 
                            alt={prop.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                          
                          <div className="absolute top-4 left-4 z-20">
                            <PropertyBadge label={prop.tag} />
                          </div>
                        </div>

                        {/* Body Details */}
                        <div className="p-6 flex-1 flex flex-col justify-between font-sans">
                          <div>
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <div className="flex items-center gap-1 text-xs text-[#5D6472] font-medium font-sans">
                                <MapPin className="w-3.5 h-3.5 text-[#CFB6A8]" />
                                <span className="truncate">{prop.location}</span>
                              </div>
                              <span className="text-[#CFB6A8] font-bold text-base tracking-tight shrink-0">{prop.price || prop.priceDisplay}</span>
                            </div>

                            <h3
                              className="text-lg font-bold text-[#363C46] font-sans tracking-tight group-hover:text-[#CFB6A8] transition-colors"
                              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                            >
                              {prop.title}
                            </h3>
                            <p className="text-[#5D6472] text-xs font-normal line-clamp-1 leading-relaxed mt-1 font-sans">
                              {prop.desc || prop.description || ''}
                            </p>
                          </div>

                          <div className="border-t border-[rgba(93,100,114,0.15)] pt-4 mt-4 flex items-center justify-between text-xs text-[#5D6472] font-sans gap-3">
                            <div className="flex gap-4 font-bold text-[#363C46] shrink-0">
                              <span>{prop.beds > 0 ? `${prop.beds} BHK` : (prop.type || 'Estate')}</span>
                              <span>{prop.area || prop.areaDisplay}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openBookModal(prop.title);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#363C46] hover:bg-[#CFB6A8] text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
                            >
                              <Calendar className="w-3 h-3" />
                              Book Visit
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: DYNAMIC SPLIT MAP COMPONENT */}
          <aside className="lg:col-span-5 border border-[rgba(93,100,114,0.15)] bg-white rounded-xl h-[580px] sticky top-28 overflow-hidden relative shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
            <div className="absolute inset-0 bg-[#E0EEE9]/60 flex flex-col items-center justify-center text-center p-6 space-y-4 font-sans">
              <div className="w-14 h-14 rounded-full bg-[rgba(207,182,168,0.15)] border border-[#CFB6A8] text-[#CFB6A8] flex items-center justify-center shadow-xs">
                <Map className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4
                  className="text-lg font-bold text-[#363C46] tracking-tight"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  Interactive Console Map
                </h4>
                <p className="text-xs text-[#5D6472] leading-relaxed font-sans max-w-xs mx-auto">
                  Displaying coordinates for <span className="text-[#363C46] font-bold">{searchResults.length} listings</span>.
                </p>
              </div>

              {/* Pin Coordinates list overlay on mock map */}
              <div className="w-full max-w-[280px] space-y-2.5 pt-4">
                {searchResults.slice(0, 4).map((item, idx) => {
                  const itemIdStr = String(item.id || item._id || `EST-${idx}`);
                  const displayId = itemIdStr.length >= 8 ? itemIdStr.slice(-5).toUpperCase() : itemIdStr.toUpperCase();
                  return (
                    <div key={itemIdStr} className="flex items-center justify-between text-[11px] font-sans text-[#5D6472] border border-[rgba(93,100,114,0.15)] bg-white px-3.5 py-2.5 rounded-lg text-left shadow-xs">
                      <span className="truncate text-[#363C46] max-w-[150px] font-bold">{item.title}</span>
                      <span className="text-[#CFB6A8] font-bold">ID: {displayId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default SearchPage;
