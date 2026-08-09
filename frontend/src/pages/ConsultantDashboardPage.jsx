import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Building,
  LogOut,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusChip from '../components/admin/primitives/StatusChip';
import api from '../services/api';

const ConsultantDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'upcoming' | 'completed'
  const [profile, setProfile] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Security guard
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'consultant' && currentUser.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Profile
      const profRes = await api.getConsultantProfile().catch(() => null);
      setProfile(profRes?.consultant || null);

      // 2. Visits based on tab
      let res;
      if (activeTab === 'today') {
        res = await api.getConsultantVisitsToday();
      } else if (activeTab === 'upcoming') {
        res = await api.getConsultantVisitsUpcoming();
      } else {
        res = await api.getConsultantVisitsCompleted();
      }
      setVisits(res?.visits || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch consultant data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && (currentUser.role === 'consultant' || currentUser.role === 'admin')) {
      loadData();
    }
  }, [activeTab, currentUser]);

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      await api.updateConsultantVisitStatus(assignmentId, newStatus);
      showToast(`Visit status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F4F1EA] text-[#1A1A1A] px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Profile / Header Banner */}
        <div className="bg-white border border-[#E8E4DA] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-[#F5A623] flex items-center justify-center font-extrabold text-xl shadow-inner">
              {currentUser?.fullName?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#1A1A1A]">{profile?.name || currentUser?.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#F5A623] text-[10px] font-bold uppercase tracking-wider">
                  Consultant
                </span>
              </div>
              <p className="text-xs text-[#8A8A85] mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#F5A623]" />{profile?.city || 'Chennai'}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-[#F5A623]" />Cap: {profile?.maxDailyVisits || 5}/day</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-red-50 hover:text-red-600 text-xs font-bold text-[#1A1A1A] transition-colors self-start md:self-auto"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E4DA] pb-2">
          {[
            { id: 'today', label: "Today's Schedule" },
            { id: 'upcoming', label: 'Upcoming Visits' },
            { id: 'completed', label: 'Completed Visits' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'bg-white text-[#8A8A85] hover:text-[#1A1A1A] border border-[#E8E4DA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Visits Content */}
        {loading ? (
          <div className="py-20 text-center text-xs text-[#8A8A85]">Loading schedule...</div>
        ) : visits.length === 0 ? (
          <div className="bg-white border border-[#E8E4DA] rounded-3xl p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-[#8A8A85] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-[#1A1A1A]">No visits found</h3>
            <p className="text-xs text-[#8A8A85]">There are no site visits listed in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visits.map((item) => {
              const b = item.visitRequest || {};
              const p = b.property || {};

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-sm space-y-4 hover:border-[#F5A623] transition-all"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                      <Clock className="w-4 h-4 text-[#F5A623]" />
                      <span>{item.date} — {b.scheduledTime || '10:00 AM'}</span>
                    </div>
                    <StatusChip status={b.status || item.status} />
                  </div>

                  {/* Property */}
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Property</p>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#F5A623] shrink-0" />
                      <p className="text-sm font-bold text-[#1A1A1A]">{p.title || b.propertyName || 'Property Asset'}</p>
                    </div>
                    <p className="text-xs text-[#8A8A85] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8A8A85]" />
                      {p.location || p.city || 'Location N/A'}
                    </p>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-[#F4F1EA]/60 p-3.5 rounded-xl space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">Client Information</p>
                    <p className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#F5A623]" />
                      {b.customerName || 'Valued Client'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#4A4A45]">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#8A8A85]" />{b.customerPhone || 'N/A'}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#8A8A85]" />{b.customerEmail || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  {activeTab === 'today' && b.status !== 'Completed' && (
                    <div className="flex gap-2 pt-2 border-t border-[#F4F1EA]">
                      <button
                        onClick={() => handleStatusUpdate(item._id, 'Confirmed')}
                        className="flex-1 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item._id, 'Completed')}
                        className="flex-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item._id, 'No-show')}
                        className="py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        No-show
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default ConsultantDashboardPage;
