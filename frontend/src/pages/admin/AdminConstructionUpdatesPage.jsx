import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HardHat, 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PlusCircle,
  Building,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { 
  FormLabel, 
  TextInput, 
  SegmentedControl, 
  ToggleSwitch, 
  ImageDropzone 
} from '../../components/admin/primitives/FormField';

const initialProjects = [
  {
    id: 'proj-1',
    name: 'IMPERIA Skyline Towers',
    location: 'Race Course, Coimbatore',
    builder: 'IMPERIA Infra',
    timeline: 'Q4 2024 – Q4 2027',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    manualOverride: false,
    manualProgress: 45,
    milestones: [
      { id: 'm1', label: 'Land Acquisition & RERA Clearance', status: 'Completed' },
      { id: 'm2', label: 'Deep Foundation Piling & Substructure', status: 'Completed' },
      { id: 'm3', label: 'Tower A & B Core Structural Superstructure', status: 'In Progress' },
      { id: 'm4', label: 'Glass Facade & MEP Electrical Rough-Ins', status: 'Pending' },
      { id: 'm5', label: 'Interior Fit-Out & Handover Key Ceremony', status: 'Pending' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Grand Vista Mansion',
    location: 'Kalapatti, Coimbatore',
    builder: 'IMPERIA Estates',
    timeline: 'Q1 2024 – Q2 2025',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    manualOverride: false,
    manualProgress: 80,
    milestones: [
      { id: 'm10', label: 'Architectural Design Approval', status: 'Completed' },
      { id: 'm11', label: 'Structure & Roof Slab Casting', status: 'Completed' },
      { id: 'm12', label: 'Plumbing & Italian Marble Flooring', status: 'Completed' },
      { id: 'm13', label: 'Infinity Pool & Landscape Gardening', status: 'In Progress' },
      { id: 'm14', label: 'Final Quality Audit & Handover', status: 'Pending' }
    ]
  }
];

const AdminConstructionUpdatesPage = () => {
  const { showToast } = useApp();

  const [projects, setProjects] = useState(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState('proj-1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Project Modal State
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    location: '',
    builder: 'IMPERIA Infra',
    timeline: '2025 – 2027',
    image: ''
  });

  // Selected Active Project
  const activeProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Derived Progress Calculation: (completed milestones / total milestones) * 100
  const calculatedProgress = useMemo(() => {
    if (!activeProject || !activeProject.milestones || activeProject.milestones.length === 0) return 0;
    const completedCount = activeProject.milestones.filter(m => m.status === 'Completed').length;
    return Math.round((completedCount / activeProject.milestones.length) * 100);
  }, [activeProject]);

  // Effective progress (manual override vs calculated)
  const effectiveProgress = activeProject?.manualOverride
    ? activeProject.manualProgress
    : calculatedProgress;

  // Soft Warning: Check if >1 milestone is set to "In Progress"
  const inProgressCount = useMemo(() => {
    return activeProject?.milestones?.filter(m => m.status === 'In Progress').length || 0;
  }, [activeProject]);

  // Update Milestone Handler
  const updateMilestone = (milestoneId, key, val) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedProjectId) return p;
      const updatedMs = p.milestones.map(m => m.id === milestoneId ? { ...m, [key]: val } : m);
      return { ...p, milestones: updatedMs };
    }));
  };

  // Add Milestone
  const addMilestone = () => {
    const newMs = {
      id: `m-${Date.now()}`,
      label: 'New Construction Milestone',
      status: 'Pending'
    };
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedProjectId) return p;
      return { ...p, milestones: [...p.milestones, newMs] };
    }));
  };

  // Delete Milestone
  const deleteMilestone = (milestoneId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedProjectId) return p;
      if (p.milestones.length <= 1) {
        showToast("At least one milestone is required in the timeline.");
        return p;
      }
      return { ...p, milestones: p.milestones.filter(m => m.id !== milestoneId) };
    }));
  };

  // Toggle Manual Override
  const toggleManualOverride = (val) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedProjectId) return p;
      return { ...p, manualOverride: val };
    }));
  };

  const updateManualProgress = (val) => {
    const clamped = Math.max(0, Math.min(100, Number(val) || 0));
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedProjectId) return p;
      return { ...p, manualProgress: clamped };
    }));
  };

  // Save Timeline Action
  const handleSaveTimeline = () => {
    showToast(`Timeline saved for ${activeProject.name}! Progress updated to ${effectiveProgress}%.`);
  };

  // Create New Project Action
  const handleCreateProject = () => {
    if (!newProjectData.name.trim() || !newProjectData.location.trim()) {
      showToast("Project Name and Location are required.");
      return;
    }

    const newId = `proj-${Date.now()}`;
    const created = {
      id: newId,
      name: newProjectData.name,
      location: newProjectData.location,
      builder: newProjectData.builder || 'IMPERIA Infra',
      timeline: newProjectData.timeline || '2025 – 2027',
      image: newProjectData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      manualOverride: false,
      manualProgress: 0,
      milestones: [
        { id: `m-${Date.now()}-1`, label: 'Site Excavation & Groundwork', status: 'In Progress' },
        { id: `m-${Date.now()}-2`, label: 'Superstructure Construction', status: 'Pending' }
      ]
    };

    setProjects(prev => [...prev, created]);
    setSelectedProjectId(newId);
    setIsAddModalOpen(false);
    showToast(`Created new project "${created.name}"!`);
  };

  return (
    <div className="space-y-8 font-sans pb-24">
      
      {/* ── TOPBAR BANNER ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
            CONSTRUCTION TIMELINE MANAGER
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
            Construction Milestone Updates
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#F5A623]" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* ── MAIN LAYOUT: LEFT RAIL + RIGHT EDITOR ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Rail (1 Col): Projects List */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)] space-y-4 h-fit font-sans">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A85] font-extrabold block border-b border-[#E8E4DA] pb-3">
            ACTIVE PROJECTS ({projects.length})
          </span>

          <div className="space-y-3">
            {projects.map(proj => {
              const isSelected = proj.id === selectedProjectId;
              const pCount = proj.milestones?.filter(m => m.status === 'Completed').length || 0;
              const pTotal = proj.milestones?.length || 1;
              const pct = proj.manualOverride ? proj.manualProgress : Math.round((pCount / pTotal) * 100);

              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                      : 'bg-white text-[#1A1A1A] border-[#E8E4DA] hover:bg-[#F4F1EA]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-xs truncate">{proj.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#F5A623] text-black' : 'bg-[#F4F1EA] text-[#1A1A1A]'
                    }`}>
                      {pct}%
                    </span>
                  </div>

                  <p className={`text-[10px] truncate ${isSelected ? 'text-[#8A8A85]' : 'text-[#8A8A85]'}`}>
                    {proj.location}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Panel (3 Cols): Project Summary Card & Milestone Timeline Editor */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProjectId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Selected Project Summary Card (Mirrors Projects.jsx card) */}
              <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] font-sans space-y-4">
                <div className="flex flex-col md:flex-row gap-5 items-start">
                  <img
                    src={activeProject.image}
                    alt={activeProject.name}
                    className="w-full md:w-56 h-36 rounded-xl object-cover border border-[#E8E4DA] shrink-0"
                  />

                  <div className="space-y-2 flex-1 font-sans">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#F5A623] tracking-wider">
                        {activeProject.builder}
                      </span>
                      <span className="text-xs text-[#8A8A85] font-semibold">{activeProject.timeline}</span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
                      {activeProject.name}
                    </h3>
                    <p className="text-xs text-[#8A8A85] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{activeProject.location}</span>
                    </p>

                    {/* Progress Bar Component */}
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs font-extrabold text-[#1A1A1A]">
                        <span>Overall Project Progress</span>
                        <span className="text-[#F5A623]">{effectiveProgress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#F4F1EA] rounded-full overflow-hidden border border-[#E8E4DA]">
                        <div
                          className="h-full bg-[#F5A623] rounded-full transition-all duration-500"
                          style={{ width: `${effectiveProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Calculation & Manual Override Toggle */}
                <div className="pt-4 border-t border-[#E8E4DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      label="Manual Override Progress %"
                      checked={activeProject.manualOverride || false}
                      onChange={toggleManualOverride}
                    />
                  </div>

                  {activeProject.manualOverride && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#8A8A85]">Set Custom %:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={activeProject.manualProgress || 0}
                        onChange={(e) => updateManualProgress(e.target.value)}
                        className="w-20 bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1A1A1A] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Editable Vertical Milestone Timeline */}
              <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.04)] font-sans space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Milestone Timeline Editor</h3>
                    <p className="text-xs text-[#8A8A85]">Drag, update, or add construction milestones for this estate.</p>
                  </div>
                  <button
                    onClick={handleSaveTimeline}
                    className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase rounded-full shadow-md cursor-pointer transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-[#F5A623]" />
                    <span>Save Timeline</span>
                  </button>
                </div>

                {/* Soft Warning if >1 In Progress */}
                {inProgressCount > 1 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#F5A623] shrink-0" />
                    <span>Multiple milestones ({inProgressCount}) are marked "In Progress". Usually only one active milestone is in progress at a time.</span>
                  </div>
                )}

                {/* Milestone Rows */}
                <div className="space-y-4">
                  {activeProject.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className="group flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-2xl border border-[#E8E4DA] bg-[#F4F1EA]/40 hover:border-[#1A1A1A] transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <GripVertical className="w-4 h-4 text-[#8A8A85] cursor-grab shrink-0" />
                        <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center shrink-0 font-mono">
                          {idx + 1}
                        </span>

                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => updateMilestone(m.id, 'label', e.target.value)}
                          placeholder="Milestone Title"
                          className="w-full min-w-0 bg-white border border-[#E8E4DA] rounded-xl px-4 py-2.5 text-xs font-extrabold text-[#1A1A1A] outline-none focus:border-[#F5A623] shadow-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E8E4DA]/60">
                        <div className="w-full lg:w-72">
                          <SegmentedControl
                            options={['Completed', 'In Progress', 'Pending']}
                            value={m.status}
                            onChange={(val) => updateMilestone(m.id, 'status', val)}
                          />
                        </div>

                        <button
                          onClick={() => deleteMilestone(m.id)}
                          className="p-2 rounded-xl text-[#8A8A85] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer shrink-0"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Milestone Ghost Button */}
                <button
                  onClick={addMilestone}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-[#E8E4DA] hover:border-[#F5A623] bg-[#F4F1EA]/50 text-xs font-extrabold text-[#1A1A1A] hover:bg-amber-50/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#F5A623]" />
                  <span>+ Add Construction Milestone</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── MODAL: ADD NEW PROJECT ─────────────────────────────────── */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Construction Project"
        subtitle="Create a new estate development project and initialize its milestone timeline."
        size="md"
        confirmText="Create Project"
        onConfirm={handleCreateProject}
      >
        <div className="space-y-4 font-sans">
          <TextInput
            label="Project Name *"
            required
            value={newProjectData.name}
            onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. IMPERIA Bayview Towers"
          />

          <TextInput
            label="Location Address *"
            required
            value={newProjectData.location}
            onChange={(e) => setNewProjectData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g. ECR, Chennai"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Developer / Builder"
              value={newProjectData.builder}
              onChange={(e) => setNewProjectData(prev => ({ ...prev, builder: e.target.value }))}
            />

            <TextInput
              label="Timeline"
              value={newProjectData.timeline}
              onChange={(e) => setNewProjectData(prev => ({ ...prev, timeline: e.target.value }))}
            />
          </div>

          <ImageDropzone
            label="Project Cover Image"
            images={newProjectData.image ? [newProjectData.image] : []}
            onChange={(imgs) => setNewProjectData(prev => ({ ...prev, image: imgs[0] || '' }))}
            maxFiles={1}
          />
        </div>
      </AdminModal>

    </div>
  );
};

export default AdminConstructionUpdatesPage;
