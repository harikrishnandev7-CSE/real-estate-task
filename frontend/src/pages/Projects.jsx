import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Building, MapPin, Calendar, Compass, ArrowRight, Download, CheckCircle, Clock, FileText, ChevronRight, User, Phone, Check } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const Projects = () => {
  const navigate = useNavigate();
  const { showToast, openBookModal } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [siteVisitBooked, setSiteVisitBooked] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', project: 'The Ritz-Carlton Residences', date: '' });

  const handleBookSiteVisit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setSiteVisitBooked(true);
      showToast(`Site visit request registered for ${formData.name}`);
    }
  };

  const activeProjects = [
    {
      id: "imperia-ritz",
      name: "The Ritz-Carlton Residences",
      location: "OMR, Chennai",
      builder: "Imperia Developers & Ritz Group",
      timeline: "Possession Dec 2025",
      progress: 90,
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
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      desc: "Ultra-luxury high-rises designed by award-winning architectural firms, defining the skyline of Coimbatore.",
      milestones: [
        { label: "Excavation & Foundations", status: "completed" },
        { label: "Superstructure Structure", status: "in-progress" },
        { label: "Exterior Masonry & Glassing", status: "pending" },
        { label: "Interior Fitouts & Commissioning", status: "pending" },
        { label: "Possession Handover", status: "pending" }
      ]
    },
    {
      id: "imperia-villas-coimbatore",
      name: "Elysian Hills Estate",
      location: "Kalapatti, Coimbatore",
      builder: "IMPERIA Estates",
      timeline: "Possession Ready",
      progress: 100,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      desc: "Private garden mansion units designed with acoustic isolation systems, private gyms, and individual lap pools.",
      milestones: [
        { label: "Excavation & Foundations", status: "completed" },
        { label: "Superstructure Structure", status: "completed" },
        { label: "Exterior Masonry & Glassing", status: "completed" },
        { label: "Interior Fitouts & Commissioning", status: "completed" },
        { label: "Possession Handover", status: "completed" }
      ]
    }
  ];

  const handleBookVisit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.date) {
      setSiteVisitBooked(true);
      showToast(`Walkthrough requested for ${formData.project}`);
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
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">

      {/* PageHero — architectural landmark image */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Projects' },
          ]}
          eyebrow="SIGNATURE PROJECTS"
          heading={
            <>Masterful Architectural <span className="font-normal text-[#8A8A85]">Creations</span></>
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
                className="border border-[#E8E4DA] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-6 md:p-8 space-y-8 relative group transition-all duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)]"
              >
                {/* Visual highlight line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#F5A623] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Project Header Info */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 font-sans">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#3A3732] text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{project.location}</span>
                      <span className="h-1 w-1 bg-stone-400 rounded-full" />
                      <span className="text-[#D97706] font-extrabold">{project.builder}</span>
                    </div>
                    <h3 
                      onClick={() => navigate(`/property/${project.id}`)}
                      className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight group-hover:text-[#F5A623] transition-colors cursor-pointer"
                    >
                      {project.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDownloadBrochure(project.name)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#E8E4DA] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs font-bold tracking-wider uppercase transition-all shrink-0 w-fit cursor-pointer bg-white shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Brochure
                  </button>
                </div>

                {/* Project Showcase Image */}
                <div 
                  onClick={() => navigate(`/property/${project.id}`)}
                  className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-stone-100 cursor-pointer"
                >
                  <ImageWithSkeleton 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                </div>

                {/* Description & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-[#1A1A1A] font-sans">
                  <div className="space-y-4">
                    <p className="font-medium text-xs text-[#2B2926]">
                      {project.desc}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#D97706] bg-amber-50 border border-[#F5A623]/30 px-4 py-2.5 rounded-xl w-fit">
                      <Calendar className="w-4 h-4 text-[#F5A623]" />
                      <span>{project.timeline}</span>
                    </div>
                  </div>

                  {/* Progress Tracker Widget */}
                  <div className="space-y-4 bg-[#F4F1EA] border border-[#E8E4DA] rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-[#3A3732] font-extrabold">Construction Progress</span>
                      <span className="text-sm font-bold text-[#F5A623]">{project.progress}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#F5A623] rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>

                    {/* Timeline Steps */}
                    <div className="space-y-3 pt-2">
                      {project.milestones.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-bold">
                          <span className={m.status === 'completed' ? 'text-[#1A1A1A]' : 'text-[#4A4640]'}>{m.label}</span>
                          {m.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          {m.status === 'in-progress' && <Clock className="w-3.5 h-3.5 text-[#F5A623]" />}
                          {m.status === 'pending' && <span className="w-2 h-2 rounded-full bg-stone-400" />}
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
            <div className="border border-[#E8E4DA] bg-white rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
              <div className="space-y-2 border-b border-[#E8E4DA] pb-4">
                <span className="text-xs uppercase tracking-widest text-[#F5A623] font-bold">VIP TOUR</span>
                <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Book Project Site Visit</h3>
                <p className="text-xs text-[#8A8A85] font-normal">Schedule a private, guided walkthrough of active construction landmarks.</p>
              </div>

              {!siteVisitBooked ? (
                <form onSubmit={handleBookSiteVisit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A8A85] mb-1.5 font-bold">Select Project</label>
                    <select
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] outline-none rounded-xl py-3 px-4 text-xs text-[#1A1A1A] font-bold"
                    >
                      {activeProjects.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A8A85] mb-1.5 font-bold">Full Name</label>
                    <input
                      type="text"
                      placeholder="Devendra Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] outline-none rounded-xl py-3 px-4 text-xs text-[#1A1A1A] font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A8A85] mb-1.5 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] outline-none rounded-xl py-3 px-4 text-xs text-[#1A1A1A] font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8A8A85] mb-1.5 font-bold">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] outline-none rounded-xl py-3 px-4 text-xs text-[#1A1A1A] font-medium"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer mt-2"
                  >
                    Schedule Chauffeur Visit
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#1A1A1A]">Site Visit Confirmed!</h4>
                  <p className="text-xs text-[#8A8A85]">Our team will call you at {formData.phone} to finalize your pickup location.</p>
                  <button
                    onClick={() => setSiteVisitBooked(false)}
                    className="text-xs text-[#F5A623] font-bold underline cursor-pointer"
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
