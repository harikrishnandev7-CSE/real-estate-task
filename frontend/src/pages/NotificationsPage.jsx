import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  FileCheck, 
  MessageCircle, 
  Trash2, 
  Bell, 
  Lock, 
  User, 
  ChevronRight,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/common/FeedbackStates';

const CATEGORIES = [
  'All',
  'Listings',
  'Site Visits',
  'Price Updates',
  'Messages',
  'Legal & Documents'
];

const DAY_GROUPS = ['TODAY', 'YESTERDAY', 'THIS WEEK', 'EARLIER'];

const getNotificationIcon = (type) => {
  switch (type) {
    case 'listing':
    case 'villa':
    case 'opportunity':
      return Building;
    case 'visit':
      return Calendar;
    case 'price':
      return TrendingUp;
    case 'recommendation':
    case 'sparkles':
      return Sparkles;
    case 'legal':
    case 'document':
      return FileCheck;
    case 'message':
      return MessageCircle;
    default:
      return Bell;
  }
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    notifications = [], 
    markNotificationRead, 
    toggleNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('All');
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Filter notifications based on active category & unread toggle
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // Category filter
      if (activeCategory !== 'All' && notif.category !== activeCategory) {
        return false;
      }
      // Unread only filter
      if (unreadOnly && notif.read) {
        return false;
      }
      return true;
    });
  }, [notifications, activeCategory, unreadOnly]);

  // Total unread count across all notifications
  const totalUnreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Group notifications into DAY_GROUPS
  const groupedNotifications = useMemo(() => {
    const map = {
      TODAY: [],
      YESTERDAY: [],
      'THIS WEEK': [],
      EARLIER: []
    };

    filteredNotifications.forEach(notif => {
      const groupKey = DAY_GROUPS.includes(notif.group) ? notif.group : 'EARLIER';
      map[groupKey].push(notif);
    });

    return map;
  }, [filteredNotifications]);

  // Handle clicking on card body
  const handleCardClick = (notif) => {
    if (!notif.read) {
      markNotificationRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  // If user is not logged in, render VIP Login Gate
  if (!currentUser) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#F4F1EA] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full border border-[#D6D0C2] bg-white rounded-3xl p-8 text-center space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-sans"
        >
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-300 text-[#B45309] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Log In Required</h3>
            <p className="text-xs text-[#2D2B28] leading-relaxed font-semibold">
              Please sign in to your VIP account to access your personalized notifications, property alerts, and concierge updates.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <Link
              to="/login"
              className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold tracking-wider uppercase rounded-full flex items-center justify-center gap-2 shadow-md transition-all block cursor-pointer"
            >
              <User className="w-4 h-4 text-[#F5A623]" />
              <span>LOG IN TO IMPERIA</span>
            </Link>
            <Link
              to="/signup"
              className="w-full py-3.5 border border-[#D6D0C2] bg-[#F4F1EA] hover:bg-stone-200 text-[#1A1A1A] text-xs font-bold tracking-wider uppercase rounded-full flex items-center justify-center transition-all block cursor-pointer"
            >
              <span>CREATE ACCOUNT</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-20 min-h-screen bg-[#F4F1EA]">
      
      {/* Clean Editorial Page Header (No background image banner) */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-6 pb-4 font-sans space-y-3">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
          <Link to="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span className="text-[#F5A623]">Notifications</span>
        </nav>

        <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
          ACCOUNT
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
          Your <span className="font-normal text-[#2D2B28]">Notifications</span>
        </h1>
        <p className="text-[#2D2B28] text-sm md:text-base font-semibold max-w-2xl leading-relaxed">
          Stay informed with instant alerts regarding your site visit schedules, property price updates, and direct private advisory messages.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 font-sans">
        
        {/* Sticky Control Row */}
        <div className="sticky top-[72px] z-30 bg-[#F4F1EA]/98 backdrop-blur-md border-b border-[#D6D0C2] py-4 mb-8 -mx-6 px-6 md:-mx-12 md:px-12 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Heading & Unread Count Badge */}
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
              Notifications
            </h2>
            {totalUnreadCount > 0 ? (
              <span className="px-3.5 py-1 bg-[#1A1A1A] text-[#F5A623] text-xs font-extrabold rounded-full shadow-xs border border-[#1A1A1A]">
                {totalUnreadCount} New
              </span>
            ) : (
              <span className="px-3.5 py-1 bg-white border border-[#D6D0C2] text-[#1A1A1A] text-xs font-extrabold rounded-full">
                All caught up
              </span>
            )}
          </div>

          {/* Right Controls: Filter Pills, Unread Toggle & Mark All Read */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-[#D6D0C2] rounded-full shadow-xs overflow-x-auto no-scrollbar max-w-full">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 text-xs rounded-full transition-all cursor-pointer whitespace-nowrap font-sans ${
                    activeCategory === category
                      ? 'bg-[#1A1A1A] text-white font-extrabold shadow-sm'
                      : 'bg-[#F4F1EA] text-[#1A1A1A] font-bold border border-[#E8E4DA] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Unread Only Toggle */}
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className="flex items-center gap-2 cursor-pointer p-1 bg-white border border-[#D6D0C2] rounded-full px-3 py-1.5 shadow-xs hover:border-[#1A1A1A] transition-all"
            >
              <div className={`w-3.5 h-3.5 rounded-full transition-colors ${unreadOnly ? 'bg-[#F5A623]' : 'bg-[#8A8A85]'}`} />
              <span className="text-xs font-extrabold text-[#1A1A1A] select-none">Unread only</span>
            </button>

            {/* Mark All As Read Button */}
            {totalUnreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-extrabold text-[#1A1A1A] hover:text-[#F5A623] transition-colors cursor-pointer px-2 py-1 flex items-center gap-1 underline"
              >
                <CheckCheck className="w-4 h-4 text-[#F5A623]" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List or Empty State */}
        {filteredNotifications.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title={notifications.length === 0 ? "No Notifications Yet" : "No Matching Notifications"}
              message={
                notifications.length === 0
                  ? "We'll let you know when there's a new listing match, a site visit update, or a message from your advisor."
                  : "Try clearing your active filters or disabling the unread-only toggle."
              }
              actionLabel="Explore Properties"
              onAction={() => navigate('/buy')}
            />
          </div>
        ) : (
          <motion.div layout className="space-y-8">
            {DAY_GROUPS.map(groupKey => {
              const groupItems = groupedNotifications[groupKey];
              if (!groupItems || groupItems.length === 0) return null;

              return (
                <div key={groupKey} className="space-y-3">
                  {/* Group Label - Dark & High Contrast */}
                  <span className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-extrabold block mb-3 font-sans">
                    {groupKey}
                  </span>

                  {/* Group Notification Cards */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {groupItems.map(notif => {
                        const IconComponent = getNotificationIcon(notif.type);
                        const isUnread = !notif.read;

                        return (
                          <motion.div
                            key={notif.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => handleCardClick(notif)}
                            className={`group flex items-start justify-between gap-3.5 md:gap-5 p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                              isUnread
                                ? 'bg-white border-[#D6D0C2] hover:border-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                                : 'bg-white border-[#E8E4DA] hover:border-[#1A1A1A] opacity-90'
                            }`}
                          >
                            {/* Left: Icon Tile & Body Text */}
                            <div className="flex items-start gap-3.5 md:gap-4 flex-1 min-w-0">
                              {/* Icon Tile */}
                              <div
                                className={`rounded-xl p-2.5 w-10 h-10 shrink-0 flex items-center justify-center transition-colors ${
                                  isUnread
                                    ? 'bg-amber-100 border border-amber-300 text-[#B45309]'
                                    : 'bg-stone-100 border border-[#D6D0C2] text-[#1A1A1A]'
                                }`}
                              >
                                <IconComponent className="w-5 h-5 stroke-[2]" />
                              </div>

                              {/* Text Column - High Contrast Dark Colors */}
                              <div className="flex-1 min-w-0 pt-0.5 font-sans">
                                <h4
                                  className={`text-base md:text-lg font-extrabold tracking-tight ${
                                    isUnread ? 'text-[#1A1A1A]' : 'text-[#2D2B28]'
                                  }`}
                                >
                                  {notif.title}
                                </h4>
                                <p className="text-xs md:text-sm text-[#2D2B28] font-medium mt-1 leading-relaxed">
                                  {notif.desc}
                                </p>
                                <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A] font-bold mt-2.5 block">
                                  {notif.timestamp}
                                </span>
                              </div>
                            </div>

                            {/* Right: Unread Dot Indicator & Desktop Hover Controls */}
                            <div className="flex items-center gap-3 shrink-0 self-center">
                              {/* Unread Dot */}
                              {isUnread && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="h-2.5 w-2.5 rounded-full bg-[#F5A623] shrink-0 shadow-xs"
                                />
                              )}

                              {/* Desktop Hover Action Links & Delete Icon */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNotificationRead(notif.id);
                                  }}
                                  className="text-xs font-bold text-[#1A1A1A] hover:text-[#F5A623] transition-colors cursor-pointer px-2.5 py-1 rounded-md bg-[#F4F1EA] border border-[#E8E4DA]"
                                >
                                  {isUnread ? 'Mark read' : 'Mark unread'}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notif.id);
                                  }}
                                  className="p-1.5 rounded-lg text-[#1A1A1A] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-[#E8E4DA]"
                                  aria-label="Delete notification"
                                >
                                  <Trash2 className="w-4 h-4 stroke-[2]" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}

            {/* End-of-List Marker */}
            {totalUnreadCount === 0 && (
              <div className="text-center py-6 text-xs font-bold text-[#1A1A1A] font-sans border-t border-[#D6D0C2] mt-8">
                You're all caught up.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
