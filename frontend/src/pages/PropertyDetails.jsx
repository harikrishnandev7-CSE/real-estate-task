import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Square, Car, Calendar, Share2, Compass, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LuxuryGallery from '../components/common/LuxuryGallery';
import { PropertyBadge, StatusBadge, SpecificationCard, AmenityCard, BuilderCard, AgentCard } from '../components/common/CardsAndBadges';
import { EMICard, BookingCard, SectionHeader, AnimatedButton } from '../components/common/InteractiveWidgets';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, wishlist, addToWishlist, removeFromWishlist, addToRecentlyViewed, openBookModal } = useApp();

  // Find current property with safe id / _id / slug / index fallback
  let property = properties.find(p => (
    p.id === id || 
    p._id === id || 
    String(p.id) === String(id) || 
    String(p._id) === String(id) || 
    p.slug === id ||
    (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id)
  ));

  // Fallback for index or prop-N urls if properties array is loaded
  if (!property && properties && properties.length > 0) {
    if (typeof id === 'string' && id.startsWith('prop-')) {
      const idx = parseInt(id.replace('prop-', ''), 10);
      if (!isNaN(idx) && properties[idx]) {
        property = properties[idx];
      }
    }
    if (!property) {
      property = properties[0];
    }
  }

  // Track viewing history
  useEffect(() => {
    if (property) {
      addToRecentlyViewed(property);
    }
  }, [id, property]);

  if (!property) {
    return (
      <div className="pt-36 min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-2xl font-serif font-light text-white">Residence Not Found</h2>
        <p className="text-neutral-400 text-xs max-w-xs font-sans">
          The requested luxury estate ID does not exist or has been archived from our properties.
        </p>
        <AnimatedButton onClick={() => navigate('/buy')} variant="secondary">
          Back to Listings
        </AnimatedButton>
      </div>
    );
  }

  const propId = property.id || property._id;
  const isWishlisted = wishlist.some(item => (item.id || item._id) === propId || item === propId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Listing URL copied to clipboard.");
  };

  // Find related listings (same city, excluding current)
  const relatedProperties = properties
    .filter(p => p.city === property.city && (p.id || p._id) !== propId)
    .slice(0, 3);

  // Mock nearby places with distances
  const nearbyPlaces = [
    { name: "Elite International School", distance: "1.5 km (5 mins)" },
    { name: "Fortis Speciality Hospital", distance: "2.8 km (8 mins)" },
    { name: "Metro Rail Station Transit", distance: "0.8 km (2 mins)" },
    { name: "International Airport Hub", distance: "14.0 km (25 mins)" }
  ];

  const galleryImages = property.gallery || property.galleryUrls || [property.image || property.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  return (
    <div className="pt-24 pb-28 md:pb-36 min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-[#8A8A85] hover:text-[#1A1A1A] transition-colors uppercase font-bold tracking-wider font-sans cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4 text-[#F5A623]" />
          Back to Discovery
        </button>
      </div>

      {/* LUXURY HERO SLIDESHOW GALLERY */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Gallery column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main slideshow widget */}
          <div className="relative">
            <LuxuryGallery images={galleryImages} alt={property.title} />

            {/* Float Save & Share Buttons (Z-20 top display overrides) */}
            <div className="absolute top-4 right-4 flex gap-3 z-20">
              <button 
                onClick={handleCopyLink}
                className="p-3 rounded-full bg-white/90 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] transition-all cursor-pointer shadow-md"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => isWishlisted ? removeFromWishlist(propId) : addToWishlist(property)}
                className="p-3 rounded-full bg-white/90 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] transition-all cursor-pointer shadow-md"
                aria-label="Save"
              >
                <svg className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#F5A623]' : 'stroke-current'}`} viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Heading Info Block & CTA */}
          <div className="space-y-4 font-sans border-b border-[#E8E4DA] pb-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <PropertyBadge label={property.tag} />
                <StatusBadge rera={property.rera || property.reraApproved} />
              </div>
              <button
                onClick={() => openBookModal(property)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1A1A] hover:bg-[#F5A623] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#F5A623]" />
                <span>Book Site Visit</span>
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              {property.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3A3732] text-xs font-bold">
                <MapPin className="w-4 h-4 text-[#F5A623] shrink-0" />
                <span>{property.location}</span>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-[#F5A623] font-sans">{property.price || property.priceDisplay}</p>
            </div>
          </div>

          {/* Property Specifications Cards */}
          <div className="space-y-4 font-sans">
            <SectionHeader title="Quick Specifications" />
            {property.type === 'Plot' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <SpecificationCard label="Typology" value="Plot / Land" icon={Compass} />
                <SpecificationCard label="Total Area" value={property.area} icon={Square} />
                <SpecificationCard label="Road Width" value={property.roadWidth || 'Paved Road'} icon={Compass} />
                <SpecificationCard label="Approval" value={property.approval || 'Verified'} icon={Compass} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <SpecificationCard label="Typology" value={property.type} icon={Compass} />
                <SpecificationCard label="Configuration" value={property.beds > 0 ? `${property.beds} BHK` : "Commercial"} icon={BedDouble} />
                <SpecificationCard label="Bathrooms" value={`${property.baths} Baths`} icon={Bath} />
                <SpecificationCard label="Area Size" value={property.area} icon={Square} />
              </div>
            )}
          </div>

          {/* Land & Layout Specific Details for Plots */}
          {property.type === 'Plot' && (
            <div className="space-y-4 border-t border-[#E8E4DA] pt-8 font-sans">
              <SectionHeader title="Land & Layout Specifications" desc="Official revenue, approval, and infrastructure parameters." />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-xs">
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Total Land Area</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.area}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Price per Sq.ft</span>
                  <p className="text-[#F5A623] font-bold text-sm">{property.pricePerSqFt || 'Market Rate'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Approval Authority</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.approval || 'DTCP Approved'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Facing Direction</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.facing || 'East Facing'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Road Width</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.roadWidth || '40 ft Road'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Frontage</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.frontage || '100+ ft'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Dimensions</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.dimensions || 'Standard Rectangular'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Registration Status</span>
                  <p className="text-emerald-600 font-bold text-sm">{property.registrationStatus || 'Ready for Registration'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Water Connection</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.waterConnection || 'Available'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Electricity Supply</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.electricity || '3-Phase Line'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Nearby Highway</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.highwayProximity || 'Arterial Access'}</p>
                </div>
                <div className="p-4 border border-[#E8E4DA] rounded-2xl bg-white space-y-1 shadow-2xs">
                  <span className="text-[#8A8A85] uppercase tracking-widest text-[10px] font-bold">Nearby School</span>
                  <p className="text-[#1A1A1A] font-bold text-sm">{property.schoolsProximity || 'Within 2.0 km'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Highlights & Description */}
          <div className="space-y-4 border-t border-[#E8E4DA] pt-8 font-sans">
            <SectionHeader title="Overview Description" />
            <p className="text-[#8A8A85] text-xs font-normal leading-relaxed max-w-2xl">
              {property.desc}
            </p>
          </div>

          {/* Bespoke Amenities */}
          <div className="space-y-6 border-t border-[#E8E4DA] pt-8 font-sans">
            <SectionHeader title="Bespoke Amenities" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities.map((amenity, idx) => (
                <AmenityCard key={idx} name={amenity} />
              ))}
            </div>
          </div>

          {/* Neighborhood connectivity */}
          <div className="space-y-4 border-t border-[#E8E4DA] pt-8 font-sans">
            <SectionHeader title="Neighborhood Connectivity" desc="Distances from coordinates calculated via local transport vectors." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
              {nearbyPlaces.map((place, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-[#E8E4DA] rounded-2xl bg-white shadow-2xs">
                  <span className="text-[#8A8A85] font-semibold">{place.name}</span>
                  <span className="text-[#F5A623] font-bold">{place.distance}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* STICKY COLUMN */}
        <aside className="lg:col-span-4 space-y-8 font-sans">
          
          {/* Booking card */}
          <BookingCard propertyTitle={property.title} />

          {/* Calculator card */}
          <EMICard initialPrincipal={property.numericPrice} />

          {/* Builder Card */}
          <BuilderCard 
            name={property.builder}
            experience={15}
            completed={24}
            ongoing={6}
            description={`A premier developer established in southern luxury corridors, specializing in high-end structural facades, acoustic glazing systems, and RERA compliance.`}
          />

          {/* Agent Card */}
          <AgentCard 
            name="Vikram Malhotra"
            designation="Relationship Concierge Director"
            experience={12}
            languages={["English", "Tamil", "Hindi"]}
            phone="+91 98765 09876"
            email="v.malhotra@imperiaestates.com"
          />

        </aside>

      </div>

      {/* RELATED PROPERTIES recomendation block */}
      {relatedProperties.length > 0 && (
        <div className="border-t border-white/5 py-16 bg-neutral-950/20 mt-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
            <SectionHeader tag="Bespoke Curation" title="Related Luxury Residences" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProperties.map((related) => {
                const relId = related.id || related._id;
                return (
                  <div
                    key={relId}
                    onClick={() => {
                      navigate(`/property/${relId}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-300 font-sans"
                  >
                    <div className="relative h-[200px] overflow-hidden bg-stone-100">
                      <img 
                        src={related.image || related.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"} 
                        alt={related.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                      <div className="absolute bottom-3 left-4 z-20">
                        <p className="text-base font-bold text-white font-sans tracking-tight">{related.price || related.priceDisplay}</p>
                      </div>
                    </div>
                    <div className="p-5 space-y-2 bg-white">
                      <div className="flex items-center gap-1 text-xs text-[#8A8A85] font-medium font-sans">
                        <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                        <span className="truncate">{related.location}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#1A1A1A] font-sans tracking-tight group-hover:text-[#F5A623] transition-colors">
                        {related.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E8E4DA] p-3.5 z-40 flex items-center justify-between gap-4 shadow-[0_-10px_25px_rgba(0,0,0,0.08)]">
        <div>
          <span className="text-[10px] text-[#8A8A85] uppercase tracking-wider font-bold block">Asking Price</span>
          <span className="text-base font-extrabold text-[#1A1A1A]">{property.price}</span>
        </div>
        <button
          onClick={() => openBookModal(property)}
          className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
        >
          Book Visit
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
