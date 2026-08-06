/**
 * Centralized Static Mock Dataset for IMPERIA ESTATES
 * Provides fallback business records when backend service is offline.
 */

export const mockProperties = [
  {
    id: "prop-1",
    title: "The Palm Residency & Sky Villa",
    type: "Villa",
    purpose: "Buy",
    city: "Chennai",
    location: "East Coast Road (ECR), Chennai",
    price: "₹ 18.5 Cr",
    numeric_price: 185000000,
    numericPrice: 185000000,
    price_per_sqft: "37,000",
    pricePerSqft: "37,000",
    area: "5,000 sq.ft.",
    numeric_area: 5000,
    numericArea: 5000,
    area_unit: "sq.ft.",
    beds: 4,
    baths: 5,
    status: "Published",
    featured: true,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Ultra-luxury oceanfront villa featuring private infinity pool, Italian marble flooring, and smart home automation.",
    builder: "IMPERIA Estates",
    rera_number: "TN/01/Building/0123/2024",
    registration_status: "RERA Approved",
    enquiries: 24,
    created_at: "2026-01-15T10:00:00Z"
  },
  {
    id: "prop-2",
    title: "Imperia Skyline Penthouse",
    type: "Apartment",
    purpose: "Buy",
    city: "Coimbatore",
    location: "Race Course, Coimbatore",
    price: "₹ 8.2 Cr",
    numeric_price: 82000000,
    numericPrice: 82000000,
    price_per_sqft: "19,500",
    pricePerSqft: "19,500",
    area: "4,200 sq.ft.",
    numeric_area: 4200,
    numericArea: 4200,
    area_unit: "sq.ft.",
    beds: 3,
    baths: 4,
    status: "Published",
    featured: true,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Duplex sky penthouse overlooking the Race Course with 360-degree panoramic city views and private elevator access.",
    builder: "IMPERIA Infra",
    rera_number: "TN/02/Building/0456/2024",
    registration_status: "RERA Approved",
    enquiries: 18,
    created_at: "2026-02-01T12:00:00Z"
  },
  {
    id: "prop-3",
    title: "Grand Vista Executive Commercial Suite",
    type: "Commercial",
    purpose: "Rent",
    city: "Bengaluru",
    location: "Indiranagar, Bengaluru",
    price: "₹ 4.5 L/mo",
    numeric_price: 450000,
    numericPrice: 450000,
    price_per_sqft: "150",
    pricePerSqft: "150",
    area: "3,000 sq.ft.",
    numeric_area: 3000,
    numericArea: 3000,
    area_unit: "sq.ft.",
    beds: 0,
    baths: 2,
    status: "Published",
    featured: false,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Grade-A corporate office space with high-speed fibre internet, conference rooms, and 24/7 power backup.",
    builder: "IMPERIA Commercial",
    rera_number: "KA/RERA/1254/2024",
    registration_status: "RERA Approved",
    enquiries: 12,
    created_at: "2026-02-10T14:30:00Z"
  },
  {
    id: "prop-4",
    title: "Serene Valley Organic Farm Estate",
    type: "Plot",
    purpose: "Buy",
    city: "Coimbatore",
    location: "Kalapatti, Coimbatore",
    price: "₹ 4.8 Cr",
    numeric_price: 48000000,
    numericPrice: 48000000,
    price_per_sqft: "4,000",
    pricePerSqft: "4,000",
    area: "12,000 sq.ft.",
    numeric_area: 12000,
    numericArea: 12000,
    area_unit: "sq.ft.",
    beds: 0,
    baths: 0,
    status: "Published",
    featured: true,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Gated farm land plot with fruit orchards, drip irrigation, and crystal-clear mountain water access.",
    builder: "IMPERIA Green Estates",
    rera_number: "TN/03/Plot/0789/2024",
    registration_status: "RERA Approved",
    enquiries: 30,
    created_at: "2026-02-15T09:15:00Z"
  }
];

export const mockBlogs = [
  {
    id: "blog-1",
    title: "Top 5 Luxury Real Estate Investment Destinations in South India for 2026",
    slug: "top-5-luxury-real-estate-destinations-2026",
    category: "Market Insights",
    author: "Vikram Malhotra",
    date: "Feb 20, 2026",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    readTime: "6 min read",
    summary: "Discover why coastal ECR Chennai and Race Course Coimbatore are witnessing record capital appreciation.",
    content: "Luxury real estate in India is experiencing unprecedented demand. Investors are shifting towards high-yield gated villas and sky penthouses..."
  },
  {
    id: "blog-2",
    title: "Understanding RERA Compliance & Legal Verification for High-Value Assets",
    slug: "understanding-rera-compliance-legal-verification",
    category: "Legal & Architecture",
    author: "Ananya Deshmukh",
    date: "Jan 28, 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    readTime: "8 min read",
    summary: "A comprehensive checklist for high-net-worth buyers verifying clear titles and environmental clearances.",
    content: "Navigating luxury property acquisition requires strict legal due diligence..."
  }
];

export const mockCustomers = [
  {
    id: "cust-1",
    name: "Rajesh Kumar",
    email: "rajesh.k@example.com",
    phone: "+91 98765 43210",
    city: "Chennai",
    purpose: "Buy",
    budget: "₹ 15 Cr - ₹ 20 Cr",
    lead_status: "New",
    consultant_name: "Vikram Malhotra",
    property_types: ["Villa", "Penthouse"],
    locations: ["ECR, Chennai", "OMR, Chennai"],
    last_active: "2026-03-01T11:00:00Z"
  },
  {
    id: "cust-2",
    name: "Priya Sundaram",
    email: "priya.s@example.com",
    phone: "+91 98123 45678",
    city: "Coimbatore",
    purpose: "Buy",
    budget: "₹ 5 Cr - ₹ 10 Cr",
    lead_status: "Contacted",
    consultant_name: "Ananya Deshmukh",
    property_types: ["Apartment"],
    locations: ["Race Course, Coimbatore"],
    last_active: "2026-02-28T16:30:00Z"
  }
];

export const mockBookings = [
  {
    id: "book-1",
    customer_name: "Rajesh Kumar",
    customer_email: "rajesh.k@example.com",
    customer_phone: "+91 98765 43210",
    booking_status: "Pending",
    preferred_visit_date: "2026-03-10",
    preferred_contact_method: "WhatsApp",
    assigned_consultant: "Vikram Malhotra",
    notes: "Interested in private beach access options.",
    property: mockProperties[0]
  }
];

export const mockSiteVisits = [
  {
    id: "visit-1",
    customer_name: "Priya Sundaram",
    customer_email: "priya.s@example.com",
    customer_phone: "+91 98123 45678",
    property_name: "Imperia Skyline Penthouse",
    visit_date: "2026-03-08",
    visit_time: "11:00 AM",
    status: "Scheduled",
    consultant_name: "Ananya Deshmukh"
  }
];

export const mockConstructionProjects = [
  {
    id: "proj-1",
    name: "The Ritz-Carlton Residences",
    location: "OMR, Chennai",
    builder: "Imperia Developers & Ritz Group",
    timeline: "Possession Dec 2025",
    progress: 90,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    manual_override: false,
    manual_progress: 90,
    milestones: [
      { id: "m1", label: "Excavation & Substructure Piling", status: "Completed" },
      { id: "m2", label: "Core Structural Tower Superstructure", status: "Completed" },
      { id: "m3", label: "Exterior Glass Facade & Glazing", status: "Completed" },
      { id: "m4", label: "Interior Luxury Fit-Out & MEP", status: "In Progress" },
      { id: "m5", label: "Final Quality Audit & Key Handover", status: "Pending" }
    ]
  },
  {
    id: "proj-2",
    name: "Imperia Skyline Towers",
    location: "Race Course, Coimbatore",
    builder: "IMPERIA Infra",
    timeline: "Possession June 2027",
    progress: 45,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    manual_override: false,
    manual_progress: 45,
    milestones: [
      { id: "m10", label: "Land Acquisition & RERA Clearances", status: "Completed" },
      { id: "m11", label: "Foundations & Tower A Structure", status: "In Progress" },
      { id: "m12", label: "Exterior Facade Works", status: "Pending" },
      { id: "m13", label: "Landscaping & Interior Fit-Out", status: "Pending" }
    ]
  }
];

export const mockNotifications = [
  {
    id: "notif-1",
    title: "Booking Request Received",
    message: "Your booking request for The Palm Residency has been submitted.",
    time: "10 minutes ago",
    unread: true
  },
  {
    id: "notif-2",
    title: "Site Visit Confirmed",
    message: "Your tour of Imperia Skyline Penthouse is scheduled for March 8 at 11:00 AM.",
    time: "2 hours ago",
    unread: false
  }
];

export const mockBroadcasts = [
  {
    id: "bcast-1",
    title: "Exclusive Private Preview: ECR Coastal Villas",
    content: "Join us this weekend for an exclusive VIP walkthrough of East Coast Road oceanfront estates.",
    created_at: "2026-03-01T09:00:00Z"
  }
];
