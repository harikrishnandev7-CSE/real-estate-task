import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Users, 
  UserCheck, 
  Bell, 
  Key, 
  ShieldCheck, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  Check, 
  Building, 
  Mail, 
  Phone, 
  Globe,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/admin/primitives/DataTable';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { 
  FormLabel, 
  FormError, 
  TextInput, 
  SelectInput, 
  TextAreaInput, 
  SegmentedControl, 
  ToggleSwitch 
} from '../../components/admin/primitives/FormField';
import { consultants as defaultConsultants } from '../../data/consultants';

const SETTINGS_NAV = [
  { id: 'general', label: 'General & Office', icon: Settings },
  { id: 'team', label: 'Team & Roles', icon: Users },
  { id: 'consultants', label: 'WhatsApp Consultants', icon: UserCheck },
  { id: 'notifications', label: 'Notification Rules', icon: Bell },
  { id: 'integrations', label: 'API Integrations', icon: Key },
  { id: 'security', label: 'Security & Auth', icon: ShieldCheck }
];

const AdminSettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useApp();

  const activeTab = searchParams.get('tab') || 'general';

  // Dirty State Tracker
  const [isDirty, setIsDirty] = useState(false);

  // 1. General Panel State
  const [generalForm, setGeneralForm] = useState({
    siteName: 'IMPERIA ESTATES',
    footerEmail: 'concierge@imperiaestates.com',
    footerPhone: '+91 (44) 4000-8000',
    maintenanceMode: false,
    offices: [
      { name: 'Chennai Flagship Gallery', address: '142 East Coast Road, Neelankarai, Chennai 600115', phone: '+91 44 4000 8000' },
      { name: 'Coimbatore Private Lounge', address: '88 Race Course Road, Gopalapuram, Coimbatore 641018', phone: '+91 422 222 9000' }
    ]
  });

  // 2. Team Panel State
  const [teamMembers, setTeamMembers] = useState([
    { id: 'tm1', name: 'Vikramaditya Roy', email: 'v.roy@imperia.com', role: 'Super Admin', status: 'Active' },
    { id: 'tm2', name: 'Ananya Deshmukh', email: 'ananya@imperia.com', role: 'Admin', status: 'Active' },
    { id: 'tm3', name: 'Siddharth Verma', email: 'siddharth@imperia.com', role: 'Consultant', status: 'Active' },
    { id: 'tm4', name: 'Pooja Sharma', email: 'pooja@imperia.com', role: 'Editor', status: 'Invited' }
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'Consultant' });

  // 3. Consultants Panel State (directly feeds WhatsApp Concierge)
  const [consultantsList, setConsultantsList] = useState(defaultConsultants);

  // 4. Integrations Panel Masked Credentials State
  const [integrations, setIntegrations] = useState({
    whatsappKey: 'WA_LIVE_99887766554433221100',
    paymentKey: 'RZP_LIVE_1122334455667788',
    emailKey: 'SG_LIVE_9900112233445566',
    analyticsId: 'G-IMPERIA998877'
  });
  const [revealedKeys, setRevealedKeys] = useState({});

  // 5. Security Panel Change Password Form
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true
  });
  const [passwordError, setPasswordError] = useState('');

  // Switch Settings Sub-Nav Tab
  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
    setIsDirty(false);
  };

  const handleFieldChange = () => {
    setIsDirty(true);
  };

  // Save Scoped Panel Changes
  const handleSavePanel = () => {
    setIsDirty(false);
    showToast("Settings saved successfully.");
  };

  // Mask Key Helper
  const maskKey = (keyStr, keyId) => {
    if (revealedKeys[keyId]) return keyStr;
    if (!keyStr) return '';
    return `••••••••••••${keyStr.slice(-4)}`;
  };

  const toggleRevealKey = (keyId) => {
    setRevealedKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Credential copied to clipboard.");
  };

  // Submit Password Change with SignupPage validation rules
  const handlePasswordChange = () => {
    if (securityForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    if (!/[A-Z]/.test(securityForm.newPassword) || !/[0-9]/.test(securityForm.newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter and one number');
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    setSecurityForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    showToast("Password updated successfully!");
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* ── TOPBAR HEADER ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
            ADMIN SYSTEM CONTROL
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
            Global Settings & Credentials
          </h1>
        </div>

        <button
          onClick={handleSavePanel}
          disabled={!isDirty}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4 text-[#F5A623]" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* ── MAIN CONTENT: SECONDARY LEFT NAV + RIGHT PANEL CONTENT ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Nav (1 Col) */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.04)] h-fit space-y-2 font-sans">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A85] font-extrabold block p-2 border-b border-[#E8E4DA] mb-2">
            SETTINGS NAVIGATION
          </span>

          {SETTINGS_NAV.map(nav => {
            const isActive = activeTab === nav.id;
            const IconComp = nav.icon;

            return (
              <button
                key={nav.id}
                onClick={() => setTab(nav.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left text-xs font-extrabold ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'text-[#8A8A85] hover:text-[#1A1A1A] hover:bg-[#F4F1EA]'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-[#F5A623]' : 'text-[#8A8A85]'}`} />
                <span>{nav.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Panel (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.04)] font-sans space-y-6">
          <AnimatePresence mode="wait">
            
            {/* 1. GENERAL PANEL */}
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border-b border-[#E8E4DA] pb-3">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">General & Office Configurations</h3>
                  <p className="text-xs text-[#8A8A85]">Site identity and repeatable office address entries matching Contact page.</p>
                </div>

                <TextInput
                  label="Platform Site Name"
                  value={generalForm.siteName}
                  onChange={(e) => { setGeneralForm(prev => ({ ...prev, siteName: e.target.value })); handleFieldChange(); }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Footer Concierge Email"
                    value={generalForm.footerEmail}
                    onChange={(e) => { setGeneralForm(prev => ({ ...prev, footerEmail: e.target.value })); handleFieldChange(); }}
                  />
                  <TextInput
                    label="Footer Support Phone"
                    value={generalForm.footerPhone}
                    onChange={(e) => { setGeneralForm(prev => ({ ...prev, footerPhone: e.target.value })); handleFieldChange(); }}
                  />
                </div>

                <ToggleSwitch
                  label="System Maintenance Mode"
                  description="Displays maintenance banner to non-admin visitors"
                  checked={generalForm.maintenanceMode}
                  onChange={(val) => { setGeneralForm(prev => ({ ...prev, maintenanceMode: val })); handleFieldChange(); }}
                />
              </motion.div>
            )}

            {/* 2. TEAM & ROLES PANEL */}
            {activeTab === 'team' && (
              <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Team Members & Access Roles</h3>
                    <p className="text-xs text-[#8A8A85]">Staff user management and RBAC permissions.</p>
                  </div>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-black flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#F5A623]" />
                    <span>Invite Staff</span>
                  </button>
                </div>

                <div className="divide-y divide-[#E8E4DA]">
                  {teamMembers.map(tm => (
                    <div key={tm.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-[#F5A623] font-bold text-xs flex items-center justify-center font-mono">
                          {tm.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-extrabold text-[#1A1A1A] block">{tm.name}</span>
                          <span className="text-[10px] text-[#8A8A85]">{tm.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F1EA] text-[#1A1A1A]">
                          {tm.role}
                        </span>
                        <StatusChip status={tm.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. CONSULTANTS PANEL */}
            {activeTab === 'consultants' && (
              <motion.div key="consultants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border-b border-[#E8E4DA] pb-4">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">WhatsApp Concierge Consultants</h3>
                  <p className="text-xs text-[#8A8A85]">Feeds the customer-facing WhatsApp Concierge picker dataset.</p>
                </div>

                <div className="space-y-3">
                  {consultantsList.map(c => (
                    <div key={c.id} className="p-4 rounded-xl border border-[#E8E4DA] bg-[#F4F1EA]/40 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={c.photo} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-[#E8E4DA]" />
                        <div>
                          <span className="font-extrabold text-[#1A1A1A] block">{c.name}</span>
                          <span className="text-[10px] text-[#8A8A85]">{c.role} · {c.languages.join(', ')}</span>
                        </div>
                      </div>

                      <ToggleSwitch
                        label={c.available ? "Online" : "Offline"}
                        checked={c.available}
                        onChange={(val) => {
                          setConsultantsList(prev => prev.map(item => item.id === c.id ? { ...item, available: val } : item));
                          handleFieldChange();
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. INTEGRATIONS PANEL (MASKED CREDENTIALS) */}
            {activeTab === 'integrations' && (
              <motion.div key="integrations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border-b border-[#E8E4DA] pb-4">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">API Keys & External Integrations</h3>
                  <p className="text-xs text-[#8A8A85]">Masked API credentials with reveal, copy, and regenerate actions.</p>
                </div>

                {[
                  { id: 'whatsappKey', label: 'WhatsApp Business API Token', val: integrations.whatsappKey },
                  { id: 'paymentKey', label: 'Razorpay / Payment Gateway Live Key', val: integrations.paymentKey },
                  { id: 'emailKey', label: 'SendGrid / Email Provider API Key', val: integrations.emailKey }
                ].map(item => (
                  <div key={item.id} className="space-y-1 font-sans">
                    <FormLabel>{item.label}</FormLabel>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={maskKey(item.val, item.id)}
                        className="flex-1 bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-2 text-xs font-mono font-bold text-[#1A1A1A]"
                      />
                      <button
                        onClick={() => toggleRevealKey(item.id)}
                        className="px-3 py-2 bg-white border border-[#E8E4DA] rounded-xl text-xs font-bold cursor-pointer hover:bg-[#F4F1EA]"
                        title="Reveal Key"
                      >
                        {revealedKeys[item.id] ? <EyeOff className="w-4 h-4 text-[#8A8A85]" /> : <Eye className="w-4 h-4 text-[#8A8A85]" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(item.val)}
                        className="px-3 py-2 bg-white border border-[#E8E4DA] rounded-xl text-xs font-bold cursor-pointer hover:bg-[#F4F1EA]"
                        title="Copy Credential"
                      >
                        <Copy className="w-4 h-4 text-[#8A8A85]" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 5. SECURITY PANEL */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border-b border-[#E8E4DA] pb-4">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Security & Authentication</h3>
                  <p className="text-xs text-[#8A8A85]">Password update, 2FA, and session management.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <TextInput
                    label="Current Password"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />

                  <TextInput
                    label="New Password"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  />

                  <TextInput
                    label="Confirm New Password"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />

                  {passwordError && <FormError message={passwordError} />}

                  <button
                    onClick={handlePasswordChange}
                    className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-black"
                  >
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

export default AdminSettingsPage;
