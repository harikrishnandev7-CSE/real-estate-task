import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  List, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Building, 
  MapPin, 
  Phone, 
  AlertCircle,
  RotateCcw,
  Check,
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import KPICard from '../../components/admin/primitives/KPICard';
import DataTable from '../../components/admin/primitives/DataTable';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { 
  FormLabel, 
  TextInput, 
  SelectInput, 
  TextAreaInput, 
  SegmentedControl 
} from '../../components/admin/primitives/FormField';

const TIME_SLOTS = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];
const CONSULTANTS = ['Vikram Malhotra', 'Ananya Deshmukh', 'Siddharth Verma'];
const CANCEL_REASONS = ['Customer Request', 'No-show / Unreachable', 'Weather / Rain', 'Property Unavailable'];

const AdminSiteVisitsPage = () => {
  const { 
    siteVisits = [], 
    properties = [], 
    addSiteVisit, 
    updateSiteVisit, 
    confirmSiteVisit,
    rescheduleSiteVisit, 
    cancelSiteVisit, 
    completeSiteVisit, 
    showToast 
  } = useApp();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Upcoming' | 'Completed' | 'Cancelled'

  // Modal & Drawer states
  const [rescheduleVisit, setRescheduleVisit] = useState(null); // target for Reschedule modal
  const [cancelTargetVisit, setCancelTargetVisit] = useState(null); // target for Cancel modal
  const [completeTargetVisit, setCompleteTargetVisit] = useState(null); // target for Mark Completed modal
  const [detailVisit, setDetailVisit] = useState(null); // target for Detail drawer
  const [isLogModalOpen, setIsLogModalOpen] = useState(false); // target for Log Manual Visit

  // Reschedule Form State
  const [rescheduleForm, setRescheduleForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "11:00 AM",
    consultantName: "Vikram Malhotra"
  });

  // Cancel Form State
  const [cancelReason, setCancelReason] = useState('Customer Request');

  // Complete Form State
  const [completionNote, setCompletionNote] = useState('');

  // Log Manual Visit Form State
  const [logVisitForm, setLogVisitForm] = useState({
    customerName: '',
    customerPhone: '',
    propertyName: 'The ECR Beachfront Villa',
    date: new Date().toISOString().split('T')[0],
    time: "11:00 AM",
    consultantName: "Vikram Malhotra"
  });

  // Filtered Site Visits
  const filteredVisits = useMemo(() => {
    return siteVisits.filter(v => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'Upcoming') return v.status === 'Confirmed' || v.status === 'Scheduled';
      if (statusFilter === 'Completed') return v.status === 'Completed';
      if (statusFilter === 'Cancelled') return v.status === 'Cancelled' || v.status === 'No-show';
      return true;
    });
  }, [siteVisits, statusFilter]);

  // Open Reschedule Modal Helper
  const handleOpenReschedule = (visit) => {
    setRescheduleVisit(visit);
    setRescheduleForm({
      date: visit.date || new Date().toISOString().split('T')[0],
      time: visit.time || "11:00 AM",
      consultantName: visit.consultantName || "Vikram Malhotra"
    });
  };

  // Submit Reschedule Action
  const handleConfirmReschedule = () => {
    if (!rescheduleVisit) return;
    rescheduleSiteVisit(rescheduleVisit.id, rescheduleForm.date, rescheduleForm.time, rescheduleForm.consultantName);
    setRescheduleVisit(null);
  };

  // Submit Cancel Action
  const handleConfirmCancel = () => {
    if (!cancelTargetVisit) return;
    cancelSiteVisit(cancelTargetVisit.id, cancelReason);
    setCancelTargetVisit(null);
  };

  // Submit Mark Completed Action
  const handleConfirmComplete = () => {
    if (!completeTargetVisit) return;
    completeSiteVisit(completeTargetVisit.id, completionNote);
    setCompleteTargetVisit(null);
    setCompletionNote('');
  };

  // Log Manual Visit Action
  const handleCreateManualVisit = () => {
    if (!logVisitForm.customerName.trim() || !logVisitForm.customerPhone.trim()) {
      showToast("Customer Name and Phone are required.");
      return;
    }

    addSiteVisit({
      ...logVisitForm,
      status: "Confirmed"
    });

    setIsLogModalOpen(false);
    setLogVisitForm({
      customerName: '',
      customerPhone: '',
      propertyName: 'The ECR Beachfront Villa',
      date: new Date().toISOString().split('T')[0],
      time: "11:00 AM",
      consultantName: "Vikram Malhotra"
    });
  };

  // DataTable Column Definitions
  const columns = [
    {
      key: 'customerName',
      label: 'Customer Name & Phone',
      sortable: true,
      render: (_, row) => (
        <div className="font-sans">
          <span className="font-extrabold text-[#1A1A1A] block">{row.customerName || 'Vikramaditya Roy'}</span>
          <span className="text-[10px] text-[#8A8A85] flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3 text-[#F5A623]" />
            <span>{row.customerPhone || '+91 98765 43210'}</span>
          </span>
        </div>
      )
    },
    {
      key: 'propertyName',
      label: 'Target Estate',
      render: (val) => (
        <div className="font-sans">
          <span className="font-extrabold text-[#1A1A1A] block">{val}</span>
          <span className="text-[10px] text-[#8A8A85]">ECR, Chennai</span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date & Time Slot',
      sortable: true,
      render: (_, row) => (
        <div className="font-sans text-xs">
          <span className="font-bold text-[#1A1A1A] block">{row.date}</span>
          <span className="text-[10px] text-[#F5A623] font-extrabold">{row.time}</span>
        </div>
      )
    },
    {
      key: 'consultantName',
      label: 'Assigned Consultant',
      render: (val) => (
        <span className="text-xs font-bold text-[#1A1A1A] bg-[#F4F1EA] px-2.5 py-1 rounded-lg border border-[#E8E4DA]">
          {val || 'Vikram Malhotra'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusChip status={val || 'Confirmed'} />
    },
    {
      key: 'actions',
      label: 'Quick Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5 font-sans">
          {row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <>
              {(row.status === 'Scheduled' || row.status === 'Pending') && (
                <button
                  onClick={(e) => { e.stopPropagation(); confirmSiteVisit(row.id || row._id); }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 cursor-pointer flex items-center gap-1 shadow-xs transition-all"
                >
                  <Check className="w-3 h-3" />
                  Confirm Visit
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handleOpenReschedule(row); }}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-[#1A1A1A] border border-amber-200 text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
              >
                Reschedule
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCancelTargetVisit(row); }}
                className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold hover:bg-red-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCompleteTargetVisit(row); }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold hover:bg-stone-200 cursor-pointer"
              >
                Complete
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* ── KPI STRIP ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Visits Today"
          value={6}
          icon={CalendarIcon}
          delta={{ value: '+2 today', positive: true }}
          sparkline={[2, 3, 4, 5, 4, 6, 6]}
        />
        <KPICard
          title="Visits This Week"
          value={siteVisits.length || 24}
          icon={Clock}
          delta={{ value: '+24.1%', positive: true }}
          sparkline={[10, 12, 14, 16, 18, 20, siteVisits.length || 24]}
        />
        <KPICard
          title="Completion Rate"
          value="88.5%"
          icon={CheckCircle2}
          delta={{ value: '+3.2%', positive: true }}
          sparkline={[80, 82, 84, 85, 87, 88, 88.5]}
        />
        <KPICard
          title="No-Show Rate"
          value="4.2%"
          icon={AlertCircle}
          delta={{ value: '-1.5%', positive: true }}
          sparkline={[8, 7, 6, 5, 5, 4.5, 4.2]}
        />
      </div>

      {/* ── TOOLBAR CONTROLS & FILTER PILLS ─────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
            BUYER TOUR SCHEDULER
          </span>
          <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
            Site Visits Calendar & Roster
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Segmented Pills */}
          <div className="flex items-center p-1 bg-[#F4F1EA] border border-[#E8E4DA] rounded-full text-xs font-bold">
            {['All', 'Upcoming', 'Completed', 'Cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* List / Calendar View Toggle */}
          <div className="flex items-center p-1 bg-[#F4F1EA] border border-[#E8E4DA] rounded-full">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
              }`}
              title="Calendar View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Log Manual Visit Primary Black Pill */}
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#F5A623]" />
            <span>Log Visit</span>
          </button>
        </div>
      </div>

      {/* ── LIST VIEW vs CALENDAR VIEW ───────────────────────────────── */}
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={filteredVisits}
          pageSize={8}
          onRowClick={(row) => setDetailVisit(row)}
          onView={(row) => setDetailVisit(row)}
        />
      ) : (
        /* CALENDAR VIEW GRID */
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] font-sans space-y-6">
          <div className="border-b border-[#E8E4DA] pb-4 flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Time-Slot Schedule Grid</h3>
            <span className="text-xs text-[#8A8A85] font-bold">Today & Upcoming Week</span>
          </div>

          <div className="space-y-4">
            {TIME_SLOTS.map(slot => {
              const visitsInSlot = filteredVisits.filter(v => v.time === slot);

              return (
                <div key={slot} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-[#E8E4DA] pb-4">
                  <div className="w-28 shrink-0 text-xs font-extrabold text-[#F5A623] bg-[#F4F1EA] px-3 py-1.5 rounded-xl border border-[#E8E4DA] text-center font-mono">
                    {slot}
                  </div>

                  <div className="flex-1 flex flex-wrap gap-3 w-full">
                    {visitsInSlot.length === 0 ? (
                      <span className="text-xs text-[#8A8A85] italic py-1">No site visits scheduled for this slot</span>
                    ) : (
                      visitsInSlot.map(visit => (
                        <div
                          key={visit.id}
                          onClick={() => setDetailVisit(visit)}
                          className={`p-3 rounded-2xl border text-xs font-sans cursor-pointer transition-all hover:scale-[1.01] shadow-xs flex items-center gap-3 min-w-[240px] ${
                            visit.status === 'Completed'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : visit.status === 'Cancelled'
                              ? 'bg-red-50 border-red-200 text-red-900 opacity-60'
                              : 'bg-[#F4F1EA] border-[#E8E4DA] text-[#1A1A1A] hover:border-[#F5A623]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F5A623] font-bold text-xs flex items-center justify-center shrink-0">
                            {(visit.customerName || 'V').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold block truncate">{visit.customerName || 'Vikramaditya Roy'}</span>
                            <span className="text-[10px] opacity-75 truncate block">{visit.propertyName}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL: RESCHEDULE SITE VISIT ───────────────────────────── */}
      <AdminModal
        isOpen={Boolean(rescheduleVisit)}
        onClose={() => setRescheduleVisit(null)}
        title="Reschedule Site Visit"
        subtitle={`Select new slot and consultant for ${rescheduleVisit?.customerName || 'customer'}.`}
        size="md"
        confirmText="Confirm Reschedule"
        onConfirm={handleConfirmReschedule}
      >
        <div className="space-y-4 font-sans">
          <TextInput
            label="New Tour Date *"
            type="date"
            min={new Date().toISOString().split('T')[0]} // Cannot select past dates
            value={rescheduleForm.date}
            onChange={(e) => setRescheduleForm(prev => ({ ...prev, date: e.target.value }))}
          />

          <SelectInput
            label="Time Slot *"
            value={rescheduleForm.time}
            onChange={(e) => setRescheduleForm(prev => ({ ...prev, time: e.target.value }))}
            options={TIME_SLOTS}
          />

          <SelectInput
            label="Reassign Consultant"
            value={rescheduleForm.consultantName}
            onChange={(e) => setRescheduleForm(prev => ({ ...prev, consultantName: e.target.value }))}
            options={CONSULTANTS}
          />
        </div>
      </AdminModal>

      {/* ── MODAL: CANCEL SITE VISIT ───────────────────────────────── */}
      <AdminModal
        isOpen={Boolean(cancelTargetVisit)}
        onClose={() => setCancelTargetVisit(null)}
        title="Cancel Site Visit"
        subtitle="Please select a reason before confirming cancellation."
        size="sm"
        isDestructive
        confirmText="Confirm Cancellation"
        onConfirm={handleConfirmCancel}
      >
        <div className="space-y-4 font-sans">
          <SelectInput
            label="Cancellation Reason *"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            options={CANCEL_REASONS}
          />
        </div>
      </AdminModal>

      {/* ── MODAL: MARK COMPLETED ─────────────────────────────────── */}
      <AdminModal
        isOpen={Boolean(completeTargetVisit)}
        onClose={() => setCompleteTargetVisit(null)}
        title="Mark Visit as Completed"
        subtitle="Confirm completion of the site visit and optionally add meeting notes."
        size="sm"
        confirmText="Mark Completed"
        onConfirm={handleConfirmComplete}
      >
        <div className="space-y-4 font-sans">
          <TextAreaInput
            label="Optional Tour Notes / Buyer Feedback"
            value={completionNote}
            onChange={(e) => setCompletionNote(e.target.value)}
            rows={3}
            placeholder="Buyer loved master suite layout; interested in booking deposit..."
          />
        </div>
      </AdminModal>

      {/* ── MODAL: LOG MANUAL VISIT ───────────────────────────────── */}
      <AdminModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Phone-Booked Site Visit"
        subtitle="Record a new buyer tour scheduled via phone or walk-in enquiry."
        size="md"
        confirmText="Log Site Visit"
        onConfirm={handleCreateManualVisit}
      >
        <div className="space-y-4 font-sans">
          <TextInput
            label="Customer Full Name *"
            required
            value={logVisitForm.customerName}
            onChange={(e) => setLogVisitForm(prev => ({ ...prev, customerName: e.target.value }))}
            placeholder="e.g. Ramesh Subramaniam"
          />

          <TextInput
            label="Phone Number *"
            required
            value={logVisitForm.customerPhone}
            onChange={(e) => setLogVisitForm(prev => ({ ...prev, customerPhone: e.target.value }))}
            placeholder="+91 98765 43210"
          />

          <SelectInput
            label="Target Estate Property *"
            value={logVisitForm.propertyName}
            onChange={(e) => setLogVisitForm(prev => ({ ...prev, propertyName: e.target.value }))}
            options={properties.map(p => p.title).concat(['The ECR Beachfront Villa', 'Golden Meadows'])}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Visit Date *"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={logVisitForm.date}
              onChange={(e) => setLogVisitForm(prev => ({ ...prev, date: e.target.value }))}
            />

            <SelectInput
              label="Time Slot *"
              value={logVisitForm.time}
              onChange={(e) => setLogVisitForm(prev => ({ ...prev, time: e.target.value }))}
              options={TIME_SLOTS}
            />
          </div>

          <SelectInput
            label="Assigned Consultant"
            value={logVisitForm.consultantName}
            onChange={(e) => setLogVisitForm(prev => ({ ...prev, consultantName: e.target.value }))}
            options={CONSULTANTS}
          />
        </div>
      </AdminModal>

      {/* ── DETAIL DRAWER: VISIT AUDIT & PROPERTY SNAPSHOT ───────── */}
      <AdminModal
        isOpen={Boolean(detailVisit)}
        onClose={() => setDetailVisit(null)}
        title="Site Visit Details & Audit Log"
        subtitle={`${detailVisit?.propertyName || ''} · ${detailVisit?.date || ''}`}
        size="drawer"
      >
        {detailVisit && (
          <div className="space-y-6 font-sans">
            
            {/* Customer & Slot Banner */}
            <div className="p-5 rounded-2xl bg-[#F4F1EA] border border-[#E8E4DA] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-[#F5A623]">TOUR SLOT</span>
                <StatusChip status={detailVisit.status} />
              </div>
              <h4 className="text-xl font-extrabold text-[#1A1A1A]">{detailVisit.customerName || 'Vikramaditya Roy'}</h4>
              <p className="text-xs text-[#8A8A85] flex items-center gap-4">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#F5A623]" /> {detailVisit.customerPhone || '+91 98765 43210'}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#F5A623]" /> {detailVisit.date} at {detailVisit.time}</span>
              </p>
            </div>

            {/* Property Snapshot Card */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#8A8A85]">TARGET ESTATE</span>
              <div className="p-4 rounded-xl border border-[#E8E4DA] bg-white flex items-center gap-3">
                <Building className="w-8 h-8 text-[#F5A623] shrink-0" />
                <div>
                  <span className="font-extrabold text-[#1A1A1A] block">{detailVisit.propertyName}</span>
                  <span className="text-xs text-[#8A8A85]">East Coast Road, Chennai</span>
                </div>
              </div>
            </div>

            {/* Consultant & Notes */}
            <div className="space-y-2 border-t border-[#E8E4DA] pt-4 text-xs">
              <div><span className="text-[10px] text-[#8A8A85] block font-bold uppercase">ASSIGNED CONSULTANT</span><span className="font-extrabold text-[#1A1A1A]">{detailVisit.consultantName || 'Vikram Malhotra'}</span></div>
              {detailVisit.completionNote && (
                <div className="pt-2"><span className="text-[10px] text-[#8A8A85] block font-bold uppercase">TOUR FEEDBACK NOTE</span><p className="text-[#1A1A1A] font-medium leading-relaxed">{detailVisit.completionNote}</p></div>
              )}
              {detailVisit.cancelReason && (
                <div className="pt-2"><span className="text-[10px] text-red-600 block font-bold uppercase">CANCELLATION REASON</span><p className="text-red-700 font-medium">{detailVisit.cancelReason}</p></div>
              )}
            </div>

          </div>
        )}
      </AdminModal>

    </div>
  );
};

export default AdminSiteVisitsPage;
