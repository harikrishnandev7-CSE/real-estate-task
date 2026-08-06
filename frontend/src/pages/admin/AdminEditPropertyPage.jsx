import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Save, 
  Trash2, 
  Eye, 
  MapPin, 
  ShieldCheck, 
  Building, 
  CheckCircle2, 
  X, 
  Plus, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  FormLabel, 
  FormError, 
  TextInput, 
  SelectInput, 
  TextAreaInput, 
  SegmentedControl, 
  ToggleSwitch, 
  MultiSelectChips, 
  ImageDropzone 
} from '../../components/admin/primitives/FormField';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';

const TABS = [
  { id: 'basics', label: 'Basics' },
  { id: 'pricing', label: 'Pricing & Specs' },
  { id: 'media', label: 'Media' },
  { id: 'amenities', label: 'Amenities & Narrative' },
  { id: 'compliance', label: 'Compliance & Status' }
];

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Penthouse', 'Plot', 'Office', 'Commercial', 'Co-working'];
const PURPOSES = ['Buy', 'Rent'];
const CITIES = ['Chennai', 'Coimbatore', 'Hyderabad', 'Bengaluru'];
const TAGS = ['Signature', 'New Launch', 'Exclusive', 'DTCP Approved', 'Premium Office', 'Luxury Villa'];
const AMENITY_OPTIONS = [
  'Infinity Pool', 'Private Gym', '24/7 Concierge', 'Home Automation', 'Sea View',
  'Private Cinema', 'Private Garden', 'Wine Cellar', 'Helipad', 'Fibre Internet',
  'Conference Room', 'Valet Parking', 'DTCP Approved', 'Power Backup'
];

const AdminEditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties = [], updateProperty, deleteProperty, showToast } = useApp();

  // Find existing property target
  const existingProp = useMemo(() => {
    return properties.find(p => p.id === id) || properties[0];
  }, [properties, id]);

  const activeTab = searchParams.get('tab') || 'basics';

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Villa',
    purpose: 'Buy',
    tag: 'Signature',
    builder: 'IMPERIA Developers',
    city: 'Chennai',
    location: '',
    price: '',
    numericPrice: 0,
    pricePerSqft: '',
    area: '',
    areaUnit: 'sq.ft.',
    beds: 3,
    baths: 4,
    furnished: 'Fully Furnished',
    yearBuilt: '2025',
    floor: '2nd Floor',
    roadWidth: '40 ft Road',
    facing: 'East Facing',
    approval: 'DTCP Approved',
    frontage: '60 ft',
    dimensions: '40 x 60 ft',
    yieldRate: '8.5%',
    image: '',
    gallery: [],
    brochureUrl: '',
    desc: '',
    amenities: [],
    pros: [],
    cons: [],
    rera: true,
    reraNumber: '',
    status: 'Published',
    registrationStatus: 'Clear Title & DTCP Approved'
  });

  // Track Unsaved modifications per tab
  const [unsavedTabs, setUnsavedTabs] = useState({
    basics: false,
    pricing: false,
    media: false,
    amenities: false,
    compliance: false
  });

  const [newProText, setNewProText] = useState('');
  const [newConText, setNewConText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Initialize form data from existing property
  useEffect(() => {
    if (existingProp) {
      setFormData({
        title: existingProp.title || '',
        type: existingProp.type || 'Villa',
        purpose: existingProp.purpose || 'Buy',
        tag: existingProp.tag || 'Signature',
        builder: existingProp.builder || 'IMPERIA Developers',
        city: existingProp.city || 'Chennai',
        location: existingProp.location || '',
        price: existingProp.price || '',
        numericPrice: existingProp.numericPrice || 145000000,
        pricePerSqft: existingProp.pricePerSqft || '32,000',
        area: existingProp.area || '4,500 sq.ft.',
        areaUnit: 'sq.ft.',
        beds: existingProp.beds || 3,
        baths: existingProp.baths || 4,
        furnished: existingProp.specs?.Furnished || 'Fully Furnished',
        yearBuilt: existingProp.specs?.['Year Built'] || '2025',
        floor: existingProp.specs?.Floor || '2nd Floor',
        roadWidth: '40 ft Road',
        facing: 'East Facing',
        approval: 'DTCP Approved',
        frontage: '60 ft',
        dimensions: '40 x 60 ft',
        yieldRate: '8.5%',
        image: existingProp.image || '',
        gallery: existingProp.gallery || [],
        brochureUrl: existingProp.brochureUrl || '',
        desc: existingProp.desc || '',
        amenities: existingProp.amenities || ['Infinity Pool', '24/7 Concierge'],
        pros: existingProp.pros || ['Prime luxury location'],
        cons: existingProp.cons || ['High demand'],
        rera: existingProp.rera ?? true,
        reraNumber: existingProp.reraNumber || 'TN/01/Building/0142/2025',
        status: existingProp.status || 'Published',
        registrationStatus: 'Clear Title & DTCP Approved'
      });
    }
  }, [existingProp]);

  // Format price preview string
  const formattedPricePreview = useMemo(() => {
    const val = Number(formData.numericPrice);
    if (!val || isNaN(val)) return formData.price || '₹0';
    if (formData.purpose === 'Rent') {
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L/mo`;
      return `₹${val.toLocaleString('en-IN')}/mo`;
    }
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  }, [formData.numericPrice, formData.purpose, formData.price]);

  // Update Field Handler
  const updateField = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));

    // Mark current tab unsaved
    setUnsavedTabs(prev => ({ ...prev, [activeTab]: true }));
  };

  // Switch Tab
  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // Add Pro / Con Chips
  const addPro = () => {
    if (!newProText.trim()) return;
    setFormData(prev => ({ ...prev, pros: [...prev.pros, newProText.trim()] }));
    setNewProText('');
    setUnsavedTabs(prev => ({ ...prev, amenities: true }));
  };

  const removePro = (idx) => {
    setFormData(prev => ({ ...prev, pros: prev.pros.filter((_, i) => i !== idx) }));
    setUnsavedTabs(prev => ({ ...prev, amenities: true }));
  };

  const addCon = () => {
    if (!newConText.trim()) return;
    setFormData(prev => ({ ...prev, cons: [...prev.cons, newConText.trim()] }));
    setNewConText('');
    setUnsavedTabs(prev => ({ ...prev, amenities: true }));
  };

  const removeCon = (idx) => {
    setFormData(prev => ({ ...prev, cons: prev.cons.filter((_, i) => i !== idx) }));
    setUnsavedTabs(prev => ({ ...prev, amenities: true }));
  };

  // Save Property Changes
  const handleSave = async () => {
    const propId = existingProp?.id || existingProp?._id || id;
    try {
      await updateProperty(propId, {
        ...formData,
        price: formattedPricePreview
      });

      setUnsavedTabs({
        basics: false,
        pricing: false,
        media: false,
        amenities: false,
        compliance: false
      });
    } catch (err) {
      if (showToast) showToast(`Save failed: ${err.message}`, 'error');
    }
  };

  // Toggle Publish / Unpublish Status
  const handleTogglePublish = async () => {
    const propId = existingProp?.id || existingProp?._id || id;
    const newStatus = formData.status === 'Published' ? 'Archived' : 'Published';
    updateField('status', newStatus);
    try {
      await updateProperty(propId, { status: newStatus });
      showToast(`Property marked as ${newStatus}`);
    } catch (err) {}
  };

  return (
    <div className="space-y-8 font-sans pb-24">
      
      {/* ── TOPBAR HEADER & ACTIONS ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/properties" className="text-xs font-bold text-[#8A8A85] hover:text-[#1A1A1A]">
              Properties
            </Link>
            <span className="text-[#8A8A85] text-xs">/</span>
            <span className="text-xs font-bold text-[#F5A623]">Edit Listing</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
            Edit: {formData.title || 'Property Listing'}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Preview Live Page Customer Link */}
          <a
            href={`/property/${existingProp.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white border border-[#E8E4DA] hover:bg-[#F4F1EA] text-[#1A1A1A] text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Preview Live Page</span>
          </a>

          {/* Context-Sensitive Publish / Unpublish */}
          <button
            type="button"
            onClick={handleTogglePublish}
            className={`px-4 py-2 border text-xs font-bold rounded-full transition-colors cursor-pointer ${
              formData.status === 'Published'
                ? 'bg-amber-50 text-[#1A1A1A] border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {formData.status === 'Published' ? 'Unpublish (Archive)' : 'Publish Now'}
          </button>

          {/* Save Changes Primary Pill */}
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#F5A623]" />
            <span>Save Changes</span>
          </button>

          {/* Delete Red Text Link */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="text-xs font-bold text-red-600 hover:underline cursor-pointer ml-2"
          >
            Delete Property
          </button>
        </div>
      </div>

      {/* ── HORIZONTAL TAB BAR (DEEP-LINKABLE) ─────────────────────── */}
      <div className="flex items-center gap-2 border-b border-[#E8E4DA] pb-1 overflow-x-auto no-scrollbar font-sans">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const isUnsaved = unsavedTabs[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white text-[#8A8A85] hover:text-[#1A1A1A] border border-[#E8E4DA]'
              }`}
            >
              <span>{tab.label}</span>
              {isUnsaved && (
                <span className="w-2 h-2 rounded-full bg-[#F5A623] shrink-0" title="Unsaved changes in this tab" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── MAIN CONTENT: TAB EDITOR + STICKY LIVE PREVIEW ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Active Tab Content */}
        <div className="lg:col-span-2 bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.04)] space-y-6">
          <AnimatePresence mode="wait">
            
            {/* BASICS TAB */}
            {activeTab === 'basics' && (
              <motion.div key="basics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <TextInput
                  label="Property Title"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />

                <SegmentedControl
                  label="Property Category"
                  options={PROPERTY_TYPES}
                  value={formData.type}
                  onChange={(val) => updateField('type', val)}
                />

                <div className="w-full sm:w-72">
                  <SegmentedControl
                    label="Listing Purpose"
                    options={PURPOSES}
                    value={formData.purpose}
                    onChange={(val) => updateField('purpose', val)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectInput
                    label="Property Tag"
                    value={formData.tag}
                    onChange={(e) => updateField('tag', e.target.value)}
                    options={TAGS}
                  />

                  <TextInput
                    label="Developer / Builder"
                    value={formData.builder}
                    onChange={(e) => updateField('builder', e.target.value)}
                  />

                  <SelectInput
                    label="Location City"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    options={CITIES}
                  />
                </div>

                <TextInput
                  label="Full Location Address String"
                  required
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                />
              </motion.div>
            )}

            {/* PRICING & SPECS TAB */}
            {activeTab === 'pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#F4F1EA] border border-[#E8E4DA]">
                  <TextInput
                    label="Asking Price (Numeric ₹)"
                    type="number"
                    value={formData.numericPrice}
                    onChange={(e) => updateField('numericPrice', e.target.value)}
                  />

                  <div className="flex flex-col justify-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#8A8A85]">Price Live Preview</span>
                    <span className="text-2xl font-extrabold text-[#F5A623]">{formattedPricePreview}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Built-up / Land Area"
                    value={formData.area}
                    onChange={(e) => updateField('area', e.target.value)}
                  />
                  <TextInput
                    label="Price per Sq.Ft (₹)"
                    value={formData.pricePerSqft}
                    onChange={(e) => updateField('pricePerSqft', e.target.value)}
                  />
                </div>

                {['Villa', 'Apartment', 'Penthouse'].includes(formData.type) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E8E4DA]">
                    <TextInput
                      label="Bedrooms (BHK)"
                      type="number"
                      value={formData.beds}
                      onChange={(e) => updateField('beds', Number(e.target.value))}
                    />
                    <TextInput
                      label="Bathrooms"
                      type="number"
                      value={formData.baths}
                      onChange={(e) => updateField('baths', Number(e.target.value))}
                    />
                    <SelectInput
                      label="Furnishing Status"
                      value={formData.furnished}
                      onChange={(e) => updateField('furnished', e.target.value)}
                      options={['Fully Furnished', 'Semi-Furnished', 'Unfurnished']}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
              <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <ImageDropzone
                  label="Cover Image"
                  images={formData.image ? [formData.image] : []}
                  onChange={(imgs) => updateField('image', imgs[0] || '')}
                  maxFiles={1}
                />

                <ImageDropzone
                  label="Gallery Images"
                  images={formData.gallery}
                  onChange={(imgs) => updateField('gallery', imgs)}
                  maxFiles={8}
                />
              </motion.div>
            )}

            {/* AMENITIES TAB */}
            {activeTab === 'amenities' && (
              <motion.div key="amenities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <TextAreaInput
                  label="Description Narrative"
                  value={formData.desc}
                  onChange={(e) => updateField('desc', e.target.value)}
                  rows={4}
                />

                <MultiSelectChips
                  label="Amenities"
                  options={AMENITY_OPTIONS}
                  selected={formData.amenities}
                  onChange={(vals) => updateField('amenities', vals)}
                />

                {/* Pros List Builder */}
                <div className="space-y-2">
                  <FormLabel>Estate Pros</FormLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add pro highlight..."
                      value={newProText}
                      onChange={(e) => setNewProText(e.target.value)}
                      className="flex-1 bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-2 text-xs font-medium outline-none"
                    />
                    <button type="button" onClick={addPro} className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl cursor-pointer">+ Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.pros.map((pro, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <span>✓ {pro}</span>
                        <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removePro(idx)} />
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* COMPLIANCE TAB */}
            {activeTab === 'compliance' && (
              <motion.div key="compliance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <ToggleSwitch
                  label="Government RERA Certified"
                  checked={formData.rera}
                  onChange={(val) => updateField('rera', val)}
                />

                {formData.rera && (
                  <TextInput
                    label="RERA Registration Number"
                    value={formData.reraNumber}
                    onChange={(e) => updateField('reraNumber', e.target.value)}
                  />
                )}

                <SegmentedControl
                  label="Construction Status"
                  options={['Ready to Move', 'Under Construction', 'Draft', 'Archived']}
                  value={formData.status}
                  onChange={(val) => updateField('status', val)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right 1 Col: STICKY LIVE PREVIEW PANEL */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)] sticky top-20 font-sans space-y-4">
            <div className="border-b border-[#E8E4DA] pb-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-extrabold block">
                LIVE REAL-TIME PREVIEW
              </span>
              <StatusChip status={formData.status} />
            </div>

            {/* Property Card Mirror */}
            <div className="rounded-2xl border border-[#E8E4DA] overflow-hidden bg-white shadow-xs space-y-3 p-3">
              <div className="relative h-44 rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={formData.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#F5A623] block">{formData.type} · {formData.purpose}</span>
                <h4 className="text-base font-extrabold text-[#1A1A1A] tracking-tight truncate">{formData.title || 'Untitled Property'}</h4>
                <p className="text-xs text-[#8A8A85] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F5A623] shrink-0" />
                  <span className="truncate">{formData.location || 'Location pending'}</span>
                </p>
                <div className="text-lg font-extrabold text-[#1A1A1A] pt-1">{formattedPricePreview}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-2 text-[10px] font-bold text-[#1A1A1A]">
                <div><span className="text-[8px] text-[#8A8A85] block uppercase">Area</span>{formData.area || '—'}</div>
                <div><span className="text-[8px] text-[#8A8A85] block uppercase">City</span>{formData.city}</div>
                <div><span className="text-[8px] text-[#8A8A85] block uppercase">BHK</span>{formData.beds} Beds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESTRUCTIVE DELETE CONFIRM MODAL ───────────────────────── */}
      <AdminModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Property Permanently?"
        subtitle={`Are you sure you want to delete "${formData.title}"? All associated views, saves, and analytics will be permanently removed.`}
        size="sm"
        isDestructive
        confirmText="Delete Property"
        onConfirm={() => {
          deleteProperty(existingProp.id);
          navigate('/admin/properties');
        }}
      >
        <p className="text-xs text-[#8A8A85]">This action cannot be undone.</p>
      </AdminModal>

    </div>
  );
};

export default AdminEditPropertyPage;
