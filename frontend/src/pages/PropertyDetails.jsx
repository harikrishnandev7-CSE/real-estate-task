import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, Calendar, Share2, Compass, ArrowLeft, Calculator, Armchair, Eye, Video } from 'lucide-react';
import VirtualTourModal from '../components/common/VirtualTourModal';
import { useApp } from '../context/AppContext';
import LuxuryGallery from '../components/common/LuxuryGallery';
import RoomImagesSection from '../components/common/RoomImagesSection';
import { SpecificationCard, AmenityCard, BuilderCard, AgentCard } from '../components/common/CardsAndBadges';
import { EMICard, BookingCard, SectionHeader } from '../components/common/InteractiveWidgets';
import api from '../services/api';

const LandAreaConverter = ({ numericArea = 2400 }) => {
  const [sqft, setSqft] = useState(numericArea);

  const cents = (sqft / 435.6).toFixed(2);
  const sqMeters = (sqft * 0.092903).toFixed(2);
  const acres = (sqft / 43560).toFixed(4);

  return (
    <div className="bg-white border border-[rgba(22,22,26,0.10)] rounded-md p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-3">
        <Calculator className="w-5 h-5 text-[#A98A5B]" />
        <div>
          <h4
            className="text-sm font-medium text-[#16161a]"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Land Area Unit Converter
          </h4>
          <p className="text-[11px] text-[#4a4a4f]">Convert square footage into South Indian land units</p>
        </div>
      </div>

      <div className="space-y-1.5 font-sans">
        <label className="text-[10px] uppercase tracking-wider text-[#4a4a4f] font-semibold block">
          Area in Sq.Ft.
        </label>
        <input
          type="number"
          value={sqft}
          onChange={(e) => setSqft(Number(e.target.value) || 0)}
          className="w-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-md px-4 py-2.5 text-xs text-[#16161a] font-semibold outline-none focus:border-[#A98A5B]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center font-sans">
        <div className="p-3 bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-md">
          <p className="text-[10px] uppercase text-[#4a4a4f] font-semibold">Cents</p>
          <p className="text-sm font-bold text-[#A98A5B]">{cents}</p>
        </div>
        <div className="p-3 bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-md">
          <p className="text-[10px] uppercase text-[#4a4a4f] font-semibold">Sq. Meters</p>
          <p className="text-sm font-bold text-[#16161a]">{sqMeters}</p>
        </div>
        <div className="p-3 bg-[#F7F6F3] border border-[rgba(22,22,26,0.10)] rounded-md">
          <p className="text-[10px] uppercase text-[#4a4a4f] font-semibold">Acres</p>
          <p className="text-sm font-bold text-[#16161a]">{acres}</p>
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
        console.error("Failed to load property details from API:", err);
      }
    };

    loadPropertyDetail();
    return () => { isMounted = false; };
  }, [id]);

  const localProperty = (properties || []).find(p => (p.id || p._id || p.slug) === id);
  const property = dbProperty || localProperty;

  useEffect(() => {
    if (property && property.assignedConsultant && !assignedConsultant) {
      setAssignedConsultant(property.assignedConsultant);
    }
  }, [property, assignedConsultant]);

  if (!property) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#F7F6F3] flex flex-col items-center justify-center font-sans text-center px-6">
        <div className="w-12 h-12 rounded-full bg-white border border-[rgba(22,22,26,0.10)] text-[#16161a] flex items-center justify-center mb-4">
          <Compass className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-2xl font-medium text-[#16161a] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
          Residence Not Found
        </h2>
        <p className="text-xs text-[#4a4a4f] max-w-sm mb-6">
          The requested luxury listing could not be retrieved or has been sold.
        </p>
        <button
          onClick={() => navigate('/buy')}
          className="px-6 py-2.5 bg-[#16161a] text-white text-xs font-semibold uppercase tracking-wider rounded-full"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const propId = property.id || property._id;
  const isWishlisted = Array.isArray(wishlist) && wishlist.some(item => item && ((item.id || item._id) === propId || item === propId));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    if (showToast) showToast('Listing link copied to clipboard.');
  };

  const handleBookClick = () => {
    openBookModal(property.title);
  };

  const galleryImages = Array.isArray(property.galleryUrls) && property.galleryUrls.length > 0
    ? property.galleryUrls
    : Array.isArray(property.gallery) && property.gallery.length > 0
    ? property.gallery
    : [property.image || property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  return (
    <>
      <div className="pt-24 pb-28 min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans">
        
        {/* Back Link */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs text-[#4a4a4f] hover:text-[#16161a] transition-colors uppercase font-semibold tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#A98A5B]" />
            Back to Residences
          </button>
        </div>

        {/* LUXURY HERO SLIDESHOW GALLERY */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Gallery Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative">
              <LuxuryGallery images={galleryImages} roomImages={property.roomImages} alt={property.title} />

              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button 
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-full bg-white/90 text-[#16161a] hover:bg-[#16161a] hover:text-white transition-colors cursor-pointer shadow-xs"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Property Video Button */}
            {Boolean(
              property.videoUrl ||
              (Array.isArray(property.roomImages) && property.roomImages.length > 0) ||
              property.image || property.imageUrl
            ) && (
              <button
                onClick={() => setShowTour(true)}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-md bg-[#16161a] hover:bg-[#A98A5B] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#A98A5B]" />
                <span>PROPERTY VIDEO</span>
              </button>
            )}

            {/* Editorial Title & Overview Header */}
            <div className="space-y-4 font-sans border-b border-[rgba(22,22,26,0.10)] pb-6">
              {/* Plain text label bar with hairline dividers */}
              <div className="flex items-center gap-3 text-xs text-[#4a4a4f] font-semibold uppercase tracking-wider">
                {property.tag && <span>{property.tag}</span>}
                {property.tag && <span>·</span>}
                <span>{property.furnishing === 'full' ? 'Fully Furnished' : 'Semi Furnished'}</span>
                <span>·</span>
                <span>RERA Approved</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-medium text-[#16161a] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                {property.title}
              </h1>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-[#4a4a4f] text-xs font-medium">
                  <MapPin className="w-4 h-4 text-[#A98A5B]" />
                  <span>{property.location}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#16161a]">{property.price || property.priceDisplay}</p>
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

            {/* Description */}
            <div className="space-y-3 border-t border-[rgba(22,22,26,0.10)] pt-8 font-sans">
              <SectionHeader title="Property Architectural Overview" />
              <p className="text-[#4a4a4f] text-xs md:text-sm font-normal leading-relaxed max-w-2xl">
                {property.desc}
              </p>
            </div>

            {/* Room-by-Room Walkthrough */}
            <RoomImagesSection
              rooms={property.rooms}
              roomImages={property.roomImages}
              furnishing={property.furnishing}
            />

            {/* Bespoke Amenities */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <div className="space-y-6 border-t border-[rgba(22,22,26,0.10)] pt-8 font-sans">
                <SectionHeader title="Bespoke Amenities" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <AmenityCard key={idx} name={amenity} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Forms Column */}
          <div className="lg:col-span-4 space-y-6">
            <BookingCard
              propertyTitle={property.title}
              propertyCity={property.city}
              propertyId={propId}
              onConsultantAssigned={(c) => setAssignedConsultant(c)}
            />

            <AgentCard
              name={assignedConsultant?.name || property.builder || "IMPERIA Advisor Desk"}
              phone={assignedConsultant?.phone || "+919876543210"}
              email={assignedConsultant?.email || "concierge@imperiaestates.com"}
            />

            <LandAreaConverter numericArea={parseInt(property.area) || 2400} />
            <EMICard initialPrincipal={property.priceNum || 50000000} />
          </div>

        </div>
      </div>

      {/* 360 Tour Modal */}
      <AnimatePresence>
        {showTour && (
          <VirtualTourModal
            isOpen={showTour}
            onClose={() => setShowTour(false)}
            propertyTitle={property.title}
            roomImages={property.roomImages || []}
            heroImage={galleryImages[0]}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyDetails;
