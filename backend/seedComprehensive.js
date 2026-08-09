import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './src/models/Property.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/imperia_estates';

const CITIES = [
  {
    name: 'Chennai',
    locations: ['OMR', 'ECR', 'Anna Nagar', 'Velachery', 'Nungambakkam', 'Boat Club', 'Adyar']
  },
  {
    name: 'Coimbatore',
    locations: ['RS Puram', 'Saravanampatti', 'Race Course', 'Peelamedu', 'Avinashi Road']
  },
  {
    name: 'Madurai',
    locations: ['KK Nagar', 'Anna Nagar', 'TVS Nagar', 'Mattuthavani', 'Sellur']
  },
  {
    name: 'Bangalore',
    locations: ['Whitefield', 'Indiranagar', 'Koramangala', 'HSR Layout', 'Sadashivanagar']
  },
  {
    name: 'Hyderabad',
    locations: ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'HITECH City', 'Financial District']
  },
  {
    name: 'Mumbai',
    locations: ['Bandra West', 'Juhu', 'Worli', 'Powai', 'Lower Parel']
  }
];

const TYPES = ['Villa', 'Apartment', 'Penthouse', 'Plot'];

// ─── MATCHED ROOM PAIRS ───────────────────────────────────────────────────────
// Each pair { furnished, empty } shows the SAME room style:
// - same wall color (white/off-white)
// - same light floor material
// - same natural-light feel
// Furnished = furniture/appliances present; Empty = bare walls + fixtures only
// NO humans in any image
// ─────────────────────────────────────────────────────────────────────────────

const ROOM_PAIRS = {
  // ── HALL / LIVING ROOM ──────────────────────────────────────────────────────
  hall: [
    {
      // Set A — bright open-plan, light oak floors, white walls
      furnished: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    },
    {
      // Set B — contemporary lounge, neutral palette
      furnished: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
    },
    {
      // Set C — luxury open living, warm tones
      furnished: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1567767671-f7a0540a9484?auto=format&fit=crop&w=1200&q=80"
    }
  ],

  // ── BEDROOM ─────────────────────────────────────────────────────────────────
  bedroom: [
    {
      // Set A — minimalist white room, light wood floor
      furnished: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    },
    {
      // Set B — modern bedroom, neutral palette, window light
      furnished: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80"
    },
    {
      // Set C — luxury suite, warm ambient light
      furnished: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1200&q=80"
    }
  ],

  // ── KITCHEN ─────────────────────────────────────────────────────────────────
  kitchen: [
    {
      // Set A — gray/white island kitchen with pendant lights (user reference)
      furnished: "https://images.unsplash.com/photo-RwXnelyqxAw?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1556185781-a47769abb7ee?auto=format&fit=crop&w=1200&q=80"
    },
    {
      // Set B — white Shaker-style kitchen, warm lighting
      furnished: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80"
    },
    {
      // Set C — luxury open kitchen with island and cooktop
      furnished: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=1200&q=80"
    }
  ],

  // ── BATHROOM ────────────────────────────────────────────────────────────────
  bathroom: [
    {
      // Set A — white marble bathroom, freestanding tub
      furnished: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80"
    },
    {
      // Set B — modern shower + vanity bathroom
      furnished: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80"
    },
    {
      // Set C — luxury ensuite, spa-style
      furnished: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      empty:     "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&w=1200&q=80"
    }
  ]
};

// ─── PER-TYPE EXTERIOR IMAGES ────────────────────────────────────────────────
const EXTERIOR_BY_TYPE = {
  Villa: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80"
  ],
  Apartment: [
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
  ],
  Penthouse: [
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1614577573673-6c91db0a69e7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80"
  ],
  Plot: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80"
  ]
};


const TITLE_PREFIXES = {
  Villa: ['Bespoke Royal', 'Signature Waterfront', 'Grand Sovereign', 'Emerald Crown', 'Imperial Haven'],
  Apartment: ['Skyline Horizon', 'Celestial Suites', 'Verdant Towers', 'Elite Residence', 'Solarium Heights'],
  Penthouse: ['Crown Zenith', 'Sky Park Skydeck', 'Aura Panorama', 'Lumiere Heights', 'Prestige Sky Villa'],
  Plot: ['Prime Sanctuary', 'Gold Crest Land', 'Urban Vantage', 'Greenfield Estate', 'Metropolitan Square']
};

function generateProperties() {
  const properties = [];

  CITIES.forEach((cityObj) => {
    TYPES.forEach((typeStr) => {
      for (let i = 1; i <= 5; i++) {
        const locationName = cityObj.locations[(i - 1) % cityObj.locations.length];
        const prefix = TITLE_PREFIXES[typeStr][(i - 1) % TITLE_PREFIXES[typeStr].length];
        const title = `${cityObj.name} ${locationName} ${prefix} ${typeStr} ${i > 1 ? `Phase ${i}` : ''}`.trim();
        const slugId = `${cityObj.name.toLowerCase()}-${typeStr.toLowerCase()}-${locationName.toLowerCase().replace(/\s+/g, '')}-${i}`;

        const isRent = (i === 4 || i === 5);
        const purpose = isRent ? 'Rent' : 'Buy';

        // Furnishing status assignment:
        // Item 1, 2, 5 -> 'full'
        // Item 3 -> 'semi'
        // Item 4 -> 'none'
        const furnishing = typeStr === 'Plot' ? 'none' : (i === 3 ? 'semi' : (i === 4 ? 'none' : 'full'));

        let numericPrice = 0;
        let priceDisplay = '';
        let area = 0;
        let beds = 0;
        let baths = 0;

        if (typeStr === 'Villa') {
          area = 2800 + (i * 350);
          beds = 3 + (i % 3);
          baths = beds;
          if (isRent) {
            numericPrice = 150000 + (i * 35000);
            priceDisplay = `₹${(numericPrice / 100000).toFixed(1)} L/mo`;
          } else {
            numericPrice = 35000000 + (i * 9000000);
            priceDisplay = `₹${(numericPrice / 10000000).toFixed(2)} Cr`;
          }
        } else if (typeStr === 'Apartment') {
          area = 1200 + (i * 200);
          beds = 2 + (i % 2);
          baths = beds;
          if (isRent) {
            numericPrice = 45000 + (i * 15000);
            priceDisplay = `₹${(numericPrice / 1000).toFixed(0)}k/mo`;
          } else {
            numericPrice = 8500000 + (i * 4500000);
            priceDisplay = `₹${(numericPrice / 10000000).toFixed(2)} Cr`;
          }
        } else if (typeStr === 'Penthouse') {
          area = 3500 + (i * 500);
          beds = 4 + (i % 2);
          baths = beds;
          if (isRent) {
            numericPrice = 220000 + (i * 60000);
            priceDisplay = `₹${(numericPrice / 100000).toFixed(1)} L/mo`;
          } else {
            numericPrice = 52000000 + (i * 12000000);
            priceDisplay = `₹${(numericPrice / 10000000).toFixed(2)} Cr`;
          }
        } else if (typeStr === 'Plot') {
          area = 1800 + (i * 400);
          beds = 0;
          baths = 0;
          if (isRent) {
            numericPrice = 80000 + (i * 30000);
            priceDisplay = `₹${(numericPrice / 100000).toFixed(1)} L/mo`;
          } else {
            numericPrice = 9500000 + (i * 6500000);
            priceDisplay = `₹${(numericPrice / 10000000).toFixed(2)} Cr`;
          }
        }

        // Build structured roomImages using MATCHED PAIRS
        // Each property gets one pair per room: furnished + empty from the SAME set
        const roomImages = [];

        // Pick pair index based on variant i — rotates across 3 sets (0,1,2)
        const pairIdx = (i - 1) % 3;

        // Per-type exterior images
        const typeExteriors = EXTERIOR_BY_TYPE[typeStr] || EXTERIOR_BY_TYPE.Villa;
        const extIdx = (i - 1) % typeExteriors.length;
        const exteriorPick = [
          typeExteriors[extIdx],
          typeExteriors[(extIdx + 1) % typeExteriors.length]
        ];

        if (typeStr === 'Plot') {
          exteriorPick.forEach(url => roomImages.push({ url, type: 'exterior', furnished: false }));
        } else {
          // ── HALL: one matched pair (furnished + empty same style) ──
          const hallPair = ROOM_PAIRS.hall[pairIdx];
          roomImages.push({ url: hallPair.furnished, type: 'hall',    furnished: true  });
          roomImages.push({ url: hallPair.empty,     type: 'hall',    furnished: false });

          // ── BEDROOM: one matched pair ──
          const bedPair = ROOM_PAIRS.bedroom[pairIdx];
          roomImages.push({ url: bedPair.furnished,  type: 'bedroom', furnished: true  });
          roomImages.push({ url: bedPair.empty,      type: 'bedroom', furnished: false });

          // ── KITCHEN: one matched pair ──
          const kitPair = ROOM_PAIRS.kitchen[pairIdx];
          roomImages.push({ url: kitPair.furnished,  type: 'kitchen', furnished: true  });
          roomImages.push({ url: kitPair.empty,      type: 'kitchen', furnished: false });

          // ── BATHROOM: one matched pair ──
          const bathPair = ROOM_PAIRS.bathroom[pairIdx];
          roomImages.push({ url: bathPair.furnished, type: 'bathroom', furnished: true  });
          roomImages.push({ url: bathPair.empty,     type: 'bathroom', furnished: false });

          // ── EXTERIOR: type-appropriate images ──
          exteriorPick.forEach(url => roomImages.push({ url, type: 'exterior', furnished: true }));
        }

        // Extract exterior urls for hero/card thumbnail
        const exteriorUrls = roomImages
          .filter(r => r.type === 'exterior')
          .map(r => r.url);

        // Card / hero image = first exterior image for this type
        const mainImageUrl = exteriorUrls[0] || typeExteriors[0];

        properties.push({
          _id: slugId,
          id: slugId,
          title: title,
          type: typeStr,
          numericPrice: numericPrice,
          priceDisplay: priceDisplay,
          price: priceDisplay,
          location: locationName,
          city: cityObj.name,
          description: `Signature luxury ${typeStr.toLowerCase()} in ${locationName}, ${cityObj.name}. Features world-class architectural design, premium finishes, and high-end community amenities.`,
          desc: `Signature luxury ${typeStr.toLowerCase()} in ${locationName}, ${cityObj.name}. Features world-class architectural design and amenities.`,
          imageUrl: mainImageUrl,
          image: mainImageUrl,
          galleryUrls: exteriorUrls,
          gallery: exteriorUrls,
          images: exteriorUrls,
          furnishing: furnishing, // 'full' | 'semi' | 'none'
          roomImages: roomImages,
          numericArea: area,
          areaDisplay: `${area.toLocaleString('en-IN')} sq.ft.`,
          area: `${area.toLocaleString('en-IN')} sq.ft.`,
          beds: beds,
          bedrooms: beds,
          baths: baths,
          bathrooms: baths,
          purpose: purpose,
          tag: isRent ? 'FOR LEASE' : (typeStr === 'Villa' ? 'LUXURY VILLA' : typeStr === 'Apartment' ? 'PREMIUM APARTMENT' : typeStr === 'Penthouse' ? 'PENTHOUSE SUITE' : 'PRIME PLOT'),
          status: 'Published',
          rating: 4.8 + (i % 3) * 0.1,
          saves: 0,
          views: 0,
          specs: {
            Furnished: furnishing === 'full' ? 'Fully Furnished' : (furnishing === 'semi' ? 'Semi Furnished' : 'Unfurnished')
          }
        });
      }
    });
  });

  return properties;
}

async function seedComprehensive() {
  try {
    console.log(`🔌 Connecting to MongoDB: ${MONGODB_URI.split('@').pop()}`);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log(`✅ MongoDB Connected.`);

    await Property.deleteMany({});
    console.log(`🧹 Cleaned existing properties database collection.`);

    const propertyDataset = generateProperties();

    const result = await Property.insertMany(propertyDataset);
    console.log(`🎉 Successfully inserted ${result.length} properties with furnishing image schemas!`);

    console.log(`\n========================================================================`);
    console.log(`📊 SEED VALIDATION SUMMARY (BREAKDOWN BY CITY & FURNISHING STATUS)`);
    console.log(`========================================================================`);
    
    for (const c of CITIES) {
      console.log(`\n🌆 ${c.name.toUpperCase()}:`);
      for (const t of TYPES) {
        const fullCount = await Property.countDocuments({ city: c.name, type: t, furnishing: 'full' });
        const semiCount = await Property.countDocuments({ city: c.name, type: t, furnishing: 'semi' });
        const noneCount = await Property.countDocuments({ city: c.name, type: t, furnishing: 'none' });
        console.log(`   ✔ ${t.padEnd(10)}: ${fullCount} Full, ${semiCount} Semi, ${noneCount} Unfurnished`);
      }
    }

    const totalCount = await Property.countDocuments({});
    console.log(`\n========================================================================`);
    console.log(`✨ TOTAL DATABASE PROPERTIES: ${totalCount} (All attached with roomImages schema)`);
    console.log(`========================================================================\n`);

  } catch (err) {
    console.error('❌ Error executing seed script:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Mongoose disconnected.');
    process.exit(0);
  }
}

seedComprehensive();
