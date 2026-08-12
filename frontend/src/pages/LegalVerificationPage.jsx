import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle, ChevronDown, Scale, BookOpen, ArrowRight, ShieldAlert, Award, ChevronRight, FileCheck } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

const LegalVerificationPage = () => {
  const { openBookModal, showToast } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const keyBenefits = [
    {
      title: "30-Year Title Search & Chain Audit",
      desc: "Exhaustive legal scrutiny of title transfer deeds across 30 years to guarantee clear, unencumbered ownership rights.",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Encumbrance Certificate (EC) Verification",
      desc: "Independent retrieval and legal audit of zero-encumbrance records to ensure property is clear of all mortgages or litigation.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "RERA & Municipal Compliance Vetting",
      desc: "Verification of developer RERA registration, DTCP/CMDA layout approvals, and environmental clearance certificates.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Revenue Records & Patta Transfer Audit",
      desc: "Validation of Chitta, Adangal, and Patta mutation records to ensure flawless government land revenue mapping.",
      image: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Agreement of Sale & Deed Drafting",
      desc: "Custom legal drafting of sale agreements, indemnity clauses, and possession covenants tailored for high-value transactions.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Physical Registrar Concierge",
      desc: "VVIP sub-registrar scheduling, biometric appointment coordination, and express registration clearance for buyer privacy.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Document Collection & Intake",
      desc: "Our legal team retrieves parent title deeds, mother documents, layout approvals, and tax receipts directly from sellers or developers."
    },
    {
      number: "02",
      title: "30-Year Search & Litigation Audit",
      desc: "High Court litigation checks, sub-registrar search index audits, and bank mortgage clearance verifications are performed."
    },
    {
      number: "03",
      title: "Legal Opinion Report Issuance",
      desc: "A Bar-associated senior advocate issues a formal, binding Legal Title Search Opinion detailing asset security clearance."
    },
    {
      number: "04",
      title: "Registration & Key Handover",
      desc: "Preparation of stamp duty calculations, biometric sub-registrar execution, and Patta mutation filing upon completion."
    }
  ];

  const whyChooseImperia = [
    {
      title: "Zero-Risk Guarantee",
      desc: "Every property verified by IMPERIA ESTATES comes with an ironclad title guarantee backed by senior legal opinion."
    },
    {
      title: "Senior Bar Advocates",
      desc: "Our legal team comprises veteran property attorneys with over 25 years of specialized real estate litigation expertise."
    },
    {
      title: "Fast-Track Turnaround",
      desc: "Comprehensive legal opinion and EC verification reports delivered within 48 to 72 business hours."
    },
    {
      title: "Complete NRI Privacy",
      desc: "Power of Attorney (POA) drafting and remote embassy attestation support for international buyers."
    }
  ];

  const faqs = [
    {
      q: "Why is a 30-year title search essential for luxury property acquisitions?",
      a: "A 30-year title search traces the unbroken chain of ownership, verifying that previous transfers, gifts, partitions, or inheritances were legal and clear of hidden claims or legal heirs' disputes."
    },
    {
      q: "What documents are verified during IMPERIA ESTATES' legal audit?",
      a: "We audit Parent Title Deeds, Encumbrance Certificates (Form 15 & Form 16), Approved Building Plans (DTCP/CMDA), RERA Registration Certificate, Land Patta/Chitta, Property Tax Receipts, Building Completion Certificates, and NOCs from water/electricity departments."
    },
    {
      q: "How does IMPERIA ESTATES assist NRIs in legal verification without physical presence?",
      a: "We manage complete Power of Attorney (POA) legal drafting, consulate attestation coordination, local advocate representations, and digital sub-registrar scheduling."
    },
    {
      q: "What happens if a legal flaw or encumbrance is discovered during vetting?",
      a: "If an unresolved encumbrance, pending litigation, or defective title link is identified, our legal team halts the transaction and issues an immediate risk report, protecting your capital advance."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] pb-20">
      
      {/* Hero Banner */}
      <PageHero
        image="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Legal Verification' },
        ]}
        eyebrow="CONCIERGE LEGAL DESK"
        heading="Legal Verification & Asset Clearance"
        description="Comprehensive 30-year title searches, RERA compliance audits, encumbrance clearances, and sale deed drafting by senior high court advocates."
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24 font-sans">
        
        {/* Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D97706] font-extrabold block">
              DUE DILIGENCE AUDIT
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] leading-snug tracking-tight">
              Safeguarding High-Value Property Investments
            </h2>
            <p className="text-[#2B2926] font-medium text-sm leading-relaxed">
              In luxury real estate transactions, unverified encumbrances or title gaps can lead to costly legal disputes. IMPERIA ESTATES’ Concierge Legal Desk engages senior Advocates to conduct rigorous 30-year title tracing, RERA regulatory audits, and sub-registrar document validation before any capital commitment is made.
            </p>
            <div className="p-6 rounded-2xl bg-white border border-[#E8E4DA] space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#D97706] text-sm font-extrabold">
                <FileCheck className="w-5 h-5 shrink-0 stroke-[2]" />
                <span>30-Year Title Search Guarantee</span>
              </div>
              <p className="text-xs text-[#2B2926] font-medium leading-relaxed">
                Full verification of parent deeds, mother documents, revenue patta certificates, and non-encumbrance certificates (EC).
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 h-[400px] rounded-3xl overflow-hidden relative border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <ImageWithSkeleton
              src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80"
              alt="Legal Due Diligence Audit"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
          </div>
        </section>

        {/* Key Benefits Grid */}
        <section className="space-y-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D97706] font-extrabold block">
              LEGAL SERVICES
            </span>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Vetting & Compliance Disciplines</h2>
            <p className="text-[#2B2926] font-medium text-sm max-w-xl">
              Six comprehensive legal practices designed to protect ownership rights and streamline sub-registrar registration.
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
              AUDIT ROADMAP
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">4-Step Verification Process</h2>
            <p className="text-[#8A8A85] font-normal text-xs">
              From document intake and revenue search to advocate title opinions and registration.
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
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Why Choose Our Legal Desk</h2>
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
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Legal Verification Questions</h2>
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
              LEGAL CONSULTATION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Initiate a Legal Title Audit
            </h2>
            <p className="text-xs md:text-sm text-stone-300 font-normal leading-relaxed">
              Connect with our senior Advocates to initiate encumbrance searches, Patta transfers, or purchase agreement reviews.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openBookModal('Legal Verification')}
              className="px-8 py-4 bg-[#F5A623] hover:bg-amber-400 text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-full shadow-md cursor-pointer transition-all duration-300"
            >
              Book a Private Consultation
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white/20 hover:border-[#F5A623] text-white hover:text-[#F5A623] font-bold text-xs tracking-wider uppercase rounded-full bg-white/5 transition-all duration-300"
            >
              Contact Legal Desk
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LegalVerificationPage;
