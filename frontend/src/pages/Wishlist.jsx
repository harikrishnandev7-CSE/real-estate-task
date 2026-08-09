import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, MapPin, Share2, Scale, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { PropertyBadge } from '../components/common/CardsAndBadges';
import { SectionHeader } from '../components/common/InteractiveWidgets';
import { EmptyState } from '../components/common/FeedbackStates';
import PageHero from '../components/PageHero';

const Wishlist = () => {
  const navigate = useNavigate();
  const { properties = [], wishlist, recentlyViewed, removeFromWishlist, addToCompare, compareList, removeFromCompare, showToast, openBookModal, currentUser } = useApp();

  const wishlistItems = React.useMemo(() => {
    const list = Array.isArray(wishlist) ? wishlist : [];
    return list.map(item => {
      if (typeof item === 'object' && item !== null) return item;
      return properties.find(p => p.id === item || p._id === item) || null;
    }).filter(Boolean);
  }, [wishlist, properties]);

  const handleShare = (propertyTitle) => {
    showToast(`Sharing link generated for ${propertyTitle}. Copied to clipboard.`);
  };

  const handleCompareToggle = (prop) => {
    const targetId = prop.id || prop._id;
    const isCompared = Array.isArray(compareList) && compareList.some(item => item && (item.id === targetId || item._id === targetId || item === targetId));
    if (isCompared) {
      removeFromCompare(targetId);
    } else {
      addToCompare(prop);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
        <div className="pt-[64px] lg:pt-[72px]">
          <PageHero
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Wishlist' },
            ]}
            eyebrow="VIP ACCESS REQUIRED"
            heading={
              <>Private <span className="font-normal text-[#8A8A85]">Saved Collection</span></>
            }
            description="Log in to access your saved estates, manage wishlist items, and schedule private chauffeur-driven walkthroughs."
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center space-y-6 font-sans">
          <div className="max-w-md mx-auto p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Please Log In to Continue</h3>
            <p className="text-xs text-[#8A8A85] leading-relaxed font-normal">
              Wishlist features are reserved for registered account holders. Please sign in to view and manage your saved luxury properties.
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
                className="px-8 py-3 border border-[#E8E4DA] bg-white text-[#1A1A1A] hover:border-[#F5A623] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-all cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      {/* Page Hero */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Wishlist' },
          ]}
          eyebrow="SAVED COLLECTION"
          heading={
            <>Your Saved <span className="font-normal text-[#8A8A85]">Estates</span></>
          }
          description="A curated private portfolio of your saved luxury properties for comparison, private tours, and investment consultations."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-20 font-sans">
        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="py-12">
            <EmptyState 
              title="Your Collection is Empty"
              message="Explore IMPERIA ESTATES signature properties and save your preferred estates for private consultations, bookings, and comparisons."
              actionLabel="Start Discovering"
              onAction={() => navigate('/buy')}
            />
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((prop) => {
              const propId = prop.id || prop._id;
              const isCompared = Array.isArray(compareList) && compareList.some(item => item && ((item.id || item._id) === propId || item === propId));
              return (
                <motion.div
                  key={propId}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group relative border border-[#E8E4DA] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-[#F5A623]"
                  onClick={() => navigate(`/property/${propId}`)}
                >
                  <div>
                    {/* Image and quick actions */}
                    <div className="relative h-[220px] overflow-hidden bg-stone-100">
                      <ImageWithSkeleton 
                        src={prop.image} 
                        alt={prop.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                      
                      {/* Trash/Remove and Share */}
                      <div className="absolute top-4 right-4 flex gap-2 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(prop.title);
                          }}
                          className="p-2.5 rounded-full bg-white/90 hover:bg-[#F5A623] hover:text-white text-[#1A1A1A] transition-colors shadow-xs cursor-pointer"
                          aria-label="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(prop.id);
                          }}
                          className="p-2.5 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-[#1A1A1A] transition-colors shadow-xs cursor-pointer"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-4 z-20">
                        <p className="text-xl font-bold text-white font-sans tracking-tight">{prop.price}</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#8A8A85] font-sans">
                        <div className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#F5A623]" />
                          <span className="truncate max-w-[150px]">{prop.location}</span>
                        </div>
                        <PropertyBadge label={prop.type} />
                      </div>

                      <h3 className="text-base font-bold text-[#1A1A1A] font-sans tracking-tight group-hover:text-[#F5A623] transition-colors">
                        {prop.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 border-t border-[#E8E4DA] flex gap-2 text-xs font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompareToggle(prop);
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border transition-all cursor-pointer font-bold ${
                        isCompared 
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' 
                          : 'border-[#E8E4DA] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623]'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      {isCompared ? 'Compared' : 'Compare'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBookModal(prop.title);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-full border border-[#E8E4DA] hover:bg-amber-50 hover:border-[#F5A623] text-[#1A1A1A] hover:text-[#F5A623] font-bold transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Book Visit
                    </button>
                    <button
                      onClick={() => navigate(`/property/${propId}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px]"
                    >
                      <span>Tour</span>
                      <ArrowRight className="w-3 h-3 text-[#F5A623]" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CAROUSEL: RECENTLY VIEWED PROPERTIES */}
        {recentlyViewed.length > 0 && (
          <div className="border-t border-[#E8E4DA] pt-16 space-y-8">
            <SectionHeader tag="VIEWING TRACKER" title="Recently Viewed Estates" />

            <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
              {recentlyViewed.map((prop) => {
                const recId = prop.id || prop._id;
                return (
                  <div
                    key={recId}
                    onClick={() => navigate(`/property/${recId}`)}
                    className="w-[280px] shrink-0 border border-[#E8E4DA] bg-white rounded-3xl overflow-hidden cursor-pointer group shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#F5A623] transition-all"
                  >
                    <div className="relative h-[160px] overflow-hidden bg-stone-100">
                      <ImageWithSkeleton 
                        src={prop.image || prop.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"} 
                        alt={prop.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none" />
                      <div className="absolute bottom-3 left-4 z-20">
                        <p className="text-sm font-bold text-white font-sans tracking-tight">{prop.price || prop.priceDisplay}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1 text-xs text-[#8A8A85] font-medium font-sans">
                        <MapPin className="w-3 h-3 text-[#F5A623]" />
                        <span className="truncate">{prop.location}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1A1A1A] font-sans tracking-tight truncate group-hover:text-[#F5A623]">
                        {prop.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
