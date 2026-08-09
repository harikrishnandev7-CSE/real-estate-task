import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Heart, Bell, Menu, X, ChevronDown, User, Users, Sparkles, Building, MapPin, Scale, Calendar, TrendingUp, Trash2, Settings, ShieldCheck } from 'lucide-react';
import ImageWithSkeleton from './ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import ImperiaLogo from './ImperiaLogo';

// ── Phase 2 Palette constants ────────────────────────────────────────────────
const C = {
  arsenic:       '#363C46',
  blackCoral:    '#5D6472',
  darkVanilla:   '#CFB6A8',
  azureish:      '#E0EEE9',
  white:         '#FFFFFF',
  border:        'rgba(93,100,114,0.15)',
  borderStrong:  'rgba(93,100,114,0.25)',
  muted:         'rgba(93,100,114,0.55)',
};

// ── Shared menu item style helpers ───────────────────────────────────────────
const menuItemCls =
  'group relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left w-full';


const Navbar = () => {
  const { openBookModal, showToast, currentUser, logoutUser, notifications = [], markNotificationRead, markAllNotificationsRead, deleteNotification } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const desktopNotifRef = useRef(null);
  const bellRef = useRef(null);
  const inlineSearchRef = useRef(null);
  const accountRef = useRef(null);
  const [accountOpen, setAccountOpen] = useState(false);

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  const handleDeleteNotification = (id, e) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    setNotificationsOpen(false);
    navigate(notif.link);
  };

  const isLinkActive = (link) => {
    if (link.type === 'luxury') {
      return location.pathname === '/buy' && location.search.includes('collection=luxury');
    }
    if (link.href === '/services') {
      return location.pathname.startsWith('/services');
    }
    return location.pathname === link.href;
  };

  const shouldReduceMotion = useReducedMotion();

  // Monitor scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside — notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopNotifRef.current && !desktopNotifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') setNotificationsOpen(false);
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [notificationsOpen]);

  // Click outside — inline search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inlineSearchRef.current && !inlineSearchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [searchOpen]);

  // Click outside — account
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') setAccountOpen(false);
    };
    if (accountOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [accountOpen]);

  // ── Animation Variants ──────────────────────────────────────────────────────
  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  const megaMenuVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : 8, scale: 0.98, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: shouldReduceMotion ? 0 : 8, transition: { duration: 0.15 } },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25, duration: 0.25 } },
    exit: { opacity: 0, scale: 0.95, y: shouldReduceMotion ? 0 : 8, transition: { duration: 0.15 } }
  };

  const drawerVariants = {
    hidden: { x: '100%', transition: { type: 'spring', damping: 30, stiffness: 300 } },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200, staggerChildren: 0.05, delayChildren: 0.05 } }
  };

  const drawerItemVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } }
  };

  const navLinks = [
    { name: 'Buy', href: '/buy' },
    { name: 'Rent', href: '/rent' },
    { name: 'Projects', href: '/projects', type: 'projects' },
    ...(currentUser ? [{ name: 'Compare', href: '/compare' }] : []),
    { name: 'Services', href: '/services', type: 'services' },
    { name: 'Insights', href: '/blog' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  // ── Shared nav link text style ────────────────────────────────────────────
  const navLinkStyle = (active) => ({
    fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: active ? C.arsenic : C.blackCoral,
    transition: 'color 0.2s',
  });

  // ── Mega menu card style ─────────────────────────────────────────────────
  const megaCardStyle = {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    boxShadow: '0 20px 48px rgba(54,60,70,0.10)',
    padding: '1.75rem',
  };

  // ── Icon button style ──────────────────────────────────────────────────────
  const iconBtnCls = 'p-2 rounded-full transition-colors duration-200 cursor-pointer outline-none flex items-center justify-center';

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 h-[64px] lg:h-[72px] flex items-center`}
        style={{
          background: isScrolled
            ? 'rgba(224,238,233,0.96)'
            : 'rgba(224,238,233,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${isScrolled ? C.borderStrong : C.border}`,
          boxShadow: isScrolled ? '0 2px 12px rgba(54,60,70,0.06)' : 'none',
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 flex items-center justify-between gap-2 xl:gap-4 relative h-full">

          {/* Logo */}
          <div className="flex items-center justify-start shrink-0">
            <Link to="/" className="flex items-center group" aria-label="IMPERIA – home">
              <ImperiaLogo
                layout="icon"
                variant="dark"
                height={30}
                className="xl:hidden transition-opacity duration-300 group-hover:opacity-70"
              />
              <ImperiaLogo
                layout="lockup"
                variant="dark"
                height={30}
                className="hidden xl:block transition-opacity duration-300 group-hover:opacity-70"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-5 flex-1 mx-1 xl:mx-4">
            {navLinks.map((link, idx) => {
              if (link.type === 'projects') {
                return (
                  <div
                    key={idx}
                    className="relative py-2"
                    onMouseEnter={() => { setActiveMegaMenu('projects'); setHoveredIndex(idx); }}
                    onMouseLeave={() => { setActiveMegaMenu(null); setHoveredIndex(null); }}
                  >
                    <button
                      onClick={() => navigate('/projects')}
                      className="relative flex items-center gap-1 py-1 px-1.5 cursor-pointer outline-none rounded focus-visible:ring-2 focus-visible:ring-[#CFB6A8]/50"
                      style={navLinkStyle(isLinkActive(link))}
                      onMouseEnter={e => { if (!isLinkActive(link)) e.currentTarget.style.color = C.arsenic; }}
                      onMouseLeave={e => { if (!isLinkActive(link)) e.currentTarget.style.color = C.blackCoral; }}
                    >
                      Projects
                      <ChevronDown
                        className="transition-transform duration-300"
                        style={{ width: 12, height: 12, transform: activeMegaMenu === 'projects' ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                      {/* Active underline — Dark Vanilla */}
                      {isLinkActive(link) && (
                        <span
                          className="absolute -bottom-[22px] left-0 right-0 h-px"
                          style={{ background: C.darkVanilla }}
                        />
                      )}
                      {/* Hover underline shared via layoutId */}
                      {hoveredIndex === idx && (
                        <motion.span
                          layoutId="navUnderline"
                          className="absolute -bottom-[22px] left-0 right-0 h-px"
                          style={{ background: C.darkVanilla }}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {activeMegaMenu === 'projects' && (
                        <motion.div
                          variants={megaMenuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-[560px] grid grid-cols-2 gap-8"
                          style={megaCardStyle}
                        >
                          <div>
                            <p
                              className="text-[10px] uppercase tracking-[0.18em] font-bold mb-4"
                              style={{ color: C.darkVanilla, fontFamily: "'Inter',sans-serif" }}
                            >
                              Our Collections
                            </p>
                            <ul className="space-y-3">
                              {[
                                { to: '/architectural-villas', icon: Building, title: 'Architectural Villas', sub: 'Custom mansions with infinity pools' },
                                { to: '/sky-apartments', icon: Sparkles, title: 'Sky Apartments', sub: 'Penthouse condos with skyline views' },
                                { to: '/premium-plots', icon: MapPin, title: 'Premium Plots', sub: 'Gated layout lands & investment plots' },
                              ].map(item => (
                                <li key={item.to}>
                                  <Link
                                    to={item.to}
                                    onClick={() => setActiveMegaMenu(null)}
                                    className="group flex items-start gap-3"
                                  >
                                    <div
                                      className="p-2 rounded-lg shrink-0 transition-colors duration-200"
                                      style={{ background: 'rgba(207,182,168,0.12)', color: C.darkVanilla }}
                                      onMouseEnter={e => { e.currentTarget.style.background = C.darkVanilla; e.currentTarget.style.color = C.white; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(207,182,168,0.12)'; e.currentTarget.style.color = C.darkVanilla; }}
                                    >
                                      <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p
                                        className="text-xs font-semibold transition-colors duration-200"
                                        style={{ color: C.arsenic, fontFamily: "'Inter',sans-serif" }}
                                      >
                                        {item.title}
                                      </p>
                                      <p
                                        className="text-[11px] mt-0.5"
                                        style={{ color: C.blackCoral, fontFamily: "'Inter',sans-serif" }}
                                      >
                                        {item.sub}
                                      </p>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div
                            className="relative rounded-lg overflow-hidden group"
                            style={{ border: `1px solid ${C.border}` }}
                          >
                            <ImageWithSkeleton
                              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                              alt="Project Showcase"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 flex flex-col justify-end z-20">
                              <p
                                className="text-[10px] uppercase tracking-widest font-bold mb-0.5"
                                style={{ color: C.darkVanilla, fontFamily: "'Inter',sans-serif" }}
                              >
                                New Launch
                              </p>
                              <p
                                className="text-sm font-semibold"
                                style={{ color: C.white, fontFamily: "'Fraunces','Playfair Display',serif" }}
                              >
                                Elysian Hills Estate
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              if (link.type === 'services') {
                return (
                  <div
                    key={idx}
                    className="relative py-2"
                    onMouseEnter={() => { setActiveMegaMenu('services'); setHoveredIndex(idx); }}
                    onMouseLeave={() => { setActiveMegaMenu(null); setHoveredIndex(null); }}
                  >
                    <button
                      className="flex items-center gap-1 py-1 px-1.5 cursor-pointer outline-none rounded focus-visible:ring-2 focus-visible:ring-[#CFB6A8]/50"
                      style={navLinkStyle(activeMegaMenu === 'services')}
                      onMouseEnter={e => e.currentTarget.style.color = C.arsenic}
                      onMouseLeave={e => { if (activeMegaMenu !== 'services') e.currentTarget.style.color = C.blackCoral; }}
                    >
                      {link.name}
                      <ChevronDown
                        className="transition-transform duration-300"
                        style={{ width: 12, height: 12, transform: activeMegaMenu === 'services' ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>

                    <AnimatePresence>
                      {activeMegaMenu === 'services' && (
                        <motion.div
                          variants={megaMenuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-[600px] grid grid-cols-2 gap-3 text-left"
                          style={megaCardStyle}
                        >
                          {[
                            { to: '/services', icon: Sparkles, title: 'Services Suite', sub: 'Full-spectrum concierge & advisory catalogue' },
                            { to: '/services/legal-verification', icon: Scale, title: 'Legal Verification', sub: '30-Year title search & EC clearance audits' },
                            { to: '/services/home-financing', icon: TrendingUp, title: 'Home Financing', sub: 'Private bank debt placement & 48-hr loans' },
                            { to: '/services/interior-design', icon: Sparkles, title: 'Interior Design', sub: 'Italian marble & smart home automation' },
                            { to: '/consultants', icon: Users, title: 'Our Consultants', sub: 'City-specialist luxury property advisors' },
                          ].map(item => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setActiveMegaMenu(null)}
                              className="p-3 rounded-lg flex items-start gap-3 group transition-all duration-200"
                              style={{ border: `1px solid ${C.border}`, background: C.azureish }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = C.darkVanilla;
                                e.currentTarget.style.background = 'rgba(207,182,168,0.08)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = C.border;
                                e.currentTarget.style.background = C.azureish;
                              }}
                            >
                              <div
                                className="p-2 rounded-lg shrink-0"
                                style={{ background: 'rgba(207,182,168,0.15)', color: C.darkVanilla }}
                              >
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p
                                  className="text-xs font-semibold"
                                  style={{ color: C.arsenic, fontFamily: "'Inter',sans-serif" }}
                                >
                                  {item.title}
                                </p>
                                <p
                                  className="text-[11px] mt-0.5 leading-relaxed"
                                  style={{ color: C.blackCoral, fontFamily: "'Inter',sans-serif" }}
                                >
                                  {item.sub}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={idx}
                  to={link.href}
                  onMouseEnter={(e) => { setHoveredIndex(idx); if (!isLinkActive(link)) e.currentTarget.style.color = C.arsenic; }}
                  onMouseLeave={(e) => { setHoveredIndex(null); if (!isLinkActive(link)) e.currentTarget.style.color = C.blackCoral; }}
                  className="relative py-2 px-1.5 cursor-pointer outline-none rounded focus-visible:ring-2 focus-visible:ring-[#CFB6A8]/50"
                  style={navLinkStyle(isLinkActive(link))}
                >
                  {link.name}
                  {isLinkActive(link) && (
                    <span
                      className="absolute -bottom-[2px] left-0 right-0 h-px"
                      style={{ background: C.darkVanilla }}
                    />
                  )}
                  {hoveredIndex === idx && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute -bottom-[19px] left-0 right-0 h-px"
                      style={{ background: C.darkVanilla }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="hidden lg:flex items-center justify-end gap-0.5 xl:gap-2 shrink-0">

            {/* Search */}
            <div className="relative flex items-center shrink-0">
              <motion.button
                whileHover={{ opacity: 0.7 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className={iconBtnCls}
                style={{ color: C.blackCoral }}
                aria-label="Search properties"
              >
                <Search className="w-[18px] h-[18px] stroke-2" />
              </motion.button>
            </div>

            {/* Wishlist */}
            {currentUser && (
              <div className="relative flex items-center shrink-0">
                <Link
                  to="/wishlist"
                  className={iconBtnCls}
                  style={{ color: C.blackCoral }}
                  onMouseEnter={e => e.currentTarget.style.color = C.arsenic}
                  onMouseLeave={e => e.currentTarget.style.color = C.blackCoral}
                  aria-label="View Wishlist"
                >
                  <Heart className="w-[18px] h-[18px] stroke-2" />
                </Link>
              </div>
            )}

            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <motion.button
                onClick={() => {
                  if (!currentUser) {
                    navigate('/login');
                  } else {
                    setAccountOpen(!accountOpen);
                  }
                }}
                whileHover={{ opacity: 0.8 }}
                whileTap={{ scale: 0.95 }}
                className={`${iconBtnCls} gap-1.5`}
                style={{ color: C.blackCoral }}
                aria-label={currentUser ? 'Account menu' : 'Log in'}
              >
                <User className="w-[18px] h-[18px] stroke-2" style={{ color: C.darkVanilla }} />
                <span
                  className="hidden xl:inline text-[10px] font-extrabold tracking-[0.1em] uppercase"
                  style={{ color: C.arsenic, fontFamily: "'Inter',sans-serif" }}
                >
                  {currentUser ? (currentUser.name || currentUser.fullName || 'Member').split(' ')[0] : 'LOGIN'}
                </span>
              </motion.button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 12px)',
                      width: 240,
                      background: C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: '0.5rem',
                      boxShadow: '0 20px 48px rgba(54,60,70,0.12)',
                      zIndex: 100,
                      transformOrigin: 'top right',
                    }}
                  >
                    {currentUser ? (
                      <>
                        {/* User info header */}
                        <div
                          className="px-3 py-2.5 mb-1.5"
                          style={{ borderBottom: `1px solid ${C.border}` }}
                        >
                          <p
                            className="text-[10px] uppercase tracking-wider font-bold"
                            style={{ color: C.darkVanilla, fontFamily: "'Inter',sans-serif" }}
                          >
                            VIP Member
                          </p>
                          <p className="text-xs font-bold truncate mt-0.5" style={{ color: C.arsenic }}>{currentUser.name}</p>
                          <p className="text-[10px] truncate font-medium" style={{ color: C.blackCoral }}>{currentUser.email}</p>
                        </div>

                        <ul className="space-y-0.5 text-xs font-medium">
                          {(currentUser.role === 'admin' || currentUser.isAdmin) && (
                            <li>
                              <Link
                                to="/admin"
                                onClick={() => setAccountOpen(false)}
                                className={menuItemCls}
                                style={{
                                  background: 'rgba(207,182,168,0.12)',
                                  border: `1px solid rgba(207,182,168,0.25)`,
                                  color: C.arsenic,
                                  fontWeight: 700,
                                  marginBottom: 4,
                                }}
                              >
                                <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: C.darkVanilla }} />
                                <span>Admin Control Panel</span>
                              </Link>
                            </li>
                          )}
                          {[
                            { to: '/dashboard', icon: Sparkles, label: 'Portfolio Dashboard' },
                            { to: '/my-bookings', icon: Calendar, label: 'My Bookings' },
                            { to: '/profile', icon: User, label: 'Profile & Preferences' },
                            { to: '/notifications', icon: Bell, label: 'Notifications' },
                            { to: '/wishlist', icon: Heart, label: 'Wishlist' },
                            { to: '/compare', icon: Scale, label: 'Compare Properties' },
                          ].map(item => (
                            <li key={item.to}>
                              <Link
                                to={item.to}
                                onClick={() => setAccountOpen(false)}
                                className={menuItemCls}
                                style={{ color: C.arsenic }}
                                onMouseEnter={e => e.currentTarget.style.background = C.azureish}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <item.icon className="w-4 h-4 shrink-0" style={{ color: C.darkVanilla }} />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                          <li>
                            <button
                              onClick={() => { logoutUser(); setAccountOpen(false); }}
                              className={`${menuItemCls} w-full font-bold cursor-pointer`}
                              style={{ color: '#DC2626' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <span>Log Out</span>
                            </button>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 mb-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                          <p
                            className="text-[10px] uppercase tracking-wider font-bold"
                            style={{ color: C.darkVanilla, fontFamily: "'Inter',sans-serif" }}
                          >
                            VIP Privilege
                          </p>
                          <p className="text-xs font-normal mt-0.5" style={{ color: C.blackCoral }}>
                            Sign in to access personalized luxury recommendations
                          </p>
                        </div>
                        <ul className="space-y-1.5 text-xs p-1">
                          <li>
                            <Link
                              to="/login"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center justify-center py-2.5 font-bold uppercase tracking-wider text-[11px] transition-all"
                              style={{ background: C.arsenic, color: C.white, borderRadius: 6 }}
                            >
                              Log In
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/signup"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center justify-center py-2.5 font-bold uppercase tracking-wider text-[11px] transition-all"
                              style={{
                                border: `1px solid ${C.border}`,
                                background: C.azureish,
                                color: C.arsenic,
                                borderRadius: 6,
                              }}
                            >
                              Create Account
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/login"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center justify-center gap-2 py-2 font-bold uppercase tracking-wider text-[10px] transition-all"
                              style={{
                                border: `1px solid rgba(207,182,168,0.30)`,
                                background: 'rgba(207,182,168,0.10)',
                                color: C.arsenic,
                                borderRadius: 6,
                              }}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" style={{ color: C.darkVanilla }} />
                              <span>Admin Control Panel</span>
                            </Link>
                          </li>
                        </ul>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative" ref={bellRef}>
              <motion.button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                whileHover={{ opacity: 0.75 }}
                whileTap={{ scale: 0.95 }}
                className={`${iconBtnCls} relative`}
                style={{ color: C.blackCoral }}
                aria-label="Notifications"
              >
                <Bell className="w-[18px] h-[18px] stroke-[1.5]" />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ background: C.darkVanilla }}
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    ref={desktopNotifRef}
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 12px)',
                      width: 380,
                      background: C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: '1.25rem',
                      boxShadow: '0 20px 48px rgba(54,60,70,0.12)',
                      zIndex: 100,
                      color: C.arsenic,
                      transformOrigin: 'top right',
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 mb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-tight" style={{ color: C.arsenic }}>Notifications</span>
                        {unreadCount > 0 && (
                          <span
                            className="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded-full uppercase"
                            style={{
                              background: 'rgba(207,182,168,0.18)',
                              color: C.darkVanilla,
                              border: `1px solid rgba(207,182,168,0.30)`,
                            }}
                          >
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] font-bold tracking-wide transition-colors cursor-pointer outline-none"
                            style={{ color: C.darkVanilla }}
                            onMouseEnter={e => e.currentTarget.style.color = C.arsenic}
                            onMouseLeave={e => e.currentTarget.style.color = C.darkVanilla}
                          >
                            Mark all as read
                          </button>
                        )}
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className={`${iconBtnCls} p-1 rounded-full`}
                          style={{ color: C.blackCoral }}
                          onMouseEnter={e => e.currentTarget.style.background = C.azureish}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          aria-label="Close notifications"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notification Cards */}
                    {notifications.length === 0 ? (
                      <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                        <div
                          className="p-3.5 rounded-full"
                          style={{ background: C.azureish, border: `1px solid ${C.border}`, color: C.blackCoral }}
                        >
                          <Bell className="w-8 h-8 stroke-[1.2]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold tracking-tight" style={{ color: C.arsenic }}>No new notifications</p>
                          <p className="text-xs font-normal mt-1" style={{ color: C.blackCoral }}>Everything is up to date.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {notifications.map((notif) => {
                          const Icon = notif.type === 'villa' ? Building :
                                       notif.type === 'visit' ? Calendar :
                                       notif.type === 'price' ? TrendingUp : Sparkles;
                          return (
                            <motion.div
                              key={notif.id}
                              whileHover={{ y: -1 }}
                              onClick={() => handleNotificationClick(notif)}
                              className="group flex items-start text-left gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer"
                              style={{
                                background: notif.read ? 'rgba(224,238,233,0.40)' : C.white,
                                border: `1px solid ${notif.read ? C.border : C.border}`,
                                color: notif.read ? C.blackCoral : C.arsenic,
                              }}
                              onMouseEnter={e => { if (!notif.read) e.currentTarget.style.borderColor = C.darkVanilla; }}
                              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                            >
                              <div
                                className="p-2 rounded-lg shrink-0"
                                style={{
                                  background: notif.read ? C.azureish : 'rgba(207,182,168,0.12)',
                                  border: `1px solid ${notif.read ? C.border : 'rgba(207,182,168,0.25)'}`,
                                  color: notif.read ? C.blackCoral : C.darkVanilla,
                                }}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className="text-xs font-bold tracking-tight"
                                  style={{ color: notif.read ? C.blackCoral : C.arsenic }}
                                >
                                  {notif.title}
                                </h5>
                                <p className="text-[11px] mt-0.5 leading-relaxed truncate" style={{ color: C.blackCoral }}>
                                  {notif.desc}
                                </p>
                                <span className="text-[9px] mt-1.5 block font-medium" style={{ color: C.muted }}>
                                  {notif.time}
                                </span>
                              </div>
                              <div className="flex flex-col items-center justify-between self-stretch shrink-0">
                                {!notif.read ? (
                                  <span className="h-1.5 w-1.5 rounded-full mt-1" style={{ background: C.darkVanilla }} />
                                ) : (
                                  <div className="w-1.5 h-1.5" />
                                )}
                                <button
                                  onClick={(e) => handleDeleteNotification(notif.id, e)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md cursor-pointer outline-none hover:bg-red-50"
                                  style={{ color: C.blackCoral }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
                                  onMouseLeave={e => e.currentTarget.style.color = C.blackCoral}
                                  aria-label="Delete notification"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={() => { setMobileMenuOpen(false); setAccountOpen(!accountOpen); }}
              className={`${iconBtnCls} relative`}
              style={{ color: C.blackCoral }}
              onMouseEnter={e => e.currentTarget.style.color = C.arsenic}
              onMouseLeave={e => e.currentTarget.style.color = C.blackCoral}
              aria-label="Account menu"
            >
              <User className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: C.darkVanilla }} />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={iconBtnCls}
              style={{ color: C.blackCoral }}
              onMouseEnter={e => e.currentTarget.style.color = C.arsenic}
              onMouseLeave={e => e.currentTarget.style.color = C.blackCoral}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Inline Search Overlay */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                ref={inlineSearchRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 px-6 md:px-12 flex items-center justify-between z-50 gap-6 h-full"
                style={{
                  background: 'rgba(224,238,233,0.98)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3.5 max-w-3xl mx-auto w-full relative">
                  <Search className="w-5 h-5 shrink-0" style={{ color: C.darkVanilla }} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search properties, cities, or projects..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-transparent border-b border-transparent focus:border-[rgba(93,100,114,0.25)] py-2.5 text-sm font-semibold tracking-wide focus:outline-none"
                    style={{ color: C.arsenic, caretColor: C.darkVanilla }}
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={() => setSearchVal('')}
                      className="transition-colors p-1"
                      style={{ color: C.blackCoral }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] py-2 px-5 transition-all cursor-pointer"
                  style={{
                    color: C.blackCoral,
                    border: `1px solid ${C.border}`,
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.70)',
                  }}
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile Search Form (below breakpoint) */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-30 backdrop-blur-sm lg:hidden"
              style={{ background: 'rgba(54,60,70,0.55)' }}
            />
            <motion.form
              onSubmit={handleSearchSubmit}
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-24 left-1/2 w-[90%] md:w-[560px] z-40 p-4 flex items-center gap-3 lg:hidden"
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                boxShadow: '0 20px 48px rgba(54,60,70,0.14)',
              }}
            >
              <Search style={{ color: C.darkVanilla, width: 18, height: 18 }} />
              <input
                type="text"
                placeholder="Search properties, neighborhoods, builders..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm py-1"
                style={{ color: C.arsenic, fontFamily: "'Inter',sans-serif" }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full transition-colors cursor-pointer"
                style={{ color: C.blackCoral }}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.form>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 backdrop-blur-md z-50"
              style={{ background: 'rgba(54,60,70,0.75)' }}
            />

            {/* Menu Panel */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 right-0 h-full w-[300px] z-50 p-6 flex flex-col justify-between"
              style={{
                background: C.azureish,
                borderLeft: `1px solid ${C.border}`,
                color: C.arsenic,
              }}
            >
              <div>
                {/* Drawer header */}
                <div className="flex items-center justify-between pb-4 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold tracking-[0.18em] uppercase text-base"
                    style={{ color: C.arsenic, fontFamily: "'Inter',sans-serif" }}
                  >
                    IMPERIA
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-full transition-colors cursor-pointer"
                    style={{ color: C.blackCoral }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(93,100,114,0.10)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="w-full relative flex items-center p-2.5 mb-5 text-sm"
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                  }}
                >
                  <Search className="w-4 h-4 shrink-0 mr-2" style={{ color: C.darkVanilla }} />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs py-0.5"
                    style={{ color: C.arsenic, fontFamily: "'Inter',sans-serif" }}
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={() => setSearchVal('')}
                      className="absolute right-3 transition-colors cursor-pointer outline-none"
                      style={{ color: C.blackCoral }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Nav Links */}
                <motion.nav className="space-y-1">
                  {navLinks.map((link, idx) => {
                    if (link.type === 'services') {
                      return (
                        <motion.div key={idx} variants={drawerItemVariants} className="space-y-1">
                          <Link
                            to="/services"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 rounded-lg text-sm font-bold outline-none transition-colors"
                            style={{
                              color: isLinkActive(link) ? C.darkVanilla : C.arsenic,
                              background: isLinkActive(link) ? 'rgba(207,182,168,0.12)' : 'transparent',
                            }}
                          >
                            Services
                          </Link>
                          <div className="pl-5 space-y-1 text-xs" style={{ borderLeft: `1px solid ${C.border}` }}>
                            {[
                              { to: '/services', label: 'Services Suite' },
                              { to: '/services/legal-verification', label: 'Legal Verification' },
                              { to: '/services/home-financing', label: 'Home Financing' },
                              { to: '/services/interior-design', label: 'Interior Design' },
                            ].map(sub => (
                              <Link
                                key={sub.to}
                                to={sub.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-1 font-medium transition-colors"
                                style={{ color: C.blackCoral }}
                                onMouseEnter={e => e.currentTarget.style.color = C.arsenic}
                                onMouseLeave={e => e.currentTarget.style.color = C.blackCoral}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div key={idx} variants={drawerItemVariants}>
                        <Link
                          to={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 px-3 rounded-lg text-sm font-bold outline-none transition-colors"
                          style={{
                            color: isLinkActive(link) ? C.darkVanilla : C.arsenic,
                            background: isLinkActive(link) ? 'rgba(207,182,168,0.12)' : 'transparent',
                          }}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>
              </div>

              {/* Drawer Footer */}
              <div className="space-y-3 pt-5" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-4 justify-around mb-1">
                  {currentUser && (
                    <>
                      <Link
                        to="/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="relative p-2 rounded-full transition-colors outline-none"
                        style={{ color: C.blackCoral }}
                        onMouseEnter={e => e.currentTarget.style.background = C.white}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        aria-label="View wishlist"
                      >
                        <Heart className="w-5 h-5" />
                      </Link>
                      <Link
                        to="/compare"
                        onClick={() => setMobileMenuOpen(false)}
                        className="relative p-2 rounded-full transition-colors outline-none"
                        style={{ color: C.blackCoral }}
                        onMouseEnter={e => e.currentTarget.style.background = C.white}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        aria-label="Compare properties"
                      >
                        <Scale className="w-5 h-5" />
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => { setMobileMenuOpen(false); setNotificationsOpen(true); }}
                    className="relative p-2 rounded-full transition-colors cursor-pointer outline-none"
                    style={{ color: C.blackCoral }}
                    onMouseEnter={e => e.currentTarget.style.background = C.white}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: C.darkVanilla }} />
                    )}
                  </button>
                </div>

                {currentUser ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold tracking-wider uppercase cursor-pointer outline-none transition-all"
                    style={{ background: C.arsenic, color: C.white, borderRadius: 6 }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: C.darkVanilla }} />
                    PORTFOLIO DASHBOARD
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold tracking-wider uppercase cursor-pointer outline-none transition-all"
                    style={{
                      background: C.white,
                      color: C.arsenic,
                      border: `1px solid ${C.border}`,
                      borderRadius: 6,
                    }}
                  >
                    <User className="w-4 h-4" style={{ color: C.darkVanilla }} />
                    SIGN IN
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
