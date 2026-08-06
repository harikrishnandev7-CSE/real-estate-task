import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Send, 
  Users, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Eye, 
  Sparkles, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  AlertCircle,
  X,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { 
  FormLabel, 
  TextInput, 
  TextAreaInput, 
  SegmentedControl, 
  ToggleSwitch, 
  MultiSelectChips 
} from '../../components/admin/primitives/FormField';

const AUDIENCE_OPTIONS = ['All Customers', 'Buyers Only', 'Renters Only', 'Chennai Buyers', 'Wishlist Matched'];

const AdminNotificationsPage = () => {
  const { broadcasts = [], addBroadcast, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'broadcast'
  const [alertFilter, setAlertFilter] = useState('All'); // 'All' | 'Unread' | 'Read'

  // Admin Alerts Mock State (re-scoped to admin events)
  const [alerts, setAlerts] = useState([
    {
      id: 'n1',
      title: 'New High-Value Enquiry Received',
      desc: 'Rajesh Subramaniam submitted a floor plan request for The Ritz-Carlton Residences.',
      time: '10 mins ago',
      type: 'enquiry',
      unread: true,
      category: 'Enquiry'
    },
    {
      id: 'n2',
      title: 'Site Visit Cancelled by Customer',
      desc: 'Priya Sundaram cancelled scheduled tour for Golden Meadows due to weather.',
      time: '1 hour ago',
      type: 'visit',
      unread: true,
      category: 'Site Visit'
    },
    {
      id: 'n3',
      title: 'New VIP Customer Signup',
      desc: 'Karthik Raja completed onboarding preferences (Budget: ₹8Cr–₹15Cr).',
      time: '3 hours ago',
      type: 'signup',
      unread: false,
      category: 'Signup'
    },
    {
      id: 'n4',
      title: 'Legal Document Uploaded',
      desc: 'DTCP verification certificate uploaded for Kalapatti Commercial Land.',
      time: ' Yesterday',
      type: 'document',
      unread: false,
      category: 'Compliance'
    }
  ]);

  // Broadcast Compose Form State
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    audiences: ['All Customers'],
    channels: ['In-App', 'Email'],
    scheduleType: 'Send Now',
    scheduleDateTime: ''
  });

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);

  // Filtered Admin Alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (alertFilter === 'Unread') return a.unread;
      if (alertFilter === 'Read') return !a.unread;
      return true;
    });
  }, [alerts, alertFilter]);

  // Mark Alert Read / Unread
  const toggleAlertRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, unread: !a.unread } : a));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, unread: false })));
    showToast("All admin alerts marked as read.");
  };

  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast("Alert removed.");
  };

  // Channel Checkbox Toggle
  const toggleChannel = (ch) => {
    setBroadcastForm(prev => {
      const exists = prev.channels.includes(ch);
      const updated = exists ? prev.channels.filter(c => c !== ch) : [...prev.channels, ch];
      return { ...prev, channels: updated };
    });
  };

  // Validate Broadcast Form
  const isFormValid = useMemo(() => {
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) return false;
    if (broadcastForm.audiences.length === 0) return false;
    if (broadcastForm.channels.length === 0) return false;
    return true;
  }, [broadcastForm]);

  // Submit Broadcast
  const handleConfirmSend = async () => {
    try {
      await addBroadcast({
        title: broadcastForm.title,
        message: broadcastForm.message,
        audience: broadcastForm.audiences.join(', '),
        channels: broadcastForm.channels
      });

      setIsSendConfirmOpen(false);
      setBroadcastForm({
        title: '',
        message: '',
        audiences: ['All Customers'],
        channels: ['In-App', 'Email'],
        scheduleType: 'Send Now',
        scheduleDateTime: ''
      });
    } catch (err) {
      if (showToast) showToast(`Broadcast failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* ── TOPBAR TAB SWITCHER ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
            COMMUNICATIONS CENTER
          </span>
          <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
            Notifications & Customer Broadcasts
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-[#F4F1EA] border border-[#E8E4DA] rounded-full">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'alerts' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>My Alerts ({alerts.filter(a => a.unread).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'broadcast' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Broadcast to Customers</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: MY ALERTS ────────────────────────────────────────── */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Sub-toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2">
              {['All', 'Unread', 'Read'].map(st => (
                <button
                  key={st}
                  onClick={() => setAlertFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    alertFilter === st ? 'bg-[#1A1A1A] text-white' : 'bg-[#F4F1EA] text-[#8A8A85] hover:text-[#1A1A1A]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={markAllAlertsRead}
              className="text-xs font-bold text-[#1A1A1A] hover:text-[#F5A623] underline cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          {/* Alerts List (Matching Phase 1 Customer Notifications style) */}
          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 font-sans ${
                  alert.unread
                    ? 'bg-white border-[#F5A623] shadow-[0_5px_15px_rgba(245,166,35,0.08)]'
                    : 'bg-white border-[#E8E4DA] opacity-80'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#F4F1EA] text-[#1A1A1A] uppercase tracking-wider">
                        {alert.category}
                      </span>
                      {alert.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#F5A623]" title="Unread alert" />
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-[#1A1A1A]">{alert.title}</h4>
                    <p className="text-xs text-[#2D2B28] leading-relaxed">{alert.desc}</p>
                    <span className="text-[10px] text-[#8A8A85] font-semibold block">{alert.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAlertRead(alert.id)}
                    className="p-2 rounded-lg text-[#8A8A85] hover:text-[#1A1A1A] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                    title={alert.unread ? "Mark as Read" : "Mark as Unread"}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${alert.unread ? 'text-[#8A8A85]' : 'text-emerald-600'}`} />
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 rounded-lg text-[#8A8A85] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: BROADCAST TO CUSTOMERS ───────────────────────────── */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Compose Broadcast Form */}
          <div className="lg:col-span-2 bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.04)] space-y-6 font-sans">
            <div className="border-b border-[#E8E4DA] pb-4">
              <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Compose Customer Broadcast</h3>
              <p className="text-xs text-[#8A8A85]">Send multi-channel push, email, and WhatsApp notifications to buyer segments.</p>
            </div>

            <TextInput
              label="Broadcast Title *"
              required
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Exclusive VIP Access: Beachfront Villa Collection"
            />

            <TextAreaInput
              label="Notification Message Content *"
              required
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              placeholder="Write clear, engaging notification copy..."
            />

            <MultiSelectChips
              label="Target Audience Segments *"
              options={AUDIENCE_OPTIONS}
              selected={broadcastForm.audiences}
              onChange={(vals) => setBroadcastForm(prev => ({ ...prev, audiences: vals }))}
            />

            {/* Delivery Channel Checkboxes */}
            <div className="space-y-2">
              <FormLabel required>Delivery Channels *</FormLabel>
              <div className="flex flex-wrap gap-4 pt-1">
                {[
                  { id: 'In-App', label: 'In-App Notification', icon: Bell },
                  { id: 'Email', label: 'Email Newsletter', icon: Mail },
                  { id: 'WhatsApp', label: 'WhatsApp Business', icon: MessageSquare }
                ].map(ch => {
                  const isChecked = broadcastForm.channels.includes(ch.id);
                  const IconComp = ch.icon;

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleChannel(ch.id)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isChecked
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#F4F1EA] text-[#8A8A85] border-[#E8E4DA] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{ch.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule Segmented Switch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <SegmentedControl
                label="Dispatch Schedule"
                options={['Send Now', 'Schedule for Later']}
                value={broadcastForm.scheduleType}
                onChange={(val) => setBroadcastForm(prev => ({ ...prev, scheduleType: val }))}
              />

              {broadcastForm.scheduleType === 'Schedule for Later' && (
                <TextInput
                  label="Scheduled Date & Time *"
                  type="datetime-local"
                  value={broadcastForm.scheduleDateTime}
                  onChange={(e) => setBroadcastForm(prev => ({ ...prev, scheduleDateTime: e.target.value }))}
                />
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="px-5 py-2.5 bg-white border border-[#E8E4DA] hover:bg-[#F4F1EA] text-[#1A1A1A] text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#F5A623]" />
                <span>Preview Notification</span>
              </button>

              <button
                type="button"
                disabled={!isFormValid}
                onClick={() => setIsSendConfirmOpen(true)}
                className="px-7 py-2.5 bg-[#F5A623] hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{broadcastForm.scheduleType === 'Send Now' ? 'Send Broadcast Now' : 'Schedule Dispatch'}</span>
              </button>
            </div>
          </div>

          {/* Right 1 Col: Recent Broadcasts History */}
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] space-y-4 font-sans h-fit">
            <div className="border-b border-[#E8E4DA] pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-extrabold block">
                DISPATCH AUDIT LOG
              </span>
              <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight">
                Recent Broadcasts
              </h3>
            </div>

            <div className="space-y-3">
              {broadcasts.map(bc => (
                <div key={bc.id} className="p-4 rounded-xl bg-[#F4F1EA]/60 border border-[#E8E4DA] text-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-[#F5A623] border border-amber-200">
                      {bc.audience}
                    </span>
                    <span className="text-[10px] text-[#8A8A85] font-semibold">{bc.sentDate}</span>
                  </div>

                  <h4 className="font-extrabold text-[#1A1A1A]">{bc.title}</h4>
                  <p className="text-[11px] text-[#8A8A85] line-clamp-2">{bc.message}</p>

                  <div className="border-t border-[#E8E4DA] pt-2 flex items-center justify-between text-[10px] font-bold text-[#1A1A1A]">
                    <span>Channels: {bc.channels?.join(', ')}</span>
                    <span className="text-emerald-600 font-extrabold">{bc.openRate} open rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS: PREVIEW & RECIPIENT COUNT CONFIRM ──────────────── */}
      <AdminModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Notification Preview (Customer View)"
        subtitle="Rendering exactly as customers will experience in their notifications center."
        size="md"
      >
        <div className="p-5 rounded-2xl bg-white border-2 border-[#F5A623] shadow-md space-y-3 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-[#F5A623] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#F4F1EA] text-[#1A1A1A] uppercase">
                {broadcastForm.audiences.join(', ') || 'VIP Alert'}
              </span>
              <h4 className="text-base font-extrabold text-[#1A1A1A] mt-0.5">{broadcastForm.title || 'Broadcast Title'}</h4>
            </div>
          </div>
          <p className="text-xs text-[#2D2B28] leading-relaxed">{broadcastForm.message || 'Notification body text preview...'}</p>
        </div>
      </AdminModal>

      <AdminModal
        isOpen={isSendConfirmOpen}
        onClose={() => setIsSendConfirmOpen(false)}
        title="Confirm Broadcast Dispatch"
        subtitle={`This broadcast will be dispatched to ~1,420 registered buyers across selected channels.`}
        size="sm"
        confirmText="Confirm & Send"
        onConfirm={handleConfirmSend}
      >
        <div className="space-y-3 text-xs text-[#8A8A85] font-sans">
          <div className="p-3 rounded-xl bg-[#F4F1EA] border border-[#E8E4DA] space-y-1">
            <div><span className="font-bold text-[#1A1A1A]">Audience:</span> {broadcastForm.audiences.join(', ')}</div>
            <div><span className="font-bold text-[#1A1A1A]">Channels:</span> {broadcastForm.channels.join(', ')}</div>
          </div>
        </div>
      </AdminModal>

    </div>
  );
};

export default AdminNotificationsPage;
