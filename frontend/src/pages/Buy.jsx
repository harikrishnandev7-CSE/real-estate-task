import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Heart, Grid, List, ChevronDown, Check, ShieldCheck, MapPin, BedDouble, Bath, Square, Sparkles, Filter, RefreshCw, X, Eye, Calendar } from 'lucide-react';
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

  // Filter States
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [maxBudget, setMaxBudget] = useState(250000000); // 25 Cr max
  const [selectedBeds, setSelectedBeds] = useState('All');
  const [selectedBaths, setSelectedBaths] = useState('All');
  const [minArea, setMinArea] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [requireRera, setRequireRera] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [luxuryOnly, setLuxuryOnly] = useState(false);

  // Layout & Sorting States
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState(null);

  // Available Filter Options (dynamically includes all cities from DB properties)
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
  const statuses = ['Ready to Move', 'Under Construction'];
  const amenitiesList = ['Infinity Pool', 'Private Gym', '24/7 Concierge', 'Home Automation', 'Private Garden', 'Sea View', 'Private Cinema', 'Wine Cellar'];

  // Read URL query params on mount/change
  React.useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) setSelectedCity(cityParam);
    const typeParam = searchParams.get('type');
    if (typeParam) setSelectedType(typeParam);
    const searchParam = searchParams.get('search') || searchParams.get('q');
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  // Toggle amenities
  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Toggle status
  const handleStatusToggle = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(item => item !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Reset Filters
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
    setLuxuryOnly(false);
    setSearchQuery('');
  };

  // Filter listings
  const filteredProperties = properties.filter(prop => {
    if (prop.purpose && String(prop.purpose).toLowerCase() !== 'buy') return false;
    
    // City filter
    if (selectedCity !== 'All' && prop.city !== selectedCity) return false;

    // Type filter
    if (selectedType !== 'All' && String(prop.type || '').toLowerCase() !== selectedType.toLowerCase()) return false;

    // Budget filter
    if (prop.numericPrice > maxBudget) return false;

    // Beds filter
    if (selectedBeds !== 'All' && prop.beds !== parseInt(selectedBeds)) return false;

    // Baths filter
    if (selectedBaths !== 'All' && prop.baths !== parseInt(selectedBaths)) return false;

    // Area filter
    if (prop.numericArea < minArea) return false;

    // RERA status filter
    if (requireRera && !prop.rera) return false;

    // Construction status filter
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(prop.status)) return false;

    // Luxury luxuryOnly toggle (over 10 Cr)
    if (luxuryOnly && prop.numericPrice < 100000000) return false;

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
    if (sortBy === 'price-asc') return a.numericPrice - b.numericPrice;
    if (sortBy === 'price-desc') return b.numericPrice - a.numericPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
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
    <div className="pt-20 lg:pt-24 min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      {/* Page Header / Hero Section */}
      <div className="border-b border-[#E8E4DA] pt-10 pb-8 md:pt-12 md:pb-10 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Subheading Tag */}
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#F5A623] font-bold block mb-3 font-sans">
            PREMIUM RESIDENCES
          </span>
          
          {/* Title & Search Bar Aligned Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
              Buy Premium <span className="font-normal text-[#8A8A85]">Estates</span>
            </h1>
            
            {/* Redesigned Search Bar */}
            <div className="relative w-full md:w-[480px] shrink-0">
              <div className="relative flex items-center w-full h-[56px] bg-[#F4F1EA] hover:bg-stone-200/50 border border-[#E8E4DA] rounded-full transition-all duration-300 focus-within:bg-white focus-within:border-[#F5A623] focus-within:ring-2 focus-within:ring-[#F5A623]/20 shadow-xs">
                <Search className="absolute left-5 text-[#F5A623] w-5 h-5 stroke-[2] shrink-0 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Search by title, location, or builder..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full bg-transparent pl-[52px] pr-11 text-sm text-[#1A1A1A] placeholder-[#8A8A85] font-sans outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-[#8A8A85] hover:text-[#1A1A1A] transition-colors cursor-pointer p-1 rounded-full hover:bg-stone-200"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex gap-10 items-start">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block w-[300px] shrink-0 border border-[#E8E4DA] bg-white rounded-3xl py-8 px-6 space-y-9 sticky top-28 shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-sans">
            <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#F5A623]" />
                <h2 className="text-lg font-bold tracking-tight text-[#1A1A1A]">Filters</h2>
              </div>
              <button 
                onClick={resetFilters}
                className="text-xs text-[#8A8A85] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors cursor-pointer font-semibold"
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
                    className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer font-bold ${
                      selectedCity === city
                        ? 'bg-[#1A1A1A] text-white'
                        : 'border border-[#E8E4DA] bg-[#F4F1EA] text-[#1A1A1A] hover:bg-stone-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Typology */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Property Type</label>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer font-bold ${
                      selectedType === type
                        ? 'bg-[#1A1A1A] text-white'
                        : 'border border-[#E8E4DA] bg-[#F4F1EA] text-[#1A1A1A] hover:bg-stone-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Filter */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs uppercase tracking-wider text-[#8A8A85] font-bold">
                <span>Max Budget</span>
                <span className="text-[#F5A623] font-bold">₹{(maxBudget / 10000000).toFixed(1)} Cr</span>
              </div>
              <div className="pt-2">
                <input 
                  type="range" 
                  min="5000000" 
                  max="250000000" 
                  step="5000000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                  className="w-full accent-[#F5A623] cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#8A8A85] font-semibold mt-2">
                <span>₹50 L</span>
                <span>₹25 Cr</span>
              </div>
            </div>

            {/* Rooms (Beds & Baths) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Beds</label>
                <div className="relative">
                  <select 
                    value={selectedBeds}
                    onChange={(e) => setSelectedBeds(e.target.value)}
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] appearance-none cursor-pointer"
                  >
                    {bedsOptions.map(opt => (
                      <option key={opt} value={opt}>{opt === 'All' ? 'All' : `${opt} BHK`}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A85] w-3.5 h-3.5 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Baths</label>
                <div className="relative">
                  <select 
                    value={selectedBaths}
                    onChange={(e) => setSelectedBaths(e.target.value)}
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] appearance-none cursor-pointer"
                  >
                    {bathsOptions.map(opt => (
                      <option key={opt} value={opt}>{opt === 'All' ? 'All' : `${opt} Baths`}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A85] w-3.5 h-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Area Minimum */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Min Area (sq.ft.)</label>
              <input 
                type="number" 
                placeholder="e.g. 2000"
                value={minArea || ''}
                onChange={(e) => setMinArea(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] font-bold placeholder-[#8A8A85] outline-none focus:border-[#F5A623] font-sans"
              />
            </div>

            {/* Toggle Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">RERA Verified Only</span>
                <button 
                  onClick={() => setRequireRera(!requireRera)}
                  className={`w-9 h-5 rounded-full transition-all duration-300 flex items-center p-0.5 cursor-pointer ${requireRera ? 'bg-[#1A1A1A] justify-end' : 'bg-[#E8E4DA] justify-start'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all ${requireRera ? 'bg-[#F5A623]' : 'bg-[#8A8A85]'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">Luxury Collection (10Cr+)</span>
                <button 
                  onClick={() => setLuxuryOnly(!luxuryOnly)}
                  className={`w-9 h-5 rounded-full transition-all duration-300 flex items-center p-0.5 cursor-pointer ${luxuryOnly ? 'bg-[#1A1A1A] justify-end' : 'bg-[#E8E4DA] justify-start'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all ${luxuryOnly ? 'bg-[#F5A623]' : 'bg-[#8A8A85]'}`} />
                </button>
              </div>
            </div>

            {/* Construction Progress Status */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Construction Status</label>
              <div className="space-y-3">
                {statuses.map((status) => (
                  <label key={status} className="flex items-center gap-2.5 text-xs text-[#1A1A1A] font-medium cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                      className="accent-[#F5A623] cursor-pointer outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" 
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            {/* Premium Amenities Checklist */}
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Amenities</label>
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
          <div className="flex-1 space-y-6">
            {/* Top Bar (Sorting & Layout toggles) */}
            <div className="flex items-center justify-between border-b border-[#E8E4DA] pt-3 pb-4 font-sans">
              <p className="text-xs text-[#8A8A85] font-sans">
                Showing <span className="text-[#1A1A1A] font-bold">{sortedProperties.length}</span> luxury properties
              </p>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8E4DA] bg-white text-xs text-[#1A1A1A] font-bold hover:border-[#1A1A1A] cursor-pointer shadow-xs"
                >
                  <Filter className="w-3.5 h-3.5 text-[#F5A623]" />
                  Filters
                </button>

                {/* Sort Option */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8A8A85] font-medium hidden sm:inline">Sort by</span>
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-[#E8E4DA] rounded-full px-4 py-2 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] appearance-none pr-8 cursor-pointer shadow-xs"
                    >
                      <option value="price-desc">Price: High to Low</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="rating">Top Rated</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8A85] w-3 h-3 pointer-events-none" />
                  </div>
                </div>

                {/* Layout Toggles */}
                <div className="hidden sm:flex items-center border border-[#E8E4DA] rounded-full p-1 bg-white shadow-xs">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                    aria-label="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#1A1A1A] text-white' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                    aria-label="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {sortedProperties.length === 0 && (
              <div className="border border-[#E8E4DA] rounded-3xl bg-white py-24 flex flex-col items-center justify-center text-center space-y-4 px-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-sans">
                <div className="p-4 rounded-full bg-[#F4F1EA] text-[#F5A623]">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">No Properties Match Your Query</h3>
                <p className="text-[#8A8A85] text-xs font-normal max-w-sm font-sans leading-relaxed">
                  Try adjusting your budget slider, changing selected bedrooms, or cleaning search terms to discover more properties.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white tracking-wider uppercase rounded-full cursor-pointer shadow-md"
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
                  const propId = prop.id || prop._id || prop.slug || (prop.title ? prop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prop-${idx}`);
                  const propImg = prop.image || prop.imageUrl || (Array.isArray(prop.galleryUrls) && prop.galleryUrls[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
                  const isWishlisted = Array.isArray(wishlist) && wishlist.some(item => item && (item === propId || item.id === propId || item._id === propId));
                  const isCompared = Array.isArray(compareList) && compareList.some(item => item && (item === propId || item.id === propId || item._id === propId));

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
                          src={propImg} 
                          alt={prop.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                          <span className="px-3 py-1.5 rounded-full bg-white/90 text-[10px] font-bold tracking-wider text-[#1A1A1A] uppercase shadow-xs">{prop.tag || 'EXCLUSIVE'}</span>
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
                                isCompared ? removeFromCompare(propId) : addToCompare(prop);
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
                          {prop.pricePerSqFt && (
                            <p className="text-[10px] text-amber-200 font-sans tracking-wider font-bold">{prop.pricePerSqFt}</p>
                          )}
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

                          {/* Technical Specs Row */}
                          {prop.type === 'Plot' ? (
                            <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-4 pb-2 text-[10px] text-[#8A8A85] font-medium font-sans">
                              <div className="flex items-center gap-1.5 truncate">
                                <Square className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                                <span className="truncate">{prop.area}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-[#F5A623] text-xs leading-none shrink-0">🛣</span>
                                <span className="truncate">{prop.roadWidth || 'Paved Road'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-[#F5A623] text-xs leading-none shrink-0">🧭</span>
                                <span className="truncate">{prop.facing || prop.approval || 'East Facing'}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-4 pb-2 text-xs text-[#8A8A85] font-medium font-sans">
                              <div className="flex items-center gap-1.5">
                                <BedDouble className="w-3.5 h-3.5 text-[#F5A623]" />
                                <span>{prop.beds} BHK</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Bath className="w-3.5 h-3.5 text-[#F5A623]" />
                                <span>{prop.baths} Baths</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Square className="w-3.5 h-3.5 text-[#F5A623]" />
                                <span>{prop.area}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Bottom CTA bar */}
                        <div className="border-t border-[#E8E4DA] pt-4 mt-4 flex items-center justify-between font-sans gap-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors shrink-0">
                            VIEW RESIDENCE
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

            {/* PAGINATION LAYOUT */}
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
                  <label className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Type</label>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-bold outline-none cursor-pointer"
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Budget */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-[#8A8A85] font-bold">
                    <span>Max Budget</span>
                    <span className="text-[#F5A623]">₹{(maxBudget / 10000000).toFixed(1)} Cr</span>
                  </div>
                  <div className="pt-2">
                    <input 
                      type="range" 
                      min="5000000" 
                      max="250000000" 
                      step="5000000"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                      className="w-full accent-[#F5A623] cursor-pointer"
                    />
                  </div>
                </div>

                {/* BHK Beds */}
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-wider text-[#8A8A85] font-bold">Beds</label>
                  <select 
                    value={selectedBeds} 
                    onChange={(e) => setSelectedBeds(e.target.value)}
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-bold outline-none cursor-pointer"
                  >
                    {bedsOptions.map(t => <option key={t} value={t}>{t === 'All' ? 'All' : `${t} BHK`}</option>)}
                  </select>
                </div>

                {/* Verify Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#1A1A1A] font-bold">RERA Verified Only</span>
                    <input 
                      type="checkbox" 
                      checked={requireRera} 
                      onChange={() => setRequireRera(!requireRera)} 
                      className="accent-[#F5A623] cursor-pointer outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#1A1A1A] font-bold">Luxury Only (10Cr+)</span>
                    <input 
                      type="checkbox" 
                      checked={luxuryOnly} 
                      onChange={() => setLuxuryOnly(!luxuryOnly)} 
                      className="accent-[#F5A623] cursor-pointer outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E8E4DA] pt-6 mt-6 gap-3 flex font-sans">
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
                    <span className="px-3 py-1 rounded-full bg-white/90 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 inline-block shadow-xs">{quickViewProperty.tag}</span>
                    <h4 className="text-xl font-bold text-white tracking-tight">{quickViewProperty.title}</h4>
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between space-y-6 bg-white font-sans">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold">Price</span>
                      <p className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{quickViewProperty.price}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold">Description</span>
                      <p className="text-xs text-[#8A8A85] leading-relaxed font-sans font-normal">
                        {quickViewProperty.desc}
                      </p>
                    </div>

                    {quickViewProperty.type === 'Plot' ? (
                      <div className="grid grid-cols-3 gap-4 border-t border-b border-[#E8E4DA] py-4 text-xs font-sans text-[#1A1A1A]">
                        <div>
                          <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Land Area</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.area}</p>
                        </div>
                        <div>
                          <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Road Width</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.roadWidth || 'Paved Road'}</p>
                        </div>
                        <div>
                          <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Facing / Approval</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.facing || quickViewProperty.approval}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 border-t border-b border-[#E8E4DA] py-4 text-xs font-sans text-[#1A1A1A]">
                        <div>
                          <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Beds</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.beds} BHK</p>
                        </div>
                        <div>
                          <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Baths</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.baths}</p>
                        </div>
                        <div>
                          <p className="text-[#8A8A85] text-[9px] uppercase font-bold">Area</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.area}</p>
                        </div>
                      </div>
                    )}
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
                      Full Details
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

export default Buy;
