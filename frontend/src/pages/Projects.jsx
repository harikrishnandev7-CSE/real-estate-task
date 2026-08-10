import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Building, MapPin, Calendar, Compass, ArrowRight, Download, CheckCircle, Clock, FileText, ChevronRight, User, Phone, Check } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const DEFAULT_PROJECTS = [
  {
    id: "imperia-ritz",
    name: "The Ritz-Carlton Residences",
    location: "OMR, Chennai",
    builder: "Imperia Developers & Ritz Group",
    timeline: "Possession Dec 2025",
    progress: 90,
    totalProperties: 12,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    desc: "Branded residences featuring full concierge service, valet, private lounges, and sky-deck infinity pools.",
    milestones: [
      { label: "Excavation & Foundations", status: "completed" },
      { label: "Superstructure Structure", status: "completed" },
      { label: "Exterior Masonry & Glassing", status: "completed" },
      { label: "Interior Fitouts & Commissioning", status: "in-progress" },
      { label: "Possession Handover", status: "pending" }
    ]
  },
  {
    id: "imperia-skyline",
    name: "Imperia Skyline Towers",
    location: "Race Course, Coimbatore",
    builder: "IMPERIA Infra",
    timeline: "Possession June 2027",
    progress: 45,
    totalProperties: 8,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    desc: "Ultra-luxury high-rises designed by award-winning architectural firms, defining the skyline of Coimbatore.",
    milestones: [
      { label: "Excavation & Foundations", status: "completed" },
      { label: "Superstructure Structure", status: "in-progress" },
      { label: "Exterior Masonry & Glassing", status: "pending" },
      { label: "Interior Fitouts & Commissioning", status: "pending" },
      { label: "Possession Handover", status: "pending" }
    ]
  }
];

const Projects = () => {
  const navigate = useNavigate();
  const { showToast, openBookModal, projects: dbProjects = [] } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [siteVisitBooked, setSiteVisitBooked] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', project: 'The Ritz-Carlton Residences', date: '' });

  const activeProjects = useMemo(() => {
    if (Array.isArray(dbProjects) && dbProjects.length > 0) {
      return dbProjects.map(p => ({
        id: p.id || p._id,
        name: p.name || p.developer || 'IMPERIA Landmark Project',
        location: p.location || (p.city ? `${p.city}, India` : 'Chennai, India'),
        builder: p.builder || p.name || 'IMPERIA Developers',
        timeline: p.timeline || 'Active Development',
        progress: p.progress || 80,
        totalProperties: p.totalProperties || p.properties?.length || 1,
        image: p.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        desc: p.desc || `Branded luxury development by ${p.builder || p.name || 'IMPERIA Developers'} featuring ultra-modern amenities.`,
        milestones: p.milestones || [
          { label: "Excavation & Foundations", status: "completed" },
          { label: "Superstructure Structure", status: "completed" },
          { label: "Exterior Masonry & Glassing", status: "in-progress" },
          { label: "Interior Fitouts & Commissioning", status: "in-progress" },
          { label: "Possession Handover", status: "pending" }
        ]
      }));
    }
    return DEFAULT_PROJECTS;
  }, [dbProjects]);

  const handleBookSiteVisit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setSiteVisitBooked(true);
      showToast(`Site visit request registered for ${formData.name}`);
    }
  };

  const handleDownloadBrochure = (projectName) => {
    showToast(`Brochure download initiated for ${projectName}`);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">

      {/* PageHero */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Projects' },
          ]}
          eyebrow="SIGNATURE PROJECTS"
          heading={
            <>Masterful Architectural <span className="font-normal text-[#5D6472]">Creations</span></>
          }
          description="A curated showcase of luxury landmarks developed by IMPERIA ESTATES in collaboration with elite global designers, mapping out upcoming luxury horizons."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: ACTIVE PROJECTS LIST */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 space-y-16"
          >
            {activeProjects.map((project) => (
              <motion.div 
                key={project.id}
                variants={itemVariants}
                className="border border-[rgba(93,100,114,0.15)] rounded-xl overflow-hidden bg-white shadow-[0_12px_32px_rgba(54,60,70,0.06)] p-6 md:p-8 space-y-8 relative group transition-all duration-300 hover:shadow-[0_20px_40px_rgba(54,60,70,0.1)]"
              >
                {/* Visual highlight line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#CFB6A8] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Project Header Info */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 font-sans">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#5D6472] text-xs font-bold flex-wrap">
                      <MapPin className="w-3.5 h-3.5 text-[#CFB6A8]" />
                      <span>{project.location}</span>
                      <span className="h-1 w-1 bg-[#5D6472] rounded-full" />
                      <span className="text-[#CFB6A8] font-bold">{project.builder}</span>
                      <span className="h-1 w-1 bg-[#5D6472] rounded-full" />
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E0EEE9] text-[#363C46] text-[10px] font-extrabold border border-[rgba(93,100,114,0.15)]">
                        {project.totalProperties || 1} {(project.totalProperties || 1) === 1 ? 'Property' : 'Properties'}
                      </span>
                    </div>
                    <h3 
                      onClick={() => navigate(`/property/${project.id}`)}
                      className="text-2xl font-bold text-[#363C46] tracking-tight group-hover:text-[#CFB6A8] transition-colors cursor-pointer"
                      style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                    >
                      {project.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDownloadBrochure(project.name)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-[rgba(93,100,114,0.20)] hover:border-[#363C46] hover:bg-[#363C46] hover:text-white text-[#363C46] text-xs font-bold tracking-wider uppercase transition-all shrink-0 w-fit cursor-pointer bg-white shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Brochure
                  </button>
                </div>

                {/* Project Showcase Image */}
                <div 
                  onClick={() => navigate(`/property/${project.id}`)}
                  className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-[#E0EEE9] cursor-pointer"
                >
                  <ImageWithSkeleton 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                </div>

                {/* Description & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-[#363C46] font-sans">
                  <div className="space-y-4">
                    <p className="font-medium text-xs text-[#5D6472]">
                      {project.desc}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#CFB6A8] bg-[rgba(207,182,168,0.12)] border border-[rgba(207,182,168,0.25)] px-4 py-2.5 rounded-lg w-fit">
                      <Calendar className="w-4 h-4 text-[#CFB6A8]" />
                      <span>{project.timeline}</span>
                    </div>
                  </div>

                  {/* Progress Tracker Widget */}
                  <div className="space-y-4 bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.15)] rounded-lg p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-[#5D6472] font-bold">Construction Progress</span>
                      <span className="text-sm font-bold text-[#CFB6A8]">{project.progress}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-[#CFB6A8] rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>

                    {/* Timeline Steps */}
                    <div className="space-y-3 pt-2">
                      {project.milestones.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-bold">
                          <span className={m.status === 'completed' ? 'text-[#363C46]' : 'text-[#5D6472]'}>{m.label}</span>
                          {m.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          {m.status === 'in-progress' && <Clock className="w-3.5 h-3.5 text-[#CFB6A8]" />}
                          {m.status === 'pending' && <span className="w-2 h-2 rounded-full bg-[#5D6472]/40" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT COLUMN: SITE VISIT BOOKING FORM */}
          <aside className="lg:col-span-4 sticky top-28 font-sans">
            <div className="border border-[rgba(93,100,114,0.15)] bg-white rounded-xl p-6 md:p-8 space-y-6 shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
              <div className="space-y-2 border-b border-[rgba(93,100,114,0.15)] pb-4">
                <span className="text-xs uppercase tracking-widest text-[#CFB6A8] font-bold">VIP TOUR</span>
                <h3
                  className="text-xl font-bold text-[#363C46] tracking-tight"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  Book Project Site Visit
                </h3>
                <p className="text-xs text-[#5D6472] font-normal">Schedule a private, guided walkthrough of active construction landmarks.</p>
              </div>

              {!siteVisitBooked ? (
                <form onSubmit={handleBookSiteVisit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5D6472] mb-1.5 font-bold">Select Project</label>
                    <select
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8] outline-none rounded-lg py-3 px-4 text-xs text-[#363C46] font-bold"
                    >
                      {activeProjects.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5D6472] mb-1.5 font-bold">Full Name</label>
                    <input
                      type="text"
                      placeholder="Devendra Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8] outline-none rounded-lg py-3 px-4 text-xs text-[#363C46] font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5D6472] mb-1.5 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8] outline-none rounded-lg py-3 px-4 text-xs text-[#363C46] font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5D6472] mb-1.5 font-bold">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8] outline-none rounded-lg py-3 px-4 text-xs text-[#363C46] font-medium"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#363C46] hover:bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-all cursor-pointer mt-2"
                  >
                    Schedule Chauffeur Visit
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#363C46]">Site Visit Confirmed!</h4>
                  <p className="text-xs text-[#5D6472]">Our team will call you at {formData.phone} to finalize your pickup location.</p>
                  <button
                    onClick={() => setSiteVisitBooked(false)}
                    className="text-xs text-[#CFB6A8] font-bold underline cursor-pointer"
                  >
                    Book Another Tour
                  </button>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Projects;
