import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Mail, UserCheck, MessageCircle, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const CITIES = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Ooty', 'Bengaluru', 'Hyderabad'];

const ConsultantsPage = () => {
  const { openWhatsApp, showToast } = useApp();

  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    setLoading(true);
    api.getPublicConsultants()
      .then((res) => {
        setConsultants(res?.consultants || []);
      })
      .catch((err) => {
        showToast(err.message || 'Failed to load consultants listing.', 'error');
        setConsultants([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredConsultants = useMemo(() => {
    return consultants.filter((c) => {
      const matchCity = selectedCity === 'All' || (c.city && c.city.toLowerCase() === selectedCity.toLowerCase());
      const matchSearch = !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.languages && c.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCity && matchSearch;
    });
  }, [consultants, selectedCity, searchQuery]);

  const handleCall = (c) => {
    showToast(`Connecting to ${c.name}: ${c.phone || '+91 99999 88888'}`);
  };

  const handleEmail = (c) => {
    showToast(`Drafting private client email to ${c.email}`);
  };

  const handleWhatsapp = (c) => {
    openWhatsApp(c.name, `Hello ${c.name}, I am looking for luxury property consultation in ${c.city}.`);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">

        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5A623] font-extrabold block">
            OUR PRIVATE ADVISORS
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight font-serif">
            Luxury Real Estate Consultants
          </h1>
          <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
            Meet our dedicated team of city-specialist real estate consultants ready to guide your property acquisitions and site visits.
          </p>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8A8A85] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by consultant name, language, or city..."
              className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#1A1A1A] font-medium outline-none focus:border-[#F5A623] placeholder-[#8A8A85]"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-[#F5A623] shrink-0 hidden md:block" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full md:w-48 bg-[#F4F1EA] border border-[#E8E4DA] rounded-2xl px-4 py-3 text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] cursor-pointer"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-[#E8E4DA] rounded-3xl p-6 space-y-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#E8E4DA]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#E8E4DA] rounded w-3/4" />
                    <div className="h-3 bg-[#E8E4DA] rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 bg-[#E8E4DA] rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredConsultants.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-[#E8E4DA] rounded-3xl p-16 text-center space-y-3 shadow-md">
            <UserCheck className="w-12 h-12 text-[#8A8A85] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#1A1A1A]">No consultants available</h3>
            <p className="text-xs text-[#8A8A85] max-w-sm mx-auto">
              No real estate consultants found matching your current search or city filter.
            </p>
          </div>
        ) : (
          /* Consultant Grid — 3 per row on desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredConsultants.map((c) => (
              <motion.div
                key={c.id || c._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.09)] transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                {/* Header: Avatar, Name & City Badge */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full border-2 border-[#F5A623] bg-amber-100 text-[#F5A623] font-extrabold flex items-center justify-center text-xl shadow-inner shrink-0">
                        {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight">{c.name}</h3>
                        <p className="text-xs text-[#8A8A85] font-medium">Luxury Real Estate Advisor</p>
                      </div>
                    </div>
                  </div>

                  {/* City & Role Badge */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#1A1A1A] bg-[#F4F1EA] border border-[#E8E4DA] px-3 py-1 rounded-full">
                      <MapPin className="w-3 h-3 text-[#F5A623]" />
                      {c.city}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      Verified
                    </span>
                  </div>

                  {/* Languages Chips */}
                  {c.languages && c.languages.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[#F4F1EA]">
                      <span className="text-[9px] text-[#8A8A85] uppercase tracking-widest font-bold block">
                        Languages Known
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-2.5 py-0.5 rounded-lg border border-[#E8E4DA] bg-[#F4F1EA] text-[10px] font-semibold text-[#1A1A1A]"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact CTA Buttons */}
                <div className="space-y-2 pt-4 border-t border-[#F4F1EA]">
                  <button
                    onClick={() => handleCall(c)}
                    className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F5A623]" />
                    <span>Call Advisor</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleWhatsapp(c)}
                      className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleEmail(c)}
                      className="py-2.5 bg-[#F4F1EA] hover:bg-[#E8E4DA] text-[#1A1A1A] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#E8E4DA]"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ConsultantsPage;
