import React, { useState, useRef, useEffect } from 'react';
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
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center px-6 py-20 font-sans">
        <div className="max-w-md w-full border border-[#E8E4DA] bg-white rounded-3xl p-8 text-center space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Admin Login Required</h2>
            <p className="text-xs text-[#8A8A85] leading-relaxed font-normal">
              You must be signed into an authorized admin or consultant account to view the IMPERIA Control Panel.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <Link
              to="/admin/login"
              className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold tracking-wider uppercase rounded-full flex items-center justify-center gap-2 shadow-md transition-all block cursor-pointer"
            >
              <User className="w-4 h-4 text-[#F5A623]" />
              <span>LOG IN TO ADMIN PORTAL</span>
            </Link>
            <Link
              to="/"
              className="w-full py-3.5 border border-[#E8E4DA] bg-[#F4F1EA] hover:bg-stone-200 text-[#1A1A1A] text-xs font-bold tracking-wider uppercase rounded-full flex items-center justify-center transition-all block cursor-pointer"
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
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center px-6 py-20 font-sans">
        <div className="max-w-md w-full border border-[#E8E4DA] bg-white rounded-3xl p-8 text-center space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Access Denied</h2>
            <p className="text-xs text-[#8A8A85] leading-relaxed font-normal">
              Your account currently has <span className="font-bold text-[#1A1A1A]">Customer</span> status. Admin or Consultant privileges are required to access this panel.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => switchRole('admin')}
              className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold tracking-wider uppercase rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F5A623]" />
              <span>SWITCH ROLE TO ADMIN (DEMO)</span>
            </button>
            <Link
              to="/dashboard"
              className="w-full py-3.5 border border-[#E8E4DA] bg-[#F4F1EA] hover:bg-stone-200 text-[#1A1A1A] text-xs font-bold tracking-wider uppercase rounded-full flex items-center justify-center transition-all block cursor-pointer"
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
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans flex flex-col md:flex-row">
      
      {/* ── DESKTOP SIDEBAR ────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-[#E8E4DA] transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 border-b border-[#E8E4DA] px-5 flex items-center justify-between shrink-0">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <ImperiaLogo layout="icon" variant="dark" height={28} className="shrink-0" />
            {!collapsed && (
              <div className="flex flex-col font-sans">
                <span className="font-extrabold text-base tracking-widest text-[#1A1A1A] leading-none">
                  IMPERIA
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#F5A623] mt-1 leading-none">
                  ADMIN PANEL
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 space-y-6">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              {!collapsed && (
                <span className="text-[10px] uppercase tracking-widest text-[#8A8A85] font-bold px-3 block mb-2 font-sans">
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
                        className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-[#1A1A1A] text-white shadow-xs'
                            : 'text-[#8A8A85] hover:bg-[#F4F1EA] hover:text-[#1A1A1A]'
                        }`}
                      >
                        {/* Amber Left Accent Bar for Active item */}
                        {active && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#F5A623] rounded-r" />
                        )}
                        <Icon className={`w-4 h-4 shrink-0 stroke-[2] ${active ? 'text-[#F5A623]' : 'group-hover:text-[#1A1A1A]'}`} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: User Card + Collapse Toggle */}
        <div className="p-3 border-t border-[#E8E4DA] bg-[#F4F1EA]/50 shrink-0 space-y-2">
          {!collapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E8E4DA]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F5A623] font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1A1A1A] truncate">{currentUser.name}</p>
                  <span className="text-[9px] font-bold text-[#F5A623] uppercase tracking-wider block">
                    {currentUser.role || 'ADMIN'}
                  </span>
                </div>
              </div>
              <button
                onClick={logoutUser}
                className="p-1.5 text-[#8A8A85] hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={logoutUser}
              className="w-full flex justify-center py-2 text-[#8A8A85] hover:text-red-600 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 text-xs font-bold text-[#8A8A85] hover:text-[#1A1A1A] border border-[#E8E4DA] bg-white rounded-xl hover:bg-[#F4F1EA] transition-all cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-1.5"><ChevronLeft className="w-4 h-4" /><span>Collapse Sidebar</span></div>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        collapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        
        {/* ── TOPBAR HEADER ───────────────────────────────────────── */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E8E4DA] px-6 lg:px-10 flex items-center justify-between gap-4 font-sans">
          
          {/* Left: Mobile Menu Trigger + Page Title / Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#1A1A1A] hover:bg-[#F4F1EA] cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">
                <span>ADMIN</span>
                <span>/</span>
                <span className="text-[#F5A623]">{getPageTitle()}</span>
              </div>
              <h1 className="text-base font-extrabold text-[#1A1A1A] tracking-tight leading-none mt-0.5">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Controls: Search, Notifications Bell & Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Global Search Input */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-[#8A8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search admin entities..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="bg-[#F4F1EA] border border-[#E8E4DA] rounded-full text-xs px-4 py-2 pl-9 text-[#1A1A1A] placeholder-[#8A8A85] focus:outline-none focus:border-[#F5A623] w-48 lg:w-64 transition-all"
              />
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setAdminNotifOpen(!adminNotifOpen)}
                className="w-9 h-9 rounded-full border border-[#E8E4DA] bg-white hover:bg-[#F4F1EA] text-[#1A1A1A] flex items-center justify-center relative cursor-pointer transition-colors"
                aria-label="Admin Alerts"
              >
                <Bell className="w-4 h-4 stroke-[2]" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F5A623]" />
                )}
              </button>

              <AnimatePresence>
                {adminNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-50 text-left font-sans"
                  >
                    <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-3 mb-3">
                      <span className="font-extrabold text-xs text-[#1A1A1A] uppercase tracking-wider">
                        Admin System Alerts
                      </span>
                      {unreadAlertsCount > 0 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-[#F5A623] border border-amber-200 rounded-full">
                          {unreadAlertsCount} New
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      {adminAlerts.map(alert => (
                        <div
                          key={alert.id}
                          className={`p-2.5 rounded-xl border text-xs transition-colors ${
                            alert.unread ? 'bg-amber-50/50 border-amber-200' : 'bg-[#F4F1EA]/50 border-[#E8E4DA]'
                          }`}
                        >
                          <p className="font-bold text-[#1A1A1A]">{alert.title}</p>
                          <p className="text-[11px] text-[#8A8A85] mt-0.5 leading-relaxed">{alert.desc}</p>
                          <span className="text-[9px] text-[#8A8A85] mt-1 block font-medium">{alert.time}</span>
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
                className="flex items-center gap-2 p-1.5 rounded-full border border-[#E8E4DA] bg-white hover:bg-[#F4F1EA] cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#F5A623] font-extrabold text-xs flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A8A85] mr-1" />
              </button>

              <AnimatePresence>
                {adminProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-64 bg-white border border-[#E8E4DA] rounded-2xl p-3 shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-50 text-left font-sans"
                  >
                    <div className="px-3 py-2 border-b border-[#E8E4DA] mb-2">
                      <p className="text-xs font-extrabold text-[#1A1A1A]">{currentUser.name}</p>
                      <p className="text-[10px] text-[#8A8A85]">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-[#F5A623] text-[9px] font-bold uppercase rounded-full">
                        Role: {currentUser.role || 'Admin'}
                      </span>
                    </div>

                    {/* Role Switcher Demo Options */}
                    <div className="px-3 py-1 mb-2 border-b border-[#E8E4DA] space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-[#8A8A85] font-bold">Switch Role (Testing)</p>
                      <div className="flex gap-1 pt-1 pb-2">
                        {['admin', 'consultant', 'customer'].map(r => (
                          <button
                            key={r}
                            onClick={() => {
                              switchRole(r);
                              setAdminProfileOpen(false);
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                              currentUser.role === r ? 'bg-[#1A1A1A] text-white' : 'bg-[#F4F1EA] text-[#1A1A1A]'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <ul className="space-y-1 text-xs font-bold text-[#1A1A1A]">
                      <li>
                        <Link
                          to="/admin/settings"
                          onClick={() => setAdminProfileOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F4F1EA]"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#F5A623]" />
                          <span>Admin Settings</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            logoutUser();
                            setAdminProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
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

        {/* ── CONTENT CANVAS (150ms opacity-only page transition) ──── */}
        <main className="flex-1 bg-[#F4F1EA] max-w-[1600px] w-full mx-auto px-3.5 sm:px-6 lg:px-10 py-4 sm:py-8 font-sans">
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
              className="fixed top-0 bottom-0 left-0 w-72 bg-white z-50 flex flex-col font-sans border-r border-[#E8E4DA] md:hidden"
            >
              <div className="h-16 border-b border-[#E8E4DA] px-6 flex items-center justify-between">
                <ImperiaLogo layout="lockup" variant="dark" height={28} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-[#8A8A85] hover:text-[#1A1A1A]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                {NAV_GROUPS.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-[#8A8A85] font-bold px-3 block mb-2">
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
                              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                active
                                  ? 'bg-[#1A1A1A] text-white'
                                  : 'text-[#8A8A85] hover:bg-[#F4F1EA] hover:text-[#1A1A1A]'
                              }`}
                            >
                              <Icon className="w-4 h-4 stroke-[2]" />
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
  );
};

export default AdminLayout;
