import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AppProvider, useApp } from './context/AppContext';
import FloatingWhatsAppButton from './components/whatsapp/FloatingWhatsAppButton';
import Toast from './components/common/Toast';
import BookSiteVisitModal from './components/common/BookSiteVisitModal';

// Page Imports
import Home from './pages/Home';
import Buy from './pages/Buy';
import Rent from './pages/Rent';
import Projects from './pages/Projects';
import PropertyDetails from './pages/PropertyDetails';
import SearchPage from './pages/Search';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import ServicesPage from './pages/ServicesPage';
import LegalVerificationPage from './pages/LegalVerificationPage';
import HomeFinancingPage from './pages/HomeFinancingPage';
import InteriorDesignPage from './pages/InteriorDesignPage';
import CollectionPage from './pages/CollectionPage';
import SignupPage from './pages/SignupPage';
import OnboardingPreferencesPage from './pages/OnboardingPreferencesPage';
import OnboardingWelcomePage from './pages/OnboardingWelcomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MyBookings from './pages/MyBookings';
import NotificationsPage from './pages/NotificationsPage';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import NotFoundPage from './pages/NotFoundPage';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminAddPropertyPage from './pages/admin/AdminAddPropertyPage';
import AdminEditPropertyPage from './pages/admin/AdminEditPropertyPage';
import AdminConstructionUpdatesPage from './pages/admin/AdminConstructionUpdatesPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminSiteVisitsPage from './pages/admin/AdminSiteVisitsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminBlogsPage from './pages/admin/AdminBlogsPage';
import AdminBlogEditorPage from './pages/admin/AdminBlogEditorPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import ConsultantDashboardPage from './pages/ConsultantDashboardPage';
import ConsultantsPage from './pages/ConsultantsPage';
import AdminConsultantsPage from './pages/admin/AdminConsultantsPage';
import AdminVisitCalendarPage from './pages/admin/AdminVisitCalendarPage';

import './App.css';

import Preloader from './components/Preloader';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/legal-verification" element={<LegalVerificationPage />} />
          <Route path="/services/home-financing" element={<HomeFinancingPage />} />
          <Route path="/services/interior-design" element={<InteriorDesignPage />} />
          <Route path="/consultants" element={<ConsultantsPage />} />
          <Route path="/premium-plots" element={<CollectionPage collectionSlug="premium-plots" />} />
          <Route path="/architectural-villas" element={<CollectionPage collectionSlug="architectural-villas" />} />
          <Route path="/sky-apartments" element={<CollectionPage collectionSlug="sky-apartments" />} />
          <Route path="/commercial-assets" element={<CollectionPage collectionSlug="commercial-assets" />} />
          <Route path="/luxury-farm-lands" element={<CollectionPage collectionSlug="luxury-farm-lands" />} />
          <Route path="/signature-collection" element={<CollectionPage collectionSlug="signature-collection" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding/preferences" element={<OnboardingPreferencesPage />} />
          <Route path="/welcome" element={<OnboardingWelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/consultant/dashboard" element={<ConsultantDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const appContext = useApp() || {};
  const toast = appContext.toast || { show: false, message: '' };
  const hideToast = appContext.hideToast || (() => {});
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        {/* Global Toast Alert */}
        <Toast
          message={toast.message}
          show={toast.show}
          onClose={hideToast}
        />

        {/* Global Book Site Visit Modal */}
        <BookSiteVisitModal />
        <ScrollToTop />

        {/* Admin Layout Shell & Sub-Routes */}
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="properties" element={<AdminPropertiesPage />} />
            <Route path="properties/new" element={<AdminAddPropertyPage />} />
            <Route path="properties/:id/edit" element={<AdminEditPropertyPage />} />
            <Route path="construction" element={<AdminConstructionUpdatesPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="consultants" element={<AdminConsultantsPage />} />
            <Route path="visit-calendar" element={<AdminVisitCalendarPage />} />
            <Route path="site-visits" element={<AdminSiteVisitsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="blogs" element={<AdminBlogsPage />} />
            <Route path="blogs/new" element={<AdminBlogEditorPage />} />
            <Route path="blogs/:id/edit" element={<AdminBlogEditorPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </>
    );
  }

  return (
    <>
      {/* Global Toast Alert */}
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={hideToast}
      />

      {/* Global Book Site Visit Modal */}
      <BookSiteVisitModal />

      {/* Cinematic 3D Architectural Intro Preloader */}
      <AnimatePresence>
        {loading && (
          <Preloader onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {/* Main Application Content Mounted Underneath */}
      <div className="min-h-screen flex flex-col" style={{ background: '#E0EEE9', color: '#363C46', userSelect: 'text' }}>
        {/* Header / Sticky Glass Navbar */}
        <Navbar />
        <ScrollToTop />

        {/* Router Outlet with Smooth Page Transitions */}
        <main className="flex-grow">
          <AppRoutes />
        </main>

        {/* Floating WhatsApp Button */}
        <FloatingWhatsAppButton />

        {/* Premium Footer */}
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
