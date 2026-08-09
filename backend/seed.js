import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

import User from './src/models/User.js';
import Property from './src/models/Property.js';
import Blog from './src/models/Blog.js';
import Customer from './src/models/Customer.js';
import Booking from './src/models/Booking.js';
import Notification from './src/models/Notification.js';
import Broadcast from './src/models/Broadcast.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/imperia_estates';

const luxuryImages = {
  villa1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  villa2: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  apartment1: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  apartment2: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  office1: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  office2: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
  penthouse1: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  penthouse2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
};

async function seed() {
  try {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      console.log(`🍃 Connected to ${MONGODB_URI}`);
    } catch (connErr) {
      if (connErr.code === 'ECONNREFUSED' || connErr.message?.includes('querySrv') || connErr.message?.includes('ECONNREFUSED')) {
        console.warn('⚠️ SRV DNS lookup failed. Connecting via direct cluster fallback...');
        const fallbackUri = "mongodb://harish007krishnan_db_user:QFZ9ggZp1HpIqi91@ac-443ujan-shard-00-00.agt0xp3.mongodb.net:27017,ac-443ujan-shard-00-01.agt0xp3.mongodb.net:27017,ac-443ujan-shard-00-02.agt0xp3.mongodb.net:27017/realestate?ssl=true&authSource=admin&retryWrites=true&w=majority";
        await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 5000 });
        console.log(`🍃 Connected to fallback MongoDB cluster`);
      } else {
        throw connErr;
      }
    }

    // 1. Seed Users
    const adminPasswordHash = await bcrypt.hash('admin1234', 10);
    const customerPasswordHash = await bcrypt.hash('Customer@123456', 10);

    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@imperiaestates.com' },
      {
        fullName: 'Imperia Admin',
        email: 'admin@imperiaestates.com',
        phone: '+91 99999 88888',
        passwordHash: adminPasswordHash,
        role: 'admin',
        city: 'Chennai',
        state: 'Tamil Nadu',
      },
      { upsert: true, new: true }
    );

    const customerUser = await User.findOneAndUpdate(
      { email: 'customer@imperiaestates.com' },
      {
        fullName: 'Rajesh Kumar',
        email: 'customer@imperiaestates.com',
        phone: '+91 98765 43210',
        passwordHash: customerPasswordHash,
        role: 'customer',
        city: 'Chennai',
        state: 'Tamil Nadu',
        purpose: 'Buy',
        propertyTypes: ['Villa', 'Penthouse'],
        budgetRange: '₹ 15 Cr - ₹ 20 Cr',
        targetLocations: ['ECR, Chennai', 'OMR, Chennai'],
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Users seeded: Admin (${adminUser.email}), Customer (${customerUser.email})`);

    // 2. Seed Properties
    const seedProperties = [
      {
        _id: "imperia-ritz",
        title: "The Ritz-Carlton Residences",
        tag: "SIGNATURE",
        priceDisplay: "₹14.5 Cr",
        numericPrice: 145000000,
        location: "OMR, Chennai",
        city: "Chennai",
        type: "Apartment",
        beds: 4,
        baths: 5,
        areaDisplay: "4,500 sq.ft.",
        numericArea: 4500,
        pricePerSqft: "32,222",
        imageUrl: luxuryImages.villa1,
        galleryUrls: [luxuryImages.villa1, luxuryImages.villa2, luxuryImages.penthouse1],
        amenities: ["Infinity Pool", "Private Gym", "24/7 Concierge", "Home Automation", "Helipad", "Sea View"],
        reraApproved: true,
        reraNumber: "TN/01/Building/0123/2025",
        status: "Ready to Move",
        purpose: "Buy",
        builder: "Imperia Developers & Ritz Group",
        rating: 4.95,
        growthRate: "+12.4% YoY",
        investmentRating: "AAA+",
        description: "An exclusive skyline development combining the legendary services of Ritz-Carlton with masterfully crafted custom interiors, offering panoramic sea views over OMR.",
        specs: { "Year Built": "2025", "Floor": "32nd", "Furnished": "Fully Furnished", "Security": "Biometric & 24/7 Guard" },
        pros: ["Branded residential services", "Stunning panoramic ocean views", "High yield potential"],
        cons: ["Premium monthly maintenance fee", "Limited inventory available"]
      },
      {
        _id: "imperia-skyline",
        title: "IMPERIA Skyline Towers",
        tag: "NEW LAUNCH",
        priceDisplay: "₹8.2 Cr",
        numericPrice: 82000000,
        location: "Race Course, Coimbatore",
        city: "Coimbatore",
        type: "Penthouse",
        beds: 3,
        baths: 4,
        areaDisplay: "3,800 sq.ft.",
        numericArea: 3800,
        pricePerSqft: "21,578",
        imageUrl: luxuryImages.penthouse1,
        galleryUrls: [luxuryImages.penthouse1, luxuryImages.penthouse2, luxuryImages.apartment1],
        amenities: ["Infinity Pool", "Private Elevator", "Home Automation", "Concierge", "Spa", "Private Garden"],
        reraApproved: true,
        reraNumber: "TN/02/Building/0456/2025",
        status: "Under Construction",
        purpose: "Buy",
        builder: "IMPERIA Infra",
        rating: 4.88,
        growthRate: "+9.8% YoY",
        investmentRating: "AA+",
        description: "Ultra-modern sky-homes redefining residential architecture in Coimbatore's elite Race Course district, featuring private elevators and floor-to-ceiling glass.",
        specs: { "Year Built": "2027", "Floor": "18th", "Furnished": "Semi-Furnished", "Security": "Smart Camera & Concierge Vetting" },
        pros: ["Exclusive Race Course pin code", "Private personal elevator lobby", "Advanced home automation"],
        cons: ["Currently under construction", "Custom floor plans take longer to execute"]
      },
      {
        _id: "imperia-beachfront",
        title: "The ECR Beachfront Villa",
        tag: "EXCLUSIVE",
        priceDisplay: "₹22.0 Cr",
        numericPrice: 220000000,
        location: "ECR, Chennai",
        city: "Chennai",
        type: "Villa",
        beds: 5,
        baths: 6,
        areaDisplay: "7,200 sq.ft.",
        numericArea: 7200,
        pricePerSqft: "30,555",
        imageUrl: luxuryImages.villa2,
        galleryUrls: [luxuryImages.villa2, luxuryImages.penthouse2, luxuryImages.villa1],
        amenities: ["Private Beach Access", "Swimming Pool", "Private Cinema", "Home Automation", "Private Garden", "Wine Cellar"],
        reraApproved: true,
        reraNumber: "TN/01/Building/0999/2024",
        status: "Ready to Move",
        purpose: "Buy",
        builder: "IMPERIA Heritage",
        rating: 4.99,
        growthRate: "+14.6% YoY",
        investmentRating: "AAA+",
        description: "A massive beachfront villa complex crafted with imported Italian marble, featuring a private infinity pool spilling into the Bay of Bengal and private direct beach access.",
        specs: { "Year Built": "2024", "Floor": "Triple Storey", "Furnished": "Fully Furnished", "Security": "Full Boundary Laser Sensors & Security Post" },
        pros: ["Direct ocean access with zero setback", "State of the art private theater", "Elite private neighborhood"],
        cons: ["High initial capital outlay", "Requires dedicated estate manager staff"]
      },
      {
        _id: "imperia-corporate-hub",
        title: "Imperia Premium Corporate Suite",
        tag: "PREMIUM OFFICE",
        priceDisplay: "₹4.5 L/mo",
        numericPrice: 450000,
        location: "OMR, Chennai",
        city: "Chennai",
        type: "Office",
        beds: 0,
        baths: 4,
        areaDisplay: "5,500 sq.ft.",
        numericArea: 5500,
        pricePerSqft: "81",
        imageUrl: luxuryImages.office1,
        galleryUrls: [luxuryImages.office1, luxuryImages.office2],
        amenities: ["Fibre Internet", "Conference Room", "Server Room", "Cafeteria", "Concierge", "Valet Parking"],
        reraApproved: false,
        status: "Ready to Move",
        purpose: "Rent",
        builder: "IMPERIA Commercial",
        rating: 4.82,
        growthRate: "+6.5% YoY",
        investmentRating: "AA",
        description: "Fully-furnished corporate offices optimized for modern tech companies and global family offices looking to establish a premium presence along Chennai's IT Corridor.",
        specs: { "Year Built": "2023", "Floor": "12th", "Furnished": "Fully Furnished", "Security": "24/7 Guard & Turnstile Access" },
        pros: ["Double height reception lobby", "Centralized high-efficiency HVAC", "Fibre optic network redundant links"],
        cons: ["Minimum 3-year lock-in period", "Separate monthly common space charge"]
      },
      {
        _id: "imperia-villas-coimbatore",
        title: "Grand Vista Mansion",
        tag: "LUXURY VILLA",
        priceDisplay: "₹9.8 Cr",
        numericPrice: 98000000,
        location: "Kalapatti, Coimbatore",
        city: "Coimbatore",
        type: "Villa",
        beds: 4,
        baths: 5,
        areaDisplay: "5,100 sq.ft.",
        numericArea: 5100,
        pricePerSqft: "19,215",
        imageUrl: luxuryImages.apartment2,
        galleryUrls: [luxuryImages.apartment2, luxuryImages.villa1, luxuryImages.penthouse1],
        amenities: ["Swimming Pool", "Private Garden", "Home Automation", "Private Gym", "Spa"],
        reraApproved: true,
        status: "Ready to Move",
        purpose: "Buy",
        builder: "IMPERIA Estates",
        rating: 4.90,
        growthRate: "+8.9% YoY",
        investmentRating: "AA+",
        description: "An architectural masterpiece in Kalapatti, Coimbatore, showcasing minimalist contemporary lines, a private rooftop pool, and sweeping garden landscapes.",
        specs: { "Year Built": "2025", "Floor": "Double Storey", "Furnished": "Fully Furnished", "Security": "Smart CCTV & Intercom Sync" },
        pros: ["Quiet, pollution-free premium zoning", "Spacious triple-car smart garage", "Private organic vegetable patch"],
        cons: ["Slightly removed from city center core", "Borewell water levels vary seasonally"]
      },
      {
        _id: "imperia-golden-meadows",
        title: "Golden Meadows",
        tag: "DTCP APPROVED",
        priceDisplay: "₹2.80 Cr",
        numericPrice: 28000000,
        location: "ECR, Chennai",
        city: "Chennai",
        type: "Plot",
        beds: 0,
        baths: 0,
        areaDisplay: "2 Acres",
        numericArea: 87120,
        pricePerSqft: "3,200",
        approval: "DTCP Approved",
        roadWidth: "40 ft Road",
        facing: "East Facing",
        frontage: "140 ft Frontage",
        dimensions: "200 x 435 ft",
        registrationStatus: "Ready for Registration",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        galleryUrls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["DTCP Approved", "Gated Community", "Lake View", "High Appreciation", "24/7 Security"],
        reraApproved: true,
        status: "Ready to Move",
        purpose: "Buy",
        builder: "IMPERIA Land Holdings",
        rating: 4.95,
        growthRate: "+18.2% YoY",
        investmentRating: "AAA+",
        description: "A sprawling 2-acre coastal estate plot along ECR, Chennai. Featuring a 40 ft wide approach road, DTCP approval, clear title deeds, and lush green surroundings.",
        specs: { "Plot Area": "2 Acres", "Price / Sq.ft": "₹3,200 / sq.ft", "Road Width": "40 ft Road", "Facing": "East Facing", "Approval": "DTCP Approved" },
        pros: ["Prime ECR coastal corridor", "40 ft wide approach road", "100% clear 30-year title audit"],
        cons: ["Limited layout inventory", "Corner plot commands premium"]
      },
      {
        _id: "imperia-marina-penthouse",
        title: "Marina Bay Sky Penthouse",
        tag: "EXCLUSIVE PENTHOUSE",
        priceDisplay: "₹18.5 Cr",
        numericPrice: 185000000,
        location: "Boat Club, Chennai",
        city: "Chennai",
        type: "Penthouse",
        beds: 4,
        baths: 5,
        areaDisplay: "5,800 sq.ft.",
        numericArea: 5800,
        pricePerSqft: "31,896",
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        galleryUrls: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["Private Rooftop Pool", "Personal Keycard Elevator", "360 Skyline Views", "Smart Home Automation", "Private Concierge"],
        reraApproved: true,
        reraNumber: "TN/01/Building/0777/2025",
        status: "Ready to Move",
        purpose: "Buy",
        builder: "IMPERIA Sovereign",
        rating: 4.97,
        growthRate: "+15.2% YoY",
        investmentRating: "AAA+",
        description: "An ultra-exclusive sky penthouse nestled in Chennai's ultra-wealthy Boat Club enclave. Offers private infinity plunge pool, floor-to-ceiling glass walls, and 360-degree city skyline vistas.",
        specs: { "Year Built": "2025", "Floor": "Top Floor Duplex", "Furnished": "Fully Furnished", "Security": "Biometric Access & Dedicated Guard" },
        pros: ["Highest prestige pin code in Chennai", "Private duplex plunge pool", "Private direct elevator access"],
        cons: ["Strict HOA association guidelines", "High annual concierge dues"]
      },
      {
        _id: "imperia-emerald-estates",
        title: "Emerald Valley Tea Sanctuary",
        tag: "HILL ESTATE",
        priceDisplay: "₹12.0 Cr",
        numericPrice: 120000000,
        location: "Kotagiri, Ooty",
        city: "Ooty",
        type: "Villa",
        beds: 5,
        baths: 6,
        areaDisplay: "8,500 sq.ft.",
        numericArea: 8500,
        pricePerSqft: "14,117",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        galleryUrls: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["Private Tea Plantation", "Fireplace Lounge", "Heated Indoor Pool", "Helipad", "Organic Farm"],
        reraApproved: true,
        status: "Ready to Move",
        purpose: "Buy",
        builder: "IMPERIA Escapes",
        rating: 4.92,
        growthRate: "+11.5% YoY",
        investmentRating: "AA+",
        description: "A private 5-bedroom luxury estate surrounded by 12 acres of organic tea gardens in the Nilgiri hills. Features stone fireplaces, heated pools, and breathtaking mountain valley views.",
        specs: { "Year Built": "2024", "Floor": "Colonial Mansion", "Furnished": "Fully Furnished", "Security": "Gated Perimeter & CCTV" },
        pros: ["12 acres of private tea plantation", "Pristine mountain climate year-round", "Turnkey eco-luxury estate"],
        cons: ["Hill terrain access requires SUV transit", "Cooler monsoon weather"]
      },
      {
        _id: "imperia-sovereign-suites",
        title: "Sovereign Financial Tower",
        tag: "COMMERCIAL HUB",
        priceDisplay: "₹3.8 L/mo",
        numericPrice: 380000,
        location: "Guindy, Chennai",
        city: "Chennai",
        type: "Office",
        beds: 0,
        baths: 4,
        areaDisplay: "4,200 sq.ft.",
        numericArea: 4200,
        pricePerSqft: "90",
        imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
        galleryUrls: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["LEED Gold Certified", "Executive Boardroom", "High-Speed Elevators", "100% Power Backup", "Covered Parking"],
        reraApproved: true,
        status: "Ready to Move",
        purpose: "Rent",
        builder: "IMPERIA Commercial",
        rating: 4.86,
        growthRate: "+7.2% YoY",
        investmentRating: "AA",
        description: "Grade-A corporate office suite located in Guindy's central business district. Ideal for multinational headquarters, wealth management funds, and consulate offices.",
        specs: { "Year Built": "2024", "Floor": "8th", "Furnished": "Fully Furnished", "Security": "24/7 RFID & Guard Security" },
        pros: ["Direct airport corridor connection", "LEED Gold green building certification", "Ample reserved multi-level parking"],
        cons: ["High demand zone parking congestion", "Fixed multi-year lease terms"]
      },
      {
        _id: "imperia-palm-residences",
        title: "Palm Grove Luxury Villas",
        tag: "LUXURY RENTAL",
        priceDisplay: "₹2.2 L/mo",
        numericPrice: 220000,
        location: "Kovalam, Chennai",
        city: "Chennai",
        type: "Villa",
        beds: 3,
        baths: 4,
        areaDisplay: "3,600 sq.ft.",
        numericArea: 3600,
        pricePerSqft: "61",
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        galleryUrls: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["Private Pool", "Beachside Walkway", "Fully Serviced Housekeeping", "24/7 Security", "Private Lawn"],
        reraApproved: true,
        status: "Ready to Move",
        purpose: "Rent",
        builder: "IMPERIA Heritage",
        rating: 4.89,
        growthRate: "+10.1% YoY",
        investmentRating: "AA+",
        description: "Resort-style luxury coastal villa available for long-term lease. Features private plunge pool, lush tropical palm gardens, and full housekeeping service.",
        specs: { "Year Built": "2025", "Floor": "Single Storey Villa", "Furnished": "Fully Furnished", "Security": "Gated Enclave & Smart Intercom" },
        pros: ["Serene coastal resort environment", "Includes butler & maintenance staff", "Private private pool"],
        cons: ["30-min drive to CBD central business district", "Long term lease preferred"]
      }
    ];

    for (const prop of seedProperties) {
      await Property.findOneAndUpdate(
        { _id: prop._id },
        prop,
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Properties seeded: ${seedProperties.length} records`);

    // 3. Seed Blogs
    const seedBlogs = [
      {
        title: "Top 5 Luxury Real Estate Investment Destinations in South India for 2026",
        slug: "top-5-luxury-real-estate-destinations-2026",
        category: "Market Insights",
        author: "Vikram Malhotra",
        date: "Feb 20, 2026",
        readTime: "6 min read",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        excerpt: "Discover why coastal ECR Chennai and Race Course Coimbatore are witnessing record capital appreciation.",
        body: "Luxury real estate in India is experiencing unprecedented demand. Investors are shifting towards high-yield gated villas and sky penthouses with branded hospitality services.",
        featured: true,
        status: "Published",
      },
      {
        title: "Understanding RERA Compliance & Legal Verification for High-Value Assets",
        slug: "understanding-rera-compliance-legal-verification",
        category: "Legal & Architecture",
        author: "Ananya Deshmukh",
        date: "Jan 28, 2026",
        readTime: "8 min read",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        excerpt: "A comprehensive checklist for high-net-worth buyers verifying clear titles and environmental clearances.",
        body: "Navigating luxury property acquisition requires strict legal due diligence, title searches spanning 30 years, and checking RERA approval numbers.",
        featured: false,
        status: "Published",
      }
    ];

    for (const blog of seedBlogs) {
      await Blog.findOneAndUpdate(
        { slug: blog.slug },
        blog,
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Blogs seeded: ${seedBlogs.length} records`);

    // 4. Seed Customers CRM
    const seedCustomers = [
      {
        name: "Rajesh Kumar",
        email: "rajesh.k@example.com",
        phone: "+91 98765 43210",
        city: "Chennai",
        purpose: "Buy",
        budget: "₹ 15 Cr - ₹ 20 Cr",
        leadStatus: "New",
        consultantName: "Vikram Malhotra",
        propertyTypes: ["Villa", "Penthouse"],
        locations: ["ECR, Chennai", "OMR, Chennai"],
        notes: "High priority lead seeking beachfront property."
      },
      {
        name: "Priya Sundaram",
        email: "priya.s@example.com",
        phone: "+91 98123 45678",
        city: "Coimbatore",
        purpose: "Buy",
        budget: "₹ 5 Cr - ₹ 10 Cr",
        leadStatus: "Contacted",
        consultantName: "Ananya Deshmukh",
        propertyTypes: ["Apartment"],
        locations: ["Race Course, Coimbatore"],
        notes: "Looking for penthouse in Race Course district."
      }
    ];

    for (const cust of seedCustomers) {
      await Customer.findOneAndUpdate(
        { email: cust.email },
        cust,
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Customers CRM seeded: ${seedCustomers.length} records`);

    // 5. Seed Site Visits / Bookings
    await Booking.findOneAndUpdate(
      { customerEmail: "priya.s@example.com", propertyName: "IMPERIA Skyline Towers" },
      {
        user: customerUser._id,
        property: "imperia-skyline",
        propertyName: "IMPERIA Skyline Towers",
        customerName: "Priya Sundaram",
        customerEmail: "priya.s@example.com",
        customerPhone: "+91 98123 45678",
        scheduledDate: "2026-03-08",
        scheduledTime: "11:00 AM",
        status: "Scheduled",
        consultantName: "Ananya Deshmukh",
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Site visits seeded: 1 record`);

    // 6. Seed Notifications
    const seedNotifications = [
      {
        user: customerUser._id,
        type: "booking",
        category: "Booking",
        title: "Booking Request Received",
        desc: "Your booking request for The Palm Residency has been submitted.",
        read: false,
      },
      {
        user: customerUser._id,
        type: "visit",
        category: "Site Visit",
        title: "Site Visit Confirmed",
        desc: "Your tour of Imperia Skyline Penthouse is scheduled for March 8 at 11:00 AM.",
        read: true,
      }
    ];

    for (const notif of seedNotifications) {
      await Notification.create(notif);
    }

    console.log(`✅ Notifications seeded: ${seedNotifications.length} records`);

    // 7. Seed Broadcasts
    await Broadcast.findOneAndUpdate(
      { title: "Exclusive Private Preview: ECR Coastal Villas" },
      {
        title: "Exclusive Private Preview: ECR Coastal Villas",
        message: "Join us this weekend for an exclusive VIP walkthrough of East Coast Road oceanfront estates.",
        audience: "All Premium Leads",
        channels: ["email", "whatsapp"],
        status: "Sent",
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Broadcasts seeded: 1 record`);
    console.log(`🎉 Mongoose Database Seeding Completed Successfully!`);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
