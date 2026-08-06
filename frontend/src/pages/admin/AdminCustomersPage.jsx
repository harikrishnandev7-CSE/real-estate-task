import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageCircle, 
  MoreVertical, 
  Heart, 
  Calendar, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  Save, 
  X, 
  CheckCircle2, 
  Clock, 
  Tag
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
  SegmentedControl, 
  ToggleSwitch 
} from '../../components/admin/primitives/FormField';
import { EmptyState } from '../../components/common/FeedbackStates';

const CITIES = ['All', 'Chennai', 'Coimbatore', 'Hyderabad', 'Bengaluru'];
const PURPOSES = ['All', 'Buy', 'Rent'];
const CONSULTANTS = ['Vikram Malhotra', 'Ananya Deshmukh', 'Siddharth Verma'];
const LEAD_STATUSES = ['New', 'Contacted', 'Touring', 'Negotiating', 'Closed', 'Lost'];

const AdminCustomersPage = () => {
  const { 
    customers = [], 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    openWhatsApp, 
    showToast 
  } = useApp();

  const [searchVal, setSearchVal] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedPurpose, setSelectedPurpose] = useState('All');
  const [upcomingVisitOnly, setUpcomingVisitOnly] = useState(false);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Profile Drawer target
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview'); // 'overview' | 'wishlist' | 'visits' | 'notes'

  // Editable Drawer Form State
  const [drawerForm, setDrawerForm] = useState({
    consultantName: '',
    leadStatus: 'New',
    notes: ''
  });

  // New Customer Form State
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Chennai',
    purpose: 'Buy',
    budget: '₹2Cr–₹5Cr',
    consultantName: 'Vikram Malhotra',
    leadStatus: 'New',
    notes: ''
  });

  // Filtered Customers List
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (searchVal.trim()) {
        const q = searchVal.toLowerCase();
        const matches = (
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }

      if (selectedCity !== 'All' && c.city !== selectedCity) return false;
      if (selectedPurpose !== 'All' && c.purpose !== selectedPurpose) return false;
      if (upcomingVisitOnly && !c.hasUpcomingVisit) return false;

      return true;
    });
  }, [customers, searchVal, selectedCity, selectedPurpose, upcomingVisitOnly]);

  // Open Profile Drawer
  const handleOpenProfile = (customer) => {
    setSelectedCustomer(customer);
    setDrawerForm({
      consultantName: customer.consultantName || 'Vikram Malhotra',
      leadStatus: customer.leadStatus || 'New',
      notes: customer.notes || ''
    });
    setActiveDrawerTab('overview');
  };

  // Save Profile Drawer Admin Edits
  const handleSaveProfileDrawer = () => {
    if (!selectedCustomer) return;
    updateCustomer(selectedCustomer.id, {
      ...drawerForm
    });
    setSelectedCustomer(null);
  };

  // CSV Export Action
  const handleExportCSV = () => {
    const headers = "ID,Name,Email,Phone,City,Purpose,Budget,Status,Consultant\n";
    const rows = filteredCustomers.map(c => 
      `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.city}","${c.purpose}","${c.budget}","${c.leadStatus}","${c.consultantName}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `imperia_customers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredCustomers.length} customer records to CSV.`);
  };

  // Create Manual Lead Customer
  const handleCreateCustomer = () => {
    if (!newCustForm.name.trim() || !newCustForm.phone.trim()) {
      showToast("Customer Name and Phone are required.");
      return;
    }

    addCustomer({
      ...newCustForm,
      propertyTypes: ["Villa", "Plot"],
      locations: [newCustForm.city],
      wishlistCount: 0,
      hasUpcomingVisit: false,
      lastActive: "Just now"
    });

    setIsAddModalOpen(false);
    setNewCustForm({
      name: '',
      email: '',
      phone: '',
      city: 'Chennai',
      purpose: 'Buy',
      budget: '₹2Cr–₹5Cr',
      consultantName: 'Vikram Malhotra',
      leadStatus: 'New',
      notes: ''
    });
  };

  // DataTable Column Definitions
  const columns = [
    {
      key: 'name',
      label: 'Customer Name & Contact',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-[#F5A623] font-extrabold text-xs flex items-center justify-center shrink-0 font-mono">
            {row.name.charAt(0)}
          </div>
          <div className="min-w-0 font-sans">
            <span className="font-extrabold text-[#1A1A1A] block truncate">{row.name}</span>
            <span className="text-[10px] text-[#8A8A85] truncate block">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (val) => <span className="font-bold text-[#1A1A1A]">{val}</span>
    },
    {
      key: 'city',
      label: 'City',
      render: (val) => <span className="font-semibold text-[#8A8A85]">{val}</span>
    },
    {
      key: 'purpose',
      label: 'Purpose',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
          val === 'Rent' ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-amber-50 text-[#1A1A1A] border-amber-200'
        }`}>
          {val}
        </span>
      )
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (val) => <span className="font-extrabold text-[#1A1A1A]">{val}</span>
    },
    {
      key: 'leadStatus',
      label: 'Lead Status',
      render: (val) => <StatusChip status={val || 'New'} />
    },
    {
      key: 'consultantName',
      label: 'Assigned Consultant',
      render: (val) => (
        <span className="text-xs font-bold text-[#1A1A1A] bg-[#F4F1EA] px-2.5 py-1 rounded-lg border border-[#E8E4DA]">
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* ── KPI STRIP ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Total Customers"
          value={customers.length || 1420}
          icon={Users}
          delta={{ value: '+14.2%', positive: true }}
          sparkline={[120, 130, 140, 150, 160, 175, customers.length || 184]}
        />
        <KPICard
          title="New This Month"
          value={184}
          icon={UserPlus}
          delta={{ value: '+22.5%', positive: true }}
          sparkline={[20, 25, 30, 40, 45, 50, 62]}
        />
        <KPICard
          title="Active Wishlists"
          value={customers.reduce((acc, c) => acc + (c.wishlistCount || 0), 0) || 642}
          icon={Heart}
          delta={{ value: '+18.1%', positive: true }}
          sparkline={[300, 320, 350, 400, 450, 520, 642]}
        />
        <KPICard
          title="Upcoming Visits"
          value={customers.filter(c => c.hasUpcomingVisit).length || 28}
          icon={Calendar}
          delta={{ value: '+8.4%', positive: true }}
          sparkline={[10, 12, 15, 18, 22, 25, 28]}
        />
      </div>

      {/* ── TOOLBAR CONTROLS & ACTIONS ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
            CLIENT RELATIONSHIP MANAGEMENT
          </span>
          <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
            VIP Customers Roster
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8A8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone, city..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-[#F4F1EA] border border-[#E8E4DA] rounded-full text-xs px-4 py-2 pl-9 text-[#1A1A1A] placeholder-[#8A8A85] focus:outline-none focus:border-[#F5A623] w-48 sm:w-60 transition-all"
            />
          </div>

          {/* City Filter */}
          <div className="w-36">
            <SelectInput
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              options={CITIES}
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-[#E8E4DA] hover:bg-[#F4F1EA] text-[#1A1A1A] text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#8A8A85]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Add Customer Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#F5A623]" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* ── DATATABLE ───────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        pageSize={8}
        onRowClick={(row) => handleOpenProfile(row)}
        onView={(row) => handleOpenProfile(row)}
        onEdit={(row) => handleOpenProfile(row)}
        onDelete={(row) => deleteCustomer(row.id)}
      />

      {/* ── CUSTOMER PROFILE DRAWER (Slide-Over, FloatingWhatsApp Motion) ─ */}
      <AdminModal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || 'Customer Profile'}
        subtitle={`${selectedCustomer?.email || ''} · ${selectedCustomer?.phone || ''}`}
        size="drawer"
      >
        {selectedCustomer && (
          <div className="space-y-6 font-sans">
            
            {/* Read-Only Profile Header (Pulled from customer ProfilePage model) */}
            <div className="p-5 rounded-2xl bg-[#F4F1EA] border border-[#E8E4DA] space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1A1A1A] text-[#F5A623] font-extrabold text-xl flex items-center justify-center shrink-0 font-mono">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xl font-extrabold text-[#1A1A1A]">{selectedCustomer.name}</h4>
                  <p className="text-xs text-[#8A8A85] flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#F5A623]" /> {selectedCustomer.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#F5A623]" /> {selectedCustomer.phone}</span>
                  </p>
                </div>
              </div>

              {/* Preferences Strip (ProfilePage model shape) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#E8E4DA] pt-3 text-xs">
                <div><span className="text-[9px] text-[#8A8A85] block font-bold uppercase">PURPOSE</span><span className="font-extrabold">{selectedCustomer.purpose}</span></div>
                <div><span className="text-[9px] text-[#8A8A85] block font-bold uppercase">BUDGET</span><span className="font-extrabold text-[#F5A623]">{selectedCustomer.budget}</span></div>
                <div><span className="text-[9px] text-[#8A8A85] block font-bold uppercase">CITY</span><span className="font-extrabold">{selectedCustomer.city}</span></div>
                <div><span className="text-[9px] text-[#8A8A85] block font-bold uppercase">WISHLIST</span><span className="font-extrabold">{selectedCustomer.wishlistCount} items</span></div>
              </div>
            </div>

            {/* Editable Admin-Only Controls */}
            <div className="space-y-4 border-t border-[#E8E4DA] pt-4">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-extrabold block">
                ADMIN CRM CONTROLS
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="Assigned Consultant"
                  value={drawerForm.consultantName}
                  onChange={(e) => setDrawerForm(prev => ({ ...prev, consultantName: e.target.value }))}
                  options={CONSULTANTS}
                />

                <SelectInput
                  label="Lead Pipeline Status"
                  value={drawerForm.leadStatus}
                  onChange={(e) => setDrawerForm(prev => ({ ...prev, leadStatus: e.target.value }))}
                  options={LEAD_STATUSES}
                />
              </div>

              <TextAreaInput
                label="Internal Consultant Notes"
                value={drawerForm.notes}
                onChange={(e) => setDrawerForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Log customer preferences, meeting feedback, target layout preferences..."
              />
            </div>

            {/* Drawer Action Bar */}
            <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-between">
              <button
                type="button"
                onClick={() => openWhatsApp(selectedCustomer.phone, `Hello ${selectedCustomer.name}, this is ${drawerForm.consultantName} from IMPERIA ESTATES.`)}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Client</span>
              </button>

              <button
                type="button"
                onClick={handleSaveProfileDrawer}
                className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#F5A623]" />
                <span>Save Profile Updates</span>
              </button>
            </div>

          </div>
        )}
      </AdminModal>

      {/* ── MODAL: ADD MANUAL LEAD CUSTOMER ───────────────────────── */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Manual Walk-In Lead"
        subtitle="Create a customer record for walk-in or phone-based buyers."
        size="md"
        confirmText="Save Customer"
        onConfirm={handleCreateCustomer}
      >
        <div className="space-y-4 font-sans">
          <TextInput
            label="Customer Full Name *"
            required
            value={newCustForm.name}
            onChange={(e) => setNewCustForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Anandha Kumar"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Email Address"
              value={newCustForm.email}
              onChange={(e) => setNewCustForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="anand@gmail.com"
            />
            <TextInput
              label="Phone Number *"
              required
              value={newCustForm.phone}
              onChange={(e) => setNewCustForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectInput
              label="City"
              value={newCustForm.city}
              onChange={(e) => setNewCustForm(prev => ({ ...prev, city: e.target.value }))}
              options={CITIES.filter(c => c !== 'All')}
            />
            <SelectInput
              label="Purpose"
              value={newCustForm.purpose}
              onChange={(e) => setNewCustForm(prev => ({ ...prev, purpose: e.target.value }))}
              options={['Buy', 'Rent']}
            />
            <TextInput
              label="Budget"
              value={newCustForm.budget}
              onChange={(e) => setNewCustForm(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="₹2Cr–₹5Cr"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Assigned Consultant"
              value={newCustForm.consultantName}
              onChange={(e) => setNewCustForm(prev => ({ ...prev, consultantName: e.target.value }))}
              options={CONSULTANTS}
            />
            <SelectInput
              label="Initial Lead Status"
              value={newCustForm.leadStatus}
              onChange={(e) => setNewCustForm(prev => ({ ...prev, leadStatus: e.target.value }))}
              options={LEAD_STATUSES}
            />
          </div>

          <TextAreaInput
            label="Initial Meeting Notes"
            value={newCustForm.notes}
            onChange={(e) => setNewCustForm(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
            placeholder="Walk-in lead interested in 4BHK ECR beachfront villa..."
          />
        </div>
      </AdminModal>

    </div>
  );
};

export default AdminCustomersPage;
