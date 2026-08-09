import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  User, 
  Clock, 
  MapPin, 
  Building, 
  RotateCcw, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import KPICard from '../../components/admin/primitives/KPICard';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import api from '../../services/api';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AdminVisitCalendarPage = () => {
  const { showToast } = useApp();
  
  // Current view month & year state
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const currentMonth = currentDate.getMonth(); // 0 - 11
  const currentYear = currentDate.getFullYear();

  // Selected date for details panel & modal (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Data states
  const [calendarCounts, setCalendarCounts] = useState({}); // { "2026-08-07": 3 }
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [consultants, setConsultants] = useState([]);
  
  // Loading states
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Visits Details Modal State
  const [isVisitsModalOpen, setIsVisitsModalOpen] = useState(false);

  // Filters
  const [selectedConsultant, setSelectedConsultant] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Reassign Modal
  const [reassignModalTarget, setReassignModalTarget] = useState(null);
  const [targetConsultantId, setTargetConsultantId] = useState('');
  const [reassigning, setReassigning] = useState(false);

  // Fetch month calendar overview (counts per date)
  const fetchMonthCalendar = async () => {
    setLoadingCalendar(true);
    try {
      const monthParam = currentMonth + 1;
      const filters = {
        month: monthParam,
        year: currentYear,
      };
      if (selectedConsultant !== 'All') filters.consultantId = selectedConsultant;
      if (selectedStatus !== 'All') filters.status = selectedStatus;

      const res = await api.getCalendarMonthData(filters);
      setCalendarCounts(res.countMap || {});
    } catch (err) {
      console.warn('Calendar month fetch warning:', err);
    } finally {
      setLoadingCalendar(false);
    }
  };

  // Fetch site visit details for the selected date
  const fetchDateBookings = async (dateStr) => {
    setLoadingBookings(true);
    try {
      const filters = { date: dateStr };
      if (selectedConsultant !== 'All') filters.consultantId = selectedConsultant;
      if (selectedStatus !== 'All') filters.status = selectedStatus;

      const res = await api.getSiteVisitsByDate(filters);
      const list = res.bookings || res.siteVisits || (Array.isArray(res) ? res : []);
      setSelectedBookings(list);
    } catch (err) {
      console.warn('Date bookings fetch warning:', err);
      setSelectedBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Handle explicit "Visits" button click on calendar date box
  const handleVisitClick = async (dateStr, e) => {
    if (e) e.stopPropagation();
    setSelectedDate(dateStr);
    setIsVisitsModalOpen(true);
    await fetchDateBookings(dateStr);
  };

  // Fetch consultants dropdown on mount
  useEffect(() => {
    const fetchConsultantsList = async () => {
      try {
        const consRes = await api.getAdminConsultants();
        setConsultants(consRes.consultants || []);
      } catch (err) {
        console.warn('Failed to load consultants dropdown list:', err);
      }
    };
    fetchConsultantsList();
  }, []);

  // Re-fetch calendar month data when month, year, or filters change
  useEffect(() => {
    fetchMonthCalendar();
  }, [currentMonth, currentYear, selectedConsultant, selectedStatus]);

  // Re-fetch date details when selectedDate or filters change
  useEffect(() => {
    if (selectedDate) {
      fetchDateBookings(selectedDate);
    }
  }, [selectedDate, selectedConsultant, selectedStatus]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Calculate 7x5 month grid cells
  const daysInMonthGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells = [];
    // Padding cells before start of month
    for (let i = 0; i < firstDay; i++) {
      cells.push({ isPadding: true, key: `pad-${i}` });
    }

    // Days of the month
    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      const count = calendarCounts[dateStr] || 0;

      cells.push({
        isPadding: false,
        day: d,
        dateStr,
        count,
        key: dateStr
      });
    }

    return cells;
  }, [currentYear, currentMonth, calendarCounts]);

  // KPIs for the selected date
  const kpis = useMemo(() => {
    const list = selectedBookings;
    return {
      total: list.length,
      assigned: list.filter(a => a.status === 'Assigned' || a.status === 'Confirmed' || a.consultant).length,
      cancelled: list.filter(a => a.status === 'Cancelled').length,
      pending: list.filter(a => !a.consultant && a.status !== 'Cancelled').length,
    };
  }, [selectedBookings]);

  // Reassign consultant handler
  const handleReassignSubmit = async () => {
    if (!targetConsultantId) {
      showToast('Please select a consultant to assign.', 'error');
      return;
    }
    setReassigning(true);
    try {
      await api.reassignVisit(reassignModalTarget._id || reassignModalTarget.id, targetConsultantId);
      showToast('Visit successfully reassigned!');
      setReassignModalTarget(null);
      setTargetConsultantId('');
      fetchMonthCalendar();
      fetchDateBookings(selectedDate);
    } catch (err) {
      showToast(err.message || 'Reassignment failed.', 'error');
    } finally {
      setReassigning(false);
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
            VISIT MANAGEMENT SYSTEM
          </span>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Visit Calendar</h1>
          <p className="text-xs text-[#8A8A85] mt-0.5">
            Interactive month view calendar to track site visits, daily load, and consultant allocations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToday}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E4DA] text-xs font-bold text-[#1A1A1A] hover:bg-[#F4F1EA] transition-colors shadow-xs cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-2xl border border-[#E8E4DA] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#8A8A85] mr-2">
          <Filter className="w-4 h-4 text-[#F5A623]" /> Filter By:
        </div>

        <select 
          value={selectedConsultant} 
          onChange={e => setSelectedConsultant(e.target.value)}
          className="px-3 py-2 bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] cursor-pointer"
        >
          <option value="All">All Consultants</option>
          {consultants.map(c => <option key={c._id} value={c._id}>{c.name} ({c.city})</option>)}
        </select>

        <select 
          value={selectedStatus} 
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* MONTH CALENDAR GRID (7x5 Grid View) */}
      <div className="bg-white border border-[#E8E4DA] rounded-3xl p-6 shadow-md space-y-4">
        
        {/* Calendar Month Header Navigation */}
        <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            {loadingCalendar && <Loader2 className="w-4 h-4 animate-spin text-[#F5A623]" />}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-[#F4F1EA] hover:bg-[#E8E4DA] text-[#1A1A1A] transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-[#F4F1EA] hover:bg-[#E8E4DA] text-[#1A1A1A] transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] uppercase tracking-wider text-[#8A8A85] pb-2">
          {WEEKDAY_NAMES.map(w => (
            <div key={w} className="py-1">{w}</div>
          ))}
        </div>

        {/* 7x5 Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonthGrid.map((cell) => {
            if (cell.isPadding) {
              return <div key={cell.key} className="h-20 sm:h-24 rounded-2xl bg-[#F4F1EA]/30 border border-transparent" />;
            }

            const isSelected = selectedDate === cell.dateStr;
            const hasBookings = cell.count > 0;
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

            return (
              <div
                key={cell.key}
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`h-20 sm:h-24 rounded-2xl p-2 flex flex-col justify-between text-left transition-all cursor-pointer border ${
                  isSelected 
                    ? 'ring-2 ring-[#1A1A1A] border-[#1A1A1A] bg-amber-50/90 shadow-md' 
                    : hasBookings 
                      ? 'bg-amber-50/50 border-amber-200 hover:border-[#F5A623] shadow-xs' 
                      : 'bg-white border-[#E8E4DA] hover:border-[#8A8A85]'
                }`}
              >
                {/* Top Date Number & Today Pill */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-extrabold ${isToday ? 'px-2 py-0.5 rounded-full bg-[#1A1A1A] text-white text-[10px]' : 'text-[#1A1A1A]'}`}>
                    {cell.day}
                  </span>

                  {hasBookings && (
                    <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                  )}
                </div>

                {/* Bottom Booking Count Button */}
                {hasBookings ? (
                  <button
                    onClick={(e) => handleVisitClick(cell.dateStr, e)}
                    className="w-full px-2 py-1 bg-amber-100/90 hover:bg-[#F5A623] hover:text-white border border-amber-300 text-[#F5A623] font-extrabold text-[10px] rounded-xl flex items-center justify-between shadow-2xs transition-all cursor-pointer group"
                    title={`Click to view ${cell.count} site visit details`}
                  >
                    <span>Visits</span>
                    <span className="bg-[#F5A623] group-hover:bg-white text-white group-hover:text-[#1A1A1A] w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">
                      {cell.count}
                    </span>
                  </button>
                ) : (
                  <span className="text-[10px] text-[#8A8A85]/50 font-medium">No visits</span>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* SELECTED DATE DETAILS PANEL BELOW CALENDAR */}
      <div className="space-y-4 border-t border-[#E8E4DA] pt-6">
        
        {/* Date Details Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">
              DAY VIEW DETAILS
            </span>
            <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#F5A623]" />
              Site Visits for {selectedDate}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8A8A85] font-semibold">
              Showing {selectedBookings.length} walkthroughs
            </span>
            {selectedBookings.length > 0 && (
              <button
                onClick={() => setIsVisitsModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-[#F5A623] text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                View Full Popup
              </button>
            )}
          </div>
        </div>

        {/* Selected Date KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Scheduled Visits" value={kpis.total} icon={CalendarIcon} color="blue" />
          <KPICard title="Active Assignments" value={kpis.assigned} icon={CheckCircle2} color="green" />
          <KPICard title="Pending Assignment" value={kpis.pending} icon={AlertCircle} color="amber" />
          <KPICard title="Cancelled Visits" value={kpis.cancelled} icon={RotateCcw} color="red" />
        </div>

        {/* Selected Date Bookings Grid */}
        {loadingBookings ? (
          <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-[#E8E4DA]">
            <Loader2 className="w-6 h-6 animate-spin text-[#F5A623] mx-auto" />
            <p className="text-xs text-[#8A8A85] font-bold">Loading visits for {selectedDate}...</p>
          </div>
        ) : selectedBookings.length === 0 ? (
          <div className="bg-white border border-dashed border-[#E8E4DA] rounded-3xl p-12 text-center space-y-3">
            <CalendarIcon className="w-10 h-10 text-[#8A8A85] mx-auto opacity-40" />
            <h3 className="text-base font-bold text-[#1A1A1A]">No bookings for this date</h3>
            <p className="text-xs text-[#8A8A85] max-w-sm mx-auto">
              There are no site visits booked on <strong className="text-[#1A1A1A]">{selectedDate}</strong>. Select another date from the calendar above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBookings.map((item) => (
              <motion.div 
                key={item._id || item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-sm space-y-4 hover:border-[#F5A623] transition-all"
              >
                {/* Card Header: Time & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                    <Clock className="w-4 h-4 text-[#F5A623]" />
                    {item.visitTime || item.scheduledTime || '10:00 AM'}
                  </div>
                  <StatusChip status={item.status || 'Scheduled'} />
                </div>

                {/* Property Info */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-[#8A8A85] font-bold block">Property Asset</span>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#F5A623] shrink-0" />
                    <p className="text-sm font-bold text-[#1A1A1A] truncate">
                      {item.property?.title || item.propertyName || 'Architectural Estate'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8A8A85]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#8A8A85]" />
                      {item.property?.city || item.property?.location || 'Chennai'}
                    </span>
                    <span className="font-extrabold text-[#F5A623]">{item.property?.price || 'Price on Request'}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-[#F4F1EA]/60 p-3 rounded-xl space-y-1 border border-[#E8E4DA]/60">
                  <span className="text-[9px] uppercase tracking-wider text-[#8A8A85] font-bold block">Customer Details</span>
                  <p className="text-xs font-bold text-[#1A1A1A]">{item.customerName || item.user?.name || 'Client'}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#4A4A45]">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#8A8A85]" />{item.customerPhone || item.user?.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Assigned Consultant Details */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-[#8A8A85] font-bold block">Assigned Consultant</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-[#F5A623] font-bold flex items-center justify-center text-xs shrink-0">
                        {item.consultant?.name ? item.consultant.name.charAt(0) : 'C'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1A1A1A] truncate">{item.consultant?.name || item.consultantName || 'Unassigned'}</p>
                        <p className="text-[10px] text-[#8A8A85] truncate">{item.consultant?.phone || ''}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setReassignModalTarget(item);
                        setTargetConsultantId(item.consultant?.id || item.consultant?._id || '');
                      }}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#F5A623] transition-colors cursor-pointer"
                      title="Reassign Consultant"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* VISITS DETAILS POPUP MODAL */}
      <AdminModal
        isOpen={isVisitsModalOpen}
        onClose={() => setIsVisitsModalOpen(false)}
        title={`Visits on ${selectedDate}`}
        size="lg"
      >
        <div className="space-y-6 font-sans">
          
          {/* Header Summary */}
          <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#F5A623]" />
              <span className="text-sm font-extrabold text-[#1A1A1A]">
                Site Visits Scheduled for {selectedDate}
              </span>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-[#F5A623] border border-amber-200 rounded-full text-xs font-bold">
              {selectedBookings.length} Total Bookings
            </span>
          </div>

          {/* Bookings List */}
          {loadingBookings ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#F5A623] mx-auto" />
              <p className="text-xs font-bold text-[#8A8A85]">Fetching visits for {selectedDate}...</p>
            </div>
          ) : selectedBookings.length === 0 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-[#E8E4DA] rounded-2xl bg-stone-50/50">
              <CalendarIcon className="w-10 h-10 text-[#8A8A85] mx-auto opacity-40" />
              <p className="text-sm font-bold text-[#1A1A1A]">No bookings for this date</p>
              <p className="text-xs text-[#8A8A85]">There are no site visits scheduled on {selectedDate}.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {selectedBookings.map((item) => (
                <div
                  key={item._id || item.id}
                  className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs space-y-4 hover:border-[#F5A623] transition-all"
                >
                  {/* Header: Time & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA]">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#1A1A1A]">
                      <Clock className="w-4 h-4 text-[#F5A623]" />
                      <span>{item.visitTime || item.scheduledTime || '10:00 AM'}</span>
                    </div>
                    <StatusChip status={item.status || 'Scheduled'} />
                  </div>

                  {/* Grid for Property, Customer, and Consultant */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    
                    {/* Property Details */}
                    <div className="space-y-1 bg-[#F4F1EA]/50 p-3 rounded-xl border border-[#E8E4DA]/60">
                      <span className="text-[9px] uppercase tracking-widest text-[#F5A623] font-bold block">PROPERTY</span>
                      <h4 className="font-bold text-[#1A1A1A] text-sm truncate">
                        {item.property?.title || item.propertyName || 'Architectural Estate'}
                      </h4>
                      <p className="text-[#8A8A85] flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-[#8A8A85]" />
                        {item.property?.city || item.property?.location || 'Chennai'}
                      </p>
                      <p className="text-[#F5A623] font-extrabold">{item.property?.price || 'Price on Request'}</p>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-1 bg-[#F4F1EA]/50 p-3 rounded-xl border border-[#E8E4DA]/60">
                      <span className="text-[9px] uppercase tracking-widest text-[#F5A623] font-bold block">CUSTOMER</span>
                      <h4 className="font-bold text-[#1A1A1A] text-sm truncate">
                        {item.customerName || item.user?.name || 'Customer'}
                      </h4>
                      <p className="text-[#4A4A45] flex items-center gap-1 font-semibold">
                        <Phone className="w-3 h-3 text-[#8A8A85]" />
                        {item.customerPhone || item.user?.phone || 'N/A'}
                      </p>
                      {item.customerEmail || item.user?.email ? (
                        <p className="text-[#8A8A85] truncate font-medium">
                          {item.customerEmail || item.user?.email}
                        </p>
                      ) : null}
                    </div>

                    {/* Consultant Details */}
                    <div className="space-y-1 bg-[#F4F1EA]/50 p-3 rounded-xl border border-[#E8E4DA]/60 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#F5A623] font-bold block">CONSULTANT</span>
                        <h4 className="font-bold text-[#1A1A1A] text-sm truncate">
                          {item.consultant?.name || item.consultantName || 'Unassigned'}
                        </h4>
                        <p className="text-[#4A4A45] flex items-center gap-1 font-semibold">
                          <Phone className="w-3 h-3 text-[#8A8A85]" />
                          {item.consultant?.phone || 'N/A'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsVisitsModalOpen(false);
                          setReassignModalTarget(item);
                          setTargetConsultantId(item.consultant?.id || item.consultant?._id || '');
                        }}
                        className="mt-2 py-1.5 px-3 bg-amber-100 hover:bg-[#F5A623] hover:text-white text-[#F5A623] rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reassign</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Action */}
          <div className="flex justify-end pt-2 border-t border-[#E8E4DA]">
            <button
              onClick={() => setIsVisitsModalOpen(false)}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </AdminModal>

      {/* Reassign Modal */}
      <AdminModal
        isOpen={!!reassignModalTarget}
        onClose={() => setReassignModalTarget(null)}
        title="Reassign Consultant"
        size="sm"
      >
        <div className="space-y-4 font-sans">
          <p className="text-xs text-[#8A8A85]">
            Reassigning visit for <strong className="text-[#1A1A1A]">{reassignModalTarget?.customerName || reassignModalTarget?.user?.name}</strong> for property <strong className="text-[#1A1A1A]">{reassignModalTarget?.property?.title || reassignModalTarget?.propertyName}</strong>.
          </p>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold block">
              Select New Consultant *
            </label>
            <select
              value={targetConsultantId}
              onChange={e => setTargetConsultantId(e.target.value)}
              className="w-full p-3 bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl text-xs text-[#1A1A1A] font-bold outline-none focus:border-[#F5A623] cursor-pointer"
            >
              <option value="">-- Choose Consultant --</option>
              {consultants
                .filter(c => c.isActive)
                .map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.city}) - Max {c.maxDailyVisits}/day
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setReassignModalTarget(null)}
              className="flex-1 py-3 border border-[#E8E4DA] rounded-xl text-xs font-bold text-[#8A8A85] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReassignSubmit}
              disabled={reassigning}
              className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
            >
              {reassigning ? 'Reassigning...' : 'Confirm Reassign'}
            </button>
          </div>
        </div>
      </AdminModal>

    </div>
  );
};

export default AdminVisitCalendarPage;
