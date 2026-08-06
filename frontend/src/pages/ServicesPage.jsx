import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Landmark, Shield, FileCheck, Compass, HeartHandshake, Compass as AdvisoryIcon, Sparkles, ChevronRight, Phone, Send, ChevronDown, Award, Users, TrendingUp, ShieldCheck, Palette, FileText, Building } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const ServicesPage = () => {
  const { openBookModal, showToast } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const suiteOfferings = [
    {
      id: "consultation",
      title: "Property Consultation",
      desc: "One-on-one sessions with veteran luxury advisors to map locations, developer properties, and lifestyle criteria.",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80",
      link: "/contact"
    },
    {
      id: "legal",
      title: "Legal Verification",
      desc: "Exhaustive legal audit of title deeds, EC clearance, DTCP/CMDA approvals, and sub-registrar registration support.",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      link: "/services/legal-verification"
    },
    {
      id: "loans",
      title: "Home Financing",
      desc: "Institutional debt structuring, express 48-hour pre-approvals, and preferential interest rates via private banking networks.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
      link: "/services/home-financing"
    },
    {
      id: "interiors",
      title: "Interior Design",
      desc: "Collaborative consultations with award-winning architects, 3D spatial renders, Italian marble, and turnkey execution.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
      link: "/services/interior-design"
    },
    {
      id: "advisory",
      title: "Investment Advisory",
      desc: "In-depth capital growth modeling, yield calculations, and portfolio diversification strategies across high-growth corridors.",
      image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=600&q=80",
      link: "/buy"
    },
    {
      id: "docs",
      title: "Documentation Support",
      desc: "Complete transactional documentation management from draft sale agreements to physical sub-registrar registrations.",
      image: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=600&q=80",
      link: "/contact"
    },
    {
      id: "site-visit",
      title: "Site Visit Assistance",
      desc: "Bespoke private transport and guided tours of luxury listings with dedicated estate specialists.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      link: "#book-visit"
    }
  ];

  const processTimeline = [
    {
      step: "01",
      title: "Private Consultation",
      desc: "Map your asset objectives, budget requirements, and timeline parameters with a designated relationships concierge."
    },
    {
      step: "02",
      title: "Due Diligence Audit",
      desc: "We perform comprehensive title checks and asset physical inspections before drafting transaction documents."
    },
    {
      step: "03",
      title: "Bespoke Structuring",
      desc: "Coordinate with private banks for custom financing structures and tax-optimal registration setups."
    },
    {
      step: "04",
      title: "Asset Handover",
      desc: "Sub-registrar execution, physical key delivery, and onboarding onto IMPERIA ESTATES' luxury property management suite."
    }
  ];

  const whyChooseImperia = [
    {
      title: "End-To-End Concierge Suite",
      desc: "Single-point coordination covering legal clearance, private banking loans, and turnkey interior design."
    },
    {
      title: "Vetted Tier-1 Partners",
      desc: "Direct collaborations with senior Advocates, Private Banks (HDFC, ICICI, HSBC), and European Design Ateliers."
    },
    {
      title: "Complete Client Discretion",
      desc: "Nondisclosure agreements and strict confidentiality protocols safeguarding high-net-worth client identity."
    },
    {
      title: "Zero Administrative Delays",
      desc: "Fast-track 48-hour loan pre-approvals and expedited legal opinion turnarounds."
    }
  ];

  const faqs = [
    {
      q: "What services are included in IMPERIA ESTATES' Concierge Suite?",
      a: "Our suite encompasses complete acquisition lifecycle management: Property Sourcing & Consultation, 30-Year Legal Title Verification, Private Banking Home Loans, Bespoke Interior Architecture, Documentation & Sub-Registrar Support, and Guided Chauffeur Site Visits."
    },
    {
      q: "Can I engage individual IMPERIA ESTATES services separately (e.g. Legal or Interior Design only)?",
      a: "Yes. Every IMPERIA ESTATES service can be engaged independently whether you purchased your property through us or independently."
    },
    {
      q: "Are there any hidden fees for financial or loan advisory services?",
      a: "No. Home loan consultation and private banking rate negotiations are completely complimentary for all IMPERIA ESTATES clients."
    },
    {
      q: "How do I schedule a private consultation for a specific service?",
      a: "Click 'Book a Private Consultation' anywhere on the page or use our WhatsApp Concierge button to schedule a appointment with a specialist relationship manager."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">

      {/* PageHero — contextual advisory/concierge image */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Services Suite' },
          ]}
          eyebrow="CONCIERGE SUITE"
          heading={
            <>End-To-End Luxury <span className="font-normal text-[#8A8A85]">Services Suite</span></>
          }
          description="A comprehensive suite of advisory, legal, structural, and financial services designed to streamline your acquisition timeline while ensuring complete capital security."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24">
        
        {/* Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D97706] font-extrabold block font-sans">
              FULL-SPECTRUM ADVISORY
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-[#1A1A1A] leading-snug tracking-tight">
              Unifying Legal, Financial & Architectural Excellence
            </h2>
            <p className="text-[#2B2926] font-medium text-sm leading-relaxed font-sans">
              Acquiring ultra-luxury real estate requires seamless integration between property search, legal due diligence, debt placement, and interior customization. IMPERIA ESTATES brings all six disciplines under one unified concierge roof, giving clients single-point account oversight.
            </p>
            <div className="grid grid-cols-2 gap-4 font-sans text-xs">
              <Link to="/services/legal-verification" className="p-4 rounded-2xl bg-white border border-[#E8E4DA] hover:border-[#F5A623] shadow-xs transition-colors space-y-1 block">
                <p className="font-extrabold text-[#1A1A1A]">Legal Verification</p>
                <p className="text-[#3A3732] font-semibold text-[11px]">30-Yr Title Search & EC Clearance &rarr;</p>
              </Link>
              <Link to="/services/home-financing" className="p-4 rounded-2xl bg-white border border-[#E8E4DA] hover:border-[#F5A623] shadow-xs transition-colors space-y-1 block">
                <p className="font-extrabold text-[#1A1A1A]">Home Financing</p>
                <p className="text-[#3A3732] font-semibold text-[11px]">Private Bank Loans & Rate Negotiation &rarr;</p>
              </Link>
              <Link to="/services/interior-design" className="p-4 rounded-2xl bg-white border border-[#E8E4DA] hover:border-[#F5A623] shadow-xs transition-colors space-y-1 block">
                <p className="font-extrabold text-[#1A1A1A]">Interior Design</p>
                <p className="text-[#3A3732] font-semibold text-[11px]">Italian Marble & Smart Home Atelier &rarr;</p>
              </Link>
              <button onClick={() => openBookModal()} className="p-4 rounded-2xl bg-amber-50 border border-[#F5A623]/30 text-left hover:bg-[#F5A623]/20 transition-colors space-y-1 block cursor-pointer">
                <p className="font-extrabold text-[#D97706]">Site Visit Concierge</p>
                <p className="text-[#D97706] font-bold text-[11px]">Book Guided Private Tour &rarr;</p>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 h-[420px] rounded-3xl overflow-hidden relative border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <ImageWithSkeleton
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
              alt="IMPERIA ESTATES Luxury Real Estate Concierge Services"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
          </div>
        </section>

        {/* Key Benefits Grid */}
        <section className="space-y-12">
          <div className="space-y-3 font-sans">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D97706] font-extrabold block">
              FULL CATALOGUE
            </span>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Our Signature Services Suite</h2>
            <p className="text-[#2B2926] font-medium text-sm max-w-xl">
              Explore each dedicated service domain or select a practice to read detailed specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suiteOfferings.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] flex flex-col justify-between cursor-pointer transition-all duration-300"
                onClick={() => {
                  if (item.link === '#book-visit') {
                    openBookModal();
                  }
                }}
              >
                <Link to={item.link === '#book-visit' ? '#' : item.link} className="flex flex-col h-full justify-between">
                  <div className="h-[200px] relative overflow-hidden bg-stone-100">
                    <ImageWithSkeleton
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between font-sans">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#F5A623] transition-colors tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-[#8A8A85] group-hover:text-[#1A1A1A] transition-colors">
                      <span>Explore Service</span>
                      <ChevronRight className="w-4 h-4 text-[#F5A623] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Timeline */}
        <section className="space-y-12 border-t border-[#E8E4DA] pt-16">
          <div className="text-center max-w-xl mx-auto space-y-3 font-sans">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              METHODOLOGY
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">The Signature Process</h2>
            <p className="text-[#8A8A85] font-normal text-xs">
              We execute every luxury acquisition using a systematic blueprint, maximizing transaction security and documentation clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processTimeline.map((step, idx) => (
              <div key={idx} className="border border-[#E8E4DA] bg-white p-6 rounded-3xl space-y-4 relative group hover:border-[#F5A623] transition-colors shadow-xs font-sans">
                <span className="text-3xl text-[#F5A623] font-black block">{step.step}</span>
                <h4 className="text-base font-bold text-[#1A1A1A] tracking-tight">{step.title}</h4>
                <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose IMPERIA ESTATES */}
        <section className="border border-[#E8E4DA] bg-white rounded-3xl p-8 md:p-12 space-y-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-sans">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              WHY IMPERIA ESTATES
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Why Choose Our Concierge Suite</h2>
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
        <section className="space-y-8 border-t border-[#E8E4DA] pt-16 font-sans">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Services Suite Questions</h2>
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
        <section className="border border-stone-800 bg-[#1A1A1A] text-white rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-2xl font-sans">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">
              SUITE ADVISORY
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Book a Private Consultation
            </h2>
            <p className="text-xs md:text-sm text-stone-300 font-normal leading-relaxed">
              Connect with our private acquisitions desk to initiate legal clearance, home loan pre-approvals, or interior design consultations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openBookModal()}
              className="px-8 py-4 bg-[#F5A623] hover:bg-amber-400 text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-full shadow-md cursor-pointer transition-all duration-300"
            >
              Book a Private Consultation
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white/20 hover:border-[#F5A623] text-white hover:text-[#F5A623] font-bold text-xs tracking-wider uppercase rounded-full bg-white/5 transition-all duration-300"
            >
              Contact Concierge Desk
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ServicesPage;
