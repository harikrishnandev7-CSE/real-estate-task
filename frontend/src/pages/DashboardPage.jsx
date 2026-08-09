import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Heart, Clock, MapPin, Building, ShieldCheck, ChevronRight, User, Settings, PlusCircle, ArrowRight, Eye, Check } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { properties, wishlist, recentlyViewed, currentUser, siteVisits, openBookModal, addToWishlist, removeFromWishlist, addToCompare, removeFromCompare, addToRecentlyViewed } = useApp();

  // RECOMMENDATION ENGINE LOGIC (Hook must execute unconditionally at top level)
  const recommendedProperties = useMemo(() => {
    if (!currentUser) return [];
    return properties.filter(prop => {
      // Purpose match
      if (currentUser.purpose === 'Rent' && prop.purpose === 'Buy') return false;

      // Type match (at least one type)
      if (currentUser.propertyTypes && currentUser.propertyTypes.length > 0) {
        const typeMatch = currentUser.propertyTypes.some(t => {
          if (t === 'Villa') return prop.type === 'Villa';
          if (t === 'Apartment') return prop.type === 'Apartment' || prop.type === 'Penthouse';
          if (t === 'Plot') return prop.type === 'Plot';
          if (t === 'Commercial') return prop.type === 'Commercial' || prop.type === 'Office';
          return true;
        });
        if (!typeMatch) return false;
      }

      // Location match
      if (currentUser.locations && currentUser.locations.length > 0) {
        const locMatch = currentUser.locations.some(loc => 
          prop.location.toLowerCase().includes(loc.toLowerCase()) || 
          prop.city?.toLowerCase().includes(loc.toLowerCase())
        );
        if (!locMatch) return false;
      }

      return true;
    }).slice(0, 6);
  }, [properties, currentUser]);

  // NEW PROJECTS (Hook must execute unconditionally at top level)
  const newProjects = useMemo(() => {
    return properties.filter(prop => 
      prop.tag === 'NEW LAUNCH' || prop.status === 'Under Construction' || prop.numericPrice > 100000000
    ).slice(0, 4);
  }, [properties]);

  // Safe Array Wrappers
  const safeSiteVisits = useMemo(() => Array.isArray(siteVisits) ? siteVisits : [], [siteVisits]);

  const wishlistProperties = useMemo(() => {
    const list = Array.isArray(wishlist) ? wishlist : [];
    return list.map(item => {
      if (typeof item === 'object' && item !== null) return item;
      return properties.find(p => p.id === item || p._id === item) || null;
    }).filter(Boolean);
  }, [wishlist, properties]);

  const recentlyViewedProperties = useMemo(() => {
    const list = Array.isArray(recentlyViewed) ? recentlyViewed : [];
    return list.map(item => {
      if (typeof item === 'object' && item !== null) return item;
      return properties.find(p => p.id === item || p._id === item) || null;
    }).filter(Boolean);
  }, [recentlyViewed, properties]);

  // Conditional rendering placed AFTER all hooks have executed
  if (!currentUser) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] flex flex-col items-center justify-center font-sans px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center shadow-md">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">VIP Access Required</h2>
        <p className="text-xs text-[#8A8A85] max-w-md leading-relaxed font-normal">
          Please log in or create a luxury account to access your personalized portfolio and recommendations.
        </p>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white uppercase tracking-wider rounded-full shadow-md transition-all">
            Log In
          </Link>
          <Link to="/signup" className="px-6 py-3 border border-[#E8E4DA] bg-white text-xs font-bold text-[#1A1A1A] hover:border-[#F5A623] rounded-full shadow-xs transition-all">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  // Time-of-day greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Spec renderer helper
  const renderCardSpecs = (prop) => {
    if (prop.type === 'Plot') {
      return (
        <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-3 text-xs text-[#8A8A85] font-sans">
          <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">Area</span><span className="text-[#1A1A1A] font-bold">{prop.area}</span></div>
          <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">Road Width</span><span className="text-[#1A1A1A] font-bold">{prop.roadWidth || '40 ft Road'}</span></div>
          <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">Facing</span><span className="text-[#1A1A1A] font-bold">{prop.facing || prop.approval || 'East Facing'}</span></div>
        </div>
      );
    }
    if (prop.type === 'Commercial' || prop.type === 'Office') {
      return (
        <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-3 text-xs text-[#8A8A85] font-sans">
          <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">Area</span><span className="text-[#1A1A1A] font-bold">{prop.area}</span></div>
          <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">Floors</span><span className="text-[#1A1A1A] font-bold">{prop.specs?.Floor || 'Multi-Floor'}</span></div>
          <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">Status</span><span className="text-emerald-700 font-bold">{prop.status}</span></div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-3 text-xs text-[#8A8A85] font-sans">
        <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">BHK</span><span className="text-[#1A1A1A] font-bold">{prop.beds} BHK</span></div>
        <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">Baths</span><span className="text-[#1A1A1A] font-bold">{prop.baths}</span></div>
        <div><span className="text-[#8A8A85] uppercase block text-[9px] font-bold">Area</span><span className="text-[#1A1A1A] font-bold">{prop.area}</span></div>
      </div>
    );
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        
        {/* 1. HERO WELCOME SECTION */}
        <section className="relative p-8 md:p-12 rounded-3xl bg-white border border-[#E8E4DA] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
                VIP PORTFOLIO DASHBOARD
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                {getGreeting()}, {currentUser.name}
              </h1>
              <p className="text-[#8A8A85] text-sm md:text-base font-normal max-w-xl leading-relaxed">
                We've prepared premium opportunities based on your personalized criteria.
              </p>
            </div>

            <Link
              to="/profile"
              className="px-6 py-3 rounded-full border border-[#E8E4DA] bg-[#F4F1EA] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 self-start md:self-auto shadow-xs"
            >
              <Settings className="w-4 h-4 text-[#F5A623]" />
              Edit Preferences
            </Link>
          </div>

          {/* User Preference Summary Pills */}
          <div className="pt-4 border-t border-[#E8E4DA] flex flex-wrap items-center gap-3 text-xs font-sans">
            <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Active Criteria:</span>
            <span className="px-3.5 py-1 rounded-full bg-[#F4F1EA] border border-[#E8E4DA] text-[#8A8A85] font-medium">
              Purpose: <strong className="text-[#1A1A1A] font-bold">{currentUser.purpose || 'Buy'}</strong>
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#F4F1EA] border border-[#E8E4DA] text-[#8A8A85] font-medium">
              Budget: <strong className="text-[#1A1A1A] font-bold">{currentUser.budget || 'Any'}</strong>
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#F4F1EA] border border-[#E8E4DA] text-[#8A8A85] font-medium">
              Types: <strong className="text-[#1A1A1A] font-bold">{(currentUser.propertyTypes || []).join(', ') || 'Villa, Apartment'}</strong>
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#F4F1EA] border border-[#E8E4DA] text-[#8A8A85] font-medium">
              Locations: <strong className="text-[#1A1A1A] font-bold">{(currentUser.locations || []).join(', ') || 'Chennai'}</strong>
            </span>
          </div>
        </section>

        {/* 2. RECOMMENDED PROPERTIES SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
                MATCHED FOR YOU
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                Recommended Properties
              </h2>
            </div>
            <Link to="/buy" className="text-xs text-[#1A1A1A] hover:text-[#F5A623] uppercase tracking-wider font-bold flex items-center gap-1">
              View All Listings <ChevronRight className="w-3.5 h-3.5 text-[#F5A623]" />
            </Link>
          </div>

          {recommendedProperties.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E8E4DA] text-center space-y-3 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
              <p className="text-[#8A8A85] text-xs font-normal">No exact matches found for your criteria. Broaden your location or budget preferences in Profile Settings.</p>
              <Link to="/profile" className="inline-block px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">Update Profile</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProperties.map((prop, idx) => (
                <div
                  key={prop.id || prop._id || `rec-${idx}`}
                  onClick={() => {
                    addToRecentlyViewed(prop.id || prop._id || prop);
                    navigate(`/property/${prop.id || prop._id}`);
                  }}
                  className="group relative border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-[220px] overflow-hidden bg-stone-100">
                    <ImageWithSkeleton src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 rounded-full bg-[#F5A623] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                        FOR {prop.purpose === 'Rent' ? 'RENT' : 'SALE'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 z-20">
                      <p className="text-xl font-bold text-white font-sans tracking-tight">{prop.price}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[#8A8A85] text-xs font-medium mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1A1A1A] font-sans tracking-tight group-hover:text-[#F5A623] transition-colors">
                        {prop.title}
                      </h3>
                    </div>

                    {renderCardSpecs(prop)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. NEW PROJECTS SECTION */}
        <section className="space-y-6 border-t border-[#E8E4DA] pt-10">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
              FLAGSHIP LAUNCHES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
              NEW PROJECTS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProjects.map((proj, idx) => (
              <div
                key={proj.id || proj._id || `proj-${idx}`}
                onClick={() => {
                  addToRecentlyViewed(proj.id || proj._id || proj);
                  navigate(`/property/${proj.id || proj._id}`);
                }}
                className="group relative border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all cursor-pointer"
              >
                <div className="relative h-[180px] overflow-hidden bg-stone-100">
                  <ImageWithSkeleton src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
                    NEW
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold block">{proj.type}</span>
                  <h4 className="text-sm font-bold text-[#1A1A1A] font-sans group-hover:text-[#F5A623] truncate">{proj.title}</h4>
                  <p className="text-xs text-[#8A8A85] truncate">{proj.location}</p>
                  <p className="text-sm font-bold text-[#F5A623] pt-1">{proj.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. UPCOMING SITE VISITS SECTION */}
        <section className="space-y-6 border-t border-[#E8E4DA] pt-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
                CHAUFFEUR & PRIVATE TOURS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                Upcoming Site Visits
              </h2>
            </div>
            <button
              onClick={() => openBookModal()}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-full uppercase tracking-wider cursor-pointer shadow-md transition-all"
            >
              Book New Visit
            </button>
          </div>

          {safeSiteVisits.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-[#E8E4DA] text-center text-xs text-[#8A8A85] space-y-2 shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-normal">
              <p>No site visits currently scheduled.</p>
              <button onClick={() => openBookModal()} className="text-[#F5A623] hover:underline font-bold">Schedule a private chauffeur-driven tour</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeSiteVisits.map((visit, idx) => (
                <div key={visit.id || visit._id || `visit-${idx}`} className="p-6 rounded-3xl bg-white border border-[#E8E4DA] flex flex-col justify-between gap-4 font-sans shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {visit.status || 'Scheduled'}
                      </span>
                      <h4 className="text-base font-bold text-[#1A1A1A] pt-1">{visit.propertyName || visit.propertyTitle}</h4>
                      <p className="text-xs text-[#8A8A85] font-medium">Date: <span className="text-[#1A1A1A] font-bold">{visit.scheduledDate || visit.date}</span> at <span className="text-[#1A1A1A] font-bold">{visit.scheduledTime || visit.time}</span></p>
                    </div>
                    <Calendar className="w-8 h-8 text-[#F5A623] shrink-0" />
                  </div>

                  {/* My Consultant Card */}
                  <div className="bg-[#F4F1EA]/80 p-3.5 rounded-2xl border border-[#E8E4DA] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#F5A623] font-extrabold flex items-center justify-center text-xs shrink-0">
                      {visit.consultantName ? visit.consultantName.charAt(0) : 'C'}
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Assigned Consultant</p>
                      <p className="font-bold text-[#1A1A1A]">{visit.consultantName || 'Auto-Assigning...'}</p>
                      {visit.consultant?.phone && (
                        <p className="text-[11px] text-[#4A4A45] font-medium">📞 {visit.consultant.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. SAVED PROPERTIES (WISHLIST) */}
        <section className="space-y-6 border-t border-[#E8E4DA] pt-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
                WISHLIST PORTFOLIO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                Saved Properties ({wishlistProperties.length})
              </h2>
            </div>
            <Link to="/wishlist" className="text-xs text-[#1A1A1A] hover:text-[#F5A623] uppercase tracking-wider font-bold">
              Manage Wishlist
            </Link>
          </div>

          {wishlistProperties.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-[#E8E4DA] text-center text-xs text-[#8A8A85] shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-normal">
              No saved properties yet. Click the heart icon on any property to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProperties.map((prop, idx) => (
                <div
                  key={prop.id || prop._id || `wish-${idx}`}
                  onClick={() => navigate(`/property/${prop.id || prop._id}`)}
                  className="group relative border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all"
                >
                  <div className="relative h-[160px] overflow-hidden bg-stone-100">
                    <ImageWithSkeleton src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(prop.id || prop._id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-xs"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1 font-sans">
                    <h4 className="text-xs font-bold text-[#1A1A1A] truncate">{prop.title}</h4>
                    <p className="text-[11px] text-[#8A8A85] font-medium truncate">{prop.location}</p>
                    <p className="text-xs font-bold text-[#F5A623]">{prop.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. RECENTLY VIEWED SECTION */}
        {recentlyViewedProperties.length > 0 && (
          <section className="space-y-6 border-t border-[#E8E4DA] pt-10">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
                RECENT BROWSING
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                Recently Viewed Properties
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentlyViewedProperties.map((prop, idx) => (
                <div
                  key={prop.id || prop._id || `recent-${idx}`}
                  onClick={() => navigate(`/property/${prop.id || prop._id}`)}
                  className="group relative border border-[#E8E4DA] hover:border-[#F5A623] rounded-2xl overflow-hidden bg-white cursor-pointer shadow-xs transition-all"
                >
                  <div className="h-[100px] overflow-hidden bg-stone-100">
                    <ImageWithSkeleton src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-2.5 font-sans">
                    <h5 className="text-[11px] font-bold text-[#1A1A1A] truncate">{prop.title}</h5>
                    <p className="text-[10px] text-[#F5A623] font-bold">{prop.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
