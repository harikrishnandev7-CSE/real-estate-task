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
      <div className="min-h-screen flex items-center justify-center px-6 py-20 font-sans" style={{ background: '#E0EEE9' }}>
        <div
          className="max-w-md w-full p-8 text-center space-y-6"
          style={{ background: '#FFFFFF', border: '1px solid rgba(93,100,114,0.15)', borderRadius: 10, boxShadow: '0 20px 48px rgba(54,60,70,0.08)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(207,182,168,0.12)', border: '1px solid rgba(207,182,168,0.28)', color: '#CFB6A8' }}
          >
            <Lock className="w-8 h-8 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight" style={{ fontFamily: "'Fraunces','Playfair Display',serif", color: '#363C46' }}>Admin Login Required</h2>
            <p className="text-xs leading-relaxed font-normal" style={{ color: '#5D6472' }}>
              You must be signed into an authorized admin or consultant account to view the IMPERIA Control Panel.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <Link
              to="/admin/login"
              className="w-full py-3 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-85 block"
              style={{ background: '#363C46', borderRadius: 6, boxShadow: '0 4px 14px rgba(54,60,70,0.18)' }}
            >
              <User className="w-4 h-4" style={{ color: '#CFB6A8' }} />
              <span>LOG IN TO ADMIN PORTAL</span>
            </Link>
            <Link
              to="/"
              className="w-full py-3 text-xs font-bold tracking-wider uppercase flex items-center justify-center transition-opacity hover:opacity-75 block cursor-pointer"
              style={{ border: '1px solid rgba(93,100,114,0.18)', background: '#E0EEE9', color: '#363C46', borderRadius: 6 }}
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
      <div className="min-h-screen flex items-center justify-center px-6 py-20 font-sans" style={{ background: '#E0EEE9' }}>
        <div
          className="max-w-md w-full p-8 text-center space-y-6"
          style={{ background: '#FFFFFF', border: '1px solid rgba(93,100,114,0.15)', borderRadius: 10, boxShadow: '0 20px 48px rgba(54,60,70,0.08)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
          >
            <ShieldAlert className="w-8 h-8 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight" style={{ fontFamily: "'Fraunces','Playfair Display',serif", color: '#363C46' }}>Access Denied</h2>
            <p className="text-xs leading-relaxed font-normal" style={{ color: '#5D6472' }}>
              Your account currently has <span className="font-bold" style={{ color: '#363C46' }}>Customer</span> status. Admin or Consultant privileges are required to access this panel.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => switchRole('admin')}
              className="w-full py-3 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-85"
              style={{ background: '#363C46', borderRadius: 6, boxShadow: '0 4px 14px rgba(54,60,70,0.18)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#CFB6A8' }} />
              <span>SWITCH ROLE TO ADMIN (DEMO)</span>
            </button>
            <Link
              to="/dashboard"
              className="w-full py-3 text-xs font-bold tracking-wider uppercase flex items-center justify-center transition-opacity hover:opacity-75 block cursor-pointer"
              style={{ border: '1px solid rgba(93,100,114,0.18)', background: '#E0EEE9', color: '#363C46', borderRadius: 6 }}
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
    <div className="min-h-screen font-sans flex flex-col md:flex-row" style={{ background: '#E0EEE9', color: '#363C46' }}>
      
      {/* ── DESKTOP SIDEBAR ────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        style={{ background: '#FFFFFF', borderRight: '1px solid rgba(93,100,114,0.15)' }}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 px-5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid rgba(93,100,114,0.15)' }}>
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <ImperiaLogo layout="icon" variant="dark" height={26} className="shrink-0" />
            {!collapsed && (
              <div className="flex flex-col" style={{ fontFamily: "'Inter','Plus Jakarta Sans',sans-serif" }}>
                <span className="font-bold text-sm tracking-[0.18em]" style={{ color: '#363C46', lineHeight: 1 }}>
                  IMPERIA
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] mt-1" style={{ color: '#CFB6A8', lineHeight: 1 }}>
                  ADMIN PANEL
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 space-y-6">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <span
                  className="text-[9px] uppercase tracking-widest font-bold px-3 block mb-2"
                  style={{ color: 'rgba(93,100,114,0.50)', fontFamily: "'Inter',sans-serif" }}
                >
                  {group.title}
                </span>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item, iIdx) => {
                  const active = isNavActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={iIdx}>
                      <Link
                        to={item.href}
                        title={collapsed ? item.label : undefined}
                        className="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: active ? '#363C46' : 'transparent',
                          color: active ? '#FFFFFF' : '#5D6472',
                          fontFamily: "'Inter','Plus Jakarta Sans',sans-serif",
                        }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#E0EEE9'; e.currentTarget.style.color = '#363C46'; } }}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5D6472'; } }}
                      >
                        {/* Dark Vanilla left bar for active item */}
                        {active && (
                          <span
                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r"
                            style={{ background: '#CFB6A8' }}
                          />
                        )}
                        <Icon
                          className="w-4 h-4 shrink-0 stroke-[1.8]"
                          style={{ color: active ? '#CFB6A8' : undefined }}
                        />
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
        <div className="p-3 shrink-0 space-y-2" style={{ borderTop: '1px solid rgba(93,100,114,0.12)', background: 'rgba(224,238,233,0.35)' }}>
          {!collapsed ? (
            <div
              className="flex items-center justify-between p-2 rounded-lg"
              style={{ background: '#FFFFFF', border: '1px solid rgba(93,100,114,0.12)' }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0"
                  style={{ background: '#363C46', color: '#CFB6A8' }}
                >
                  {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: '#363C46' }}>{currentUser.name}</p>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider block"
                    style={{ color: '#CFB6A8' }}
                  >
                    {currentUser.role || 'ADMIN'}
                  </span>
                </div>
              </div>
              <button
                onClick={logoutUser}
                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{ color: '#5D6472' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = '#FEF2F2'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#5D6472'; e.currentTarget.style.background = 'transparent'; }}
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={logoutUser}
              className="w-full flex justify-center py-2 transition-colors cursor-pointer"
              style={{ color: '#5D6472' }}
              onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
              onMouseLeave={e => e.currentTarget.style.color = '#5D6472'}
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 text-xs font-bold transition-all cursor-pointer rounded-lg"
            style={{ color: '#5D6472', border: '1px solid rgba(93,100,114,0.15)', background: '#FFFFFF' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E0EEE9'; e.currentTarget.style.color = '#363C46'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#5D6472'; }}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-1.5"><ChevronLeft className="w-4 h-4" /><span>Collapse</span></div>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        collapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        
        {/* ── TOPBAR HEADER ───────────────────────────────────────── */}
        <header
          className="sticky top-0 z-30 h-16 px-6 lg:px-10 flex items-center justify-between gap-4 font-sans"
          style={{
            background: 'rgba(224,238,233,0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(93,100,114,0.14)',
          }}
        >
          {/* Left: Mobile Menu Trigger + Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg cursor-pointer transition-colors"
              style={{ color: '#363C46' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(93,100,114,0.10)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold"
                style={{ color: '#5D6472', fontFamily: "'Inter',sans-serif" }}
              >
                <span>ADMIN</span>
                <span>/</span>
                <span style={{ color: '#CFB6A8' }}>{getPageTitle()}</span>
              </div>
              <h1
                className="text-sm font-semibold tracking-tight leading-none mt-0.5"
                style={{ fontFamily: "'Fraunces','Playfair Display',serif", color: '#363C46' }}
              >
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#5D6472' }} />
              <input
                type="text"
                placeholder="Search admin entities..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="text-xs px-4 py-2 pl-9 focus:outline-none w-48 lg:w-64 transition-all rounded-lg"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(93,100,114,0.18)',
                  color: '#363C46',
                  fontFamily: "'Inter',sans-serif",
                }}
              />
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setAdminNotifOpen(!adminNotifOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center relative cursor-pointer transition-colors"
                style={{ background: '#FFFFFF', border: '1px solid rgba(93,100,114,0.18)', color: '#5D6472' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E0EEE9'; e.currentTarget.style.color = '#363C46'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#5D6472'; }}
                aria-label="Admin Alerts"
              >
                <Bell className="w-4 h-4 stroke-[1.8]" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#CFB6A8' }} />
                )}
              </button>

              <AnimatePresence>
                {adminNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 z-50 text-left p-4"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(93,100,114,0.15)', borderRadius: 10, boxShadow: '0 20px 48px rgba(54,60,70,0.12)' }}
                  >
                    <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid rgba(93,100,114,0.12)' }}>
                      <span
                        className="font-bold text-xs uppercase tracking-wider"
                        style={{ color: '#363C46', fontFamily: "'Inter',sans-serif" }}
                      >
                        Admin Alerts
                      </span>
                      {unreadAlertsCount > 0 && (
                        <span
                          className="px-2 py-0.5 text-[9px] font-bold rounded-full"
                          style={{ background: 'rgba(207,182,168,0.15)', color: '#CFB6A8', border: '1px solid rgba(207,182,168,0.25)' }}
                        >
                          {unreadAlertsCount} New
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      {adminAlerts.map(alert => (
                        <div
                          key={alert.id}
                          className="p-2.5 rounded-lg border text-xs"
                          style={{
                            background: alert.unread ? 'rgba(207,182,168,0.08)' : 'rgba(224,238,233,0.50)',
                            border: `1px solid ${alert.unread ? 'rgba(207,182,168,0.25)' : 'rgba(93,100,114,0.12)'}`,
                          }}
                        >
                          <p className="font-semibold" style={{ color: '#363C46' }}>{alert.title}</p>
                          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: '#5D6472' }}>{alert.desc}</p>
                          <span className="text-[9px] mt-1 block font-medium" style={{ color: 'rgba(93,100,114,0.55)' }}>{alert.time}</span>
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
                className="flex items-center gap-2 p-1.5 rounded-full cursor-pointer transition-colors"
                style={{ border: '1px solid rgba(93,100,114,0.18)', background: '#FFFFFF' }}
                onMouseEnter={e => e.currentTarget.style.background = '#E0EEE9'}
                onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
              >
                <div
                  className="w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center"
                  style={{ background: '#363C46', color: '#CFB6A8' }}
                >
                  {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 mr-1" style={{ color: '#5D6472' }} />
              </button>

              <AnimatePresence>
                {adminProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-60 z-50 text-left p-3"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(93,100,114,0.15)', borderRadius: 10, boxShadow: '0 20px 48px rgba(54,60,70,0.12)' }}
                  >
                    <div className="px-3 py-2 mb-2" style={{ borderBottom: '1px solid rgba(93,100,114,0.12)' }}>
                      <p className="text-xs font-bold" style={{ color: '#363C46' }}>{currentUser.name}</p>
                      <p className="text-[10px]" style={{ color: '#5D6472' }}>{currentUser.email}</p>
                      <span
                        className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full"
                        style={{ background: 'rgba(207,182,168,0.12)', border: '1px solid rgba(207,182,168,0.28)', color: '#CFB6A8' }}
                      >
                        Role: {currentUser.role || 'Admin'}
                      </span>
                    </div>

                    {/* Role Switcher */}
                    <div className="px-3 py-1 mb-2 space-y-1" style={{ borderBottom: '1px solid rgba(93,100,114,0.10)' }}>
                      <p
                        className="text-[9px] uppercase tracking-wider font-bold"
                        style={{ color: 'rgba(93,100,114,0.55)' }}
                      >
                        Switch Role (Testing)
                      </p>
                      <div className="flex gap-1 pt-1 pb-2">
                        {['admin', 'consultant', 'customer'].map(r => (
                          <button
                            key={r}
                            onClick={() => { switchRole(r); setAdminProfileOpen(false); }}
                            className="px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer"
                            style={{
                              background: currentUser.role === r ? '#363C46' : '#E0EEE9',
                              color: currentUser.role === r ? '#FFFFFF' : '#363C46',
                            }}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <ul className="space-y-0.5 text-xs">
                      <li>
                        <Link
                          to="/admin/settings"
                          onClick={() => setAdminProfileOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                          style={{ color: '#363C46', fontWeight: 600 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#E0EEE9'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Settings className="w-3.5 h-3.5" style={{ color: '#CFB6A8' }} />
                          <span>Admin Settings</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => { logoutUser(); setAdminProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                          style={{ color: '#DC2626', fontWeight: 600 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
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

        {/* ── CONTENT CANVAS ───────────────────────────────────────── */}
        <main
          className="flex-1 max-w-[1600px] w-full mx-auto px-3.5 sm:px-6 lg:px-10 py-4 sm:py-8 font-sans"
          style={{ background: '#E0EEE9' }}
        >
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
              className="fixed top-0 bottom-0 left-0 w-72 z-50 flex flex-col font-sans md:hidden"
              style={{ background: '#FFFFFF', borderRight: '1px solid rgba(93,100,114,0.15)' }}
            >
              <div className="h-16 px-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(93,100,114,0.15)' }}>
                <ImperiaLogo layout="lockup" variant="dark" height={26} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{ color: '#5D6472' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-3 space-y-5">
                {NAV_GROUPS.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <span
                      className="text-[9px] uppercase tracking-widest font-bold px-3 block mb-1"
                      style={{ color: 'rgba(93,100,114,0.50)', fontFamily: "'Inter',sans-serif" }}
                    >
                      {group.title}
                    </span>
                    <ul className="space-y-0.5">
                      {group.items.map((item, iIdx) => {
                        const active = isNavActive(item.href);
                        const Icon = item.icon;
                        return (
                          <li key={iIdx}>
                            <Link
                              to={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all"
                              style={{
                                background: active ? '#363C46' : 'transparent',
                                color: active ? '#FFFFFF' : '#5D6472',
                              }}
                              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#E0EEE9'; e.currentTarget.style.color = '#363C46'; } }}
                              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5D6472'; } }}
                            >
                              <Icon className="w-4 h-4 stroke-[1.8]" style={{ color: active ? '#CFB6A8' : undefined }} />
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
