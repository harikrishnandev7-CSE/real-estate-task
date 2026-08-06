import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Palette, Sparkles, Home, CheckCircle, ChevronDown, Award, ArrowRight, ChevronRight, Layers } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

const InteriorDesignPage = () => {
  const { openBookModal, showToast } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const keyBenefits = [
    {
      title: "3D Volumetric Spatial Visualizations",
      desc: "Full-scale 3D virtual walkthroughs and photorealistic lighting renderings before physical execution begins.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Imported Italian Marble & Finishes",
      desc: "Direct sourcing of rare Statuario marble, brushed brass trims, and acoustic hardwood paneling directly from European quarries.",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Smart Home & Automation Integration",
      desc: "Lutron lighting controls, motorized acoustic curtains, and integrated Control4 home automation for seamless comfort.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Custom Italian & German Modular Kitchens",
      desc: "Bespoke Poggenpohl and Valcucine kitchen layouts with integrated Miele appliances and quartz waterfall islands.",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Master Suite & Spa Bath Architecture",
      desc: "Private retreat designs featuring double-vanity quartz countertops, frameless glass rain showers, and walk-in dressing suites.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Turnkey Contractor & Execution Supervision",
      desc: "Dedicated project manager oversight guaranteeing strict timelines, zero material wastage, and flawless execution.",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Concept & Moodboard Briefing",
      desc: "Collaborative session with award-winning interior architects to map color palettes, material samples, and spatial layouts."
    },
    {
      number: "02",
      title: "3D Rendering & CAD Drafting",
      desc: "Generation of detailed 3D photorealistic renderings, electrical layouts, plumbing schematics, and custom millwork drawings."
    },
    {
      number: "03",
      title: "European Procurement",
      desc: "Direct import of bespoke furniture, lighting fixtures, Italian stone, and smart automation hardware."
    },
    {
      number: "04",
      title: "Turnkey Execution & Styling",
      desc: "On-site carpentry, marble polishing, automation commissioning, and final artistic styling prior to handover."
    }
  ];

  const whyChooseImperia = [
    {
      title: "Award-Winning Atelier",
      desc: "Collaborate with international interior architects renowned for signature luxury estate designs across Asia & Europe."
    },
    {
      title: "Direct European Import",
      desc: "Bypass intermediary markups with direct quarry-to-home procurement of Italian marble and German fittings."
    },
    {
      title: "Lifetime Hardware Warranty",
      desc: "Comprehensive 10-year structural and lifetime mechanical hardware warranty on all modular cabinetry."
    },
    {
      title: "Guaranteed Completion Date",
      desc: "Strict milestone-backed completion contracts with liquid damages clauses ensuring zero move-in delays."
    }
  ];

  const faqs = [
    {
      q: "What is the typical timeline for complete luxury villa interior execution?",
      a: "Turnkey interior execution for a 4,000–8,000 sq ft luxury villa typically spans 90 to 120 days from approved 3D designs to final white-glove handover."
    },
    {
      q: "Can clients customize imported materials and furniture selections?",
      a: "Absolutely. We arrange private design consultations with physical material samples, marble slab selection visits, and custom upholstery fabric books."
    },
    {
      q: "How does IMPERIA ESTATES integrate Smart Home Automation into interior designs?",
      a: "Our electrical CAD schematics incorporate concealed wiring and hub placements for Lutron, Crestron, and Control4 systems, allowing unified smartphone and voice control over lighting, HVAC, and security."
    },
    {
      q: "Do you handle turnkey interior execution for newly acquired shell apartments?",
      a: "Yes. We specialize in bare-shell transformation, managing civil modifications, false ceiling design, electrical ducting, acoustic treatment, and full furnishing."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      
      {/* Hero Banner */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Interior Design' },
          ]}
          eyebrow="DESIGN ATELIER"
          heading={
            <>Bespoke Luxury <span className="font-normal text-[#8A8A85]">Interior Architecture</span></>
          }
          description="Transforming spaces into living works of art using imported Italian stone, smart home automation, bespoke millwork, and turnkey execution."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24 font-sans">
        
        {/* Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              DESIGN PHILOSOPHY
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-snug tracking-tight">
              Harmonizing Space, Light & Italian Craftsmanship
            </h2>
            <p className="text-[#8A8A85] font-normal text-sm leading-relaxed">
              True luxury is experienced through material authenticity and spatial rhythm. IMPERIA ESTATES’ Design Atelier works closely with homeowners, architectural firms, and European furniture houses to turn blank structural floor plans into bespoke sanctuary residences.
            </p>
            <div className="p-6 rounded-2xl bg-white border border-[#E8E4DA] space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#F5A623] text-sm font-bold">
                <Palette className="w-5 h-5 shrink-0 stroke-[2]" />
                <span>Custom Material Sourcing</span>
              </div>
              <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                Direct imports of Statuario Italian Marble, custom teak millwork, brass inlay metalwork, and motorized acoustic drapes.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 h-[400px] rounded-3xl overflow-hidden relative border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <ImageWithSkeleton
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
              alt="Bespoke Interior Living Room Design"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
          </div>
        </section>

        {/* Key Benefits Grid */}
        <section className="space-y-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              DESIGN DISCIPLINES
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Interior Architecture Practices</h2>
            <p className="text-[#8A8A85] font-normal text-sm max-w-xl">
              Six core specializations spanning 3D spatial modeling, smart home integration, and custom furnishings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyBenefits.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between transition-all duration-300"
              >
                <div className="h-[200px] relative overflow-hidden bg-stone-100">
                  <ImageWithSkeleton
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Timeline */}
        <section className="space-y-12 border-t border-[#E8E4DA] pt-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              EXECUTION PIPELINE
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">4-Phase Atelier Process</h2>
            <p className="text-[#8A8A85] font-normal text-xs">
              From mood boards and 3D spatial renders to physical installation and handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <div key={idx} className="border border-[#E8E4DA] bg-white p-6 rounded-3xl space-y-4 relative group hover:border-[#F5A623] transition-colors shadow-xs">
                <span className="text-3xl text-[#F5A623] font-black block">{step.number}</span>
                <h4 className="text-base font-bold text-[#1A1A1A] tracking-tight">{step.title}</h4>
                <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose IMPERIA ESTATES */}
        <section className="border border-[#E8E4DA] bg-white rounded-3xl p-8 md:p-12 space-y-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              THE IMPERIA ESTATES MARGIN
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Why Choose Our Design Atelier</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseImperia.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#1A1A1A] tracking-tight">{item.title}</h4>
                  <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="space-y-8 border-t border-[#E8E4DA] pt-16">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Interior Architecture Questions</h2>
          </div>

          <div className="space-y-4 max-w-3xl">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#E8E4DA] bg-white rounded-2xl overflow-hidden transition-colors shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm font-bold text-[#1A1A1A]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#F5A623] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 text-xs text-[#8A8A85] font-normal leading-relaxed border-t border-[#E8E4DA] pt-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="border border-stone-800 bg-[#1A1A1A] text-white rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-2xl">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
              DESIGN CONSULTATION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Schedule an Atelier Consultation
            </h2>
            <p className="text-xs md:text-sm text-stone-300 font-normal leading-relaxed">
              Meet with our lead interior architects to review floor plans, material palettes, and 3D spatial concepts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openBookModal('Interior Design')}
              className="px-8 py-4 bg-[#F5A623] hover:bg-amber-400 text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-full shadow-md cursor-pointer transition-all duration-300"
            >
              Book a Private Consultation
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white/20 hover:border-[#F5A623] text-white hover:text-[#F5A623] font-bold text-xs tracking-wider uppercase rounded-full bg-white/5 transition-all duration-300"
            >
              Contact Design Desk
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default InteriorDesignPage;
