import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, X, Check, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { PropertyBadge } from '../components/common/CardsAndBadges';
import { SectionHeader } from '../components/common/InteractiveWidgets';
import { EmptyState } from '../components/common/FeedbackStates';
import PageHero from '../components/PageHero';

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, addToWishlist, wishlist, properties, currentUser } = useApp();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
        <div className="pt-[64px] lg:pt-[72px]">
          <PageHero
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Compare' },
            ]}
            eyebrow="VIP ACCESS REQUIRED"
            heading={
              <>Compare <span className="font-normal text-[#5D6472]">Estates</span></>
            }
            description="Log in to access side-by-side estate comparisons, technical specs, and investment analytics."
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center space-y-6 font-sans">
          <div className="max-w-md mx-auto p-8 sm:p-10 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-5">
            <div className="w-16 h-16 rounded-full bg-[rgba(207,182,168,0.15)] border border-[#CFB6A8] text-[#CFB6A8] flex items-center justify-center mx-auto shadow-xs">
              <Scale className="w-8 h-8" />
            </div>
            <h3
              className="text-2xl font-bold text-[#363C46] tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Please Log In to Continue
            </h3>
            <p className="text-xs text-[#5D6472] leading-relaxed font-normal">
              Property comparison features are reserved for logged-in VIP members. Please sign in to compare property specifications side-by-side.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-[#363C46] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Continue to Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3 border border-[rgba(93,100,114,0.20)] bg-[#E0EEE9] text-[#363C46] hover:border-[#CFB6A8] text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all cursor-pointer"
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

  React.useEffect(() => {
    if (resolvedCompareList.length > 0) {
      const activeType = normalizeType(resolvedCompareList[0].type);
      setSelectedType(activeType);
    }
  }, [resolvedCompareList]);

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Compare' },
          ]}
          eyebrow="COMPARATIVE ANALYTICS"
          heading={
            <>Estate Specs <span className="font-normal text-[#5D6472]">Comparison</span></>
          }
          description="Side-by-side technical matrix comparing pricing, carpet area, zoning approvals, and expected capital yields."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 font-sans space-y-12">
        {resolvedCompareList.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Estates Selected for Comparison"
              message="Select up to 3 properties from our buy or rent portfolio to view side-by-side technical and financial metrics."
              actionLabel="Explore Properties"
              onAction={() => navigate('/buy')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[700px] grid grid-cols-4 gap-6 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-6 shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
              <div className="space-y-4 font-bold text-xs uppercase tracking-wider text-[#5D6472]">
                <div className="h-48 flex items-center">Estate Matrix</div>
                <div className="py-3 border-t border-[rgba(93,100,114,0.15)]">Price</div>
                <div className="py-3 border-t border-[rgba(93,100,114,0.15)]">Location</div>
                <div className="py-3 border-t border-[rgba(93,100,114,0.15)]">Builder</div>
                <div className="py-3 border-t border-[rgba(93,100,114,0.15)]">Carpet Area</div>
                <div className="py-3 border-t border-[rgba(93,100,114,0.15)]">Bedrooms</div>
                <div className="py-3 border-t border-[rgba(93,100,114,0.15)]">RERA Status</div>
              </div>

              {resolvedCompareList.slice(0, 3).map((item) => (
                <div key={item.id} className="space-y-4 text-xs font-sans">
                  <div className="h-48 relative rounded-lg overflow-hidden border border-[rgba(93,100,114,0.15)]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFromCompare(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-[#363C46] hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2">
                      <PropertyBadge label={item.tag} />
                    </div>
                  </div>
                  <div className="py-3 border-t border-[rgba(93,100,114,0.15)] font-bold text-sm text-[#CFB6A8]">{item.price}</div>
                  <div className="py-3 border-t border-[rgba(93,100,114,0.15)] text-[#363C46] font-medium">{item.location}</div>
                  <div className="py-3 border-t border-[rgba(93,100,114,0.15)] text-[#363C46] font-medium">{item.builder}</div>
                  <div className="py-3 border-t border-[rgba(93,100,114,0.15)] text-[#363C46] font-medium">{item.area}</div>
                  <div className="py-3 border-t border-[rgba(93,100,114,0.15)] text-[#363C46] font-medium">{item.beds} BHK</div>
                  <div className="py-3 border-t border-[rgba(93,100,114,0.15)] text-emerald-600 font-bold">{item.rera ? 'RERA Approved' : 'Under Review'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
