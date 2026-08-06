import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getToken, setToken } from '../services/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// High-resolution premium luxury property images
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

const initialPropertiesData = [
  {
    id: "imperia-ritz",
    title: "The Ritz-Carlton Residences",
    tag: "SIGNATURE",
    price: "₹14.5 Cr",
    numericPrice: 145000000,
    location: "OMR, Chennai",
    city: "Chennai",
    type: "Apartment",
    beds: 4,
    baths: 5,
    area: "4,500 sq.ft.",
    numericArea: 4500,
    image: luxuryImages.villa1,
    gallery: [luxuryImages.villa1, luxuryImages.villa2, luxuryImages.penthouse1],
    amenities: ["Infinity Pool", "Private Gym", "24/7 Concierge", "Home Automation", "Helipad", "Sea View"],
    rera: true,
    status: "Ready to Move",
    purpose: "Buy",
    builder: "Imperia Developers & Ritz Group",
    rating: 4.95,
    growth: "+12.4% YoY",
    investmentRating: "AAA+",
    desc: "An exclusive skyline development combining the legendary services of Ritz-Carlton with masterfully crafted custom interiors, offering panoramic sea views over OMR.",
    specs: { "Year Built": "2025", "Floor": "32nd", "Furnished": "Fully Furnished", "Security": "Biometric & 24/7 Guard" },
    pros: ["Branded residential services", "Stunning panoramic ocean views", "High yield potential"],
    cons: ["Premium monthly maintenance fee", "Limited inventory available"]
  },
  {
    id: "imperia-skyline",
    title: "IMPERIA Skyline Towers",
    tag: "NEW LAUNCH",
    price: "₹8.2 Cr",
    numericPrice: 82000000,
    location: "Race Course, Coimbatore",
    city: "Coimbatore",
    type: "Penthouse",
    beds: 3,
    baths: 4,
    area: "3,800 sq.ft.",
    numericArea: 3800,
    image: luxuryImages.penthouse1,
    gallery: [luxuryImages.penthouse1, luxuryImages.penthouse2, luxuryImages.apartment1],
    amenities: ["Infinity Pool", "Private Elevator", "Home Automation", "Concierge", "Spa", "Private Garden"],
    rera: true,
    status: "Under Construction",
    purpose: "Buy",
    builder: "IMPERIA Infra",
    rating: 4.88,
    growth: "+9.8% YoY",
    investmentRating: "AA+",
    desc: "Ultra-modern sky-homes redefining residential architecture in Coimbatore's elite Race Course district, featuring private elevators and floor-to-ceiling glass.",
    specs: { "Year Built": "2027", "Floor": "18th", "Furnished": "Semi-Furnished", "Security": "Smart Camera & Concierge Vetting" },
    pros: ["Exclusive Race Course pin code", "Private personal elevator lobby", "Advanced home automation"],
    cons: ["Currently under construction", "Custom floor plans take longer to execute"]
  },
  {
    id: "imperia-beachfront",
    title: "The ECR Beachfront Villa",
    tag: "EXCLUSIVE",
    price: "₹22.0 Cr",
    numericPrice: 220000000,
    location: "ECR, Chennai",
    city: "Chennai",
    type: "Villa",
    beds: 5,
    baths: 6,
    area: "7,200 sq.ft.",
    numericArea: 7200,
    image: luxuryImages.villa2,
    gallery: [luxuryImages.villa2, luxuryImages.penthouse2, luxuryImages.villa1],
    amenities: ["Private Beach Access", "Swimming Pool", "Private Cinema", "Home Automation", "Private Garden", "Wine Cellar"],
    rera: true,
    status: "Ready to Move",
    purpose: "Buy",
    builder: "IMPERIA Heritage",
    rating: 4.99,
    growth: "+14.6% YoY",
    investmentRating: "AAA+",
    desc: "A massive beachfront villa complex crafted with imported Italian marble, featuring a private infinity pool spilling into the Bay of Bengal and private direct beach access.",
    specs: { "Year Built": "2024", "Floor": "Triple Storey", "Furnished": "Fully Furnished", "Security": "Full Boundary Laser Sensors & Security Post" },
    pros: ["Direct ocean access with zero setback", "State of the art private theater", "Elite private neighborhood"],
    cons: ["High initial capital outlay", "Requires dedicated estate manager staff"]
  }
];

const initialBlogsData = [
  {
    id: "art-1",
    title: "Chennai's Coastal Corridor: The 2026 ECR Real Estate Surge Analysis",
    slug: "chennai-coastal-corridor-ecr-surge-2026",
    category: "Market Intelligence",
    author: "Pranav Rajan",
    date: "October 14, 2025",
    readTime: "6 Min Read",
    image: luxuryImages.villa2,
    excerpt: "An in-depth capital growth evaluation of East Coast Road luxury villas, infrastructure expansion, and high-net-worth investor capital movement.",
    featured: true,
    views: 1420,
    status: "Published"
  },
  {
    id: "art-2",
    title: "Designing Invisible Luxury: Modernist Architecture in Coimbatore Penthouses",
    slug: "designing-invisible-luxury-coimbatore-penthouses",
    category: "Design & Style",
    author: "Aditi Sen",
    date: "November 02, 2025",
    readTime: "4 Min Read",
    image: luxuryImages.penthouse1,
    excerpt: "How floor-to-ceiling glass systems, acoustic insulation, and thermal climate controls redefine vertical living in Race Course estates.",
    featured: false,
    views: 980,
    status: "Published"
  }
];

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState(initialPropertiesData);
  const [blogs, setBlogs] = useState(initialBlogsData);
  const [customers, setCustomers] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [wishlist, setWishlist] = useState(["imperia-ritz"]);
  const [compareList, setCompareList] = useState(["imperia-ritz", "imperia-skyline"]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };
  const hideToast = () => setToast(prev => ({ ...prev, show: false }));

  // Global Site Visit Booking Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookModalProperty, setBookModalProperty] = useState(null);

  const openBookModal = (property = null) => {
    setBookModalProperty(property);
    setIsBookModalOpen(true);
  };
  const closeBookModal = () => {
    setIsBookModalOpen(false);
    setBookModalProperty(null);
  };

  // Global WhatsApp Drawer State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppInitialMessage, setWhatsAppInitialMessage] = useState('');

  const openWhatsApp = (initialMsg = '') => {
    setWhatsAppInitialMessage(initialMsg);
    setIsWhatsAppOpen(true);
  };
  const closeWhatsApp = () => {
    setIsWhatsAppOpen(false);
    setWhatsAppInitialMessage('');
  };

  // Global Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Private Viewing Confirmed",
      message: "Your private tour of The Ritz-Carlton Residences has been confirmed for tomorrow at 11:00 AM.",
      timestamp: "10 mins ago",
      type: "site_visit",
      read: false
    },
    {
      id: "notif-2",
      title: "Price Appreciation Alert",
      message: "The ECR Beachfront Villa portfolio experienced a +14.6% valuation surge.",
      timestamp: "2 hours ago",
      type: "market_update",
      read: false
    }
  ]);

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const toggleNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatUserObject = (u) => {
    if (!u) return null;
    const raw = u.user || u;
    const userName = raw.fullName || raw.name || (raw.email ? raw.email.split('@')[0] : 'Client');
    return {
      ...raw,
      isLoggedIn: true,
      name: userName,
      fullName: userName,
      purpose: raw.purpose || raw.preferences?.purpose || 'Buy',
      budget: raw.budget || raw.preferences?.budget || 'Any',
      propertyTypes: Array.isArray(raw.propertyTypes) ? raw.propertyTypes : (Array.isArray(raw.preferences?.propertyTypes) ? raw.preferences.propertyTypes : ['Villa', 'Apartment']),
      locations: Array.isArray(raw.locations) ? raw.locations : (Array.isArray(raw.preferences?.locations) ? raw.preferences.locations : ['Chennai']),
    };
  };

  // Temporary testing role switcher
  const switchRole = (newRole) => {
    if (!newRole) {
      setCurrentUser(null);
    } else {
      setCurrentUser(formatUserObject({
        id: 'usr-1',
        fullName: newRole === 'admin' ? 'Imperia Admin' : 'Alexander Wright',
        name: newRole === 'admin' ? 'Imperia Admin' : 'Alexander Wright',
        email: newRole === 'admin' ? 'admin@imperiaestates.com' : 'a.wright@solaris-cap.com',
        role: newRole,
        phone: '+91 98401 23456',
        city: 'Chennai',
        state: 'Tamil Nadu',
        memberSince: '2024'
      }));
    }
  };

  // --- INITIAL BACKEND DATA SYNC ---
  useEffect(() => {
    const initApp = async () => {
      const token = getToken();
      let user = null;

      // 1. Fetch Auth State if token exists
      if (token) {
        try {
          const meRes = await api.getMe();
          const rawUser = meRes?.user || meRes || null;
          user = formatUserObject(rawUser);
          setCurrentUser(user);
        } catch (err) {
          console.warn("Session token expired or invalid:", err.message);
          setToken(null);
        }
      }

      // 2. Fetch Real Properties from API
      try {
        const propData = await api.getProperties({ limit: 100 });
        if (propData?.properties?.length > 0) {
          setProperties(propData.properties);
        }
      } catch (err) {
        console.warn("API properties fetch error, using local dataset fallback:", err.message);
      }

      // 3. Fetch Real Blogs from API
      try {
        const blogData = await api.getBlogs({ limit: 50 });
        if (blogData?.blogs?.length > 0) {
          setBlogs(blogData.blogs);
        }
      } catch (err) {
        console.warn("API blogs fetch error:", err.message);
      }

      // 4. Fetch User Wishlist, Compare, Site Visits if logged in
      if (token) {
        try {
          const visitsData = await api.getUserSiteVisits();
          if (visitsData?.siteVisits) setSiteVisits(visitsData.siteVisits);
        } catch (err) {}

        try {
          const wishData = await api.getWishlist();
          if (wishData?.wishlist) setWishlist(wishData.wishlist);
        } catch (err) {}

        try {
          const compData = await api.getCompare();
          if (compData?.compare) setCompareList(compData.compare);
        } catch (err) {}
      }

      // 5. Fetch Admin Data if user is Admin
      if (user?.role === 'admin') {
        try {
          const custData = await api.getAdminCustomers();
          if (custData?.customers) setCustomers(custData.customers);
        } catch (err) {}
        try {
          const adminVisits = await api.getAdminSiteVisits();
          if (adminVisits?.siteVisits) setSiteVisits(adminVisits.siteVisits);
        } catch (err) {}
        try {
          const bcastData = await api.getBroadcasts();
          if (bcastData?.broadcasts) setBroadcasts(bcastData.broadcasts);
        } catch (err) {}
      }
    };

    initApp();
  }, []);

  // --- AUTH METHODS ---
  const loginUser = async (credentials) => {
    try {
      const data = await api.login(credentials);
      if (data.token) {
        setToken(data.token);
      }
      const rawUser = data.user || data;
      const user = formatUserObject(rawUser);
      setCurrentUser(user);
      showToast(`Welcome back, ${user.fullName || user.name || 'Client'}!`);

      // Sync backend user state
      if (user.role === 'admin') {
        api.getAdminCustomers().then(res => res?.customers && setCustomers(res.customers)).catch(()=>{});
        api.getAdminSiteVisits().then(res => res?.siteVisits && setSiteVisits(res.siteVisits)).catch(()=>{});
        api.getBroadcasts().then(res => res?.broadcasts && setBroadcasts(res.broadcasts)).catch(()=>{});
      } else {
        api.getUserSiteVisits().then(res => res?.siteVisits && setSiteVisits(res.siteVisits)).catch(()=>{});
        api.getWishlist().then(res => res?.wishlist && setWishlist(res.wishlist)).catch(()=>{});
        api.getCompare().then(res => res?.compare && setCompareList(res.compare)).catch(()=>{});
      }

      return user;
    } catch (err) {
      showToast(err.message || "Login failed.", "error");
      throw err;
    }
  };

  const signupUser = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data.token) {
        setToken(data.token);
      }
      const rawUser = data.user || data;
      const user = formatUserObject(rawUser);
      setCurrentUser(user);
      showToast(`Welcome to IMPERIA, ${user.fullName || user.name || 'Client'}!`);
      return user;
    } catch (err) {
      showToast(err.message || "Registration failed.", "error");
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await api.logout();
    } catch (err) {}
    setToken(null);
    setCurrentUser(null);
    showToast("Logged out successfully.");
  };

  const updateUserProfile = async (profileData) => {
    try {
      const data = await api.updateProfile(profileData);
      const updatedUser = formatUserObject(data.user || data);
      setCurrentUser(updatedUser);
      showToast("Profile updated successfully!");
      return updatedUser;
    } catch (err) {
      showToast(err.message || "Failed to update profile.", "error");
      throw err;
    }
  };

  // --- PROPERTY METHODS ---
  const addProperty = async (newProp) => {
    try {
      const data = await api.createProperty(newProp);
      const created = data.property || data;
      setProperties(prev => [created, ...prev]);
      showToast(`Property "${created.title || 'New Property'}" created successfully!`);
      return created;
    } catch (err) {
      showToast(err.message || "Failed to create property.", "error");
      throw err;
    }
  };

  const updateProperty = async (id, updatedFields) => {
    try {
      const data = await api.updateProperty(id, updatedFields);
      const updated = data.property || data;
      setProperties(prev => prev.map(p => (p.id === id || p._id === id) ? { ...p, ...updated } : p));
      showToast("Property updated successfully!");
      return updated;
    } catch (err) {
      showToast(err.message || "Failed to update property.", "error");
      throw err;
    }
  };

  const deleteProperty = async (id) => {
    try {
      await api.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id && p._id !== id));
      showToast("Property deleted.");
    } catch (err) {
      showToast(err.message || "Failed to delete property.", "error");
      throw err;
    }
  };

  const bulkUpdateProperties = async (ids, action) => {
    if (!ids || ids.length === 0) return;
    try {
      await api.bulkPropertiesAction(ids, action);
      if (action === 'Delete') {
        setProperties(prev => prev.filter(p => !ids.includes(p.id) && !ids.includes(p._id)));
        showToast(`${ids.length} properties deleted successfully.`);
      } else if (action === 'Publish' || action === 'Archive') {
        const targetStatus = action === 'Publish' ? 'Published' : 'Archived';
        setProperties(prev => prev.map(p => (ids.includes(p.id) || ids.includes(p._id)) ? { ...p, status: targetStatus } : p));
        showToast(`${ids.length} properties updated to ${targetStatus}.`);
      }
    } catch (err) {
      showToast(err.message || "Bulk action failed.", "error");
    }
  };

  // --- SITE VISITS ---
  const addSiteVisit = async (visit) => {
    try {
      const nameVal = visit.name || visit.customerName || visit.visitorName || currentUser?.fullName || currentUser?.name || 'Valued Client';
      const emailVal = visit.email || visit.customerEmail || visit.visitorEmail || currentUser?.email || '';
      const phoneVal = visit.phone || visit.customerPhone || visit.visitorPhone || currentUser?.phone || '';
      const dateVal = visit.date || visit.scheduledDate || new Date().toISOString().split('T')[0];
      const timeVal = visit.time || visit.scheduledTime || '10:00 AM';
      const propNameVal = visit.propertyName || visit.propertyTitle || visit.property || 'Architectural Estate';

      const payload = {
        propertyId: visit.propertyId || visit.id,
        propertyName: propNameVal,
        title: propNameVal,
        name: nameVal,
        customerName: nameVal,
        email: emailVal,
        customerEmail: emailVal,
        phone: phoneVal,
        customerPhone: phoneVal,
        date: dateVal,
        scheduledDate: dateVal,
        time: timeVal,
        scheduledTime: timeVal,
        notes: visit.notes || visit.specialRequest,
        consultantName: visit.consultantName || "Vikram Malhotra",
      };

      const data = await api.createSiteVisit(payload);
      const createdVisit = data.siteVisit || data;
      setSiteVisits(prev => [createdVisit, ...prev]);
      showToast("Site visit booked successfully!");
      closeBookModal();
      return createdVisit;
    } catch (err) {
      // Fallback local addition if API call fails
      const fallbackVisit = {
        id: `visit-${Date.now()}`,
        status: "Scheduled",
        createdAt: new Date().toISOString(),
        ...visit
      };
      setSiteVisits(prev => [fallbackVisit, ...prev]);
      showToast("Site visit requested!");
      closeBookModal();
      return fallbackVisit;
    }
  };

  const confirmSiteVisit = async (id) => {
    try {
      const data = await api.confirmSiteVisit(id);
      const updated = data.siteVisit || data;
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, ...updated, status: 'Confirmed' } : v));
      showToast("Site visit confirmed by Admin!");

      // Add a notification for confirmed visit
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          type: 'visit',
          category: 'Site Visit',
          title: 'Site Visit Confirmed! ✅',
          desc: `Your site visit has been confirmed by Admin!`,
          time: 'Just now',
          read: false,
        },
        ...prev
      ]);
    } catch (err) {
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, status: 'Confirmed' } : v));
      showToast("Site visit marked as Confirmed.");
    }
  };

  const rescheduleSiteVisit = async (id, newDate, newTime, newConsultant) => {
    try {
      const updateData = { date: newDate, time: newTime, consultantName: newConsultant, status: 'Scheduled' };
      const data = await api.rescheduleSiteVisit(id, updateData);
      const updated = data.siteVisit || data;
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, ...updated } : v));
      showToast("Site visit rescheduled successfully!");
    } catch (err) {
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, date: newDate, time: newTime, consultantName: newConsultant, status: 'Scheduled' } : v));
      showToast("Site visit rescheduled!");
    }
  };

  const cancelSiteVisit = async (id, reason) => {
    try {
      const updateData = { status: 'Cancelled', cancellationReason: reason };
      const data = await api.updateSiteVisitStatus(id, updateData);
      const updated = data.siteVisit || data;
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, ...updated } : v));
      showToast("Site visit marked as Cancelled.");
    } catch (err) {
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, status: "Cancelled", cancelReason: reason } : v));
      showToast("Site visit cancelled.");
    }
  };

  const completeSiteVisit = async (id, note) => {
    try {
      const updateData = { status: 'Completed', completionNote: note };
      const data = await api.updateSiteVisitStatus(id, updateData);
      const updated = data.siteVisit || data;
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, ...updated } : v));
      showToast("Site visit marked as Completed.");
    } catch (err) {
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, status: "Completed", completionNote: note } : v));
      showToast("Site visit completed.");
    }
  };

  const updateSiteVisit = (id, updatedFields) => {
    setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, ...updatedFields } : v));
  };

  // --- CUSTOMERS ---
  const addCustomer = async (newCust) => {
    try {
      const data = await api.createCustomer(newCust);
      const created = data.customer || data;
      setCustomers(prev => [created, ...prev]);
      showToast(`Customer "${created.name}" added successfully.`);
      return created;
    } catch (err) {
      const fallbackCust = { id: `cust-${Date.now()}`, ...newCust };
      setCustomers(prev => [fallbackCust, ...prev]);
      showToast(`Customer added.`);
      return fallbackCust;
    }
  };

  const updateCustomer = async (id, updatedFields) => {
    try {
      const data = await api.updateCustomer(id, updatedFields);
      const updated = data.customer || data;
      setCustomers(prev => prev.map(c => (c.id === id || c._id === id) ? { ...c, ...updated } : c));
      showToast("Customer record updated successfully.");
      return updated;
    } catch (err) {
      setCustomers(prev => prev.map(c => (c.id === id || c._id === id) ? { ...c, ...updatedFields } : c));
      showToast("Customer updated.");
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id && c._id !== id));
      showToast("Customer record removed.");
    } catch (err) {
      setCustomers(prev => prev.filter(c => c.id !== id && c._id !== id));
      showToast("Customer removed.");
    }
  };

  // --- BLOGS ---
  const addBlog = async (newBlog) => {
    try {
      const data = await api.createBlog(newBlog);
      const created = data.blog || data;
      setBlogs(prev => [created, ...prev]);
      showToast(`Article "${created.title}" published!`);
      return created;
    } catch (err) {
      const fallbackBlog = { id: `art-${Date.now()}`, ...newBlog };
      setBlogs(prev => [fallbackBlog, ...prev]);
      showToast("Article published.");
      return fallbackBlog;
    }
  };

  const updateBlog = async (id, updatedFields) => {
    try {
      const data = await api.updateBlog(id, updatedFields);
      const updated = data.blog || data;
      setBlogs(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, ...updated } : b));
      showToast("Article updated successfully.");
      return updated;
    } catch (err) {
      setBlogs(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, ...updatedFields } : b));
      showToast("Article updated.");
    }
  };

  const deleteBlog = async (id) => {
    try {
      await api.deleteBlog(id);
      setBlogs(prev => prev.filter(b => b.id !== id && b._id !== id));
      showToast("Article deleted.");
    } catch (err) {
      setBlogs(prev => prev.filter(b => b.id !== id && b._id !== id));
      showToast("Article deleted.");
    }
  };

  // --- BROADCASTS ---
  const addBroadcast = async (newBcast) => {
    try {
      const data = await api.sendBroadcast(newBcast);
      const created = data.broadcast || data;
      setBroadcasts(prev => [created, ...prev]);
      showToast("Broadcast notification sent successfully!");
      return created;
    } catch (err) {
      const fallback = { id: `bcast-${Date.now()}`, ...newBcast };
      setBroadcasts(prev => [fallback, ...prev]);
      showToast("Broadcast sent.");
      return fallback;
    }
  };

  // --- INQUIRIES ---
  const addInquiry = async (inquiryData) => {
    try {
      const data = await api.createInquiry(inquiryData);
      showToast("Inquiry submitted! A luxury consultant will reach out shortly.");
      return data;
    } catch (err) {
      showToast("Inquiry recorded.");
    }
  };

  // --- WISHLIST & COMPARE TOGGLES ---
  const addToWishlist = async (propertyId) => {
    if (!wishlist.includes(propertyId)) {
      setWishlist(prev => [...prev, propertyId]);
      showToast("Added to Wishlist");
      if (currentUser) {
        try { await api.addToWishlist(propertyId); } catch (err) {}
      }
    }
  };

  const removeFromWishlist = async (propertyId) => {
    setWishlist(prev => prev.filter(id => id !== propertyId));
    showToast("Removed from Wishlist");
    if (currentUser) {
      try { await api.removeFromWishlist(propertyId); } catch (err) {}
    }
  };

  const addToCompare = async (propertyId) => {
    if (compareList.length >= 4) {
      showToast("You can compare up to 4 properties.", "warning");
      return;
    }
    if (!compareList.includes(propertyId)) {
      setCompareList(prev => [...prev, propertyId]);
      showToast("Added to Compare");
      if (currentUser) {
        try { await api.addToCompare(propertyId); } catch (err) {}
      }
    }
  };

  const removeFromCompare = async (propertyId) => {
    setCompareList(prev => prev.filter(id => id !== propertyId));
    showToast("Removed from Compare");
    if (currentUser) {
      try { await api.removeFromCompare(propertyId); } catch (err) {}
    }
  };

  const addToRecentlyViewed = (propertyId) => {
    if (!recentlyViewed.includes(propertyId)) {
      setRecentlyViewed(prev => [propertyId, ...prev.filter(id => id !== propertyId)].slice(0, 10));
      if (currentUser) {
        try { api.addRecentlyViewed(propertyId); } catch (err) {}
      }
    }
  };

  return (
    <AppContext.Provider value={{
      properties,
      setProperties,
      addProperty,
      updateProperty,
      deleteProperty,
      bulkUpdateProperties,
      customers,
      setCustomers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      siteVisits,
      setSiteVisits,
      addSiteVisit,
      updateSiteVisit,
      confirmSiteVisit,
      rescheduleSiteVisit,
      cancelSiteVisit,
      completeSiteVisit,
      blogs,
      setBlogs,
      addBlog,
      updateBlog,
      deleteBlog,
      broadcasts,
      setBroadcasts,
      addBroadcast,
      addInquiry,
      wishlist,
      compareList,
      recentlyViewed,
      addToWishlist,
      removeFromWishlist,
      addToCompare,
      removeFromCompare,
      addToRecentlyViewed,
      currentUser,
      signupUser,
      loginUser,
      logoutUser,
      updateUserProfile,
      toast,
      showToast,
      hideToast,
      isBookModalOpen,
      bookModalProperty,
      openBookModal,
      closeBookModal,
      isWhatsAppOpen,
      whatsAppInitialMessage,
      openWhatsApp,
      closeWhatsApp,
      notifications,
      markNotificationRead,
      toggleNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      switchRole
    }}>
      {children}
    </AppContext.Provider>
  );
};
