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
  const { properties, wishlist, addToWishlist, removeFromWishlist, openBookModal } = useApp();
  const shouldReduceMotion = useReducedMotion();

  // Search input query
  const queryParam = searchParams.get('q') || '';
  const [searchVal, setSearchVal] = useState(queryParam);
  const [activeCityFilter, setActiveCityFilter] = useState('All');
  const [activePurposeFilter, setActivePurposeFilter] = useState('All'); // 'All' | 'Buy' | 'Rent'

  // Loading skeleton state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchVal(queryParam);
  }, [queryParam]);

  // Simulate premium skeleton loader on query trigger
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
    // City filter
    if (activeCityFilter !== 'All' && prop.city !== activeCityFilter) return false;

    // Purpose filter
    if (activePurposeFilter !== 'All' && prop.purpose !== activePurposeFilter) return false;

    // Query filter
    if (queryParam) {
      const q = queryParam.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchLocation = prop.location.toLowerCase().includes(q);
      const matchBuilder = prop.builder.toLowerCase().includes(q);
      const matchType = prop.type.toLowerCase().includes(q);
      return matchTitle || matchLocation || matchBuilder || matchType;
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
    <div className="pt-28 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans">
      
      {/* Editorial Search Head bar */}
      <div className="border-b border-[#E8E4DA] py-10 relative overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionHeader tag="BESPOKE SEARCH INTELLIGENCE" title="Discovery Console" />

          <form onSubmit={triggerSearch} className="relative w-full md:w-[460px] flex gap-3 font-sans">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5A623] w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search estates, builders, neighborhoods..." 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-full py-3.5 pl-11 pr-5 text-xs font-medium outline-none text-[#1A1A1A] placeholder-[#8A8A85] focus:border-[#F5A623] transition-all font-sans"
              />
            </div>
            <button 
              type="submit"
              className="px-7 py-3.5 bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white tracking-wider uppercase rounded-full shrink-0 cursor-pointer shadow-md transition-all font-sans"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        
        {/* Animated Filter Pill Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E4DA] pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
            
            {/* City select */}
            <div className="flex gap-2 p-1 bg-white border border-[#E8E4DA] rounded-full shadow-xs">
              {['All', 'Chennai', 'Coimbatore'].map(city => (
                <button
                  key={city}
                  onClick={() => setActiveCityFilter(city)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activeCityFilter === city ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Purpose select */}
            <div className="flex gap-2 p-1 bg-white border border-[#E8E4DA] rounded-full shadow-xs">
              {['All', 'Buy', 'Rent'].map(purp => (
                <button
                  key={purp}
                  onClick={() => setActivePurposeFilter(purp)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${activePurposeFilter === purp ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                >
                  {purp === 'All' ? 'Buy & Rent' : purp === 'Buy' ? 'For Sale' : 'For Lease'}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#8A8A85] font-sans font-medium">
            Discovered <span className="text-[#1A1A1A] font-bold">{searchResults.length}</span> luxury listings
          </p>
        </div>

        {/* MAP + LISTINGS SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: RESULTS COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              {loading ? (
                /* Consume global shared Skeleton Loader component */
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SkeletonLoader count={3} />
                </motion.div>
              ) : searchResults.length === 0 ? (
                /* Consume global shared Empty State component */
                <div className="py-12">
                  <EmptyState 
                    title="No Bespoke Listings Discovered"
                    message="Your search query did not yield direct results in our signature collection. Try expanding search keywords or selecting different cities."
                    actionLabel="Reset Discovery"
                    onAction={() => {
                      setSearchVal('');
                      setSearchParams({});
                    }}
                  />
                </div>
              ) : (
                /* Search Results Grid */
                <motion.div
                  key="results"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {searchResults.map((prop) => {
                    const isWishlisted = wishlist.some(item => item.id === prop.id);
                    return (
                      <motion.div
                        key={prop.id}
                        variants={itemVariants}
                        whileHover="hover"
                        className="group relative border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-stretch cursor-pointer transition-all duration-300"
                        onClick={() => navigate(`/property/${prop.id}`)}
                      >
                        {/* Image */}
                        <div className="relative w-full md:w-[240px] h-[180px] md:h-auto overflow-hidden bg-stone-100 shrink-0">
                          <ImageWithSkeleton 
                            src={prop.image} 
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
                              <div className="flex items-center gap-1 text-xs text-[#8A8A85] font-medium font-sans">
                                <MapPin className="w-3.5 h-3.5 text-[#F5A623]" />
                                <span className="truncate">{prop.location}</span>
                              </div>
                              <span className="text-[#F5A623] font-bold text-base tracking-tight shrink-0">{prop.price}</span>
                            </div>

                            <h3 className="text-lg font-bold text-[#1A1A1A] font-sans tracking-tight group-hover:text-[#F5A623] transition-colors">
                              {prop.title}
                            </h3>
                            <p className="text-[#8A8A85] text-xs font-normal line-clamp-1 leading-relaxed mt-1 font-sans">
                              {prop.desc}
                            </p>
                          </div>

                          <div className="border-t border-[#E8E4DA] pt-4 mt-4 flex items-center justify-between text-xs text-[#8A8A85] font-sans gap-3">
                            <div className="flex gap-4 font-bold text-[#1A1A1A] shrink-0">
                              <span>{prop.beds > 0 ? `${prop.beds} BHK` : 'Office'}</span>
                              <span>{prop.area}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openBookModal(prop.title);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-[#F5A623] text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
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
          <aside className="lg:col-span-5 border border-[#E8E4DA] bg-white rounded-3xl h-[580px] sticky top-28 overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 bg-[#F4F1EA] flex flex-col items-center justify-center text-center p-6 space-y-4 font-sans">
              <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center shadow-xs">
                <Map className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#1A1A1A] tracking-tight">Interactive Console Map</h4>
                <p className="text-xs text-[#8A8A85] leading-relaxed font-sans max-w-xs mx-auto">
                  Displaying coordinates for <span className="text-[#1A1A1A] font-bold">{searchResults.length} listings</span>.
                </p>
              </div>

              {/* Pin Coordinates list overlay on mock map */}
              <div className="w-full max-w-[280px] space-y-2.5 pt-4">
                {searchResults.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-[11px] font-sans text-[#8A8A85] border border-[#E8E4DA] bg-white px-3.5 py-2.5 rounded-2xl text-left shadow-2xs">
                    <span className="truncate text-[#1A1A1A] max-w-[150px] font-bold">{item.title}</span>
                    <span className="text-[#F5A623] font-bold">ID: {item.id.slice(5, 10).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default SearchPage;
