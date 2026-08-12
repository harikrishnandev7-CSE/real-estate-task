import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Heart, Bell, Menu, X, ChevronDown, User, Sparkles, Building, MapPin, Scale, TrendingUp, Trash2, LayoutDashboard, Calendar, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImperiaLogo from './ImperiaLogo';

// ── Luxury Design System Constants ──────────────────────────────────────────
const C = {
  ink:           '#0B0B0B',
  graphite:      '#6B6B6B',
  accent:        '#C6A66B',
  bone:          '#F8F6F2',
  paper:         '#FFFFFF',
  hairline:      'rgba(198,166,107,0.20)',
  hairlineStrong:'rgba(198,166,107,0.35)',
  muted:         'rgba(107,107,107,0.65)',
};

const Navbar = () => {
  const { openBookModal, currentUser, logoutUser, wishlist = [], compareList = [], notifications = [] } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const desktopNotifRef = useRef(null);
  const accountRef = useRef(null);
  const [accountOpen, setAccountOpen] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
  const compareCount = Array.isArray(compareList) ? compareList.length : 0;

  const isLinkActive = (link) => {
    if (link.href === '/services') {
      return location.pathname.startsWith('/services');
    }
    if (link.href === '/insights') {
      return location.pathname === '/insights' || location.pathname === '/blog';
    }
    return location.pathname === link.href;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopNotifRef.current && !desktopNotifRef.current.contains(event.target)) {
        // notification close
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  const megaMenuVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : 6, transition: { duration: 0.2 } }
  };

  const navLinks = [
    { name: 'Buy', href: '/buy' },
    { name: 'Rent', href: '/rent' },
    { name: 'Projects', href: '/projects', type: 'projects' },
    { name: 'Services', href: '/services', type: 'services' },
    { name: 'Insights', href: '/insights' },
  ];

  const navLinkStyle = (active) => ({
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: active ? '#C9A96E' : '#F4F1EA',
    transition: 'color 0.25s ease',
  });

  const megaCardStyle = {
    background: '#141416',
    border: '1px solid rgba(201, 169, 110, 0.25)',
    borderRadius: 8,
    boxShadow: '0 24px 48px rgba(0,0,0,0.50)',
    padding: '1.5rem',
  };

  const iconBtnCls = 'p-2 rounded-full transition-colors duration-200 cursor-pointer outline-none flex items-center justify-center relative';

  const isHome = location.pathname === '/';

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex items-center ${
          isScrolled || !isHome
            ? 'h-[72px] lg:h-[78px] bg-[#0E0E10]/95 backdrop-blur-md border-b border-[rgba(201,169,110,0.20)] shadow-2xl'
            : 'h-[88px] lg:h-[96px] bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 flex items-center justify-between gap-4 relative h-full">

          {/* Logo */}
          <div className="flex items-center justify-start shrink-0">
            <Link to="/" className="flex items-center group" aria-label="IMPERIA – home">
              <ImperiaLogo
                layout="icon"
                variant="light"
                height={isScrolled ? 26 : 32}
                className="xl:hidden transition-all duration-300 group-hover:opacity-80"
              />
              <ImperiaLogo
                layout="lockup"
                variant="light"
                height={isScrolled ? 26 : 32}
                className="hidden xl:block transition-all duration-300 group-hover:opacity-80"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-10 flex-1 mx-4">
            {navLinks.map((link, idx) => {
              if (link.type === 'projects') {
                return (
                  <div
                    key={idx}
                    className="relative py-2"
                    onMouseEnter={() => setActiveMegaMenu('projects')}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <button
                      onClick={() => navigate('/projects')}
                      className="relative flex items-center gap-1 py-1 px-1 cursor-pointer outline-none transition-colors"
                      style={navLinkStyle(isLinkActive(link))}
                      onMouseEnter={e => { e.currentTarget.style.color = '#C9A96E'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = (isLinkActive(link) || activeMegaMenu === 'projects') ? '#C9A96E' : '#F4F1EA'; }}
                    >
                      Projects
                      <ChevronDown
                        className="transition-transform duration-300"
                        style={{ width: 12, height: 12, transform: activeMegaMenu === 'projects' ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                      {isLinkActive(link) && (
                        <span
                          className="absolute -bottom-[20px] left-0 right-0 h-0.5"
                          style={{ background: '#C9A96E' }}
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
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[520px] grid grid-cols-2 gap-6"
                          style={megaCardStyle}
                        >
                          <div>
                            <p className="eyebrow-accent mb-3 text-[#C9A96E]">Our Collections</p>
                            <ul className="space-y-3">
                              {[
                                { to: '/projects', icon: Building, title: 'Architectural Villas', sub: 'Custom estates & oceanfront villas' },
                                { to: '/projects', icon: Sparkles, title: 'Sky Apartments', sub: 'Penthouse condos with panoramic views' },
                                { to: '/projects', icon: MapPin, title: 'Landmark Developments', sub: 'Master-planned luxury communities' },
                              ].map((item, i) => (
                                <li key={i}>
                                  <Link
                                    to={item.to}
                                    onClick={() => setActiveMegaMenu(null)}
                                    className="group flex items-start gap-3 p-1.5 rounded-md hover:bg-white/5 transition-colors"
                                  >
                                    <item.icon className="w-4 h-4 mt-0.5 text-[#C9A96E]" />
                                    <div>
                                      <p className="text-xs font-bold text-[#F4F1EA]">{item.title}</p>
                                      <p className="text-[11px] text-[#A09D96] mt-0.5">{item.sub}</p>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="relative rounded-md overflow-hidden group border border-[rgba(201,169,110,0.2)]">
                            <img
                              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                              alt="Project Showcase"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                              <p className="eyebrow-accent text-[#C9A96E]">Curated Landmark</p>
                              <p className="text-sm font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Elysian Hills Estate</p>
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
                    onMouseEnter={() => setActiveMegaMenu('services')}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <button
                      onClick={() => navigate('/services')}
                      className="flex items-center gap-1 py-1 px-1 cursor-pointer outline-none transition-colors"
                      style={navLinkStyle(activeMegaMenu === 'services' || isLinkActive(link))}
                      onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                      onMouseLeave={e => { e.currentTarget.style.color = (activeMegaMenu === 'services' || isLinkActive(link)) ? '#C9A96E' : '#F4F1EA'; }}
                    >
                      Services
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
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[560px] grid grid-cols-2 gap-2 text-left"
                          style={megaCardStyle}
                        >
                          {[
                            { to: '/services', icon: Sparkles, title: 'Services Suite', sub: 'Full concierge & private office catalogue' },
                            { to: '/services/legal-verification', icon: Scale, title: 'Legal Verification', sub: '30-Year title search & EC clearance' },
                            { to: '/services/home-financing', icon: TrendingUp, title: 'Home Financing', sub: 'Private bank debt placement & loans' },
                            { to: '/services/interior-design', icon: Sparkles, title: 'Interior Architecture', sub: 'Turnkey luxury interiors' },
                          ].map((item, i) => (
                            <Link
                              key={i}
                              to={item.to}
                              onClick={() => setActiveMegaMenu(null)}
                              className="p-3 rounded-md flex items-start gap-3 hover:bg-white/5 border border-[rgba(201,169,110,0.15)] transition-all"
                            >
                              <item.icon className="w-4 h-4 mt-0.5 shrink-0 text-[#C9A96E]" />
                              <div>
                                <p className="text-xs font-bold text-[#F4F1EA]">{item.title}</p>
                                <p className="text-[11px] text-[#A09D96] mt-0.5 leading-relaxed">{item.sub}</p>
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
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#C9A96E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isLinkActive(link) ? '#C9A96E' : '#F4F1EA'; }}
                  className="relative py-2 px-1 cursor-pointer outline-none transition-colors"
                  style={navLinkStyle(isLinkActive(link))}
                >
                  {link.name}
                  {isLinkActive(link) && (
                    <span
                      className="absolute -bottom-[20px] left-0 right-0 h-0.5"
                      style={{ background: '#C9A96E' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls (Wishlist + Compare + Account Icon + Book a Visit CTA) */}
          <div className="hidden lg:flex items-center justify-end gap-4 shrink-0">
            {/* Wishlist Quick Link Icon */}
            <Link
              to="/wishlist"
              className={iconBtnCls}
              title="My Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.8] text-[#F4F1EA] hover:text-[#C9A96E] transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A96E] text-[#0B0B0B] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Compare Quick Link Icon */}
            <Link
              to="/compare"
              className={iconBtnCls}
              title="Compare Properties"
              aria-label="Compare Properties"
            >
              <Scale className="w-5 h-5 stroke-[1.8] text-[#F4F1EA] hover:text-[#C9A96E] transition-colors" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A96E] text-[#0B0B0B] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Account Icon Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => currentUser ? setAccountOpen(!accountOpen) : navigate('/login')}
                className={iconBtnCls}
                aria-label={currentUser ? 'Account menu' : 'Log in'}
              >
                <User className="w-5 h-5 stroke-[1.8] text-[#F4F1EA] hover:text-[#C9A96E] transition-colors" />
              </button>

              <AnimatePresence>
                {accountOpen && currentUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-[#141416] border border-[rgba(201,169,110,0.25)] rounded-xl shadow-2xl p-3 text-xs font-sans z-50"
                  >
                    <div className="px-3 py-2 border-b border-[rgba(201,169,110,0.2)] mb-1">
                      <p className="font-bold text-[#F4F1EA] truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-[#A09D96] truncate">{currentUser.email}</p>
                    </div>

                    {currentUser.role === 'admin' && (
                      <Link to="/admin" onClick={() => setAccountOpen(false)} className="block px-3 py-2 rounded-lg text-[#F4F1EA] hover:bg-white/5 font-extrabold border-b border-[rgba(201,169,110,0.15)] mb-1">
                        Admin Portal
                      </Link>
                    )}

                    <Link to="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-lg text-[#F4F1EA] hover:bg-white/5 font-semibold">
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#C9A96E]" />
                        VIP Dashboard
                      </span>
                    </Link>

                    <Link to="/profile" onClick={() => setAccountOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-lg text-[#F4F1EA] hover:bg-white/5 font-semibold">
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#A09D96]" />
                        Profile Settings
                      </span>
                    </Link>

                    <Link to="/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-lg text-[#F4F1EA] hover:bg-white/5 font-semibold">
                      <span className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        My Wishlist
                      </span>
                      {wishlistCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-[#C9A96E] text-[#0B0B0B] text-[10px] font-bold rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link to="/compare" onClick={() => setAccountOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-lg text-[#F4F1EA] hover:bg-white/5 font-semibold">
                      <span className="flex items-center gap-2">
                        <Scale className="w-3.5 h-3.5 text-[#C9A96E]" />
                        Compare Estates
                      </span>
                      {compareCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-[#C9A96E] text-[#0B0B0B] text-[10px] font-bold rounded-full">
                          {compareCount}
                        </span>
                      )}
                    </Link>

                    <Link to="/my-bookings" onClick={() => setAccountOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-lg text-[#F4F1EA] hover:bg-white/5 font-semibold">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        My Bookings
                      </span>
                    </Link>

                    <button onClick={() => { logoutUser(); setAccountOpen(false); }} className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 font-bold mt-1 border-t border-[rgba(201,169,110,0.15)]">
                      <LogOut className="w-3.5 h-3.5" />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gold Outline to Solid Fill Luxury CTA Button */}
            <button
              onClick={openBookModal}
              className="border border-[#C9A96E] text-[#F4F1EA] hover:bg-[#C9A96E] hover:text-[#0B0B0B] rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer"
            >
              Book a Visit
            </button>
          </div>

          {/* Mobile Quick Wishlist/Compare & Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/wishlist" className="p-2 text-[#F4F1EA] hover:text-[#C9A96E] relative transition-colors" title="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C9A96E] text-[#0B0B0B] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#F4F1EA] hover:text-[#C9A96E] transition-colors duration-200 cursor-pointer outline-none flex items-center justify-center relative"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#F7F6F3] shadow-2xl p-6 pt-20 flex flex-col justify-between overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* User Info Header in Mobile Drawer */}
                {currentUser ? (
                  <div className="p-4 bg-white rounded-lg border border-[rgba(22,22,26,0.10)] shadow-xs">
                    <p className="font-bold text-[#16161a] text-sm">{currentUser.name}</p>
                    <p className="text-xs text-[#4a4a4f] truncate">{currentUser.email}</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2.5 text-center bg-[#16161a] text-white text-xs font-semibold uppercase tracking-wider rounded-md"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2.5 text-center border border-[rgba(22,22,26,0.20)] text-[#16161a] text-xs font-semibold uppercase tracking-wider rounded-md"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Primary Nav Links */}
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-[#A98A5B] tracking-wider mb-2">Explore</p>
                  {[
                    { name: 'Buy Properties', href: '/buy' },
                    { name: 'Rent Properties', href: '/rent' },
                    { name: 'Projects & Developments', href: '/projects' },
                    { name: 'Services Concierge', href: '/services' },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm font-semibold text-[#16161a] hover:text-[#A98A5B]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Account / User Portal Pages */}
                <div className="space-y-1 border-t border-[rgba(22,22,26,0.10)] pt-4">
                  <p className="text-[10px] uppercase font-bold text-[#A98A5B] tracking-wider mb-2">My Account</p>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium text-[#16161a]"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      My Wishlist
                    </span>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 bg-[#A98A5B] text-white text-[10px] font-bold rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-medium text-[#16161a]"
                  >
                    <span className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#16161a]" />
                      Compare Estates
                    </span>
                    {compareCount > 0 && (
                      <span className="px-2 py-0.5 bg-[#16161a] text-white text-[10px] font-bold rounded-full">
                        {compareCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-[#16161a]"
                  >
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    My Bookings
                  </Link>

                  {currentUser && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 text-sm font-medium text-[#16161a]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#A98A5B]" />
                        VIP Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 text-sm font-medium text-[#16161a]"
                      >
                        <User className="w-4 h-4 text-[#4a4a4f]" />
                        Profile Settings
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-3 pt-6 border-t border-[rgba(22,22,26,0.10)]">
                <button
                  onClick={() => { setMobileMenuOpen(false); openBookModal(); }}
                  className="w-full py-3 bg-[#16161a] hover:bg-[#A98A5B] text-white text-xs font-semibold uppercase tracking-wider rounded-md text-center"
                >
                  Book a Visit
                </button>
                {currentUser && (
                  <button
                    onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-center text-xs font-bold text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Log Out
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

