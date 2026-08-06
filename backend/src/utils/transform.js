/**
 * Formats BigInt, Decimal, and Prisma objects into JSON-safe camelCase response format
 */
export const formatProperty = (prop) => {
  if (!prop) return null;
  
  const numericPrice = typeof prop.numericPrice === 'bigint' 
    ? Number(prop.numericPrice) 
    : (prop.numericPrice || 0);

  return {
    id: prop.id,
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
    image: prop.imageUrl || null,
    imageUrl: prop.imageUrl || null,
    image_url: prop.imageUrl || null,
    gallery: Array.isArray(prop.galleryUrls) ? prop.galleryUrls : [],
    galleryUrls: Array.isArray(prop.galleryUrls) ? prop.galleryUrls : [],
    gallery_urls: Array.isArray(prop.galleryUrls) ? prop.galleryUrls : [],
    amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
    pros: Array.isArray(prop.pros) ? prop.pros : [],
    cons: Array.isArray(prop.cons) ? prop.cons : [],
    rera: Boolean(prop.reraApproved),
    reraApproved: Boolean(prop.reraApproved),
    rera_approved: Boolean(prop.reraApproved),
    reraNumber: prop.reraNumber || null,
    status: prop.status || 'Published',
    purpose: prop.purpose || 'Buy',
    builder: prop.builder || null,
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
