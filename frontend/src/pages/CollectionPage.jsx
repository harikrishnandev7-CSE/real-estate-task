import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Heart, Check, Grid, List, ChevronDown, Filter, MapPin, BedDouble, Bath, Square, Sparkles, ChevronRight, X, Eye, ShieldCheck, Calendar } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

// Collection Metadata Registry
const collectionConfigs = {
  'premium-plots': {
    title: 'Premium Plots',
    subtitle: 'Exclusive investment-ready plots and gated layouts across fast-growing corridors.',
    overview: 'Premium Plots focuses on DTCP, CMDA, BIAAPA, and HMDA approved residential layouts located in high-appreciation corridors. Complete 30-year clear title audit, wide asphalt approach roads, and ready for immediate registration.',
    category: 'Plot',
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    countText: '10 Listings'
  },
  'architectural-villas': {
    title: 'Architectural Villas',
    subtitle: 'Bespoke custom-built mansions featuring private infinity pools and lush grounds.',
    overview: 'Architectural Villas celebrates luxury standalone residences, beachfront estates, and hill country manors crafted with imported marble, acoustic glazing, and private security perimeters.',
    category: 'Villa',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    countText: '12 Listings'
  },
  'sky-apartments': {
    title: 'Sky Apartments',
    subtitle: 'Luxury high-floor penthouses with full-skyline glass facades and private elevators.',
    overview: 'Sky Apartments features branded high-rise condominiums, duplex penthouses, and sky homes in prime city centers with 24/7 concierge services, infinity sky pools, and automated living controls.',
    category: 'Apartment',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    countText: '15 Listings'
  },
  'commercial-assets': {
    title: 'Commercial Assets',
    subtitle: 'High-yield corporate towers, IT park suites, and flagship retail showrooms.',
    overview: 'Commercial Assets offers institutional-grade office spaces, high-street retail showrooms, and tech park suites delivering strong long-term rental yields and blue-chip tenant profiles.',
    category: 'Commercial',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    countText: '8 Listings'
  },
  'luxury-farm-lands': {
    title: 'Luxury Farm Lands',
    subtitle: 'Sprawling organic plantations, countryside retreats, and foothill orchards.',
    overview: 'Luxury Farm Lands showcases fertile agricultural estates, coffee & tea plantations, and scenic country ranch lands equipped with abundant groundwater, solar hybrid grids, and mountain views.',
    category: 'Farm Land',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    countText: '8 Listings'
  },
  'signature-collection': {
    title: 'Signature Collection',
    subtitle: 'Ultra-exclusive private island style estates, beachfront sanctuaries, and trophy assets.',
    overview: 'Signature Collection represents the zenith of global luxury real estate — rare beachfront compounds, mountain retreats, and landmark trophy assets for discerning family offices.',
    category: 'Signature',
    heroImage: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80',
    countText: '10 Listings'
  }
};

const CollectionPage = ({ collectionSlug: propSlug }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { properties, fetchProperties, wishlist, compareList, addToWishlist, removeFromWishlist, addToCompare, removeFromCompare, addToRecentlyViewed, openBookModal } = useApp();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (fetchProperties) fetchProperties();
  }, []);

  // Determine current slug from prop or pathname
  const currentSlug = propSlug || location.pathname.replace('/', '') || 'premium-plots';
  const config = collectionConfigs[currentSlug] || collectionConfigs['premium-plots'];

  // Filter States
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedPurpose, setSelectedPurpose] = useState('All'); // 'All' | 'Sale' | 'Rent'
  const [maxBudget, setMaxBudget] = useState(500000000); // 50 Cr max
  const [selectedApproval, setSelectedApproval] = useState('All');
  const [selectedFacing, setSelectedFacing] = useState('All');
  const [sortBy, setSortBy] = useState('price-desc');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const cities = useMemo(() => {
    const defaultCities = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Goa', 'Ooty', 'Kodaikanal', 'Coonoor', 'Pondicherry'];
    const dynamicSet = new Set(defaultCities);
    (properties || []).forEach(p => {
      if (p.city && p.city.trim()) dynamicSet.add(p.city.trim());
    });
    return Array.from(dynamicSet);
  }, [properties]);
  const approvals = ['All', 'DTCP Approved', 'CMDA Approved', 'BIAAPA Approved', 'HMDA Approved', 'RERA Verified'];
  const facings = ['All', 'East Facing', 'North Facing', 'North-East Facing', 'South-East Facing'];

  // Reset page filters on slug change
  useEffect(() => {
    setSelectedCity('All');
    setSelectedPurpose('All');
    setMaxBudget(500000000);
    setSelectedApproval('All');
    setSelectedFacing('All');
    setSearchQuery('');
  }, [currentSlug]);

  // Filter logic
  const filteredListings = properties.filter(prop => {
    // Category / Collection matching
    if (config.category === 'Signature') {
      if (prop.numericPrice < 140000000 && prop.tag !== 'EXCLUSIVE' && prop.tag !== 'SIGNATURE' && !prop.amenities.includes('Private Beach Access')) {
        return false;
      }
    } else if (config.category === 'Farm Land') {
      if (prop.type !== 'Plot' || (!prop.tag.includes('FARM') && !prop.area.includes('Acres'))) return false;
    } else if (config.category === 'Plot') {
      if (prop.type !== 'Plot') return false;
    } else if (config.category === 'Villa') {
      if (prop.type !== 'Villa') return false;
    } else if (config.category === 'Apartment') {
      if (prop.type !== 'Apartment' && prop.type !== 'Penthouse') return false;
    } else if (config.category === 'Commercial') {
      if (prop.type !== 'Commercial' && prop.type !== 'Office' && prop.type !== 'Co-working') return false;
    }

    // City Filter
    if (selectedCity !== 'All' && prop.city !== selectedCity) return false;

    // Purpose Filter (Sale vs Rent)
    if (selectedPurpose === 'Sale' && prop.purpose === 'Rent') return false;
    if (selectedPurpose === 'Rent' && prop.purpose === 'Buy') return false;

    // Budget Filter
    if (prop.numericPrice > maxBudget) return false;

    // Approval Filter
    if (selectedApproval !== 'All') {
      if (selectedApproval === 'RERA Verified' && !prop.rera) return false;
      if (prop.approval && prop.approval !== selectedApproval) return false;
    }

    // Facing Filter
    if (selectedFacing !== 'All' && prop.facing && prop.facing !== selectedFacing) return false;

    // Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchLoc = prop.location.toLowerCase().includes(q);
      const matchBuilder = prop.builder?.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchBuilder) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price-asc') return a.numericPrice - b.numericPrice;
    if (sortBy === 'price-desc') return b.numericPrice - a.numericPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Render Listing Badge (FOR SALE, FOR RENT, BUY / RENT)
  const renderListingBadge = (prop) => {
    if (prop.purpose === 'Buy' && prop.gallery?.length > 2 && prop.numericPrice > 100000000) {
      return <span className="px-2.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-[9px] font-semibold tracking-wider uppercase">BUY / RENT</span>;
    }
    if (prop.purpose === 'Rent') {
      return <span className="px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[9px] font-semibold tracking-wider uppercase">FOR RENT</span>;
    }
    return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-semibold tracking-wider uppercase">FOR SALE</span>;
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      
      {/* 1. LUXURY HERO BANNER */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image={config.heroImage}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
            { label: config.title },
          ]}
          eyebrow="CURATED COLLECTION"
          heading={
            <>{config.title} <span className="font-normal text-[#8A8A85]">Listings</span></>
          }
          description={config.subtitle}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12 font-sans">
        
        {/* 2. COLLECTION OVERVIEW */}
        <section className="p-6 md:p-8 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block font-sans">
            COLLECTION BRIEF
          </span>
          <p className="text-[#8A8A85] font-sans font-normal text-sm md:text-base leading-relaxed">
            {config.overview}
          </p>
        </section>

        {/* 3. MAIN EXPLORER: SIDEBAR & GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          
          {/* FILTER SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 p-6 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
              <h3 className="text-sm uppercase tracking-wider font-bold text-[#1A1A1A] font-sans flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#F5A623]" />
                Refine Collection
              </h3>
              <button 
                onClick={() => {
                  setSelectedCity('All');
                  setSelectedPurpose('All');
                  setMaxBudget(500000000);
                  setSelectedApproval('All');
                  setSelectedFacing('All');
                  setSearchQuery('');
                }} 
                className="text-xs text-[#8A8A85] hover:text-[#F5A623] transition-colors font-bold uppercase font-sans cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block font-sans">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1A1A1A] font-medium placeholder-[#8A8A85] outline-none focus:border-[#F5A623] font-sans"
                />
                <Search className="w-3.5 h-3.5 text-[#F5A623] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Purpose (Sale vs Rent) */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block font-sans">Listing Type</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4F1EA] rounded-xl border border-[#E8E4DA] text-xs font-sans">
                {['All', 'Sale', 'Rent'].map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPurpose(p)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${selectedPurpose === p ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* City Location */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block font-sans">Location</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] font-sans cursor-pointer"
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#8A8A85] font-sans font-bold">
                <span className="text-[10px] uppercase tracking-wider">Max Price</span>
                <span className="text-[#F5A623]">₹{(maxBudget / 10000000).toFixed(1)} Cr</span>
              </div>
              <input
                type="range"
                min="10000000"
                max="500000000"
                step="10000000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                className="w-full accent-[#F5A623] cursor-pointer"
              />
            </div>

            {/* Approval / RERA */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block font-sans">Approval & RERA</label>
              <select
                value={selectedApproval}
                onChange={(e) => setSelectedApproval(e.target.value)}
                className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] font-sans cursor-pointer"
              >
                {approvals.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Facing Direction */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block font-sans">Facing</label>
              <select
                value={selectedFacing}
                onChange={(e) => setSelectedFacing(e.target.value)}
                className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] font-sans cursor-pointer"
              >
                {facings.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </aside>

          {/* 4. PROPERTY GRID & CONTROLS CONTAINER */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-sans">
              <div className="text-xs text-[#8A8A85] font-medium">
                Showing <span className="text-[#1A1A1A] font-bold">{sortedListings.length}</span> properties in <span className="text-[#F5A623] font-bold">{config.title}</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F4F1EA] border border-[#E8E4DA] text-xs text-[#1A1A1A] font-bold cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-[#F5A623]" />
                  Filters
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#8A8A85] font-bold hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] cursor-pointer"
                  >
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* View Toggles */}
                <div className="hidden sm:flex items-center border border-[#E8E4DA] rounded-xl p-1 bg-[#F4F1EA]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'}`}
                    aria-label="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {sortedListings.length === 0 && (
              <div className="border border-[#E8E4DA] rounded-3xl bg-white py-20 text-center space-y-4 px-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <Filter className="w-8 h-8 text-[#F5A623] mx-auto" />
                <h3 className="text-xl font-bold text-[#1A1A1A]">No Properties Match Selected Filters</h3>
                <p className="text-xs text-[#8A8A85] max-w-sm mx-auto font-sans leading-relaxed">
                  Try adjusting the budget slider or selecting a different location to explore more properties in {config.title}.
                </p>
                <button
                  onClick={() => {
                    setSelectedCity('All');
                    setSelectedPurpose('All');
                    setMaxBudget(500000000);
                    setSelectedApproval('All');
                    setSelectedFacing('All');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white tracking-wider uppercase rounded-full cursor-pointer shadow-md font-sans"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Property Cards Grid */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
              {sortedListings.map((prop, propIdx) => {
                const propKey = prop._id || prop.id || propIdx;
                const targetId = prop._id || prop.id;
                const isWishlisted = Array.isArray(wishlist) && wishlist.some(item => item && ((item._id || item.id) === targetId || item === targetId));
                const isCompared = Array.isArray(compareList) && compareList.some(item => item && ((item._id || item.id) === targetId || item === targetId));

                return (
                  <motion.div
                    key={propKey}
                    whileHover={{ y: shouldReduceMotion ? 0 : -6 }}
                    transition={{ duration: 0.3 }}
                    className={`group relative border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex flex-col md:flex-row items-stretch' : 'flex flex-col'}`}
                    onClick={() => {
                      addToRecentlyViewed(prop);
                      navigate(`/property/${prop.id}`);
                    }}
                  >
                    {/* Card Image */}
                    <div className={`relative overflow-hidden bg-stone-100 shrink-0 ${viewMode === 'list' ? 'w-full md:w-[320px] h-[240px] md:h-auto' : 'h-[260px]'}`}>
                      <ImageWithSkeleton
                        src={prop.image}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                        {renderListingBadge(prop)}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToWishlist(prop);
                            }}
                            className="p-2 rounded-full bg-white/90 text-[#1A1A1A] hover:bg-[#F5A623] hover:text-white transition-colors cursor-pointer shadow-xs"
                            aria-label="Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-red-500 hover:text-white' : ''}`} />
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

                      {/* Price Tag */}
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
                        className="absolute right-4 bottom-4 p-2 rounded-full bg-white/90 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden sm:block cursor-pointer shadow-xs"
                        aria-label="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between font-sans">
                      <div>
                        <div className="flex items-center gap-1 text-[#8A8A85] text-xs font-medium mb-2 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                          <span className="truncate">{prop.location}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1A1A1A] font-sans tracking-tight mb-2 transition-colors group-hover:text-[#F5A623]">
                          {prop.title}
                        </h3>
                        <p className="text-[#8A8A85] text-xs font-normal line-clamp-2 leading-relaxed mb-4 font-sans">
                          {prop.desc}
                        </p>

                        {/* Category-Specific Specifications Row */}
                        {prop.type === 'Plot' ? (
                          <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-4 pb-2 text-xs text-[#8A8A85] font-medium font-sans">
                            <div className="flex items-center gap-1 truncate">
                              <Square className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                              <span className="truncate">{prop.area}</span>
                            </div>
                            <div className="flex items-center gap-1 truncate">
                              <span className="text-[#F5A623] text-xs">🛣</span>
                              <span className="truncate">{prop.roadWidth || 'Paved Road'}</span>
                            </div>
                            <div className="flex items-center gap-1 truncate">
                              <span className="text-[#F5A623] text-xs">🧭</span>
                              <span className="truncate">{prop.facing || prop.approval || 'East Facing'}</span>
                            </div>
                          </div>
                        ) : prop.type === 'Commercial' || prop.type === 'Office' || prop.type === 'Co-working' ? (
                          <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-4 pb-2 text-xs text-[#8A8A85] font-medium font-sans">
                            <div className="flex items-center gap-1 truncate">
                              <Square className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                              <span className="truncate">{prop.area}</span>
                            </div>
                            <div className="flex items-center gap-1 truncate">
                              <span className="text-[#F5A623] text-xs">📈</span>
                              <span className="truncate">Yield: {prop.growth || '8.5%'}</span>
                            </div>
                            <div className="flex items-center gap-1 truncate">
                              <span className="text-[#F5A623] text-xs">🏢</span>
                              <span className="truncate">{prop.specs?.Floor || 'Multi-Floor'}</span>
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
            </div>

          </div>

        </div>

      </div>

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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[760px] bg-white border border-[#E8E4DA] text-[#1A1A1A] rounded-3xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.15)] z-[1000] max-h-[90vh] overflow-y-auto font-sans"
            >
              <button
                onClick={() => setQuickViewProperty(null)}
                className="absolute right-6 top-6 p-2 bg-white/90 hover:bg-[#1A1A1A] hover:text-white rounded-full text-[#1A1A1A] transition-all z-50 cursor-pointer shadow-xs"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <p className="text-[10px] uppercase tracking-wider text-[#F5A623] font-bold mb-1 font-sans">{quickViewProperty.tag}</p>
                    <h4 className="text-xl font-bold font-sans text-white tracking-tight">{quickViewProperty.title}</h4>
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-[#8A8A85] uppercase tracking-widest font-bold">Price</span>
                      <p className="text-2xl font-bold text-[#F5A623] tracking-tight">{quickViewProperty.price}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-[#8A8A85] uppercase tracking-widest font-bold">Description</span>
                      <p className="text-xs text-[#8A8A85] leading-relaxed font-sans font-normal">
                        {quickViewProperty.desc}
                      </p>
                    </div>

                    {quickViewProperty.type === 'Plot' ? (
                      <div className="grid grid-cols-3 gap-4 border-t border-b border-[#E8E4DA] py-4 text-xs font-sans text-[#1A1A1A]">
                        <div>
                          <p className="text-[#8A8A85] text-[10px] uppercase font-bold">Land Area</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.area}</p>
                        </div>
                        <div>
                          <p className="text-[#8A8A85] text-[10px] uppercase font-bold">Road Width</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.roadWidth || 'Paved Road'}</p>
                        </div>
                        <div>
                          <p className="text-[#8A8A85] text-[10px] uppercase font-bold">Facing / Approval</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.facing || quickViewProperty.approval}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 border-t border-b border-[#E8E4DA] py-4 text-xs font-sans text-[#1A1A1A]">
                        <div>
                          <p className="text-[#8A8A85] text-[10px] uppercase font-bold">Beds</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.beds} BHK</p>
                        </div>
                        <div>
                          <p className="text-[#8A8A85] text-[10px] uppercase font-bold">Baths</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.baths}</p>
                        </div>
                        <div>
                          <p className="text-[#8A8A85] text-[10px] uppercase font-bold">Area</p>
                          <p className="font-bold mt-0.5">{quickViewProperty.area}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 font-sans">
                    <button
                      onClick={() => {
                        navigate(`/property/${quickViewProperty.id}`);
                        setQuickViewProperty(null);
                      }}
                      className="flex-1 py-3.5 text-center bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white tracking-wider uppercase rounded-full cursor-pointer shadow-md transition-all"
                    >
                      Full Details
                    </button>
                    <button
                      onClick={() => {
                        addToWishlist(quickViewProperty);
                      }}
                      className="px-4 py-3.5 border border-[#E8E4DA] rounded-full text-[#1A1A1A] hover:border-[#F5A623] transition-colors flex items-center justify-center cursor-pointer shadow-xs"
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

export default CollectionPage;
