import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Download, 
  Eye, 
  Pencil, 
  Copy, 
  Trash2, 
  Check, 
  Building, 
  MapPin, 
  Heart, 
  MessageSquare,
  ShieldCheck,
  X,
  Sliders,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/admin/primitives/DataTable';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { 
  FormLabel, 
  SelectInput, 
  SegmentedControl, 
  ToggleSwitch, 
  MultiSelectChips 
} from '../../components/admin/primitives/FormField';
import { EmptyState } from '../../components/common/FeedbackStates';

const CITIES = ['All', 'Chennai', 'Coimbatore', 'Hyderabad', 'Bengaluru'];
const TYPES = ['All', 'Villa', 'Apartment', 'Penthouse', 'Plot', 'Commercial', 'Office', 'Co-working'];
const PURPOSES = ['All', 'Buy', 'Rent'];
const STATUSES = ['All', 'Published', 'Ready to Move', 'Under Construction', 'Draft', 'Archived'];

const AdminPropertiesPage = () => {
  const navigate = useNavigate();
  const { 
    properties = [], 
    deleteProperty, 
    bulkUpdateProperties, 
    addProperty, 
    showToast 
  } = useApp();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [searchVal, setSearchVal] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const citiesOptions = useMemo(() => {
    const defaultCities = ['All', 'Chennai', 'Coimbatore', 'Hyderabad', 'Bengaluru'];
    const dynamicSet = new Set(defaultCities);
    (properties || []).forEach(p => {
      if (p.city && p.city.trim()) dynamicSet.add(p.city.trim());
    });
    return Array.from(dynamicSet);
  }, [properties]);

  // Filter drawer states (matching Buy.jsx filter controls)
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPurpose, setSelectedPurpose] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [reraOnly, setReraOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(250000000); // Max 25 Cr

  // Selection state for Grid view bulk actions
  const [selectedGridIds, setSelectedGridIds] = useState([]);

  // Preview Drawer Modal state
  const [previewProperty, setPreviewProperty] = useState(null);

  // Filter properties based on search & filter controls
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Search
      if (searchVal.trim()) {
        const q = searchVal.toLowerCase();
        const matches = (
          prop.title?.toLowerCase().includes(q) ||
          prop.location?.toLowerCase().includes(q) ||
          prop.city?.toLowerCase().includes(q) ||
          prop.type?.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }

      // City
      if (selectedCity !== 'All' && prop.city !== selectedCity) return false;

      // Type
      if (selectedType !== 'All' && prop.type !== selectedType) return false;

      // Purpose
      if (selectedPurpose !== 'All' && prop.purpose !== selectedPurpose) return false;

      // Status
      if (selectedStatus !== 'All') {
        const pStatus = (prop.status || 'Published').toLowerCase();
        const sTarget = selectedStatus.toLowerCase();
        if (!pStatus.includes(sTarget)) return false;
      }

      // RERA
      if (reraOnly && !prop.rera) return false;

      // Price Range
      if (prop.numericPrice && prop.numericPrice > priceRange) return false;

      return true;
    });
  }, [properties, searchVal, selectedCity, selectedType, selectedPurpose, selectedStatus, reraOnly, priceRange]);

  // Reset Filters helper
  const resetFilters = () => {
    setSelectedCity('All');
    setSelectedType('All');
    setSelectedPurpose('All');
    setSelectedStatus('All');
    setReraOnly(false);
    setPriceRange(250000000);
    setSearchVal('');
    showToast("Filters reset to default.");
  };

  // CSV Export helper
  const handleExportCSV = () => {
    const headers = "ID,Title,City,Location,Type,Purpose,Price,Status,Views,Enquiries\n";
    const rows = filteredProperties.map(p => 
      `"${p.id}","${p.title}","${p.city}","${p.location}","${p.type}","${p.purpose}","${p.price}","${p.status || 'Published'}",${p.views || 0},${p.enquiries || 0}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `imperia_properties_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredProperties.length} properties to CSV`);
  };

  // Duplicate property helper
  const handleDuplicate = (property) => {
    const copyData = {
      ...property,
      title: `${property.title} (Copy)`,
      status: 'Draft'
    };
    delete copyData.id;
    addProperty(copyData);
  };

  // DataTable Column Definitions
  const columns = [
    {
      key: 'title',
      label: 'Property Title & Location',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.image && !row.image.startsWith('blob:') ? row.image : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80"} 
            alt={row.title} 
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80";
            }}
            className="w-12 h-12 rounded-xl object-cover border border-[#E8E4DA] shrink-0" 
          />
          <div className="min-w-0 font-sans">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#1A1A1A] block truncate">{row.title}</span>
              {row.isJustPublished && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-[#F5A623] border border-amber-200 uppercase tracking-wider shrink-0">
                  Just published
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#8A8A85] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#F5A623] shrink-0" />
              <span className="truncate">{row.location}</span>
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (val) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F4F1EA] text-[#1A1A1A] border border-[#E8E4DA]">
          {val}
        </span>
      )
    },
    {
      key: 'purpose',
      label: 'Purpose',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
          val === 'Rent' ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-amber-50 text-[#1A1A1A] border-amber-200'
        }`}>
          {val || 'Buy'}
        </span>
      )
    },
    {
      key: 'numericPrice',
      label: 'Price',
      sortable: true,
      render: (_, row) => <span className="font-extrabold text-[#1A1A1A]">{row.price}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusChip status={val || 'Published'} />
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (val) => <span className="font-bold text-[#1A1A1A]">{val ?? 450}</span>
    },
    {
      key: 'enquiries',
      label: 'Enquiries',
      render: (val) => <span className="font-bold text-amber-600">{val ?? 18}</span>
    },
    {
      key: 'rera',
      label: 'RERA',
      render: (val) => val ? (
        <ShieldCheck className="w-4 h-4 text-emerald-600" title="RERA Certified" />
      ) : (
        <span className="text-[#8A8A85] text-xs">—</span>
      )
    }
  ];

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* ── TOPBAR CONTROLS & ACTION ROW ────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-5 shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-extrabold block font-sans">
            INVENTORY MANAGEMENT
          </span>
          <h2
            className="text-2xl font-bold text-[#0B0B0B] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Properties Catalog
          </h2>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#C9A96E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, city, type..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-[#F8F6F2] border border-[rgba(201,169,110,0.25)] rounded-xl text-xs px-4 py-2.5 pl-9 text-[#0B0B0B] placeholder-[#8A8A85] focus:outline-none focus:border-[#C9A96E] w-48 sm:w-60 transition-all font-sans font-medium"
            />
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="px-4 py-2.5 bg-[#F8F6F2] hover:bg-[#0E0E10] hover:text-[#F4F1EA] border border-[rgba(201,169,110,0.25)] text-[#0B0B0B] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Filter className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Filters</span>
          </button>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 bg-[#F8F6F2] border border-[rgba(201,169,110,0.25)] rounded-full">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#0E0E10] text-[#F4F1EA] shadow-xs' : 'text-[#8A8A85] hover:text-[#0B0B0B]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#0E0E10] text-[#F4F1EA] shadow-xs' : 'text-[#8A8A85] hover:text-[#0B0B0B]'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV Ghost Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-[rgba(201,169,110,0.25)] hover:bg-[#F8F6F2] text-[#0B0B0B] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Add Property Primary Black Pill */}
          <button
            onClick={() => navigate('/admin/properties/new')}
            className="px-5 py-2.5 bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] text-xs font-extrabold tracking-wider uppercase rounded-xl shadow-md border border-[#C9A96E] transition-all cursor-pointer flex items-center gap-2 font-sans"
          >
            <PlusCircle className="w-4 h-4 text-[#C9A96E]" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* ── TABLE VIEW vs GRID VIEW ─────────────────────────────────── */}
      {filteredProperties.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-[#E8E4DA]">
          <EmptyState
            title="No Properties Match Filters"
            message="Try clearing active filters or searching for another keyword."
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <DataTable
          columns={columns}
          data={filteredProperties}
          pageSize={8}
          onRowClick={(row) => setPreviewProperty(row)}
          onView={(row) => setPreviewProperty(row)}
          onEdit={(row) => navigate(`/admin/properties/${row.id || row._id}/edit`)}
          onDelete={(row) => deleteProperty(row.id || row._id)}
          bulkActions={[
            { label: 'Publish Selected', action: (ids) => bulkUpdateProperties(ids, 'Publish') },
            { label: 'Archive Selected', action: (ids) => bulkUpdateProperties(ids, 'Archive') },
            { label: 'Delete Selected', action: (ids) => bulkUpdateProperties(ids, 'Delete') }
          ]}
        />
      ) : (
        /* GRID CARD VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(prop => {
              const targetId = prop.id || prop._id;
              return (
              <div
                key={targetId}
                className="group relative bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.04)] hover:border-[#1A1A1A] transition-all font-sans flex flex-col justify-between"
              >
                {/* Image Container with Status Ribbon + Admin Stats Badge */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img 
                    src={prop.image && !prop.image.startsWith('blob:') ? prop.image : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"} 
                    alt={prop.title} 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Status Ribbon */}
                  <div className="absolute top-3 left-3">
                    <StatusChip status={prop.status || 'Published'} />
                  </div>

                  {/* Views & Enquiry Stats Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] font-bold">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-[#F5A623]" /> {prop.views ?? 420} views</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-[#F5A623]" /> {prop.enquiries ?? 12} enquiries</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5A623]">
                        {prop.type} · {prop.purpose || 'Buy'}
                      </span>
                      <span className="text-base font-extrabold text-[#1A1A1A]">{prop.price}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#1A1A1A] tracking-tight mt-1 truncate">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-[#8A8A85] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#F5A623] shrink-0" />
                      <span className="truncate">{prop.location}</span>
                    </p>
                  </div>

                  {/* Specs Row */}
                  <div className="grid grid-cols-3 gap-2 border-t border-[#E8E4DA] pt-3 text-[11px] font-bold text-[#1A1A1A]">
                    <div><span className="text-[9px] text-[#8A8A85] block uppercase font-bold">BHK</span>{prop.beds || '—'} Beds</div>
                    <div><span className="text-[9px] text-[#8A8A85] block uppercase font-bold">Baths</span>{prop.baths || '—'}</div>
                    <div><span className="text-[9px] text-[#8A8A85] block uppercase font-bold">Area</span>{prop.area || '—'}</div>
                  </div>

                  {/* Admin Actions Bar */}
                  <div className="border-t border-[#E8E4DA] pt-3 flex items-center justify-between">
                    <button
                      onClick={() => setPreviewProperty(prop)}
                      className="px-3 py-1.5 rounded-lg bg-[#F4F1EA] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/admin/properties/${targetId}/edit`)}
                        className="p-2 rounded-lg text-[#8A8A85] hover:text-[#1A1A1A] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                        title="Edit Property"
                      >
                        <Pencil className="w-4 h-4 stroke-[2]" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(prop)}
                        className="p-2 rounded-lg text-[#8A8A85] hover:text-[#F5A623] hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Duplicate Property"
                      >
                        <Copy className="w-4 h-4 stroke-[2]" />
                      </button>
                      <button
                        onClick={() => deleteProperty(targetId)}
                        className="p-2 rounded-lg text-[#8A8A85] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* ── FILTER DRAWER MODAL (Reusing Buy.jsx exact filter controls) ── */}
      <AdminModal
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter Admin Properties Catalog"
        subtitle="Narrow down property records by city, property type, purpose, status, and price limits."
        size="drawer"
      >
        <div className="space-y-6 font-sans">
          {/* City Selector */}
          <SelectInput
            label="Location City"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            options={citiesOptions}
          />

          {/* Property Type Selector */}
          <SelectInput
            label="Property Category"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={TYPES}
          />

          {/* Listing Purpose */}
          <SegmentedControl
            label="Listing Purpose"
            options={PURPOSES}
            value={selectedPurpose}
            onChange={setSelectedPurpose}
          />

          {/* Property Status */}
          <SelectInput
            label="Listing Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={STATUSES}
          />

          {/* RERA Only Toggle */}
          <ToggleSwitch
            label="RERA Certified Only"
            description="Filter only government RERA verified listings"
            checked={reraOnly}
            onChange={setReraOnly}
          />

          {/* Reset Filters & Apply */}
          <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-between">
            <button
              onClick={resetFilters}
              className="text-xs text-[#8A8A85] hover:text-[#1A1A1A] underline font-bold cursor-pointer"
            >
              Reset All Filters
            </button>

            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase rounded-full shadow-md cursor-pointer hover:bg-black transition-all"
            >
              Apply Filters ({filteredProperties.length})
            </button>
          </div>
        </div>
      </AdminModal>

      {/* ── READ-ONLY PROPERTY PREVIEW DRAWER (Miniature Customer View) ─ */}
      <AdminModal
        isOpen={Boolean(previewProperty)}
        onClose={() => setPreviewProperty(null)}
        title={previewProperty?.title || 'Property Preview'}
        subtitle={`${previewProperty?.location || ''} · ${previewProperty?.price || ''}`}
        size="drawer"
      >
        {previewProperty && (
          <div className="space-y-6 font-sans">
            {/* Image Banner */}
            <div className="relative h-60 rounded-2xl overflow-hidden border border-[#E8E4DA]">
              <img 
                src={previewProperty.image && !previewProperty.image.startsWith('blob:') ? previewProperty.image : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"} 
                alt={previewProperty.title} 
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
                }}
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3">
                <StatusChip status={previewProperty.status || 'Published'} />
              </div>
            </div>

            {/* Quick Spec Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#F4F1EA] border border-[#E8E4DA] text-xs">
              <div><span className="text-[10px] text-[#8A8A85] block font-bold">TYPE</span><span className="font-extrabold">{previewProperty.type}</span></div>
              <div><span className="text-[10px] text-[#8A8A85] block font-bold">PURPOSE</span><span className="font-extrabold">{previewProperty.purpose || 'Buy'}</span></div>
              <div><span className="text-[10px] text-[#8A8A85] block font-bold">PRICE</span><span className="font-extrabold text-[#F5A623]">{previewProperty.price}</span></div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#8A8A85]">Description</span>
              <p className="text-xs text-[#2D2B28] leading-relaxed font-normal">
                {previewProperty.desc || 'An extraordinary luxury estate built with world-class materials and custom interior architecture.'}
              </p>
            </div>

            {/* Amenities List */}
            {previewProperty.amenities && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#8A8A85]">Key Amenities</span>
                <div className="flex flex-wrap gap-1.5">
                  {previewProperty.amenities.map((am, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#F4F1EA] text-[#1A1A1A] border border-[#E8E4DA]">
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTAs */}
            <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setPreviewProperty(null);
                  navigate(`/admin/properties/${previewProperty.id}/edit`);
                }}
                className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Edit Property</span>
              </button>
            </div>
          </div>
        )}
      </AdminModal>

    </div>
  );
};

export default AdminPropertiesPage;
