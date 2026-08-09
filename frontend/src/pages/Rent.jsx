import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Heart, Grid, List, ChevronDown, Check, ShieldCheck, MapPin, BedDouble, Bath, Square, Sparkles, Filter, RefreshCw, X, Eye, Calendar, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Rent = () => {
  const [searchParams] = useSearchParams();
  const { properties, fetchProperties, wishlist, compareList, addToWishlist, removeFromWishlist, addToCompare, removeFromCompare, addToRecentlyViewed, openBookModal } = useApp();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (fetchProperties) fetchProperties();
  }, []);

  // Filter States
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [maxRent, setMaxRent] = useState(800000); // 8L/mo max
  const [maxDeposit, setMaxDeposit] = useState(2500000); // 25L max deposit
  const [minLease, setMinLease] = useState('All'); // 'All' | '12' | '36'
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [onlyReady, setOnlyReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // UI state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Available Filter Options (dynamically includes all cities from DB properties)
  const cities = useMemo(() => {
    const defaultCities = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Hyderabad', 'Mumbai'];
    const dynamicSet = new Set(defaultCities);
    (properties || []).forEach(p => {
      if (p.city && p.city.trim()) dynamicSet.add(p.city.trim());
    });
    return Array.from(dynamicSet);
  }, [properties]);

  const types = ['All', 'Villa', 'Apartment', 'Penthouse', 'Plot', 'Commercial'];

  // Read URL query params on mount/change
  React.useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) setSelectedCity(cityParam);
    const typeParam = searchParams.get('type');
    if (typeParam) setSelectedType(typeParam);
    const searchParam = searchParams.get('search') || searchParams.get('q');
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);
  const leaseOptions = [
    { label: 'Any Duration', value: 'All' },
    { label: '1 Year Min', value: '12' },
    { label: '3 Years Min', value: '36' }
  ];
  const amenitiesList = ['Fibre Internet', 'Conference Room', 'Server Room', 'Cafeteria', 'Concierge', 'Valet Parking', 'Swimming Pool', 'Private Gym', 'Home Automation', 'Sea View'];

  // Toggle amenities
  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setSelectedCity('All');
    setSelectedType('All');
    setMaxRent(800000);
    setMaxDeposit(2500000);
    setMinLease('All');
    setSelectedAmenities([]);
    setOnlyReady(false);
    setSearchQuery('');
  };

  // Filter listings
  const filteredProperties = properties.filter(prop => {
    if (prop.purpose && String(prop.purpose).toLowerCase() !== 'rent') return false;
    
    // City filter
    if (selectedCity !== 'All' && prop.city !== selectedCity) return false;

    // Type filter
    if (selectedType !== 'All' && String(prop.type || '').toLowerCase() !== selectedType.toLowerCase()) return false;

    // Budget (Monthly Rent) filter
    if (prop.numericPrice > maxRent) return false;

    // Deposit filter (simulate deposit = rent * 5 for offices, rent * 3 for others)
    const deposit = prop.type === 'Office' || prop.type === 'Commercial' ? prop.numericPrice * 5 : prop.numericPrice * 3;
    if (deposit > maxDeposit) return false;

    // Lease Duration filter (Office/Commercial = 36mo lock-in, others = 12mo)
    const lease = prop.type === 'Office' || prop.type === 'Commercial' ? 36 : 12;
    if (minLease !== 'All' && lease < parseInt(minLease)) return false;

    // Availability filter
    if (onlyReady && prop.status !== 'Ready to Move') return false;

    // Search Query filter
    if (searchQuery && !prop.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !prop.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !prop.builder.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      const hasAllAmenities = selectedAmenities.every(amenity => prop.amenities.includes(amenity));
      if (!hasAllAmenities) return false;
    }

    return true;
  });

  // Sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    return b.numericPrice - a.numericPrice; // Default Rent High to Low
  });

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProperties.slice(indexOfFirstItem, indexOfLastItem);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const imageVariants = {
    hidden: { opacity: 1, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      {/* Page Header / Hero Section */}
      <div className="border-b border-[rgba(93,100,114,0.15)] pt-10 pb-8 md:pt-12 md:pb-10 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block mb-2 font-sans">
              LEASING PORTFOLIO
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#363C46] tracking-tight leading-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Luxury Residences <span className="font-normal text-[#5D6472]">for Rent</span>
            </h1>
          </div>
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CFB6A8] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by workspace, title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg py-3 pl-11 pr-5 text-sm outline-none text-[#363C46] placeholder-[#5D6472]/60 focus:border-[#CFB6A8] transition-all font-sans font-medium"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex gap-10 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block w-[300px] shrink-0 border border-[rgba(93,100,114,0.15)] bg-white rounded-xl py-8 px-6 space-y-9 sticky top-28 shadow-[0_12px_32px_rgba(54,60,70,0.06)] font-sans">
            <div className="flex items-center justify-between border-b border-[rgba(93,100,114,0.15)] pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#CFB6A8]" />
                <h2 className="text-lg font-bold text-[#1A1A1A] tracking-tight">Filters</h2>
              </div>
              <button 
                onClick={resetFilters}
                className="text-xs text-[#8A8A85] hover:text-[#F5A623] flex items-center gap-1 transition-colors cursor-pointer font-bold uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* City Selection */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Location</label>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedCity === city
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'border border-[#E8E4DA] bg-[#F4F1EA] text-[#8A8A85] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Typology */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Space Type</label>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedType === type
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'border border-[#E8E4DA] bg-[#F4F1EA] text-[#8A8A85] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget (Monthly Rent) */}
            <div className="space-y-4 font-sans">
              <div className="flex justify-between text-xs uppercase tracking-wider text-[#8A8A85] font-bold">
                <span>Max Monthly Rent</span>
                <span className="text-[#F5A623] font-bold">₹{(maxRent / 100000).toFixed(1)} L/mo</span>
              </div>
              <div className="pt-2">
                <input 
                  type="range" 
                  min="50000" 
                  max="800000" 
                  step="25000"
                  value={maxRent}
                  onChange={(e) => setMaxRent(parseInt(e.target.value))}
                  className="w-full accent-[#F5A623] cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#8A8A85] font-bold mt-2">
                <span>₹50 K</span>
                <span>₹8 L</span>
              </div>
            </div>

            {/* Refundable Deposit Limit */}
            <div className="space-y-4 font-sans">
              <div className="flex justify-between text-xs uppercase tracking-wider text-[#8A8A85] font-bold">
                <span>Max Deposit Limit</span>
                <span className="text-[#F5A623] font-bold">₹{(maxDeposit / 100000).toFixed(1)} L</span>
              </div>
              <div className="pt-2">
                <input 
                  type="range" 
                  min="100000" 
                  max="2500000" 
                  step="50000"
                  value={maxDeposit}
                  onChange={(e) => setMaxDeposit(parseInt(e.target.value))}
                  className="w-full accent-[#F5A623] cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#8A8A85] font-bold mt-2">
                <span>₹1 L</span>
                <span>₹25 L</span>
              </div>
            </div>

            {/* Lease Duration Limit */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Lease Term Requirements</label>
              <div className="flex flex-wrap gap-2">
                {leaseOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMinLease(opt.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      minLease === opt.value
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'border border-[#E8E4DA] bg-[#F4F1EA] text-[#8A8A85] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">Available Immediately</span>
                <button 
                  onClick={() => setOnlyReady(!onlyReady)}
                  className={`w-9 h-5 rounded-full transition-all duration-300 flex items-center p-0.5 cursor-pointer ${onlyReady ? 'bg-[#1A1A1A] justify-end' : 'bg-[#E8E4DA] justify-start'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all ${onlyReady ? 'bg-[#F5A623]' : 'bg-[#8A8A85]'}`} />
                </button>
              </div>
            </div>

            {/* Premium Amenities Checklist */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Amenities Included</label>
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2.5 text-xs text-[#1A1A1A] font-medium cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="accent-[#F5A623] cursor-pointer outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" 
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN RESULTS SECTION */}
          <div className="flex-1 space-y-6 font-sans">
            {/* Top Bar (Sorting & Layout toggles) */}
            <div className="flex items-center justify-between border-b border-[#E8E4DA] pt-3 pb-4">
              <p className="text-xs text-[#8A8A85] font-medium">
                Showing <span className="text-[#1A1A1A] font-bold">{sortedProperties.length}</span> premium lease estates
              </p>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8E4DA] bg-white text-xs text-[#1A1A1A] font-bold cursor-pointer shadow-xs"
                >
                  <Filter className="w-3.5 h-3.5 text-[#F5A623]" />
                  Filters
                </button>

                {/* Layout Toggles */}
                <div className="hidden sm:flex items-center border border-[#E8E4DA] rounded-full p-1 bg-[#F4F1EA]">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                    aria-label="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                    aria-label="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {sortedProperties.length === 0 && (
              <div className="border border-[#E8E4DA] rounded-3xl bg-white py-24 flex flex-col items-center justify-center text-center space-y-4 px-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <div className="p-4 rounded-full bg-amber-50 text-[#F5A623]">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">No Properties Match Your Query</h3>
                <p className="text-[#8A8A85] text-xs font-normal max-w-sm font-sans leading-relaxed">
                  Try adjusting your monthly budget limits, deposit requirements, or space typology checklist to explore other properties.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white tracking-wider uppercase rounded-full cursor-pointer shadow-md font-sans"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* PROPERTY CARDS WRAPPER */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" 
                : "flex flex-col gap-6"
              }
            >
              <AnimatePresence mode="popLayout">
                {currentItems.map((prop, idx) => {
                  const propId = prop.id || prop._id || prop.slug || (prop.title ? prop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `rent-${idx}`);
                  const isWishlisted = Array.isArray(wishlist) && wishlist.some(item => item && (item === propId || item.id === propId || item._id === propId));
                  const isCompared = Array.isArray(compareList) && compareList.some(item => item && (item === propId || item.id === propId || item._id === propId));
                  const deposit = prop.type === 'Office' || prop.type === 'Commercial' ? prop.numericPrice * 5 : prop.numericPrice * 3;
                  const lease = prop.type === 'Office' || prop.type === 'Commercial' ? 36 : 12;

                  return (
                    <motion.div
                      key={propId}
                      variants={cardVariants}
                      whileHover="hover"
                      layout
                      className={`group relative border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer ${
                        viewMode === 'list' ? 'flex flex-col md:flex-row items-stretch' : 'flex flex-col'
                      }`}
                      onClick={() => {
                        addToRecentlyViewed(prop);
                        navigate(`/property/${propId}`);
                      }}
                    >
                      {/* CARD IMAGE CONTAINER */}
                      <div className={`relative overflow-hidden bg-stone-100 shrink-0 ${
                        viewMode === 'list' ? 'w-full md:w-[320px] h-[240px] md:h-auto' : 'h-[280px]'
                      }`}>
                        <ImageWithSkeleton 
                          variants={imageVariants}
                          src={prop.image} 
                          alt={prop.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                          <span className="px-3 py-1.5 rounded-full bg-white/90 text-[10px] font-bold tracking-wider text-[#1A1A1A] uppercase shadow-xs">{prop.tag}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToWishlist(prop);
                              }}
                              className="p-2 rounded-full bg-white/90 text-[#1A1A1A] hover:bg-[#F5A623] hover:text-white transition-colors cursor-pointer shadow-xs"
                              aria-label="Wishlist"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                isCompared ? removeFromCompare(prop.id) : addToCompare(prop);
                              }}
                              className={`p-2 rounded-full transition-colors cursor-pointer shadow-xs ${isCompared ? 'bg-[#1A1A1A] text-white' : 'bg-white/90 text-[#1A1A1A] hover:bg-[#F5A623] hover:text-white'}`}
                              aria-label="Compare"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        </div>

                        {/* Floating Price */}
                        <div className="absolute bottom-4 left-4 z-20">
                          <p className="text-xl font-bold text-white font-sans tracking-tight">{prop.price}</p>
                        </div>

                        {/* Quick View Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProperty(prop);
                          }}
                          className="absolute right-4 bottom-4 p-2 rounded-full bg-white/90 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden sm:block shadow-xs"
                          aria-label="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* CARD BODY CONTENT */}
                      <div className="p-6 flex-1 flex flex-col justify-between font-sans bg-white">
                        <div>
                          <div className="flex items-center gap-1 text-[#8A8A85] text-xs font-medium mb-2">
                            <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                            <span className="truncate">{prop.location}</span>
                          </div>
                          <h3 className="text-lg font-bold text-[#1A1A1A] font-sans tracking-tight mb-2 transition-colors group-hover:text-[#F5A623]">
                            {prop.title}
                          </h3>
                          <p className="text-[#8A8A85] text-xs font-normal line-clamp-2 leading-relaxed mb-4 font-sans">
                            {prop.desc}
                          </p>

                          {/* Technical Lease Row */}
                          <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-4 pb-2 text-[10px] font-sans">
                            <div className="flex flex-col">
                              <span className="text-[#8A8A85] text-[9px] uppercase font-bold">Security Deposit</span>
                              <span className="font-bold text-[#1A1A1A] mt-0.5">₹{(deposit / 100000).toFixed(1)} L</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[#8A8A85] text-[9px] uppercase font-bold">Min Lease</span>
                              <span className="font-bold text-[#1A1A1A] mt-0.5">{lease} months</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[#8A8A85] text-[9px] uppercase font-bold">Area Size</span>
                              <span className="font-bold text-[#1A1A1A] mt-0.5">{prop.area}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom CTA bar */}
                        <div className="border-t border-[#E8E4DA] pt-4 mt-4 flex items-center justify-between font-sans gap-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors shrink-0">
                            LEASE DETAILS
                          </span>
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
              </AnimatePresence>
            </motion.div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10 border-t border-white/5">
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      currentPage === idx + 1
                        ? 'bg-gold-500 text-neutral-950 font-bold'
                        : 'border border-white/5 hover:border-gold-500/25 text-neutral-400 hover:text-white'
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

      {/* MOBILE DRAWER FILTERS */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[320px] bg-[#F4F1EA] border-l border-[#E8E4DA] z-50 py-8 px-6 flex flex-col justify-between overflow-y-auto lg:hidden font-sans text-[#1A1A1A]"
            >
              <div className="space-y-9">
                <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
                  <h2 className="text-lg font-bold text-[#1A1A1A] tracking-tight">Filters</h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 text-[#8A8A85] hover:text-[#1A1A1A] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* City */}
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Location</label>
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-bold outline-none cursor-pointer"
                  >
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                {/* Type */}
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Workspace Type</label>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-bold outline-none cursor-pointer"
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Rent Budget */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-[#8A8A85] font-bold">
                    <span>Max Monthly Rent</span>
                    <span className="text-[#F5A623]">₹{(maxRent / 100000).toFixed(1)} L/mo</span>
                  </div>
                  <div className="pt-2">
                    <input 
                      type="range" 
                      min="50000" 
                      max="800000" 
                      step="25000"
                      value={maxRent}
                      onChange={(e) => setMaxRent(parseInt(e.target.value))}
                      className="w-full accent-[#F5A623] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E8E4DA] pt-6 mt-6 gap-3 flex">
                <button 
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 py-3 text-center border border-[#E8E4DA] bg-white rounded-full text-xs text-[#1A1A1A] font-bold uppercase cursor-pointer"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 text-center bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-full text-xs uppercase cursor-pointer shadow-md"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* QUICK VIEW POPUP MODAL */}
      <AnimatePresence>
        {quickViewProperty && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProperty(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[760px] bg-white border border-[#E8E4DA] rounded-3xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.15)] z-[1000] max-h-[90vh] overflow-y-auto font-sans text-[#1A1A1A]"
            >
              <button 
                onClick={() => setQuickViewProperty(null)}
                className="absolute right-6 top-6 p-2 rounded-full bg-white/90 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all z-50 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-[280px] md:h-full min-h-[320px] relative bg-stone-100">
                  <ImageWithSkeleton 
                    src={quickViewProperty.image} 
                    alt={quickViewProperty.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-[10px] uppercase font-bold text-[#1A1A1A] tracking-wider mb-2 inline-block shadow-xs">{quickViewProperty.tag}</span>
                    <h4 className="text-xl font-bold text-white tracking-tight">{quickViewProperty.title}</h4>
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between space-y-6 bg-white font-sans">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold">Monthly Rent</span>
                      <p className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{quickViewProperty.price}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold">Description</span>
                      <p className="text-xs text-[#8A8A85] leading-relaxed font-sans font-normal">
                        {quickViewProperty.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-b border-[#E8E4DA] py-4 text-xs font-sans text-[#1A1A1A]">
                      <div>
                        <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Deposit</p>
                        <p className="font-bold mt-0.5">₹{( (quickViewProperty.type === 'Office' || quickViewProperty.type === 'Commercial' ? quickViewProperty.numericPrice * 5 : quickViewProperty.numericPrice * 3) / 100000).toFixed(1)} L</p>
                      </div>
                      <div>
                        <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Min Lease</p>
                        <p className="font-bold mt-0.5">{quickViewProperty.type === 'Office' || quickViewProperty.type === 'Commercial' ? 36 : 12} mo</p>
                      </div>
                      <div>
                        <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Area Size</p>
                        <p className="font-bold mt-0.5">{quickViewProperty.area}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 font-sans">
                    <button
                      onClick={() => {
                        const qId = quickViewProperty.id || quickViewProperty._id;
                        navigate(`/property/${qId}`);
                        setQuickViewProperty(null);
                      }}
                      className="flex-1 py-3.5 text-center bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white tracking-wider uppercase rounded-full cursor-pointer shadow-md"
                    >
                      Lease Details
                    </button>
                    <button
                      onClick={() => {
                        addToWishlist(quickViewProperty);
                      }}
                      className="px-4 py-3.5 border border-[#E8E4DA] bg-white rounded-full text-[#1A1A1A] hover:border-[#F5A623] transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      <Heart className={`w-4 h-4 ${Array.isArray(wishlist) && wishlist.some(item => item && ((item.id || item._id) === (quickViewProperty.id || quickViewProperty._id) || item === (quickViewProperty.id || quickViewProperty._id))) ? 'fill-current text-red-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rent;
