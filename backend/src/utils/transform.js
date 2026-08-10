/**
 * Formats BigInt, Decimal, and Prisma objects into JSON-safe camelCase response format
 */
export const formatProperty = (prop) => {
  if (!prop) return null;
  
  const numericPrice = typeof prop.numericPrice === 'bigint' 
    ? Number(prop.numericPrice) 
    : (prop.numericPrice || 0);

  // Furnishing level: 'full', 'semi', 'none'
  const rawFurnishing = prop.furnishing || (prop.specs && prop.specs.Furnished === 'Semi Furnished' ? 'semi' : prop.specs && prop.specs.Furnished === 'Unfurnished' ? 'none' : 'full');
  const furnishing = String(rawFurnishing).toLowerCase();

  const allRoomImages = Array.isArray(prop.roomImages) ? prop.roomImages : [];

  let filteredRoomImages = [];
  const propType = String(prop.type || '').toLowerCase();
  const isFurnishingApplicable = ['villa', 'apartment', 'penthouse'].includes(propType);

  if (isFurnishingApplicable && allRoomImages.length > 0) {
    if (furnishing === 'full') {
      // IF furnishing === "full": return only images where furnished = true
      filteredRoomImages = allRoomImages.filter(img => img.furnished === true);
    } else if (furnishing === 'none') {
      // IF furnishing === "none": return only images where furnished = false
      filteredRoomImages = allRoomImages.filter(img => img.furnished === false);
    } else if (furnishing === 'semi') {
      // IF furnishing === "semi": return mix: bedroom -> furnished, hall -> furnished, kitchen -> empty, bathroom -> empty
      filteredRoomImages = allRoomImages.filter(img => {
        const t = String(img.type || '').toLowerCase();
        if (t === 'bedroom' || t === 'hall') return img.furnished === true;
        if (t === 'kitchen' || t === 'bathroom') return img.furnished === false;
        return true; // exterior / other
      });
    } else {
      filteredRoomImages = allRoomImages;
    }
  } else {
    filteredRoomImages = allRoomImages;
  }

  // ── Structured Images object (Entrance, Hall, Kitchen, Bedrooms, Bathrooms, Terrace) ──
  const rawImages = (prop.images && typeof prop.images === 'object' && !Array.isArray(prop.images))
    ? prop.images
    : {};

  const extractUrlList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === 'object') {
      return Object.values(val).flat().filter(Boolean);
    }
    if (typeof val === 'string' && val.trim()) return [val];
    return [];
  };

  const structuredImages = {
    entrance: rawImages.entrance || prop.imageUrl || prop.image || null,
    hall: extractUrlList(rawImages.hall),
    kitchen: extractUrlList(rawImages.kitchen),
    bedrooms: extractUrlList(rawImages.bedrooms),
    bathrooms: extractUrlList(rawImages.bathrooms),
    terrace: extractUrlList(rawImages.terrace),
  };

  // Strictly ordered list for gallery / display:
  // 1. Entrance, 2. Hall, 3. Kitchen, 4. Bedrooms, 5. Bathrooms, 6. Terrace
  const orderedImagesList = [
    ...(structuredImages.entrance ? [structuredImages.entrance] : []),
    ...structuredImages.hall,
    ...structuredImages.kitchen,
    ...structuredImages.bedrooms,
    ...structuredImages.bathrooms,
    ...structuredImages.terrace,
  ];

  // Separate exterior images (for hero/card) from interior room images
  const exteriorImages = filteredRoomImages.filter(img => String(img.type || '').toLowerCase() === 'exterior');
  const interiorRoomImages = filteredRoomImages.filter(img => String(img.type || '').toLowerCase() !== 'exterior');

  const exteriorUrls = exteriorImages.map(img => img.url).filter(Boolean);

  const filteredGalleryUrls = orderedImagesList.length > 0
    ? orderedImagesList
    : (exteriorUrls.length > 0 ? exteriorUrls : (Array.isArray(prop.galleryUrls) ? prop.galleryUrls : []));

  // Card thumbnail = entrance image if present, else first image in ordered list, else imageUrl
  const mainImageUrl =
    structuredImages.entrance ||
    orderedImagesList[0] ||
    prop.imageUrl ||
    prop.image ||
    null;

  const furnishingLabel = furnishing === 'full' ? 'Fully Furnished' : furnishing === 'semi' ? 'Semi Furnished' : 'Unfurnished';

  const propId = prop._id ? (typeof prop._id === 'object' ? prop._id.toString() : String(prop._id)) : (prop.id ? String(prop.id) : null);

  return {
    id: propId,
    _id: propId,
    title: prop.title,
    tag: prop.tag || null,
    price: prop.priceDisplay || `₹${(numericPrice / 10000000).toFixed(1)} Cr`,
    priceDisplay: prop.priceDisplay || `₹${(numericPrice / 10000000).toFixed(1)} Cr`,
    numericPrice: numericPrice,
    numeric_price: numericPrice,
    location: prop.location,
    city: prop.city,
    type: prop.type,
    beds: prop.beds,
    baths: prop.baths,
    area: prop.areaDisplay || `${prop.numericArea || 0} sq.ft.`,
    areaDisplay: prop.areaDisplay || `${prop.numericArea || 0} sq.ft.`,
    numericArea: prop.numericArea || 0,
    numeric_area: prop.numericArea || 0,
    pricePerSqft: prop.pricePerSqft || null,
    price_per_sqft: prop.pricePerSqft || null,
    images: structuredImages,
    image: mainImageUrl,
    imageUrl: mainImageUrl,
    image_url: mainImageUrl,
    gallery: filteredGalleryUrls,
    galleryUrls: filteredGalleryUrls,
    gallery_urls: filteredGalleryUrls,
    furnishing: furnishing,
    furnishingLabel: furnishingLabel,
    roomImages: interiorRoomImages,
    amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
    pros: Array.isArray(prop.pros) ? prop.pros : [],
    cons: Array.isArray(prop.cons) ? prop.cons : [],
    rera: Boolean(prop.reraApproved),
    reraApproved: Boolean(prop.reraApproved),
    rera_approved: Boolean(prop.reraApproved),
    reraNumber: prop.reraNumber || null,
    status: prop.status || 'Published',
    purpose: prop.purpose || 'Buy',
    builder: prop.developer || prop.builder || null,
    developer: prop.developer || prop.builder || null,
    projectId: prop.projectId || null,
    rating: prop.rating ? Number(prop.rating) : 4.8,
    growth: prop.growthRate || null,
    growthRate: prop.growthRate || null,
    investmentRating: prop.investmentRating || null,
    desc: prop.description || null,
    description: prop.description || null,
    specs: prop.specs || {},
    roadWidth: prop.roadWidth || null,
    facing: prop.facing || null,
    approval: prop.approval || null,
    frontage: prop.frontage || null,
    dimensions: prop.dimensions || null,
    registrationStatus: prop.registrationStatus || null,
    views: prop.views || 0,
    enquiries: prop.enquiries || 0,
    saves: prop.saves || 0,
    // New media & legal fields
    videoUrl: prop.videoUrl || null,
    legal: prop.legal || {
      ecStatus: null,
      dtcpCmdaApproval: null,
      reraStatus: null,
      propertyTaxStatus: null,
    },
    assignedConsultant: prop.assignedConsultant || null,
    createdAt: prop.createdAt || null,
    updatedAt: prop.updatedAt || null,
  };
};

export const sanitizeUser = (user) => {
  if (!user) return null;
  const userObj = user.toObject ? user.toObject() : user;
  const { passwordHash, ...safeUser } = userObj;
  const userName = safeUser.fullName || safeUser.name || (safeUser.email ? safeUser.email.split('@')[0] : 'Imperia User');
  return {
    id: safeUser._id ? safeUser._id.toString() : safeUser.id,
    name: userName,
    fullName: userName,
    email: safeUser.email,
    phone: safeUser.phone || null,
    city: safeUser.city || null,
    state: safeUser.state || null,
    role: safeUser.role,
    purpose: safeUser.purpose || safeUser.preferences?.purpose || null,
    propertyTypes: safeUser.propertyTypes || safeUser.preferences?.propertyTypes || [],
    budget: safeUser.budget || safeUser.budgetRange || safeUser.preferences?.budget || null,
    locations: safeUser.targetLocations || safeUser.locations || safeUser.preferences?.locations || [],
    createdAt: safeUser.createdAt,
    updatedAt: safeUser.updatedAt,
  };
};
