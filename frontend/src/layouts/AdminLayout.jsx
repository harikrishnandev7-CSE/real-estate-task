import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building, 
  PlusCircle, 
  HardHat, 
  Users, 
  Calendar, 
  Bell, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Sliders, 
  Layers,
  ChevronDown,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImperiaLogo from '../components/ImperiaLogo';

// Nav items configuration grouped by section
const NAV_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'INVENTORY',
    items: [
      { label: 'Properties', href: '/admin/properties', icon: Building },
      { label: 'Add Property', href: '/admin/properties/new', icon: PlusCircle },
      { label: 'Construction Updates', href: '/admin/construction', icon: HardHat }
    ]
  },
  {
    title: 'PEOPLE',
    items: [
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Consultants', href: '/admin/consultants', icon: Users },
      { label: 'Visit Calendar', href: '/admin/visit-calendar', icon: Calendar },
      { label: 'Site Visits', href: '/admin/site-visits', icon: Calendar }
    ]
  },
  {
    title: 'ENGAGEMENT',
    items: [
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Blogs', href: '/admin/blogs', icon: FileText }
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings }
    ]
  }
];

// Context for sidebar collapsed state
const AdminLayoutContext = createContext({
  collapsed: false,
  setCollapsed: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logoutUser, switchRole } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [adminNotifOpen, setAdminNotifOpen] = useState(false);
  const [adminProfileOpen, setAdminProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Stubbed admin notifications data
  const [adminAlerts, setAdminAlerts] = useState([
    { id: 1, title: 'New Site Visit Request', desc: 'Vikramaditya Roy requested tour for ECR Beachfront Villa', time: '10 mins ago', unread: true },
    { id: 2, title: 'RERA Document Verified', desc: 'Title clearance certificate uploaded for Skyline Towers', time: '1 hour ago', unread: true },
    { id: 3, title: 'Property Price Updated', desc: 'Golden Meadows price revised to ₹2.80 Cr', time: '3 hours ago', unread: false }
  ]);

  const unreadAlertsCount = adminAlerts.filter(a => a.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setAdminNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setAdminProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auth & Role Guard Check
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20 font-sans bg-[#F7F6F3]">
        <div className="max-w-md w-full p-8 text-center space-y-6 bg-white border border-[rgba(201,169,110,0.30)] rounded-2xl shadow-[0_20px_48px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-amber-50 border border-amber-200 text-[#C9A96E]">
            <Lock className="w-8 h-8 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#0B0B0B] tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Admin Login Required</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed font-semibold">
              You must be signed into an authorized admin or consultant account to view the IMPERIA Control Panel.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <Link
              to="/admin/login"
              className="w-full py-3.5 bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] text-xs font-extrabold tracking-widest uppercase rounded-xl shadow-md border border-[#C9A96E] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#C9A96E]" />
              <span>LOG IN TO ADMIN PORTAL</span>
            </Link>
            <Link
              to="/"
              className="w-full py-3 bg-[#F8F6F2] hover:bg-[#0E0E10] text-[#0B0B0B] hover:text-[#F4F1EA] text-xs font-bold tracking-wider uppercase rounded-xl border border-[rgba(201,169,110,0.30)] transition-all flex items-center justify-center cursor-pointer"
            >
              <span>RETURN TO MAIN SITE</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'customer') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20 font-sans bg-[#F7F6F3]">
        <div className="max-w-md w-full p-8 text-center space-y-6 bg-white border border-[rgba(201,169,110,0.30)] rounded-2xl shadow-[0_20px_48px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-rose-50 border border-rose-200 text-rose-600">
            <ShieldAlert className="w-8 h-8 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#0B0B0B] tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Access Denied</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed font-semibold">
              Your account currently has <span className="font-extrabold text-[#0B0B0B]">Customer</span> status. Admin or Consultant privileges are required to access this panel.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => switchRole('admin')}
              className="w-full py-3.5 bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] text-xs font-extrabold tracking-widest uppercase rounded-xl shadow-md border border-[#C9A96E] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C9A96E]" />
              <span>SWITCH ROLE TO ADMIN (DEMO)</span>
            </button>
            <Link
              to="/dashboard"
              className="w-full py-3 bg-[#F8F6F2] hover:bg-[#0E0E10] text-[#0B0B0B] hover:text-[#F4F1EA] text-xs font-bold tracking-wider uppercase rounded-xl border border-[rgba(201,169,110,0.30)] transition-all flex items-center justify-center cursor-pointer"
            >
              <span>GO TO CUSTOMER DASHBOARD</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active route matching helper (prevents dual selection when subroutes share prefixes)
  const isNavActive = (href) => {
    if (href === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    if (location.pathname === href) return true;

    // Check if another nav item matches location.pathname exactly
    const hasExactOtherMatch = NAV_GROUPS.some(group =>
      group.items.some(item => item.href === location.pathname)
    );
    if (hasExactOtherMatch) {
      return false;
    }

    return location.pathname.startsWith(href);
  };

  // Find page title for topbar
  const getPageTitle = () => {
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (isNavActive(item.href)) {
          return item.label;
        }
      }
    }
    return 'Admin Panel';
  };

  return (
    <AdminLayoutContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen font-sans flex flex-col md:flex-row bg-[#F7F6F3] text-[#0B0B0B]">
        
        {/* ── DESKTOP SIDEBAR ────────────────────────────────────────── */}
        <aside
          className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          } bg-[#0E0E10] border-r border-[rgba(201,169,110,0.20)] shadow-xl`}
        >
          {/* Sidebar Header / Logo */}
          <div className="h-16 px-4 flex items-center justify-between shrink-0 border-b border-[rgba(201,169,110,0.20)]">
            <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
              <ImperiaLogo layout="icon" variant="light" height={26} className="shrink-0" />
              {!collapsed && (
                <div className="flex flex-col font-sans whitespace-nowrap">
                  <span className="font-bold text-sm tracking-[0.18em] text-[#F4F1EA] leading-none">
                    IMPERIA
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#C9A96E] mt-1 leading-none">
                    ADMIN PANEL
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-[#F4F1EA]/70 hover:text-[#C9A96E] hover:bg-white/10 transition-all cursor-pointer shrink-0"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4 text-[#C9A96E]" /> : <ChevronLeft className="w-4 h-4 text-[#C9A96E]" />}
            </button>
          </div>

          {/* Navigation List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 space-y-6">
            {NAV_GROUPS.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!collapsed && (
                  <span className="text-[10px] uppercase tracking-widest font-extrabold px-3 block mb-2" style={{ color: '#C9A96E' }}>
                    {group.title}
                  </span>
                )}
                <ul className="space-y-1">
                  {group.items.map((item, iIdx) => {
                    const active = isNavActive(item.href);
                    const Icon = item.icon;
                    return (
                      <li key={iIdx}>
                        <Link
                          to={item.href}
                          title={collapsed ? item.label : undefined}
                          className="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                          style={{
                            background: active ? '#C9A96E' : 'transparent',
                            color: active ? '#0B0B0B' : '#F4F1EA',
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                              e.currentTarget.style.color = '#C9A96E';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#F4F1EA';
                            }
                          }}
                        >
                          {active && (
                            <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#0B0B0B]" />
                          )}
                          <Icon
                            className="w-4 h-4 shrink-0 stroke-[2]"
                            style={{ color: active ? '#0B0B0B' : '#C9A96E' }}
                          />
                          {!collapsed && (
                            <span className="truncate" style={{ color: active ? '#0B0B0B' : '#F4F1EA' }}>
                              {item.label}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar Footer: Sleek Icon Collapse Toggle */}
          <div className="p-3 shrink-0 border-t border-[rgba(201,169,110,0.20)] bg-[#141416]">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full py-2 flex items-center justify-center text-xs font-bold bg-[#0E0E10] hover:bg-white/10 border border-[rgba(201,169,110,0.25)] rounded-xl transition-all cursor-pointer"
              style={{ color: '#C9A96E' }}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}>
          
          {/* ── TOPBAR HEADER ───────────────────────────────────────── */}
          <header className="sticky top-0 z-30 h-16 px-6 lg:px-10 flex items-center justify-between gap-4 font-sans bg-[#0E0E10]/95 backdrop-blur-md border-b border-[rgba(201,169,110,0.20)] shadow-sm">
            {/* Left: Mobile Menu Trigger + Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-[#F4F1EA] hover:text-[#C9A96E] hover:bg-white/5 cursor-pointer transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-extrabold text-[#6B6B6B]">
                  <span>ADMIN</span>
                  <span>/</span>
                  <span className="text-[#C9A96E]">{getPageTitle()}</span>
                </div>
                <h1
                  className="text-base font-bold text-[#F4F1EA] tracking-tight leading-none mt-0.5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
                <input
                  type="text"
                  placeholder="Search admin entities..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="text-xs px-4 py-2 pl-9 focus:outline-none w-48 lg:w-64 transition-all rounded-xl bg-[#141416] border border-[rgba(201,169,110,0.25)] text-[#F4F1EA] placeholder-[#8A8A85] focus:border-[#C9A96E]"
                />
              </div>

              {/* Notifications Bell Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setAdminNotifOpen(!adminNotifOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center relative cursor-pointer transition-colors bg-[#141416] border border-[rgba(201,169,110,0.25)] text-[#F4F1EA] hover:text-[#C9A96E]"
                  aria-label="Admin Alerts"
                >
                  <Bell className="w-4 h-4 stroke-[1.8]" />
                  {unreadAlertsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C9A96E]" />
                  )}
                </button>

                <AnimatePresence>
                  {adminNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 z-50 text-left p-4 bg-[#141416] border border-[rgba(201,169,110,0.25)] rounded-2xl shadow-2xl"
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(201,169,110,0.20)]">
                        <span className="font-extrabold text-xs uppercase tracking-wider text-[#F4F1EA]">
                          Admin Alerts
                        </span>
                        {unreadAlertsCount > 0 && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-[#C9A96E] text-[#0B0B0B]">
                            {unreadAlertsCount} New
                          </span>
                        )}
                      </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      {adminAlerts.map(alert => (
                        <div
                          key={alert.id}
                          className="p-2.5 rounded-xl border text-xs bg-[#0E0E10] border-[rgba(201,169,110,0.20)]"
                        >
                          <p className="font-bold text-[#F4F1EA]">{alert.title}</p>
                          <p className="text-[11px] mt-0.5 leading-relaxed text-[#A09D96]">{alert.desc}</p>
                          <span className="text-[9px] mt-1 block font-medium text-[#C9A96E]">{alert.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown & Role Switcher */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setAdminProfileOpen(!adminProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full cursor-pointer transition-all bg-[#141416] hover:bg-[#1C1C20] border border-[rgba(201,169,110,0.25)] shadow-xs"
              >
                <div className="w-7 h-7 rounded-full font-extrabold text-xs flex items-center justify-center bg-[#C9A96E] text-[#0B0B0B] shadow-xs">
                  {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                </div>
                <span className="text-xs font-bold text-[#F4F1EA] hidden md:inline-block max-w-[100px] truncate">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'Admin'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#C9A96E] transition-transform duration-200 ${adminProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {adminProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-64 z-50 text-left p-3.5 bg-[#141416] border border-[rgba(201,169,110,0.30)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  >
                    {/* User Identity Header */}
                    <div className="px-3 py-2.5 mb-2.5 border-b border-[rgba(201,169,110,0.20)] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#C9A96E] text-[#0B0B0B] font-extrabold text-sm flex items-center justify-center shrink-0">
                        {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#F4F1EA] truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-[#A09D96] truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/40">
                          Role: {currentUser.role || 'Admin'}
                        </span>
                      </div>
                    </div>

                    {/* Role Switcher */}
                    <div className="px-3 py-1.5 mb-2.5 space-y-1.5 border-b border-[rgba(201,169,110,0.20)]">
                      <p className="text-[9px] uppercase tracking-wider font-extrabold text-[#C9A96E]">
                        Switch Role (Testing)
                      </p>
                      <div className="flex gap-1 pt-0.5 pb-1.5">
                        {['admin', 'consultant', 'customer'].map(r => (
                          <button
                            key={r}
                            onClick={() => { switchRole(r); setAdminProfileOpen(false); }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase cursor-pointer transition-all ${
                              currentUser.role === r 
                                ? 'bg-[#C9A96E] text-[#0B0B0B] shadow-xs' 
                                : 'bg-[#0E0E10] text-[#F4F1EA] hover:bg-white/10 border border-[rgba(201,169,110,0.2)]'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Menu Links */}
                    <ul className="space-y-1 text-xs">
                      <li>
                        <Link
                          to="/admin/settings"
                          onClick={() => setAdminProfileOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F1EA] hover:bg-white/10 hover:text-[#C9A96E] font-semibold transition-colors"
                        >
                          <User className="w-4 h-4 text-[#C9A96E]" />
                          <span>View Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/settings"
                          onClick={() => setAdminProfileOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F4F1EA] hover:bg-white/10 hover:text-[#C9A96E] font-semibold transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#C9A96E]" />
                          <span>Admin Settings</span>
                        </Link>
                      </li>
                      <li className="pt-1.5 border-t border-[rgba(201,169,110,0.15)]">
                        <button
                          onClick={() => { logoutUser(); setAdminProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/15 font-bold transition-all cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Log Out</span>
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── CONTENT CANVAS ───────────────────────────────────────── */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-3.5 sm:px-6 lg:px-10 py-4 sm:py-8 font-sans bg-[#F7F6F3]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── MOBILE DRAWER SIDEBAR (<768px) ─────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 md:hidden"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 bottom-0 left-0 w-72 z-50 flex flex-col font-sans bg-[#0E0E10] border-r border-[rgba(201,169,110,0.20)] md:hidden"
            >
              <div className="h-16 px-6 flex items-center justify-between border-b border-[rgba(201,169,110,0.20)]">
                <ImperiaLogo layout="lockup" variant="light" height={26} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-[#F4F1EA] hover:text-[#C9A96E] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-3 space-y-5">
                {NAV_GROUPS.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-bold px-3 block mb-1 text-[#C9A96E]">
                      {group.title}
                    </span>
                    <ul className="space-y-1">
                      {group.items.map((item, iIdx) => {
                        const active = isNavActive(item.href);
                        const Icon = item.icon;
                        return (
                          <li key={iIdx}>
                            <Link
                              to={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                active
                                  ? 'bg-[#C9A96E] text-[#0B0B0B] font-extrabold'
                                  : 'text-[#F4F1EA]/75 hover:bg-white/10 hover:text-[#C9A96E]'
                              }`}
                            >
                              <Icon className={`w-4 h-4 stroke-[1.8] ${active ? 'text-[#0B0B0B]' : 'text-[#C9A96E]'}`} />
                              <span>{item.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      </div>
    </AdminLayoutContext.Provider>
  );
};

export default AdminLayout;
