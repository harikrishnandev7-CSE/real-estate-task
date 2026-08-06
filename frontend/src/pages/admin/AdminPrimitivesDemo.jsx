import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Calendar, 
  TrendingUp, 
  Layers, 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  PlusCircle,
  FileText
} from 'lucide-react';
import KPICard from '../../components/admin/primitives/KPICard';
import DataTable from '../../components/admin/primitives/DataTable';
import StatusChip from '../../components/admin/primitives/StatusChip';
import { 
  FormLabel, 
  TextInput, 
  SelectInput, 
  TextAreaInput, 
  SegmentedControl, 
  ToggleSwitch, 
  MultiSelectChips, 
  ImageDropzone 
} from '../../components/admin/primitives/FormField';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { useApp } from '../../context/AppContext';

const mockTableData = [
  { id: '1', name: 'The Ritz-Carlton Residences', city: 'Chennai', price: '₹14.5 Cr', type: 'Apartment', status: 'Ready to Move', rating: '4.95' },
  { id: '2', name: 'IMPERIA Skyline Towers', city: 'Coimbatore', price: '₹8.2 Cr', type: 'Penthouse', status: 'Under Construction', rating: '4.88' },
  { id: '3', name: 'The ECR Beachfront Villa', city: 'Chennai', price: '₹22.0 Cr', type: 'Villa', status: 'Ready to Move', rating: '4.99' },
  { id: '4', name: 'Golden Meadows 2-Acres', city: 'Chennai', price: '₹2.80 Cr', type: 'Plot', status: 'Ready for Registration', rating: '4.95' },
  { id: '5', name: 'Infinity Co-Working Lounge', city: 'Chennai', price: '₹2.2 L/mo', type: 'Co-working', status: 'Scheduled', rating: '4.75' },
  { id: '6', name: 'Grand Vista Mansion', city: 'Coimbatore', price: '₹9.8 Cr', type: 'Villa', status: 'Draft', rating: '4.90' },
  { id: '7', name: 'Signature Acres 10-Acres', city: 'Hyderabad', price: '₹6.80 Cr', type: 'Plot', status: 'Cancelled', rating: '4.94' }
];

const AdminPrimitivesDemo = () => {
  const { showToast } = useApp();

  // Form Field Primitive States
  const [textVal, setTextVal] = useState('IMPERIA Heritage Villa');
  const [selectVal, setSelectVal] = useState('Villa');
  const [textError, setTextError] = useState('');
  const [segmentVal, setSegmentVal] = useState('Buy');
  const [toggleVal, setToggleVal] = useState(true);
  const [chipVal, setChipVal] = useState(['Infinity Pool', '24/7 Concierge']);
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
  ]);

  // Modal Primitive States
  const [modalSize, setModalSize] = useState(null); // null | 'sm' | 'md' | 'lg' | 'drawer'
  const [isDestructive, setIsDestructive] = useState(false);

  // DataTable State
  const [tableLoading, setTableLoading] = useState(false);
  const [showEmptyTable, setShowEmptyTable] = useState(false);

  const columns = [
    { key: 'name', label: 'Property Title', sortable: true },
    { key: 'city', label: 'Location City', sortable: true },
    { key: 'price', label: 'Asking Price', sortable: true },
    { key: 'type', label: 'Type' },
    { 
      key: 'status', 
      label: 'Status Badge',
      render: (val) => <StatusChip status={val} />
    }
  ];

  return (
    <div className="space-y-12 font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 md:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.04)] space-y-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#F5A623]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold">
            ADMIN SYSTEM PRIMITIVES STORYBOOK
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
          Reusable Admin UI Primitives
        </h2>
        <p className="text-xs md:text-sm text-[#8A8A85] font-medium max-w-2xl leading-relaxed">
          Isolated test canvas verifying Phase 2 UI primitives: KPICard, DataTable, StatusChip, FormFields set (TextInput, Select, SegmentedControl, MultiSelect, Dropzone), AdminModals (sm/md/lg/drawer/destructive), and Toast notifications.
        </p>
      </div>

      {/* ── 1. KPICARD PRIMITIVES ───────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight border-b border-[#E8E4DA] pb-2">
          1. KPICard Primitives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard
            title="Total Revenue Assets"
            value="₹142.5 Cr"
            icon={Building}
            delta={{ value: '+12.4%', positive: true }}
            sparkline={[40, 55, 65, 80, 100, 120, 142]}
          />
          <KPICard
            title="Scheduled Site Visits"
            value="38 Visits"
            icon={Calendar}
            delta={{ value: '+24.1%', positive: true }}
            sparkline={[10, 14, 18, 22, 28, 32, 38]}
          />
          <KPICard
            title="Active Consultations"
            value="18 Active"
            icon={Users}
            delta={{ value: '-3.2%', positive: false }}
            sparkline={[30, 28, 25, 22, 20, 19, 18]}
          />
          <KPICard
            title="Portfolio Growth"
            value="+18.4% YoY"
            icon={TrendingUp}
            delta={{ value: '+5.8%', positive: true }}
            sparkline={[5, 8, 10, 12, 15, 17, 18]}
          />
        </div>
      </section>

      {/* ── 2. STATUSCHIP PALETTE PRIMITIVES ─────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight border-b border-[#E8E4DA] pb-2">
          2. StatusChip Color Mapped Palette
        </h3>
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] flex flex-wrap gap-4 items-center">
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">EMERALD:</span><StatusChip status="Published" /></div>
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">EMERALD:</span><StatusChip status="Completed" /></div>
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">EMERALD:</span><StatusChip status="Ready to Move" /></div>
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">STONE:</span><StatusChip status="Draft" /></div>
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">STONE:</span><StatusChip status="Pending" /></div>
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">RED:</span><StatusChip status="Archived" /></div>
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">RED:</span><StatusChip status="Cancelled" /></div>
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">SKY:</span><StatusChip status="Scheduled" /></div>
          <div><span className="text-[10px] text-[#8A8A85] block mb-1 font-bold">SKY:</span><StatusChip status="Rent" /></div>
        </div>
      </section>

      {/* ── 3. DATATABLE PRIMITIVE ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E4DA] pb-2">
          <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight">
            3. DataTable Primitive (Sort, Paginate, Checkbox Select, Row Actions)
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTableLoading(!tableLoading)}
              className="px-3 py-1.5 rounded-full border border-[#E8E4DA] bg-white text-xs font-bold text-[#1A1A1A] hover:bg-[#F4F1EA] cursor-pointer"
            >
              {tableLoading ? 'Stop Loading' : 'Simulate Loading Shimmer'}
            </button>
            <button
              onClick={() => setShowEmptyTable(!showEmptyTable)}
              className="px-3 py-1.5 rounded-full border border-[#E8E4DA] bg-white text-xs font-bold text-[#1A1A1A] hover:bg-[#F4F1EA] cursor-pointer"
            >
              {showEmptyTable ? 'Show Data' : 'Simulate Empty State'}
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={showEmptyTable ? [] : mockTableData}
          loading={tableLoading}
          pageSize={4}
          onRowClick={(row) => showToast(`Selected row: ${row.name}`)}
          onView={(row) => showToast(`Viewing "${row.name}"`)}
          onEdit={(row) => showToast(`Editing "${row.name}"`)}
          onDelete={(row) => showToast(`Deleted "${row.name}"`)}
          bulkActions={[
            { label: 'Export Selected', action: (ids) => showToast(`Exported IDs: ${ids.join(', ')}`) },
            { label: 'Bulk Delete', action: (ids) => showToast(`Deleted IDs: ${ids.join(', ')}`) }
          ]}
        />
      </section>

      {/* ── 4. FORM FIELD PRIMITIVES SUITE ──────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight border-b border-[#E8E4DA] pb-2">
          4. FormField Primitives Suite
        </h3>

        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Property Title"
              required
              value={textVal}
              onChange={(e) => {
                setTextVal(e.target.value);
                setTextError(e.target.value ? '' : 'Property title is required');
              }}
              error={textError}
              placeholder="e.g. Imperial Heights Penthouse"
            />

            <SelectInput
              label="Property Category"
              required
              value={selectVal}
              onChange={(e) => setSelectVal(e.target.value)}
              options={['Villa', 'Apartment', 'Penthouse', 'Plot', 'Office', 'Co-working']}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SegmentedControl
              label="Listing Purpose"
              options={['Buy', 'Rent', 'Invest']}
              value={segmentVal}
              onChange={setSegmentVal}
            />

            <ToggleSwitch
              label="RERA Compliance Verified"
              description="Displays gold compliance shield on property cards"
              checked={toggleVal}
              onChange={setToggleVal}
            />
          </div>

          <MultiSelectChips
            label="Featured Property Amenities"
            options={['Infinity Pool', 'Private Gym', '24/7 Concierge', 'Home Automation', 'Helipad', 'Sea View', 'Private Cinema']}
            selected={chipVal}
            onChange={setChipVal}
          />

          <TextAreaInput
            label="Architectural Description"
            placeholder="Write detailed property description..."
            rows={3}
          />

          <ImageDropzone
            label="Gallery & Floor Plan Media Upload"
            images={images}
            onChange={setImages}
            maxFiles={6}
          />
        </div>
      </section>

      {/* ── 5. ADMIN MODALS & DRAWERS ───────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight border-b border-[#E8E4DA] pb-2">
          5. AdminModal Primitives (sm / md / lg / drawer / destructive)
        </h3>

        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] flex flex-wrap gap-4 items-center">
          <button
            onClick={() => { setIsDestructive(false); setModalSize('sm'); }}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-full cursor-pointer"
          >
            Open Small Modal (420px)
          </button>
          <button
            onClick={() => { setIsDestructive(false); setModalSize('md'); }}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-full cursor-pointer"
          >
            Open Medium Modal (600px)
          </button>
          <button
            onClick={() => { setIsDestructive(false); setModalSize('lg'); }}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold rounded-full cursor-pointer"
          >
            Open Large Modal (760px)
          </button>
          <button
            onClick={() => { setIsDestructive(false); setModalSize('drawer'); }}
            className="px-4 py-2 bg-[#F5A623] hover:bg-amber-500 text-white text-xs font-bold rounded-full cursor-pointer shadow-xs"
          >
            Open Slide-Over Drawer
          </button>
          <button
            onClick={() => { setIsDestructive(true); setModalSize('sm'); }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full cursor-pointer"
          >
            Open Destructive Modal
          </button>
        </div>
      </section>

      {/* Render Modal Instance */}
      <AdminModal
        isOpen={Boolean(modalSize)}
        onClose={() => setModalSize(null)}
        title={isDestructive ? "Confirm Permanent Deletion" : `${modalSize?.toUpperCase()} Admin Modal`}
        subtitle={isDestructive ? "This action cannot be undone. Are you sure?" : "Demonstrating spring physics and chrome design tokens."}
        size={modalSize || 'md'}
        isDestructive={isDestructive}
        confirmText={isDestructive ? "Delete Permanently" : "Save Changes"}
        onConfirm={() => showToast(isDestructive ? "Record deleted" : "Modal action confirmed")}
      >
        <p className="text-xs text-[#8A8A85] leading-relaxed">
          {isDestructive
            ? "Deleting this luxury property listing will instantly purge all records, analytics, and associated site visit schedules."
            : "This modal primitive uses the exact backdrop blur, spring physics, and rounded-3xl chrome defined in the IMPERIA design system."}
        </p>
      </AdminModal>

    </div>
  );
};

export default AdminPrimitivesDemo;
