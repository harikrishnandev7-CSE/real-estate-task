import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Heart, Grid, List, ChevronDown, Check, ShieldCheck, MapPin, BedDouble, Bath, Square, Sparkles, Filter, RefreshCw, X, Eye, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Buy = () => {
  const [searchParams] = useSearchParams();
  const { properties, fetchProperties, wishlist, compareList, addToWishlist, removeFromWishlist, addToCompare, removeFromCompare, addToRecentlyViewed, openBookModal } = useApp();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (fetchProperties) fetchProperties();
  }, []);

  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [maxBudget, setMaxBudget] = useState(250000000);
  const [selectedBeds, setSelectedBeds] = useState('All');
  const [selectedBaths, setSelectedBaths] = useState('All');
  const [minArea, setMinArea] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [requireRera, setRequireRera] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const cities = useMemo(() => {
    const defaultCities = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Hyderabad', 'Mumbai'];
    const dynamicSet = new Set(defaultCities);
    (properties || []).forEach(p => {
      if (p.city && p.city.trim()) dynamicSet.add(p.city.trim());
    });
    return Array.from(dynamicSet);
  }, [properties]);

  const types = ['All', 'Villa', 'Apartment', 'Penthouse', 'Plot'];
  const bedsOptions = ['All', '3', '4', '5'];
  const bathsOptions = ['All', '3', '4', '5', '6'];

  React.useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) setSelectedCity(cityParam);
    const typeParam = searchParams.get('type');
    if (typeParam) setSelectedType(typeParam);
    const qParam = searchParams.get('q');
    if (qParam) setSearchQuery(qParam);
  }, [searchParams]);

  const filteredProperties = useMemo(() => {
    let result = (properties || []).filter(p => {
      const isRent = (p.purpose || p.status || '').toLowerCase() === 'rent' || p.isRent === true;
      return !isRent;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q)) ||
        (p.type && p.type.toLowerCase().includes(q))
      );
    }

    if (selectedCity !== 'All') {
      result = result.filter(p => (p.city || p.location || '').toLowerCase().includes(selectedCity.toLowerCase()));
    }

    if (selectedType !== 'All') {
      result = result.filter(p => (p.type || '').toLowerCase() === selectedType.toLowerCase());
    }

    if (maxBudget) {
      result = result.filter(p => (p.priceNum || 0) <= maxBudget);
    }

    if (selectedBeds !== 'All') {
      const b = parseInt(selectedBeds);
      result = result.filter(p => (p.beds || 0) >= b);
    }

    if (selectedBaths !== 'All') {
      const bt = parseInt(selectedBaths);
      result = result.filter(p => (p.baths || 0) >= bt);
    }

    if (requireRera) {
      result = result.filter(p => p.reraApproved === true || p.rera === true);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [properties, searchQuery, selectedCity, selectedType, maxBudget, selectedBeds, selectedBaths, requireRera, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSelectedCity('All');
    setSelectedType('All');
    setMaxBudget(250000000);
    setSelectedBeds('All');
    setSelectedBaths('All');
    setMinArea(0);
    setSelectedAmenities([]);
    setRequireRera(false);
    setSelectedStatuses([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F7F6F3] text-[#16161a] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">

        {/* Page Title & Breadcrumb Header */}
        <div className="space-y-3 border-b border-[rgba(22,22,26,0.08)] pb-8">
          <span className="eyebrow">BUY PORTFOLIO</span>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-[#16161a]" style={{ fontFamily: "'Fraunces', serif" }}>
            Curated Luxury Estates
          </h1>
          <p className="text-sm text-[#4a4a4f] max-w-xl font-normal leading-relaxed">
            Explore exclusive architectural villas, penthouses, and prime residential developments.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[rgba(22,22,26,0.10)] rounded-md p-4 shadow-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden px-4 py-2 bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-[#A98A5B]" />
              <span>Filters</span>
            </button>
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-[#4a4a4f] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city, neighborhood..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-md pl-9 pr-3 py-2 text-xs text-[#16161a] outline-none focus:border-[#A98A5B]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-[#4a4a4f] font-semibold">{filteredProperties.length} Properties</span>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-md px-3 py-2 text-xs font-semibold text-[#16161a] outline-none focus:border-[#A98A5B] cursor-pointer"
              >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white border border-[rgba(22,22,26,0.10)] rounded-md p-6 shadow-xs sticky top-28">
            <div className="flex items-center justify-between border-b border-[rgba(22,22,26,0.08)] pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#16161a]">Filter Portfolio</h3>
              <button onClick={resetFilters} className="text-[11px] font-semibold uppercase tracking-wider text-[#A98A5B] hover:text-[#16161a]">
                Reset
              </button>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#4a4a4f] block">City Location</label>
              <select
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-md p-2 text-xs font-semibold text-[#16161a] outline-none focus:border-[#A98A5B] cursor-pointer"
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#4a4a4f] block">Property Type</label>
              <div className="flex flex-wrap gap-1.5">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => { setSelectedType(t); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      selectedType === t
                        ? 'bg-[#16161a] text-white shadow-xs'
                        : 'bg-[#F7F6F3] text-[#4a4a4f] hover:text-[#16161a]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#4a4a4f] font-semibold">Max Price</span>
                <span className="text-[#16161a] font-bold">₹{(maxBudget / 10000000).toFixed(1)} Cr</span>
              </div>
              <input
                type="range"
                min="10000000"
                max="250000000"
                step="5000000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                className="w-full accent-[#A98A5B] cursor-pointer"
              />
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#4a4a4f] block">Minimum Bedrooms</label>
              <div className="flex gap-1.5">
                {bedsOptions.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBeds(b)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      selectedBeds === b ? 'bg-[#16161a] text-white' : 'bg-[#F7F6F3] text-[#4a4a4f]'
                    }`}
                  >
                    {b === 'All' ? 'All' : `${b}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* RERA */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#16161a] font-semibold">RERA Approved Only</span>
              <button
                type="button"
                onClick={() => setRequireRera(!requireRera)}
                className={`w-10 h-5 rounded-full transition-colors relative ${requireRera ? 'bg-[#A98A5B]' : 'bg-[rgba(22,22,26,0.18)]'}`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${requireRera ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </aside>

          {/* Property Cards Grid */}
          <div className="lg:col-span-3 space-y-8">
            {currentItems.length === 0 ? (
              <div className="bg-white border border-[rgba(22,22,26,0.10)] rounded-md p-16 text-center space-y-4">
                <p className="text-lg font-medium text-[#16161a]" style={{ fontFamily: "'Fraunces', serif" }}>No residences found</p>
                <p className="text-xs text-[#4a4a4f]">Try adjusting your search query or price filters.</p>
                <button onClick={resetFilters} className="px-5 py-2 bg-[#16161a] text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentItems.map((prop, idx) => {
                  const propId = prop.id || prop._id;
                  const propImg = prop.image || prop.imageUrl || (Array.isArray(prop.galleryUrls) && prop.galleryUrls[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
                  const isWishlisted = Array.isArray(wishlist) && wishlist.some(item => item && ((item.id || item._id) === propId || item === propId));

                  return (
                    <motion.div
                      key={propId}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => {
                        addToRecentlyViewed(prop);
                        navigate(`/property/${propId}`);
                      }}
                      className="group relative flex flex-col bg-white border border-[rgba(22,22,26,0.10)] rounded-md overflow-hidden shadow-[0_1px_2px_rgba(22,22,26,0.04),0_8px_24px_rgba(22,22,26,0.05)] cursor-pointer transition-colors duration-300 hover:border-[rgba(22,22,26,0.22)]"
                    >
                      {/* Photo Edge-to-Edge */}
                      <div className="relative h-[260px] overflow-hidden bg-[#F7F6F3]">
                        <ImageWithSkeleton
                          src={propImg}
                          alt={prop.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />

                        {prop.tag && (
                          <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-xs text-[10px] font-semibold uppercase tracking-wider text-[#16161a] rounded-sm">
                            {prop.tag}
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist(prop);
                          }}
                          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#16161a] transition-colors cursor-pointer shadow-xs"
                        >
                          <Heart
                            className="w-3.5 h-3.5"
                            style={{
                              fill: isWishlisted ? '#A98A5B' : 'transparent',
                              color: isWishlisted ? '#A98A5B' : 'currentColor'
                            }}
                          />
                        </button>
                      </div>

                      {/* Caption Block Below Photo */}
                      <div className="p-5 flex-1 flex flex-col justify-between font-sans">
                        <div className="space-y-2">
                          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#4a4a4f] block">
                            {prop.location || prop.city}
                          </span>

                          <h3
                            className="text-lg font-medium text-[#16161a] tracking-tight leading-snug"
                            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                          >
                            {prop.title}
                          </h3>

                          <p className="text-xl font-bold text-[#16161a] tracking-tight pt-1">
                            {prop.price}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-[rgba(22,22,26,0.10)] space-y-3">
                          <div className="flex items-center gap-2 text-xs text-[#4a4a4f] font-medium">
                            <span>{prop.beds > 0 ? `${prop.beds} Beds` : 'Commercial'}</span>
                            <span>·</span>
                            <span>{prop.baths} Baths</span>
                            <span>·</span>
                            <span>{prop.area}</span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#16161a] group-hover:text-[#A98A5B] transition-colors">
                              Explore Residence
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openBookModal(prop.title);
                              }}
                              className="text-[11px] font-semibold uppercase tracking-wider text-[#4a4a4f] hover:text-[#16161a] transition-colors"
                            >
                              Book Visit →
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      currentPage === idx + 1
                        ? 'bg-[#16161a] text-white shadow-xs'
                        : 'bg-white border border-[rgba(22,22,26,0.10)] text-[#4a4a4f] hover:text-[#16161a]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
