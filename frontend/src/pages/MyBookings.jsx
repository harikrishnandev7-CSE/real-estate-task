import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Building, Phone, Mail, 
  ArrowLeft, ArrowRight, UserCheck, CheckCircle2, ShieldCheck, 
  Sparkles, Loader2, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusChip from '../components/admin/primitives/StatusChip';
import api from '../services/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const { currentUser, showToast } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMyBookings();
      const target = res?.data || res;
      let rawList = target?.bookings || target?.siteVisits || (Array.isArray(target) ? target : null);

      if (rawList && !Array.isArray(rawList) && typeof rawList === 'object') {
        rawList = rawList.bookings || rawList.siteVisits || null;
      }

      const list = Array.isArray(rawList) ? rawList : [];
      setBookings(list);
    } catch (err) {
      console.warn('Failed to load bookings via API:', err.message);
      setError(err.message || 'Could not load your site visits.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const filteredBookings = safeBookings.filter(b => {
    if (filter === 'All') return true;
    return (b.status || 'Scheduled').toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">

        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-[#8A8A85] hover:text-[#1A1A1A] transition-colors uppercase font-bold tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#F5A623]" />
          Back
        </button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E4DA] pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
              PRIVATE CONCIERGE PORTFOLIO
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight mt-1">
              My Booked Site Visits
            </h1>
            <p className="text-xs text-[#8A8A85] mt-1 font-normal max-w-xl">
              Track your scheduled walkthroughs, property assignments, and private client advisor details.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Scheduled', 'Confirmed', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  filter === tab
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#8A8A85] border-[#E8E4DA] hover:border-[#F5A623]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#F5A623] mx-auto" />
            <p className="text-xs font-bold text-[#8A8A85]">Retrieving your reserved walkthroughs...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 px-6 border border-dashed border-[#E8E4DA] rounded-3xl bg-white text-center space-y-5 max-w-md mx-auto shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#1A1A1A]">You have no bookings yet</h3>
              <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                Schedule a chauffeur-driven private walkthrough for any of our luxury residences to get paired with a dedicated city consultant.
              </p>
            </div>
            <Link
              to="/buy"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
            >
              <span>Explore Residences</span>
              <ArrowRight className="w-4 h-4 text-[#F5A623]" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBookings.map((booking) => {
              const prop = booking.property || {};
              const consultant = booking.consultant;

              return (
                <motion.div
                  key={booking.id || booking._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-[#E8E4DA] bg-white rounded-3xl overflow-hidden shadow-md flex flex-col justify-between font-sans hover:border-[#F5A623]/60 transition-all duration-300"
                >
                  {/* Card Main Block */}
                  <div>
                    {/* Top Property Media Header */}
                    <div className="relative h-48 sm:h-56 bg-stone-100 overflow-hidden">
                      <img 
                        src={prop.image || prop.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
                        alt={prop.title || booking.propertyName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A1A] shadow-sm">
                          {prop.type || 'LUXURY ESTATE'}
                        </span>
                        <StatusChip status={booking.status || 'Scheduled'} />
                      </div>

                      {/* Title & Price overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{prop.location || prop.city || booking.cityName || 'Chennai'}</span>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1">
                          {prop.title || booking.propertyName || 'Architectural Residence'}
                        </h3>
                        <p className="text-lg font-extrabold text-[#F5A623]">{prop.price || 'Price on Request'}</p>
                      </div>
                    </div>

                    {/* Booking Details Section */}
                    <div className="p-6 space-y-6">
                      
                      {/* Visit Schedule Bar */}
                      <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F4F1EA] border border-[#E8E4DA] rounded-2xl">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-[#8A8A85] font-bold block">Visit Date</span>
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1A1A1A]">
                            <Calendar className="w-3.5 h-3.5 text-[#F5A623]" />
                            <span>{booking.visitDate || booking.scheduledDate || 'Scheduled'}</span>
                          </div>
                        </div>
                        <div className="space-y-0.5 border-l border-[#E8E4DA] pl-3">
                          <span className="text-[9px] uppercase tracking-wider text-[#8A8A85] font-bold block">Visit Time</span>
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1A1A1A]">
                            <Clock className="w-3.5 h-3.5 text-[#F5A623]" />
                            <span>{booking.visitTime || booking.scheduledTime || '10:00 AM'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Consultant Details Card */}
                      <div className="border border-[#E8E4DA] rounded-2xl p-4 space-y-3 bg-stone-50/50">
                        <span className="text-[9px] uppercase tracking-widest text-[#F5A623] font-bold block">
                          ASSIGNED CITY ADVISOR
                        </span>

                        {consultant ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                                {consultant.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-[#1A1A1A] truncate">{consultant.name}</h4>
                                <p className="text-[11px] text-[#8A8A85] font-medium">Senior Concierge Manager</p>
                              </div>
                            </div>

                            {/* Languages */}
                            {consultant.languages && consultant.languages.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {consultant.languages.map(lang => (
                                  <span key={lang} className="px-2 py-0.5 rounded border border-[#E8E4DA] bg-white text-[9px] font-semibold text-[#1A1A1A]">
                                    {lang}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Contact Details */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E4DA]/80 text-xs">
                              {consultant.phone && (
                                <a 
                                  href={`tel:${consultant.phone}`} 
                                  className="flex items-center gap-1.5 text-[#1A1A1A] hover:text-[#F5A623] font-bold truncate transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                                  <span className="truncate">{consultant.phone}</span>
                                </a>
                              )}
                              {consultant.email && (
                                <a 
                                  href={`mailto:${consultant.email}`} 
                                  className="flex items-center gap-1.5 text-[#8A8A85] hover:text-[#1A1A1A] font-medium truncate transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                                  <span className="truncate">{consultant.email}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="py-2 text-center space-y-1">
                            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#F5A623] font-bold flex items-center justify-center mx-auto text-xs">
                              👤
                            </div>
                            <p className="text-xs font-bold text-[#1A1A1A]">Consultant will be assigned shortly</p>
                            <p className="text-[11px] text-[#8A8A85]">Our wealth team is pairing your visit with a city advisor.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-[#F4F1EA] border-t border-[#E8E4DA] flex items-center justify-between gap-3">
                    <span className="text-[10px] text-[#8A8A85] font-bold uppercase tracking-wider">
                      Reference #{String(booking.id || booking._id).slice(-6)}
                    </span>

                    {prop.id || prop._id ? (
                      <Link
                        to={`/property/${prop.id || prop._id}`}
                        className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        View Residence
                      </Link>
                    ) : null}
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;
