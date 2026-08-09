import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Heart, Check, Grid, List, ChevronDown, Filter, MapPin, BedDouble, Bath, Square, Sparkles, ChevronRight, X, Eye, ShieldCheck, Calendar } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

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

const CollectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { properties, wishlist, addToWishlist, removeFromWishlist, openBookModal } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const collectionSlug = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'premium-plots';
  }, [location.pathname]);

  const config = collectionConfigs[collectionSlug] || collectionConfigs['premium-plots'];

  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedPurpose, setSelectedPurpose] = useState('All');
  const [maxBudget, setMaxBudget] = useState(500000000);
  const [selectedApproval, setSelectedApproval] = useState('All');
  const [selectedFacing, setSelectedFacing] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredListings = properties.filter(prop => {
    if (!prop) return false;

    if (config.category === 'Plot') {
      if (prop.type !== 'Plot' && prop.type !== 'Land') return false;
    } else if (config.category === 'Villa') {
      if (prop.type !== 'Villa') return false;
    } else if (config.category === 'Apartment') {
      if (prop.type !== 'Apartment' && prop.type !== 'Penthouse') return false;
    } else if (config.category === 'Commercial') {
      if (prop.type !== 'Commercial' && prop.type !== 'Office' && prop.type !== 'Co-working') return false;
    }

    if (selectedCity !== 'All' && prop.city !== selectedCity) return false;
    if (selectedPurpose === 'Sale' && prop.purpose === 'Rent') return false;
    if (selectedPurpose === 'Rent' && prop.purpose === 'Buy') return false;
    if (prop.numericPrice > maxBudget) return false;

    if (selectedApproval !== 'All') {
      if (selectedApproval === 'RERA Verified' && !prop.rera) return false;
      if (prop.approval && prop.approval !== selectedApproval) return false;
    }

    if (selectedFacing !== 'All' && prop.facing && prop.facing !== selectedFacing) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchLoc = prop.location.toLowerCase().includes(q);
      const matchBuilder = prop.builder?.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchBuilder) return false;
    }

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price-asc') return a.numericPrice - b.numericPrice;
    if (sortBy === 'price-desc') return b.numericPrice - a.numericPrice;
    return 0;
  });

  const cities = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Hyderabad', 'Mumbai'];

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-20">
        <PageHero
          tag="IMPERIA CURATED SPECTRUM"
          heading={
            <>{config.title} <span className="font-normal text-[#5D6472]">Listings</span></>
          }
          description={config.subtitle}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12 font-sans">
        
        {/* 2. COLLECTION OVERVIEW */}
        <section className="p-6 md:p-8 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block font-sans">
            COLLECTION BRIEF
          </span>
          <p className="text-[#5D6472] font-sans font-normal text-sm md:text-base leading-relaxed">
            {config.overview}
          </p>
        </section>

        {/* 3. MAIN EXPLORER: SIDEBAR & GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          
          {/* FILTER SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 p-6 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
            <div className="flex items-center justify-between border-b border-[rgba(93,100,114,0.15)] pb-4">
              <h3 className="text-sm uppercase tracking-wider font-bold text-[#363C46] font-sans flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#CFB6A8]" />
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
                className="text-xs text-[#5D6472] hover:text-[#CFB6A8] transition-colors font-bold uppercase font-sans cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block font-sans">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#363C46] font-medium placeholder-[#5D6472]/60 outline-none focus:border-[#CFB6A8] font-sans"
                />
                <Search className="w-3.5 h-3.5 text-[#CFB6A8] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* City Selection */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-[#5D6472] font-bold block font-sans">Location</label>
              <div className="flex flex-wrap gap-1.5">
                {cities.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCity(c)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${selectedCity === c ? 'bg-[#363C46] text-white' : 'bg-[#E0EEE9]/40 border border-[rgba(93,100,114,0.15)] text-[#5D6472] hover:text-[#363C46]'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* LISTINGS GRID */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header controls bar */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] shadow-xs">
              <p className="text-xs text-[#5D6472] font-bold uppercase tracking-wider">
                Showing <span className="text-[#363C46] font-extrabold">{sortedListings.length}</span> Estates
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#363C46] text-white' : 'text-[#5D6472] hover:text-[#363C46]'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#363C46] text-white' : 'text-[#5D6472] hover:text-[#363C46]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {sortedListings.map(prop => {
                const propId = prop.id || prop._id;
                return (
                  <div
                    key={propId}
                    onClick={() => navigate(`/property/${propId}`)}
                    className="group border border-[rgba(93,100,114,0.15)] hover:border-[#CFB6A8] rounded-xl overflow-hidden bg-white shadow-[0_12px_32px_rgba(54,60,70,0.06)] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative h-[220px] overflow-hidden bg-[#E0EEE9]">
                      <ImageWithSkeleton
                        src={prop.image || prop.imageUrl}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3
                          className="text-base font-bold text-[#363C46] tracking-tight group-hover:text-[#CFB6A8] transition-colors"
                          style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                        >
                          {prop.title}
                        </h3>
                        <span className="text-sm font-bold text-[#CFB6A8]">{prop.price}</span>
                      </div>
                      <p className="text-xs text-[#5D6472] font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#CFB6A8]" />
                        {prop.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CollectionPage;
