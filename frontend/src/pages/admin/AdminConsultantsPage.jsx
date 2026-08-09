import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, MapPin, Phone, Mail,
  CheckCircle2, XCircle, Trash2, Edit3, Shield, Clock, Star,
  Calendar, Eye, UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import KPICard from '../../components/admin/primitives/KPICard';
import DataTable from '../../components/admin/primitives/DataTable';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { FormLabel, TextInput, SelectInput } from '../../components/admin/primitives/FormField';
import api from '../../services/api';

const CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Ooty', 'Bengaluru', 'Hyderabad'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ALL_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Kannada', 'Malayalam'];

const emptyForm = {
  name: '', email: '', phone: '', city: 'Chennai',
  password: '', maxDailyVisits: 5, dailyVisitCap: 5,
  workingDays: [1, 2, 3, 4, 5],
  languages: ['Tamil', 'English'],
};

const AdminConsultantsPage = () => {
  const { showToast, siteVisits = [] } = useApp();
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Allocations modal state
  const [isAllocationsOpen, setIsAllocationsOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [loadingAllocations, setLoadingAllocations] = useState(false);

  const openAllocationsModal = async (c) => {
    setSelectedConsultant(c);
    setIsAllocationsOpen(true);
    setLoadingAllocations(true);
    try {
      const res = await api.getConsultantAllocations(c._id);
      setAllocations(res.allocations || []);
    } catch (err) {
      // Fallback matching from app context siteVisits
      const matched = siteVisits.filter(v => 
        (v.consultant && (v.consultant._id === c._id || v.consultant === c._id)) ||
        (v.consultantName && v.consultantName.toLowerCase() === c.name.toLowerCase())
      ).map(v => ({
        id: v._id || v.id,
        customerName: v.customerName || v.name || 'Valued Client',
        customerEmail: v.customerEmail || v.email || 'N/A',
        customerPhone: v.customerPhone || v.phone || 'N/A',
        propertyName: v.propertyName || (v.property ? v.property.title : 'Architectural Estate'),
        scheduledDate: v.scheduledDate || v.date || 'N/A',
        scheduledTime: v.scheduledTime || v.time || 'N/A',
        status: v.status || 'Scheduled',
      }));
      setAllocations(matched);
    } finally {
      setLoadingAllocations(false);
    }
  };

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminConsultants();
      setConsultants(data.consultants || []);
    } catch (err) {
      showToast('Failed to load consultants.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConsultants(); }, []);

  const filtered = useMemo(() => {
    return consultants.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
      const matchCity = cityFilter === 'All' || c.city === cityFilter;
      const matchStatus = statusFilter === 'All' ||
        (statusFilter === 'Active' ? c.isActive : !c.isActive);
      return matchSearch && matchCity && matchStatus;
    });
  }, [consultants, search, cityFilter, statusFilter]);

  const kpis = useMemo(() => ({
    total: consultants.length,
    active: consultants.filter(c => c.isActive).length,
    inactive: consultants.filter(c => !c.isActive).length,
    cities: [...new Set(consultants.map(c => c.city))].length,
  }), [consultants]);

  const openAdd = () => { setForm(emptyForm); setEditTarget(null); setIsAddOpen(true); };
  const openEdit = (c) => {
    setForm({
      name: c.name, email: c.email, phone: c.phone, city: c.city,
      password: '', maxDailyVisits: c.dailyVisitCap || c.maxDailyVisits || 5,
      dailyVisitCap: c.dailyVisitCap || c.maxDailyVisits || 5,
      workingDays: c.workingDays || [1, 2, 3, 4, 5],
      languages: c.languages && c.languages.length > 0 ? c.languages : ['Tamil', 'English'],
    });
    setEditTarget(c);
    setIsAddOpen(true);
  };

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      workingDays: f.workingDays.includes(day)
        ? f.workingDays.filter(d => d !== day)
        : [...f.workingDays, day].sort(),
    }));
  };

  const toggleLanguage = (lang) => {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter(l => l !== lang)
        : [...f.languages, lang],
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone || !form.city) {
      showToast('Name, email, phone and city are required.', 'error'); return;
    }
    setSaving(true);
    const payload = {
      ...form,
      dailyVisitCap: Number(form.dailyVisitCap || form.maxDailyVisits || 5),
      maxDailyVisits: Number(form.dailyVisitCap || form.maxDailyVisits || 5),
    };
    try {
      if (editTarget) {
        const data = await api.updateConsultant(editTarget._id, payload);
        setConsultants(prev => prev.map(c => c._id === editTarget._id ? (data.consultant || c) : c));
        showToast('Consultant updated successfully!');
      } else {
        const data = await api.createConsultant(payload);
        setConsultants(prev => [data.consultant, ...prev]);
        showToast('Consultant created! They can now log in with their email and password.');
      }
      setIsAddOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save consultant.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c) => {
    try {
      const data = c.isActive ? await api.deactivateConsultant(c._id) : await api.activateConsultant(c._id);
      setConsultants(prev => prev.map(x => x._id === c._id ? (data.consultant || { ...x, isActive: !x.isActive }) : x));
      showToast(`Consultant ${c.isActive ? 'deactivated' : 'activated'}.`);
    } catch (err) {
      showToast(err.message || 'Action failed.', 'error');
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete consultant ${c.name}? This cannot be undone.`)) return;
    try {
      await api.deleteConsultant(c._id);
      setConsultants(prev => prev.filter(x => x._id !== c._id));
      showToast('Consultant deleted.');
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
    }
  };

  const columns = [
    {
      key: 'name', label: 'Consultant', render: (_, row) => (
        <div 
          onClick={() => openAllocationsModal(row)}
          className="flex items-center gap-3 cursor-pointer group"
          title="Click to view allocated clients"
        >
          <div className="w-8 h-8 rounded-full bg-amber-100 group-hover:bg-[#F5A623] group-hover:text-white flex items-center justify-center text-amber-700 font-bold text-xs flex-shrink-0 transition-colors">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[#1A1A1A] group-hover:text-[#F5A623] text-xs transition-colors">{row.name}</p>
            <p className="text-[10px] text-[#8A8A85]">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone', render: (v) => <span className="text-xs text-[#4A4A45]">{v}</span> },
    { key: 'city', label: 'City', render: (v) => <span className="text-xs font-medium text-[#1A1A1A]">{v}</span> },
    {
      key: 'maxDailyVisits', label: 'Daily Cap', render: (v) => (
        <span className="text-xs font-bold text-[#F5A623]">{v} visits/day</span>
      )
    },
    {
      key: 'workingDays', label: 'Working Days', render: (v) => (
        <div className="flex gap-0.5">
          {WEEKDAYS.map((d, i) => (
            <span key={i} className={`text-[9px] px-1 py-0.5 rounded font-bold ${(v || []).includes(i) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{d}</span>
          ))}
        </div>
      )
    },
    {
      key: 'isActive', label: 'Status', render: (v) => (
        <StatusChip status={v ? 'Active' : 'Inactive'} />
      )
    },
    {
      key: 'actions', label: 'Actions', render: (_, row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => openAllocationsModal(row)} 
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-[#F5A623] text-[#F5A623] hover:text-white transition-all text-[11px] font-bold"
            title="View Allocated Clients"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Clients</span>
          </button>
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-amber-50 text-[#8A8A85] hover:text-[#F5A623] transition-colors" title="Edit Profile">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleToggleActive(row)} className={`p-1.5 rounded-lg transition-colors ${row.isActive ? 'hover:bg-red-50 text-[#8A8A85] hover:text-red-500' : 'hover:bg-green-50 text-[#8A8A85] hover:text-green-600'}`} title={row.isActive ? 'Deactivate' : 'Activate'}>
            {row.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#8A8A85] hover:text-red-500 transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Consultants</h1>
          <p className="text-xs text-[#8A8A85] mt-0.5">Manage your field consultant team and auto-assignment settings</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold tracking-wide rounded-xl transition-all shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          Add Consultant
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Consultants" value={kpis.total} icon={Users} color="blue" />
        <KPICard title="Active" value={kpis.active} icon={CheckCircle2} color="green" />
        <KPICard title="Inactive" value={kpis.inactive} icon={XCircle} color="red" />
        <KPICard title="Cities Covered" value={kpis.cities} icon={MapPin} color="amber" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 text-[#8A8A85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs text-[#1A1A1A] placeholder-[#8A8A85] outline-none focus:border-[#F5A623]"
          />
        </div>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
          className="px-3 py-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs text-[#1A1A1A] outline-none focus:border-[#F5A623]">
          <option value="All">All Cities</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-white border border-[#E8E4DA] rounded-xl text-xs text-[#1A1A1A] outline-none focus:border-[#F5A623]">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No consultants found. Add your first consultant to enable auto-assignment."
      />

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={editTarget ? `Edit — ${editTarget.name}` : 'Add New Consultant'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel required>Full Name</FormLabel>
              <TextInput value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Vikram Malhotra" />
            </div>
            <div>
              <FormLabel required>Phone</FormLabel>
              <TextInput value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 99000 00000" />
            </div>
          </div>
          <div>
            <FormLabel required>Email (login username)</FormLabel>
            <TextInput value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="vikram@imperiaestates.com" type="email" disabled={!!editTarget} />
          </div>
          {!editTarget && (
            <div>
              <FormLabel>Login Password</FormLabel>
              <TextInput value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters (auto-generated if empty)" type="password" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel required>City</FormLabel>
              <SelectInput value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} options={CITIES.map(c => ({ label: c, value: c }))} />
            </div>
            <div>
              <FormLabel>Daily Visit Cap</FormLabel>
              <TextInput value={form.dailyVisitCap || form.maxDailyVisits || 5} onChange={e => setForm(f => ({ ...f, dailyVisitCap: parseInt(e.target.value) || 5, maxDailyVisits: parseInt(e.target.value) || 5 }))} type="number" min="1" max="20" />
            </div>
          </div>
          <div>
            <FormLabel>Languages Spoken</FormLabel>
            <div className="flex flex-wrap gap-2 mt-1">
              {ALL_LANGUAGES.map(lang => (
                <button
                  key={lang} type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${form.languages.includes(lang) ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'bg-white text-[#8A8A85] border-[#E8E4DA] hover:border-[#F5A623]'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FormLabel>Working Days</FormLabel>
            <div className="flex gap-2 mt-1">
              {WEEKDAYS.map((d, i) => (
                <button
                  key={i} type="button"
                  onClick={() => toggleDay(i)}
                  className={`w-10 h-10 rounded-lg text-xs font-bold transition-all border ${form.workingDays.includes(i) ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#8A8A85] border-[#E8E4DA] hover:border-[#F5A623]'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsAddOpen(false)} className="flex-1 py-3 border border-[#E8E4DA] rounded-xl text-xs font-bold text-[#8A8A85] hover:bg-[#F4F1EA] transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : (editTarget ? 'Update Consultant' : 'Create Consultant')}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Allocated Customers Modal */}
      <AdminModal
        isOpen={isAllocationsOpen}
        onClose={() => setIsAllocationsOpen(false)}
        title={selectedConsultant ? `Allocated Clients — ${selectedConsultant.name}` : 'Allocated Clients'}
        size="lg"
      >
        <div className="space-y-4 font-sans text-[#1A1A1A]">
          {selectedConsultant && (
            <div className="flex items-center justify-between p-4 bg-[#F4F1EA] rounded-2xl border border-[#E8E4DA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {selectedConsultant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A]">{selectedConsultant.name}</h4>
                  <p className="text-xs text-[#8A8A85] flex items-center gap-2 mt-0.5">
                    <span>📍 {selectedConsultant.city}</span> • <span>📞 {selectedConsultant.phone}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#8A8A85] block">Total Allocated</span>
                <span className="text-lg font-extrabold text-[#F5A623]">{allocations.length} Visits</span>
              </div>
            </div>
          )}

          {loadingAllocations ? (
            <div className="py-12 text-center text-xs text-[#8A8A85] font-medium">
              Loading allocated customer visits...
            </div>
          ) : allocations.length === 0 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-[#E8E4DA] rounded-2xl bg-white">
              <Calendar className="w-8 h-8 text-[#8A8A85] mx-auto opacity-50" />
              <p className="text-xs font-bold text-[#1A1A1A]">No Clients Currently Allocated</p>
              <p className="text-[11px] text-[#8A8A85]">This consultant has no site visit bookings assigned yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#E8E4DA] rounded-2xl max-h-80 custom-scrollbar bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F1EA] text-[#8A8A85] uppercase tracking-wider text-[10px] sticky top-0 border-b border-[#E8E4DA]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Allocated Customer</th>
                    <th className="py-3 px-4 font-bold">Estate / Property</th>
                    <th className="py-3 px-4 font-bold">Scheduled Date</th>
                    <th className="py-3 px-4 font-bold">Scheduled Time</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DA]">
                  {allocations.map((alloc) => (
                    <tr key={alloc.id || alloc._id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#1A1A1A]">
                        <div>
                          <p className="font-bold text-[#1A1A1A] text-xs">{alloc.customerName || 'Valued Client'}</p>
                          <p className="text-[10px] text-[#8A8A85] font-normal">{alloc.customerPhone} • {alloc.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#1A1A1A]">
                        {alloc.propertyName}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#1A1A1A]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#F5A623]" />
                          <span>{alloc.scheduledDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#1A1A1A]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#F5A623]" />
                          <span>{alloc.scheduledTime}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusChip status={alloc.status || 'Scheduled'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsAllocationsOpen(false)}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminConsultantsPage;
