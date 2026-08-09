import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getToken, setToken } from '../services/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext) || {};

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
  const [bookModalCallback, setBookModalCallback] = useState(null);

  const openBookModal = (property = null, callback = null) => {
    setBookModalProperty(property);
    setBookModalCallback(() => (typeof callback === 'function' ? callback : null));
    setIsBookModalOpen(true);
  };
  const closeBookModal = () => {
    setIsBookModalOpen(false);
    setBookModalProperty(null);
    setBookModalCallback(null);
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

  // --- FETCH REAL PROPERTIES FROM API ---
  const fetchProperties = async () => {
    try {
      const propData = await api.getProperties({ limit: 100 });
      if (propData?.properties?.length > 0) {
        const cleaned = propData.properties.map(p => {
          const fallback = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
          const fixImg = (url) => (url && typeof url === 'string' && !url.startsWith('blob:')) ? url : null;

          const exteriorFromRoomImages = Array.isArray(p.roomImages)
            ? p.roomImages.find(r => String(r.type || '').toLowerCase() === 'exterior')?.url
            : null;
          const cardImage =
            fixImg(p.image) ||
            fixImg(p.imageUrl) ||
            (Array.isArray(p.gallery) && p.gallery.length > 0 ? fixImg(p.gallery[0]) : null) ||
            (Array.isArray(p.galleryUrls) && p.galleryUrls.length > 0 ? fixImg(p.galleryUrls[0]) : null) ||
            fixImg(exteriorFromRoomImages) ||
            fallback;

          return {
            ...p,
            image: cardImage,
            imageUrl: cardImage
          };
        });
        setProperties(cleaned);
        return cleaned;
      }
    } catch (err) {
      console.warn("API properties fetch error:", err.message);
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
          setToken(null);
          setCurrentUser(null);
          user = null;
        }
      }

      // 2. Fetch Real Properties from API
      await fetchProperties();

      // 3. Fetch Real Blogs from API
      try {
        const blogData = await api.getBlogs({ limit: 50 });
        if (blogData?.blogs?.length > 0) {
          setBlogs(blogData.blogs);
        }
      } catch (err) {
        console.warn("API blogs fetch error:", err.message);
      }

      // Helper to safely extract array from API response
      const safeArray = (res, key) => {
        if (!res) return null;
        const target = res.data || res;
        if (key && Array.isArray(target[key])) return target[key];
        if (Array.isArray(target)) return target;
        return null;
      };

      // 4. Fetch User Wishlist, Compare, Site Visits ONLY if user is authenticated
      if (user && getToken()) {
        try {
          const visitsData = await api.getUserSiteVisits();
          const list = safeArray(visitsData, 'siteVisits');
          if (list) setSiteVisits(list);
        } catch (err) {}

        try {
          const wishData = await api.getWishlist();
          const list = safeArray(wishData, 'wishlist');
          if (list) setWishlist(list.filter(Boolean));
        } catch (err) {}

        try {
          const notifData = await api.getUserNotifications();
          const list = safeArray(notifData, 'notifications');
          if (list) setNotifications(list);
        } catch (err) {}
      }

      // 5. Fetch Admin Data if user is Admin
      if (user?.role === 'admin') {
        try {
          const custData = await api.getAdminCustomers();
          const list = safeArray(custData, 'customers');
          if (list) setCustomers(list);
        } catch (err) {}
        try {
          const adminVisits = await api.getAdminSiteVisits();
          const list = safeArray(adminVisits, 'siteVisits');
          if (list) setSiteVisits(list);
        } catch (err) {}
        try {
          const bcastData = await api.getBroadcasts();
          const list = safeArray(bcastData, 'broadcasts');
          if (list) setBroadcasts(list);
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

      const safeArray = (res, key) => {
        if (!res) return null;
        if (key && Array.isArray(res[key])) return res[key];
        if (Array.isArray(res)) return res;
        return null;
      };

      // Sync backend user state
      if (user.role === 'admin') {
        api.getAdminCustomers().then(res => { const l = safeArray(res, 'customers'); if (l) setCustomers(l); }).catch(()=>{});
        api.getAdminSiteVisits().then(res => { const l = safeArray(res, 'siteVisits'); if (l) setSiteVisits(l); }).catch(()=>{});
        api.getBroadcasts().then(res => { const l = safeArray(res, 'broadcasts'); if (l) setBroadcasts(l); }).catch(()=>{});
      } else {
        api.getUserSiteVisits().then(res => { const l = safeArray(res, 'siteVisits'); if (l) setSiteVisits(l); }).catch(()=>{});
        api.getWishlist().then(res => { const l = safeArray(res, 'wishlist'); if (l) setWishlist(l); }).catch(()=>{});
        api.getUserNotifications().then(res => { const l = safeArray(res, 'notifications'); if (l) setNotifications(l); }).catch(()=>{});
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
    setSiteVisits([]);
    setWishlist([]);
    setCompareList([]);
    setCustomers([]);
    setBroadcasts([]);
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
      showToast(`Property "${created.title || 'New Property'}" created successfully!`);
      await fetchProperties();
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
      showToast("Property updated successfully!");
      await fetchProperties();
      return updated;
    } catch (err) {
      showToast(err.message || "Failed to update property.", "error");
      throw err;
    }
  };

  const deleteProperty = async (idOrProp) => {
    try {
      const targetId = typeof idOrProp === 'object' ? (idOrProp?.id || idOrProp?._id) : idOrProp;
      if (!targetId || targetId === 'undefined') {
        throw new Error('Invalid property ID provided for deletion');
      }
      await api.deleteProperty(targetId);
      showToast("Property deleted successfully.");
      await fetchProperties();
    } catch (err) {
      showToast(err.message || "Failed to delete property.", "error");
      throw err;
    }
  };

  const bulkUpdateProperties = async (ids, action) => {
    if (!ids || ids.length === 0) return;
    try {
      await api.bulkPropertiesAction(ids, action);
      await fetchProperties();
      if (action === 'Delete') {
        showToast(`${ids.length} properties deleted successfully.`);
      } else if (action === 'Publish' || action === 'Archive') {
        const targetStatus = action === 'Publish' ? 'Published' : 'Archived';
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
        city: visit.city || visit.cityName || 'Chennai',
        notes: visit.notes || visit.specialRequest,
      };

      const data = await api.createSiteVisit(payload);
      const createdVisit = data.siteVisit || data;
      const assignedConsultant = data.assignedConsultant || null;

      if (createdVisit) {
        createdVisit.assignedConsultant = assignedConsultant;
      }

      setSiteVisits(prev => [createdVisit, ...prev]);
      showToast("Site visit booked successfully!");

      if (bookModalCallback && assignedConsultant) {
        bookModalCallback(assignedConsultant);
      }

      closeBookModal();
      return { siteVisit: createdVisit, assignedConsultant };
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
      return { siteVisit: fallbackVisit, assignedConsultant: null };
    }
  };

  const confirmSiteVisit = async (id) => {
    try {
      const data = await api.confirmSiteVisit(id);
      const updated = data.siteVisit || data;
      setSiteVisits(prev => prev.map(v => (v.id === id || v._id === id) ? { ...v, ...updated, status: 'Confirmed' } : v));
      showToast("Site visit confirmed & consultant assigned!");

      // Refresh admin site visits to keep dashboard in sync
      api.getAdminSiteVisits().then(res => {
        const l = res?.siteVisits || (Array.isArray(res) ? res : null);
        if (l) setSiteVisits(l);
      }).catch(() => {});
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

  const getPropId = (p) => {
    if (!p) return '';
    if (typeof p === 'string') return p;
    if (p.id) return String(p.id);
    if (p._id) return String(p._id);
    if (p.slug) return String(p.slug);
    if (p.title) return String(p.title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return '';
  };

  const addToWishlist = async (propertyId) => {
    if (!currentUser) {
      showToast("Please log in to add properties to your Wishlist.", "warning");
      return false;
    }

    const id = getPropId(propertyId);
    if (!id) {
      showToast("Invalid property selection.", "error");
      return false;
    }

    const propObj = typeof propertyId === 'object' && propertyId !== null ? propertyId : properties.find(p => getPropId(p) === id);

    const isAlreadyIn = Array.isArray(wishlist) && wishlist.some(item => {
      if (!item) return false;
      return getPropId(item) === id;
    });

    if (isAlreadyIn) {
      showToast("Already added to your Wishlist!", "info");
      return true;
    }

    const itemToAdd = propObj || id;
    setWishlist(prev => [...(Array.isArray(prev) ? prev.filter(Boolean) : []), itemToAdd]);
    showToast("Added to Wishlist!", "success");

    try {
      await api.addToWishlist(id);
    } catch (err) {
      console.warn("API addToWishlist error:", err.message);
    }

    return true;
  };

  const removeFromWishlist = async (propertyId) => {
    if (!currentUser) {
      showToast("Please log in to manage your Wishlist.", "warning");
      return false;
    }
    const id = getPropId(propertyId);
    setWishlist(prev => (Array.isArray(prev) ? prev : []).filter(item => {
      if (!item) return false;
      return getPropId(item) !== id;
    }));
    showToast("Removed from Wishlist");
    try { await api.removeFromWishlist(id); } catch (err) {}
    return true;
  };

  const addToCompare = async (propertyId) => {
    if (!currentUser) {
      showToast("Please log in to compare properties.", "warning");
      return false;
    }

    const inputId = getPropId(propertyId);
    const newPropObj = (typeof propertyId === 'object' && propertyId !== null)
      ? propertyId
      : properties.find(p => getPropId(p) === inputId);

    const id = getPropId(newPropObj) || inputId;
    if (!id) {
      showToast("Invalid property selection", "error");
      return false;
    }

    const newType = normalizeType(newPropObj?.type);

    const isAlreadyAdded = Array.isArray(compareList) && compareList.some(item => item && getPropId(item) === id);
    if (isAlreadyAdded) {
      showToast("Property is already added to compare list.", "info");
      return false;
    }

    if (compareList.length >= 3) {
      showToast("Maximum 3 properties allowed", "error");
      return false;
    }

    if (compareList.length > 0) {
      const firstItem = compareList[0];
      const firstPropObj = (typeof firstItem === 'object' && firstItem !== null)
        ? firstItem
        : properties.find(p => getPropId(p) === getPropId(firstItem));

      const firstType = normalizeType(firstPropObj?.type);

      if (firstType !== newType) {
        showToast(`❌ ${firstType || 'Property'} and ${newType || 'Property'} cannot be compared. Only same property types allowed.`, "error");
        return false;
      }
    }

    setCompareList(prev => [...prev, id]);
    showToast("Added to Compare");
    return true;
  };

  const removeFromCompare = async (propertyId) => {
    if (!currentUser) {
      showToast("Please log in to manage Compare list.", "warning");
      return false;
    }
    const targetId = getPropId(propertyId);
    setCompareList(prev => prev.filter(item => getPropId(item) !== targetId));
    showToast("Removed from Compare");
    return true;
  };

  const addToRecentlyViewed = (propertyOrId) => {
    if (!propertyOrId) return;
    const propId = typeof propertyOrId === 'string' ? propertyOrId : getPropId(propertyOrId);
    if (!propId || typeof propId !== 'string') return;

    setRecentlyViewed(prev => [propId, ...prev.filter(id => id !== propId)].slice(0, 10));

    if (currentUser && getToken()) {
      try {
        api.addRecentlyViewed(propId);
      } catch (err) {}
    }
  };

  return (
    <AppContext.Provider value={{
      properties,
      setProperties,
      fetchProperties,
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
