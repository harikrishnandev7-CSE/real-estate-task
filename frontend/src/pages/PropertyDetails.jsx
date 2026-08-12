import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, Calendar, Share2, Compass, ArrowLeft, Calculator, Armchair, Eye, Video, Phone, Mail, CheckCircle2, Shield, Heart } from 'lucide-react';
import VirtualTourModal from '../components/common/VirtualTourModal';
import { useApp } from '../context/AppContext';
import LuxuryGallery from '../components/common/LuxuryGallery';
import RoomImagesSection from '../components/common/RoomImagesSection';
import { SpecificationCard, AmenityCard, BuilderCard, AgentCard } from '../components/common/CardsAndBadges';
import { EMICard, BookingCard, SectionHeader } from '../components/common/InteractiveWidgets';
import api from '../services/api';
import PageHero from '../components/PageHero';

const LandAreaConverter = ({ numericArea = 3500 }) => {
  const [sqft, setSqft] = useState(numericArea);

  const cents = (sqft / 435.6).toFixed(2);
  const sqMeters = (sqft * 0.092903).toFixed(2);
  const acres = (sqft / 43560).toFixed(4);

  return (
    <div className="bg-white border border-[rgba(201,169,110,0.30)] rounded-xl p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] font-sans">
      <div className="flex items-center gap-3 border-b border-[rgba(201,169,110,0.20)] pb-3">
        <div className="w-10 h-10 rounded-lg bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h4
            className="text-base font-bold text-[#0B0B0B]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Land Area Unit Converter
          </h4>
          <p className="text-[11px] text-[#6B6B6B] font-medium">Convert square footage into South Indian land units</p>
        </div>
      </div>

      <div className="space-y-1.5 font-sans">
        <label className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-bold block">
          Area in Sq.Ft.
        </label>
        <input
          type="number"
          value={sqft}
          onChange={(e) => setSqft(Number(e.target.value) || 0)}
          className="w-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.15)] rounded-lg px-4 py-3 text-xs text-[#0B0B0B] font-bold outline-none focus:border-[#C9A96E]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center font-sans">
        <div className="p-3 bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-lg">
          <p className="text-[10px] uppercase text-[#6B6B6B] font-bold">Cents</p>
          <p className="text-sm font-bold text-[#C9A96E]">{cents}</p>
        </div>
        <div className="p-3 bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-lg">
          <p className="text-[10px] uppercase text-[#6B6B6B] font-bold">Sq. Meters</p>
          <p className="text-sm font-bold text-[#0B0B0B]">{sqMeters}</p>
        </div>
        <div className="p-3 bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-lg">
          <p className="text-[10px] uppercase text-[#6B6B6B] font-bold">Acres</p>
          <p className="text-sm font-bold text-[#0B0B0B]">{acres}</p>
        </div>
      </div>
    </div>
  );
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, wishlist, addToWishlist, showToast, openBookModal } = useApp();

  const [dbProperty, setDbProperty] = useState(null);
  const [assignedConsultant, setAssignedConsultant] = useState(null);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPropertyDetail = async () => {
      try {
        if (id) {
          const res = await api.get(`/properties/${id}`);
          if (res.data?.data && isMounted) {
            setDbProperty(res.data.data);
            if (res.data.data.assignedConsultant) {
              setAssignedConsultant(res.data.data.assignedConsultant);
            }
          }
        }
      } catch (err) {
        // Fallback gracefully to client state
      }
    };

    loadPropertyDetail();
    return () => { isMounted = false; };
  }, [id]);

  // Robust property lookup helper
  const property = useMemo(() => {
    if (dbProperty) return dbProperty;

    const searchStr = String(id || '').toLowerCase();
    
    // 1. Direct match by id, _id, or slug
    const directMatch = (properties || []).find(p => {
      if (!p) return false;
      const pId = String(p.id || p._id || '').toLowerCase();
      const pSlug = String(p.slug || '').toLowerCase();
      const titleSlug = String(p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return pId === searchStr || pSlug === searchStr || titleSlug === searchStr;
    });

    if (directMatch) return directMatch;

    // 2. Dynamic high-luxury fallback property generator for custom URLs
    const formattedTitle = searchStr
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: searchStr,
      title: formattedTitle.includes('Villa') || formattedTitle.includes('Estate') ? formattedTitle : `${formattedTitle} Luxury Villa`,
      tag: "SIGNATURE COLLECTION",
      price: "₹16.8 Cr",
      numericPrice: 168000000,
      priceNum: 168000000,
      location: searchStr.includes('chennai') ? "Nungambakkam, Chennai" : searchStr.includes('coimbatore') ? "Race Course, Coimbatore" : "OMR Luxury Corridor, Chennai",
      city: searchStr.includes('coimbatore') ? "Coimbatore" : "Chennai",
      type: "Villa",
      beds: 4,
      baths: 5,
      area: "5,400 sq.ft.",
      numericArea: 5400,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
      ],
      amenities: ["Private Infinity Pool", "Italian Marble Flooring", "Smart Home Automation", "24/7 VIP Security", "Private Elevator", "Landscaped Zen Garden", "Chauffeur Lounge"],
      rera: true,
      status: "Ready to Move",
      purpose: "Buy",
      furnishing: "full",
      builder: "IMPERIA Estates Private Desk",
      rating: 4.98,
      desc: "An architectural masterpiece engineered with floor-to-ceiling double-glazed glass, Italian Statuario marble, acoustic insulation panels, and custom-tailored automated climate systems. Situated in one of the most prestigious micro-markets with private gated access.",
      roomImages: [
        { type: "entrance", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" },
        { type: "hall", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80" },
        { type: "kitchen", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80" },
        { type: "bedroom", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80" },
        { type: "bathroom", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80" },
        { type: "terrace", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" }
      ]
    };
  }, [dbProperty, properties, id]);

  useEffect(() => {
    if (property && property.assignedConsultant && !assignedConsultant) {
      setAssignedConsultant(property.assignedConsultant);
    }
  }, [property, assignedConsultant]);

  const propId = property.id || property._id;
  const isWishlisted = Array.isArray(wishlist) && wishlist.some(item => item && ((item.id || item._id) === propId || item === propId));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    if (showToast) showToast('Listing link copied to clipboard.');
  };

  const galleryImages = Array.isArray(property.galleryUrls) && property.galleryUrls.length > 0
    ? property.galleryUrls
    : Array.isArray(property.gallery) && property.gallery.length > 0
    ? property.gallery
    : [property.image || property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans pb-24">
      {/* 1. Full-Bleed PageHero Header */}
      <PageHero
        image={galleryImages[0]}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Residences', href: '/buy' },
          { label: property.title }
        ]}
        eyebrow={property.tag || "IMPERIA PRIVATE SELECTION"}
        heading={property.title}
        description={`Located in ${property.location}. Featuring ${property.beds > 0 ? `${property.beds} Bedrooms` : 'Commercial Layout'}, ${property.baths} Bathrooms, and ${property.area} of bespoke architectural craftsmanship.`}
      />

      {/* 2. Main Content Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-[rgba(201,169,110,0.20)] mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6B6B6B] hover:text-[#C9A96E] transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#C9A96E]" />
            Back to Catalog
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => addToWishlist(property)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(201,169,110,0.30)] bg-white text-[#0B0B0B] text-xs font-bold uppercase tracking-wider hover:border-[#C9A96E] transition-all cursor-pointer shadow-xs"
            >
              <Heart className="w-4 h-4" style={{ fill: isWishlisted ? '#C9A96E' : 'transparent', color: isWishlisted ? '#C9A96E' : '#0B0B0B' }} />
              <span>{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>
            
            <button 
              onClick={handleCopyLink}
              className="p-2.5 rounded-full border border-[rgba(201,169,110,0.30)] bg-white text-[#0B0B0B] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all cursor-pointer shadow-xs"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Main Gallery, Title, Specs & Walkthrough */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* High-Clarity Bento Grid Slideshow Gallery */}
            <div className="space-y-4">
              <LuxuryGallery images={galleryImages} roomImages={property.roomImages} alt={property.title} />

              <button
                onClick={() => setShowTour(true)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer border border-[rgba(201,169,110,0.30)]"
              >
                <Video className="w-4.5 h-4.5 text-[#C9A96E]" />
                <span>Video Tour</span>
              </button>
            </div>

            {/* Title & Pricing Overview Box */}
            <div className="bg-white border border-[rgba(201,169,110,0.30)] rounded-xl p-6 sm:p-8 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] font-sans">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A96E]">
                {property.tag && <span className="px-3 py-1 bg-[rgba(201,169,110,0.12)] rounded-md border border-[rgba(201,169,110,0.3)]">{property.tag}</span>}
                <span className="px-3 py-1 bg-[#F7F6F3] text-[#6B6B6B] rounded-md border border-[rgba(22,22,26,0.10)]">{property.furnishing === 'full' ? 'Fully Furnished' : 'Semi Furnished'}</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">RERA Approved</span>
              </div>

              <h1 
                className="text-3xl sm:text-4xl font-bold text-[#0B0B0B] tracking-tight leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {property.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[rgba(201,169,110,0.20)]">
                <div className="flex items-center gap-2 text-[#6B6B6B] text-xs font-semibold">
                  <MapPin className="w-4 h-4 text-[#C9A96E]" />
                  <span>{property.location}</span>
                </div>
                <p className="text-3xl font-extrabold text-[#C9A96E] font-sans tracking-tight">{property.price || property.priceDisplay}</p>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="space-y-4 font-sans">
              <SectionHeader title="Residence Parameters" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SpecificationCard label="Typology" value={property.type || 'Villa'} icon={Compass} />
                <SpecificationCard label="Configuration" value={property.beds > 0 ? `${property.beds} Beds` : "Commercial"} icon={BedDouble} />
                <SpecificationCard label="Bathrooms" value={`${property.baths} Baths`} icon={Bath} />
                <SpecificationCard label="Total Area" value={property.area} icon={Square} />
              </div>
            </div>

            {/* Architectural Description */}
            <div className="bg-white border border-[rgba(201,169,110,0.30)] rounded-xl p-6 sm:p-8 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] font-sans">
              <SectionHeader title="Architectural Overview" />
              <p className="text-[#2D2D32] text-sm sm:text-base font-semibold leading-relaxed">
                {property.desc}
              </p>
            </div>

            {/* Room-by-Room Walkthrough Section */}
            <div className="bg-white border border-[rgba(201,169,110,0.30)] rounded-xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] font-sans">
              <RoomImagesSection
                rooms={property.rooms}
                roomImages={property.roomImages}
                images={property.images}
                furnishing={property.furnishing}
              />
            </div>

            {/* Bespoke Amenities Grid */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <div className="bg-white border border-[rgba(201,169,110,0.30)] rounded-xl p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] font-sans">
                <SectionHeader title="Bespoke Amenities" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <AmenityCard key={idx} name={amenity} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Booking Form, Advisor Desk & Financial Utilities */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
            <BookingCard
              propertyTitle={property.title}
              propertyCity={property.city}
              propertyId={propId}
              onConsultantAssigned={(c) => setAssignedConsultant(c)}
            />

            <AgentCard
              name={assignedConsultant?.name || property.builder || "IMPERIA Private Desk"}
              phone={assignedConsultant?.phone || "+919876543210"}
              email={assignedConsultant?.email || "concierge@imperiaestates.com"}
            />

            <LandAreaConverter numericArea={parseInt(property.area?.replace(/[^0-9]/g, '')) || 3500} />
            
            <EMICard initialPrincipal={property.numericPrice || property.priceNum || 85000000} />
          </div>

        </div>
      </div>

      {/* 360 Tour Video Modal */}
      <AnimatePresence>
        {showTour && (
          <VirtualTourModal
            isOpen={showTour}
            onClose={() => setShowTour(false)}
            propertyTitle={property.title}
            property={property}
            roomImages={property.roomImages || []}
            heroImage={galleryImages[0]}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetails;
