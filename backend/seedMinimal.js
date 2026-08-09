import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './src/models/Property.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/imperia_estates';

const rawProperties = [
  // ─── 🏡 VILLAS (5) ──────────────────────────────────────────────────────────
  {
    title: "ECR Beachfront Luxury Villa",
    type: "Villa",
    price: 55000000,
    location: "ECR",
    city: "Chennai",
    description: "Luxury sea-facing villa with private beach access, infinity pool, and Italian marble flooring.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 3500,
    bedrooms: 4,
    bathrooms: 4,
    purpose: "Buy"
  },
  {
    title: "OMR Tech Corridor Signature Villa",
    type: "Villa",
    price: 38000000,
    location: "OMR",
    city: "Chennai",
    description: "Gated community smart villa with private garden, solar powered automation, and clubhouse membership.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 2800,
    bedrooms: 3,
    bathrooms: 3,
    purpose: "Buy"
  },
  {
    title: "RS Puram Heritage Royal Villa",
    type: "Villa",
    price: 42000000,
    location: "RS Puram",
    city: "Coimbatore",
    description: "Bespoke multi-level villa featuring teakwood finishes, private courtyard, and serene landscaped lawns.",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 3200,
    bedrooms: 4,
    bathrooms: 4,
    purpose: "Buy"
  },
  {
    title: "Whitefield Sanctuary Golf Villa",
    type: "Villa",
    price: 68000000,
    location: "Whitefield",
    city: "Bangalore",
    description: "Ultra-luxury golf course facing villa with personal terrace jacuzzi and home automation system.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 4200,
    bedrooms: 5,
    bathrooms: 5,
    purpose: "Buy"
  },
  {
    title: "Anna Nagar Executive Modern Villa",
    type: "Villa",
    price: 250000, // Monthly Rent: ₹2.5 L/mo
    location: "Anna Nagar",
    city: "Chennai",
    description: "Prime residential zone independent villa available for executive lease with private elevator and pool.",
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 3600,
    bedrooms: 4,
    bathrooms: 4,
    purpose: "Rent"
  },

  // ─── 🏢 APARTMENTS (5) ──────────────────────────────────────────────────────
  {
    title: "Anna Nagar Skyline Luxury Apartment",
    type: "Apartment",
    price: 18500000,
    location: "Anna Nagar",
    city: "Chennai",
    description: "Panoramic city-view 3 BHK high-rise apartment with acoustic insulation and VRV air conditioning.",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 1850,
    bedrooms: 3,
    bathrooms: 3,
    purpose: "Buy"
  },
  {
    title: "Velachery Lakeview Premium Apartment",
    type: "Apartment",
    price: 85000, // Monthly Rent: ₹85,000/mo
    location: "Velachery",
    city: "Chennai",
    description: "Modern 2 BHK rental apartment near Metro corridor with EV charging stations and fitness deck.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 1350,
    bedrooms: 2,
    bathrooms: 2,
    purpose: "Rent"
  },
  {
    title: "Saravanampatti IT Park Residency",
    type: "Apartment",
    price: 8500000,
    location: "Saravanampatti",
    city: "Coimbatore",
    description: "Contemporary 2 BHK apartment designed for IT professionals, located next to CHIL SEZ tech park.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    purpose: "Buy"
  },
  {
    title: "Whitefield ITPL Heights Apartment",
    type: "Apartment",
    price: 120000, // Monthly Rent: ₹1.2 L/mo
    location: "Whitefield",
    city: "Bangalore",
    description: "High-floor 3 BHK apartment for lease with modular German kitchen, clubhouse access, and tennis courts.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 2100,
    bedrooms: 3,
    bathrooms: 3,
    purpose: "Rent"
  },
  {
    title: "RS Puram Boulevard Apartment",
    type: "Apartment",
    price: 16500000,
    location: "RS Puram",
    city: "Coimbatore",
    description: "Bespoke 3 BHK residence in prime commercial hub with dedicated underground parking and rooftop lounge.",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 1750,
    bedrooms: 3,
    bathrooms: 3,
    purpose: "Buy"
  },

  // ─── 🏞️ PLOTS (5) ───────────────────────────────────────────────────────────
  {
    title: "ECR Coastal Prime Villa Plot",
    type: "Plot",
    price: 15000000,
    location: "ECR",
    city: "Chennai",
    description: "CMDA approved 2400 sq.ft. corner plot with 40ft wide blacktop road access, perfect for custom beach villa.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 2400,
    purpose: "Buy"
  },
  {
    title: "OMR IT Expressway Commercial Plot",
    type: "Plot",
    price: 180000, // Monthly Lease: ₹1.8 L/mo
    location: "OMR",
    city: "Chennai",
    description: "DTCP approved 3600 sq.ft. plot available for long-term commercial lease along Siruseri IT corridor.",
    images: [
      "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 3600,
    purpose: "Rent"
  },
  {
    title: "Saravanampatti Smart City Land Plot",
    type: "Plot",
    price: 7500000,
    location: "Saravanampatti",
    city: "Coimbatore",
    description: "Gated community DTCP & RERA registered plot with underground drainage and streetlights.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 1800,
    purpose: "Buy"
  },
  {
    title: "Velachery Central Residential Plot",
    type: "Plot",
    price: 19500000,
    location: "Velachery",
    city: "Chennai",
    description: "North facing 2000 sq.ft. plot in established residential layout near Grand Square mall.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 2000,
    purpose: "Buy"
  },
  {
    title: "Whitefield Greenfield Estate Plot",
    type: "Plot",
    price: 150000, // Monthly Lease: ₹1.5 L/mo
    location: "Whitefield",
    city: "Bangalore",
    description: "Exclusive 3000 sq.ft. plot available for lease inside a luxury gated enclave in Whitefield.",
    images: [
      "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    area: 3000,
    purpose: "Rent"
  }
];

async function seedMinimal() {
  try {
    console.log(`🔌 Connecting to MongoDB: ${MONGODB_URI.split('@').pop()}`);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log(`✅ MongoDB Connected.`);

    // 1. Clear existing properties to ensure clean minimal dataset
    await Property.deleteMany({});
    console.log(`🧹 Cleaned existing properties database collection.`);

    // 2. Format properties to match MongoDB Schema & Frontend conventions
    const formattedData = rawProperties.map((p, idx) => {
      const slugId = `minimal-${p.type.toLowerCase()}-${p.location.toLowerCase().replace(/\s+/g, '')}-${idx + 1}`;
      const priceDisplay = p.purpose === 'Rent'
        ? `₹${(p.price / 1000).toFixed(0)}k/mo`
        : (p.price >= 10000000 ? `₹${(p.price / 10000000).toFixed(2)} Cr` : `₹${(p.price / 100000).toFixed(2)} L`);

      return {
        _id: slugId,
        id: slugId,
        title: p.title,
        type: p.type, // 'Villa' | 'Apartment' | 'Plot'
        numericPrice: p.price,
        priceDisplay: priceDisplay,
        price: priceDisplay,
        location: p.location,
        city: p.city,
        description: p.description,
        desc: p.description,
        imageUrl: p.images[0],
        image: p.images[0],
        galleryUrls: p.images,
        gallery: p.images,
        images: p.images,
        numericArea: p.area,
        areaDisplay: `${p.area.toLocaleString('en-IN')} sq.ft.`,
        area: `${p.area.toLocaleString('en-IN')} sq.ft.`,
        beds: p.bedrooms || 0,
        bedrooms: p.bedrooms || 0,
        baths: p.bathrooms || 0,
        bathrooms: p.bathrooms || 0,
        purpose: p.purpose, // 'Buy' | 'Rent'
        tag: p.purpose === 'Rent' ? 'FOR LEASE' : (p.type === 'Villa' ? 'LUXURY VILLA' : p.type === 'Apartment' ? 'PREMIUM APARTMENT' : 'PRIME PLOT'),
        status: 'Published',
        rating: 4.8,
        saves: 0,
        views: 0
      };
    });

    // 3. Insert 15 minimal properties
    const result = await Property.insertMany(formattedData);
    console.log(`🎉 Successfully inserted ${result.length} minimal properties into MongoDB!`);

    // 4. Validate breakdown
    const villaCount = await Property.countDocuments({ type: 'Villa' });
    const apartmentCount = await Property.countDocuments({ type: 'Apartment' });
    const plotCount = await Property.countDocuments({ type: 'Plot' });
    const buyCount = await Property.countDocuments({ purpose: 'Buy' });
    const rentCount = await Property.countDocuments({ purpose: 'Rent' });

    console.log(`\n====================================`);
    console.log(`📊 SEED VALIDATION SUMMARY`);
    console.log(`====================================`);
    console.log(`✔ Villas inserted:     ${villaCount} / 5`);
    console.log(`✔ Apartments inserted: ${apartmentCount} / 5`);
    console.log(`✔ Plots inserted:      ${plotCount} / 5`);
    console.log(`------------------------------------`);
    console.log(`✔ Properties for Buy:  ${buyCount} (Sale)`);
    console.log(`✔ Properties for Rent: ${rentCount} (Lease)`);
    console.log(`✔ Total Database Items: ${villaCount + apartmentCount + plotCount} / 15`);
    console.log(`====================================\n`);

  } catch (err) {
    console.error('❌ Error executing seedMinimal script:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Mongoose disconnected.');
    process.exit(0);
  }
}

seedMinimal();
