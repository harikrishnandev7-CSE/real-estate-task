import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Heart, Bell, Menu, X, ChevronDown, User, Sparkles, Building, MapPin, Scale, Calendar, TrendingUp, Trash2, Settings, ShieldCheck } from 'lucide-react';
import ImageWithSkeleton from './ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import ImperiaLogo from './ImperiaLogo';


const Navbar = () => {
  const { openBookModal, showToast, currentUser, logoutUser, notifications = [], markNotificationRead, markAllNotificationsRead, deleteNotification } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'luxury' | 'projects' | null
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

  // Monitor scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside and escape key notification closure
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopNotifRef.current && !desktopNotifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
      }
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

  // Click outside and escape key inline search closure
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inlineSearchRef.current && !inlineSearchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
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

  // Click outside and escape key account dropdown closure
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
      }
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

  // Page Load Header Animation variants
  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  // Mega Menu Entry/Exit curves
  const megaMenuVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 10, 
      scale: 0.98,
      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      transition: { 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 8, 
      scale: 0.98,
      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)",
      transition: { 
        duration: 0.22, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  // Dropdown variants for Framer Motion with Origin Top Right, duration 250ms, spring curve
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: shouldReduceMotion ? 0 : 8,
      transition: { duration: 0.15, ease: 'easeOut' }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 250, 
        damping: 25,
        duration: 0.25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: shouldReduceMotion ? 0 : 8,
      transition: { duration: 0.15, ease: 'easeIn' }
    }
  };

  // Mobile drawer staggered animations
  const drawerVariants = {
    hidden: { 
      x: '100%',
      transition: { 
        type: 'spring', 
        damping: 30, 
        stiffness: 300 
      } 
    },
    visible: { 
      x: 0, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 200,
        staggerChildren: 0.05,
        delayChildren: 0.05
      } 
    }
  };

  const drawerItemVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 150, 
        damping: 20 
      } 
    }
  };

  const navLinks = [
    { name: 'Buy', href: '/buy' },
    { name: 'Rent', href: '/rent' },
    { name: 'Projects', href: '/projects', type: 'projects' },
    { name: 'Compare', href: '/compare' },
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

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 h-[64px] lg:h-[72px] flex items-center ${
          isScrolled 
            ? 'bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#E8E4DA] shadow-md' 
            : 'bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#E8E4DA]/60'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 flex items-center justify-between gap-2 xl:gap-4 relative h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-start shrink-0">
            <Link to="/" className="flex items-center group" aria-label="IMPERIA – home">
              {/* Icon-only at lg, full horizontal lockup at xl+ */}
              <ImperiaLogo
                layout="icon"
                variant="dark"
                height={32}
                className="xl:hidden transition-opacity duration-300 group-hover:opacity-75"
              />
              <ImperiaLogo
                layout="lockup"
                variant="dark"
                height={32}
                className="hidden xl:block transition-opacity duration-300 group-hover:opacity-75"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-6 flex-1 mx-1 xl:mx-4">
            {navLinks.map((link, idx) => {
              if (link.type === 'projects') {
                return (
                  <div 
                    key={idx}
                    className="relative py-2"
                    onMouseEnter={() => {
                      setActiveMegaMenu('projects');
                      setHoveredIndex(idx);
                    }}
                    onMouseLeave={() => {
                      setActiveMegaMenu(null);
                      setHoveredIndex(null);
                    }}
                  >
                    <button 
                      onClick={() => navigate('/projects')}
                      className={`relative flex items-center gap-1 font-sans text-[13px] font-bold tracking-[0.06em] uppercase transition-colors duration-300 py-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50 rounded px-1 ${
                        isLinkActive(link) ? 'text-[#1A1A1A]' : 'text-[#2B2926] hover:text-[#F5A623]'
                      }`}
                    >
                      Projects <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMegaMenu === 'projects' ? 'rotate-180' : ''}`} />
                      {isLinkActive(link) && (
                        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                      )}
                      {hoveredIndex === idx && (
                        <motion.span 
                          layoutId="navUnderline" 
                          className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[#F5A623]"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
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
                          className="absolute left-1/2 -translate-x-1/2 top-full w-[600px] bg-white border border-[#E8E4DA] p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] mt-2 grid grid-cols-2 gap-8 font-sans"
                        >
                          <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold mb-4 font-sans">Our Collections</h4>
                            <ul className="space-y-3">
                              <li>
                                <Link to="/architectural-villas" onClick={() => setActiveMegaMenu(null)} className="group flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-amber-50 text-[#F5A623] group-hover:bg-[#F5A623] group-hover:text-white transition-colors">
                                    <Building className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors font-sans">Architectural Villas</p>
                                    <p className="text-xs text-[#8A8A85] font-sans">Custom mansions with infinity pools</p>
                                  </div>
                                </Link>
                              </li>
                              <li>
                                <Link to="/sky-apartments" onClick={() => setActiveMegaMenu(null)} className="group flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-amber-50 text-[#F5A623] group-hover:bg-[#F5A623] group-hover:text-white transition-colors">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors font-sans">Sky Apartments</p>
                                    <p className="text-xs text-[#8A8A85] font-sans">Penthouse condos with skyline views</p>
                                  </div>
                                </Link>
                              </li>
                              <li>
                                <Link to="/premium-plots" onClick={() => setActiveMegaMenu(null)} className="group flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-amber-50 text-[#F5A623] group-hover:bg-[#F5A623] group-hover:text-white transition-colors">
                                    <MapPin className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors font-sans">Premium Plots</p>
                                    <p className="text-xs text-[#8A8A85] font-sans">Gated layout lands & investment plots</p>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="relative rounded-xl overflow-hidden group border border-[#E8E4DA]">
                            <ImageWithSkeleton 
                              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80" 
                              alt="Project Showcase"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end z-20">
                              <p className="text-xs uppercase tracking-widest text-amber-300 font-bold font-sans">New Launch</p>
                              <p className="text-sm font-bold text-white font-sans">Elysian Hills Estate</p>
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
                    onMouseEnter={() => {
                      setActiveMegaMenu('services');
                      setHoveredIndex(idx);
                    }}
                    onMouseLeave={() => {
                      setActiveMegaMenu(null);
                      setHoveredIndex(null);
                    }}
                  >
                    <button 
                      className={`text-[13px] font-bold tracking-[0.06em] uppercase transition-colors duration-300 py-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50 rounded px-1 flex items-center gap-1 ${
                        activeMegaMenu === 'services' ? 'text-[#1A1A1A]' : 'text-[#2B2926] hover:text-[#F5A623]'
                      }`}
                    >
                      {link.name} <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMegaMenu === 'services' ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {activeMegaMenu === 'services' && (
                        <motion.div
                          variants={megaMenuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute left-1/2 -translate-x-1/2 top-full w-[650px] bg-white border border-[#E8E4DA] p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] mt-2 grid grid-cols-2 gap-4 font-sans text-left"
                        >
                          <Link 
                            to="/services" 
                            onClick={() => setActiveMegaMenu(null)}
                            className="p-3.5 rounded-xl bg-[#F4F1EA] hover:bg-amber-50/60 border border-[#E8E4DA] hover:border-[#F5A623] transition-all duration-200 group flex items-start gap-3"
                          >
                            <div className="p-2 rounded-lg bg-amber-100 text-[#F5A623] shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors">Services Suite</p>
                              <p className="text-xs text-[#8A8A85] font-normal mt-0.5 leading-relaxed">Full-spectrum concierge & advisory catalogue</p>
                            </div>
                          </Link>

                          <Link 
                            to="/services/legal-verification" 
                            onClick={() => setActiveMegaMenu(null)}
                            className="p-3.5 rounded-xl bg-[#F4F1EA] hover:bg-amber-50/60 border border-[#E8E4DA] hover:border-[#F5A623] transition-all duration-200 group flex items-start gap-3"
                          >
                            <div className="p-2 rounded-lg bg-amber-100 text-[#F5A623] shrink-0">
                              <Scale className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors">Legal Verification</p>
                              <p className="text-xs text-[#8A8A85] font-normal mt-0.5 leading-relaxed">30-Year title search & EC clearance audits</p>
                            </div>
                          </Link>

                          <Link 
                            to="/services/home-financing" 
                            onClick={() => setActiveMegaMenu(null)}
                            className="p-3.5 rounded-xl bg-[#F4F1EA] hover:bg-amber-50/60 border border-[#E8E4DA] hover:border-[#F5A623] transition-all duration-200 group flex items-start gap-3"
                          >
                            <div className="p-2 rounded-lg bg-amber-100 text-[#F5A623] shrink-0">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors">Home Financing</p>
                              <p className="text-xs text-[#8A8A85] font-normal mt-0.5 leading-relaxed">Private bank debt placement & 48-hr loans</p>
                            </div>
                          </Link>

                          <Link 
                            to="/services/interior-design" 
                            onClick={() => setActiveMegaMenu(null)}
                            className="p-3.5 rounded-xl bg-[#F4F1EA] hover:bg-amber-50/60 border border-[#E8E4DA] hover:border-[#F5A623] transition-all duration-200 group flex items-start gap-3"
                          >
                            <div className="p-2 rounded-lg bg-amber-100 text-[#F5A623] shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors">Interior Design</p>
                              <p className="text-xs text-[#8A8A85] font-normal mt-0.5 leading-relaxed">Italian marble & smart home automation</p>
                            </div>
                          </Link>
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
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative font-sans text-[13px] font-bold tracking-[0.06em] uppercase transition-colors duration-300 py-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50 rounded px-1.5 ${
                    isLinkActive(link) ? 'text-[#1A1A1A]' : 'text-[#2B2926] hover:text-[#F5A623]'
                  }`}
                >
                  {link.name}
                  {isLinkActive(link) && (
                    <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                  )}
                  {hoveredIndex === idx && (
                    <motion.span 
                      layoutId="navUnderline" 
                      className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-[#F5A623]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="hidden lg:flex items-center justify-end gap-1.5 xl:gap-3 shrink-0">
            {/* Search Icon Trigger */}
            <div className="relative flex items-center shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="text-[#2B2926] hover:text-[#F5A623] transition-colors duration-300 cursor-pointer outline-none p-1.5 rounded-full flex items-center justify-center font-bold"
                aria-label="Search properties"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </motion.button>
            </div>

            {/* Account Trigger & Dropdown */}
            <div className="relative" ref={accountRef}>
              <motion.button
                onClick={() => setAccountOpen(!accountOpen)}
                whileHover={{ opacity: 0.8 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#2B2926] hover:text-[#F5A623] transition-colors duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50 p-1.5 rounded-full flex items-center justify-center gap-1.5 font-bold"
                aria-label="Account menu"
              >
                <User className="w-5 h-5 stroke-[2] text-[#F5A623]" />
                {/* Show name only at xl+ so it doesn't compete for space at lg */}
                <span className="hidden xl:inline font-sans text-[11px] font-extrabold tracking-[0.1em] uppercase text-[#1A1A1A]">
                  {currentUser ? (currentUser.name || currentUser.fullName || 'Member').split(' ')[0] : 'ACCOUNT'}
                </span>
              </motion.button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 mt-3 w-60 bg-white border border-[#E8E4DA] rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-[100] font-sans text-left"
                  >
                    {currentUser ? (
                      <>
                        <div className="px-3 py-2.5 border-b border-[#E8E4DA] mb-1.5 text-left font-sans">
                          <p className="text-[10px] uppercase tracking-wider text-[#F5A623] font-bold">VIP Member</p>
                          <p className="text-xs text-[#1A1A1A] font-bold truncate mt-0.5">{currentUser.name}</p>
                          <p className="text-[10px] text-[#8A8A85] truncate font-medium">{currentUser.email}</p>
                        </div>

                        <ul className="space-y-0.5 text-xs text-[#1A1A1A] font-medium font-sans">
                          {(currentUser.role === 'admin' || currentUser.isAdmin) && (
                            <li>
                              <Link
                                to="/admin"
                                onClick={() => setAccountOpen(false)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#1A1A1A] font-bold border border-amber-200 transition-colors text-left mb-1"
                              >
                                <ShieldCheck className="w-4 h-4 text-[#F5A623] shrink-0" />
                                <span>Admin Control Panel</span>
                              </Link>
                            </li>
                          )}
                          <li>
                            <Link
                              to="/dashboard"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F1EA] hover:text-[#1A1A1A] transition-colors text-left"
                            >
                              <Sparkles className="w-4 h-4 text-[#F5A623] shrink-0" />
                              <span>Portfolio Dashboard</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/profile"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F1EA] hover:text-[#1A1A1A] transition-colors text-left"
                            >
                              <User className="w-4 h-4 text-[#F5A623] shrink-0" />
                              <span>Profile & Preferences</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/notifications"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F1EA] hover:text-[#1A1A1A] transition-colors text-left"
                            >
                              <Bell className="w-4 h-4 text-[#F5A623] shrink-0" />
                              <span>Notifications</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/wishlist"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F1EA] hover:text-[#1A1A1A] transition-colors text-left"
                            >
                              <Heart className="w-4 h-4 text-[#F5A623] shrink-0" />
                              <span>Wishlist</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/compare"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F1EA] hover:text-[#1A1A1A] transition-colors text-left"
                            >
                              <Scale className="w-4 h-4 text-[#F5A623] shrink-0" />
                              <span>Compare Properties</span>
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                logoutUser();
                                setAccountOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer font-bold"
                            >
                              <span>Log Out</span>
                            </button>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 border-b border-[#E8E4DA] mb-1.5 text-left font-sans">
                          <p className="text-[10px] uppercase tracking-wider text-[#F5A623] font-bold">VIP Privilege</p>
                          <p className="text-xs text-[#8A8A85] font-normal mt-0.5">Sign in to access personalized luxury recommendations</p>
                        </div>
                        <ul className="space-y-1.5 text-xs p-1 font-sans">
                          <li>
                            <Link
                              to="/login"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center justify-center py-2.5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl uppercase tracking-wider text-[11px] shadow-xs"
                            >
                              Log In
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/signup"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center justify-center py-2.5 border border-[#E8E4DA] bg-[#F4F1EA] text-[#1A1A1A] font-bold rounded-xl hover:border-[#1A1A1A] uppercase tracking-wider text-[11px]"
                            >
                              Create Account
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/login"
                              onClick={() => setAccountOpen(false)}
                              className="w-full flex items-center justify-center gap-2 py-2 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-[#1A1A1A] font-bold rounded-xl uppercase tracking-wider text-[10px] transition-all"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#F5A623]" />
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

            {/* Notifications Trigger & Overlay Panel */}
            <div className="relative" ref={bellRef}>
              <motion.button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                whileHover={{ opacity: 0.8 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#8A8A85] hover:text-[#1A1A1A] transition-colors duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50 p-1.5 rounded-full flex items-center justify-center relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 stroke-[1.5]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F5A623]"></span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    ref={desktopNotifRef}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 mt-3 w-[400px] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)] rounded-[24px] border border-[#E8E4DA] p-5 z-[100] text-left font-sans text-[#1A1A1A]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-3 mb-4 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base tracking-tight text-[#1A1A1A]">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider bg-amber-50 text-[#F5A623] border border-amber-200 rounded-full uppercase">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllRead} 
                            className="text-[#F5A623] hover:text-[#1A1A1A] text-xs font-bold tracking-wide transition-colors cursor-pointer outline-none focus-visible:underline"
                          >
                            Mark all as read
                          </button>
                        )}
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="p-1 rounded-full hover:bg-[#F4F1EA] text-[#8A8A85] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none"
                          aria-label="Close notifications"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notification Cards */}
                    {notifications.length === 0 ? (
                      <div className="py-10 flex flex-col items-center justify-center text-center space-y-3 font-sans">
                        <div className="p-3.5 rounded-full bg-[#F4F1EA] text-[#8A8A85] border border-[#E8E4DA]">
                          <Bell className="w-8 h-8 stroke-[1.2]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A] tracking-wide">No new notifications</p>
                          <p className="text-xs text-[#8A8A85] mt-1 font-normal font-sans">Everything is up to date.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-[320px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar font-sans">
                        {notifications.map((notif) => {
                          const Icon = notif.type === 'villa' ? Building :
                                       notif.type === 'visit' ? Calendar :
                                       notif.type === 'price' ? TrendingUp : Sparkles;
                          return (
                            <motion.div
                              key={notif.id}
                              whileHover={{ y: -2 }}
                              onClick={() => handleNotificationClick(notif)}
                              className={`group flex items-start text-left gap-3.5 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                notif.read 
                                  ? 'bg-[#F4F1EA]/50 border-[#E8E4DA] text-[#8A8A85] hover:bg-[#F4F1EA]' 
                                  : 'bg-white border-[#E8E4DA] text-[#1A1A1A] hover:border-[#F5A623] shadow-xs'
                              }`}
                            >
                              <div className={`p-2 rounded-xl border shrink-0 ${
                                notif.read 
                                  ? 'bg-[#F4F1EA] border-[#E8E4DA] text-[#8A8A85]' 
                                  : 'bg-amber-50 border-amber-200 text-[#F5A623]'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className={`text-xs font-bold tracking-tight ${notif.read ? 'text-[#8A8A85]' : 'text-[#1A1A1A]'}`}>
                                  {notif.title}
                                </h5>
                                <p className="text-[11px] text-[#8A8A85] mt-0.5 leading-relaxed truncate font-sans font-normal">
                                  {notif.desc}
                                </p>
                                <span className="text-[9px] text-[#8A8A85] mt-1.5 block font-medium font-sans">
                                  {notif.time}
                                </span>
                              </div>
                              <div className="flex flex-col items-center justify-between self-stretch shrink-0">
                                {!notif.read ? (
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623] mt-1"></span>
                                ) : (
                                  <div className="w-1.5 h-1.5"></div>
                                )}
                                <button
                                  onClick={(e) => handleDeleteNotification(notif.id, e)}
                                  className="text-[#8A8A85] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50 cursor-pointer outline-none focus-visible:opacity-100"
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

          {/* Mobile Menu Controls */}
          <div className="flex items-center gap-3 lg:hidden shrink-0">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                setAccountOpen(!accountOpen);
              }}
              className="text-[#8A8A85] hover:text-[#1A1A1A] transition-colors duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50 p-1.5 rounded-full flex items-center justify-center relative animate-none"
              aria-label="Account menu"
            >
              <User className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F5A623]"></span>
              )}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-[#8A8A85] hover:text-[#1A1A1A] transition-colors duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50 p-1.5 rounded-full flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Search Overlay */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                ref={inlineSearchRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-[#F4F1EA]/98 backdrop-blur-lg px-6 md:px-12 flex items-center justify-between z-50 gap-6 rounded-b-2xl border-b border-[#E8E4DA] h-full"
              >
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3.5 max-w-3xl mx-auto w-full relative">
                  <Search className="w-5 h-5 text-[#F5A623] shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search properties, cities, or projects..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-transparent border-b border-transparent focus:border-[#F5A623]/30 py-2.5 text-sm text-[#1A1A1A] placeholder-[#8A8A85] focus:outline-none font-sans font-bold tracking-wide"
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={() => setSearchVal('')}
                      className="text-[#8A8A85] hover:text-[#1A1A1A] transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A8A85] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-all cursor-pointer py-2 px-5 border border-[#E8E4DA] rounded-full bg-white/70 shadow-xs"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Floating Inline Search Bar Expansion */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm lg:hidden"
            />
            <motion.form
              onSubmit={handleSearchSubmit}
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-24 left-1/2 w-[90%] md:w-[600px] z-40 glass p-4 rounded-2xl shadow-2xl flex items-center gap-3 lg:hidden"
            >
              <Search className="text-gold-400 w-5 h-5 shrink-0" />
              <input 
                type="text" 
                placeholder="Search properties, neighborhoods, builders..." 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white placeholder-neutral-500 text-sm py-1 font-sans"
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />

            {/* Menu Panel */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 right-0 h-full w-[320px] bg-[#F4F1EA] border-l border-[#E8E4DA] z-50 p-6 flex flex-col justify-between text-[#1A1A1A]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4 mb-6">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-bold text-xl tracking-[0.2em] text-[#1A1A1A]">IMPERIA</Link>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-full hover:bg-stone-200 text-[#8A8A85] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Drawer Search Bar */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="w-full relative flex items-center bg-white border border-[#E8E4DA] rounded-xl p-2.5 mb-6 text-sm shadow-xs"
                >
                  <Search className="text-[#F5A623] w-4 h-4 shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-[#1A1A1A] placeholder-[#8A8A85] text-xs py-0.5 font-sans font-medium"
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={() => setSearchVal('')}
                      className="absolute right-3 text-[#8A8A85] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                <motion.nav className="space-y-4 font-sans">
                  {navLinks.map((link, idx) => {
                    if (link.type === 'services') {
                      return (
                        <motion.div key={idx} variants={drawerItemVariants} className="space-y-1">
                          <Link 
                            to="/services" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className={`block py-1 text-lg transition-colors font-bold outline-none focus-visible:text-[#F5A623] ${
                              isLinkActive(link) ? 'text-[#F5A623]' : 'text-[#1A1A1A] hover:text-[#F5A623]'
                            }`}
                          >
                            Services
                          </Link>
                          <div className="pl-4 space-y-1.5 border-l border-[#E8E4DA] text-xs font-sans">
                            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block text-[#8A8A85] hover:text-[#1A1A1A] font-medium py-0.5">Services Suite</Link>
                            <Link to="/services/legal-verification" onClick={() => setMobileMenuOpen(false)} className="block text-[#8A8A85] hover:text-[#1A1A1A] font-medium py-0.5">Legal Verification</Link>
                            <Link to="/services/home-financing" onClick={() => setMobileMenuOpen(false)} className="block text-[#8A8A85] hover:text-[#1A1A1A] font-medium py-0.5">Home Financing</Link>
                            <Link to="/services/interior-design" onClick={() => setMobileMenuOpen(false)} className="block text-[#8A8A85] hover:text-[#1A1A1A] font-medium py-0.5">Interior Design</Link>
                          </div>
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div key={idx} variants={drawerItemVariants}>
                        <Link 
                          to={link.href} 
                          onClick={() => setMobileMenuOpen(false)} 
                          className={`block py-2 text-lg transition-colors font-bold outline-none focus-visible:text-[#F5A623] ${
                            isLinkActive(link) ? 'text-[#F5A623]' : 'text-[#1A1A1A] hover:text-[#F5A623]'
                          }`}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>
              </div>

              <div className="space-y-4 border-t border-[#E8E4DA] pt-6 font-sans">
                <div className="flex items-center gap-4 justify-around mb-2">
                  <Link 
                    to="/wishlist" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[#8A8A85] hover:text-[#1A1A1A] transition-colors relative p-2 rounded-full hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50"
                    aria-label="View wishlist"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F5A623]"></span>
                  </Link>
                  <Link 
                    to="/compare" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-[#8A8A85] hover:text-[#1A1A1A] transition-colors relative p-2 rounded-full hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50"
                    aria-label="Compare properties"
                  >
                    <Scale className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setNotificationsOpen(true);
                    }}
                    className="text-[#8A8A85] hover:text-[#1A1A1A] transition-colors relative p-2 rounded-full hover:bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50 cursor-pointer"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F5A623]"></span>
                    )}
                  </button>
                </div>
                
                {currentUser ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-[#E8E4DA] bg-[#1A1A1A] hover:bg-black text-xs font-bold tracking-wider text-white rounded-full transition-all outline-none shadow-md cursor-pointer uppercase"
                  >
                    <Sparkles className="w-4 h-4 text-[#F5A623]" />
                    PORTFOLIO DASHBOARD
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-[#E8E4DA] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] text-xs font-bold tracking-wider rounded-full transition-all outline-none shadow-xs cursor-pointer uppercase"
                  >
                    <User className="w-4 h-4 text-[#F5A623]" />
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
