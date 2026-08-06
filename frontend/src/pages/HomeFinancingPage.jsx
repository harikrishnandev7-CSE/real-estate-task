import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Landmark, Calculator, CheckCircle, ChevronDown, Award, ArrowRight, ChevronRight, Percent } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

const HomeFinancingPage = () => {
  const { openBookModal, showToast } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const keyBenefits = [
    {
      title: "Private Banking Rate Negotiation",
      desc: "Direct access to preferred AAA-grade interest rate structures starting from 8.2% via our private banking network.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Express 48-Hour Loan Approvals",
      desc: "Fast-tracked credit underwriting and express sanction letter issuance for time-sensitive luxury purchases.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "HNI Multi-Property Debt Structuring",
      desc: "Strategic leverage planning across commercial and residential portfolios to optimize capital allocation and tax liability.",
      image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Flexible Repayment & Moratorium Plans",
      desc: "Customized step-up, step-down, and interest-only moratorium structures tailored for family office cash flows.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "NRI Financial & Tax Compliance",
      desc: "FEMA compliance advisory, NRE/NRO account leverage, and international currency hedging for overseas investors.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Balance Transfer & Top-Up Audit",
      desc: "Refinancing existing high-cost loans to reduce interest outlay and unlock top-up capital for luxury fitouts.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Financial Profile Assessment",
      desc: "We analyze income parameters, asset liquidity, tax returns, and target property valuation."
    },
    {
      number: "02",
      title: "Bank Partner Matching",
      desc: "We present your dossier to top private banks (HDFC, ICICI, Axis Private, HSBC) to procure competitive rate quotes."
    },
    {
      number: "03",
      title: "Sanction Letter Issuance",
      desc: "Express pre-approval sanction letter delivered within 48 hours without administrative delays."
    },
    {
      number: "04",
      title: "Disbursement & Handover",
      desc: "Legal property valuation verification, final agreement execution, and direct loan disbursement to seller."
    }
  ];

  const whyChooseImperia = [
    {
      title: "Direct Private Bank Concierge",
      desc: "Dedicated senior banking relationship managers assigned exclusively to IMPERIA ESTATES HNI clients."
    },
    {
      title: "Zero Administrative Fee",
      desc: "Our financial advisory services are completely complimentary for all IMPERIA ESTATES property purchasers."
    },
    {
      title: "Higher Loan-to-Value (LTV)",
      desc: "Negotiated maximum eligibility capping up to 80-85% for pre-vetted premium residential developments."
    },
    {
      title: "End-to-End Paperwork",
      desc: "Complete documentation management, doorstep signature collection, and title verification filing."
    }
  ];

  const faqs = [
    {
      q: "What home loan interest rates can IMPERIA ESTATES clients access?",
      a: "Through our institutional banking partnerships, IMPERIA ESTATES clients receive preferential rates starting from 8.2% per annum, with zero processing fee waivers on select Tier-1 developers."
    },
    {
      q: "Can NRIs obtain home loans for luxury property acquisitions in South India?",
      a: "Yes. NRIs can secure home financing up to 80% of property cost. We manage NRE/NRO banking compliance, overseas income verification, and Power of Attorney execution."
    },
    {
      q: "What is the turnaround time for home loan pre-approval?",
      a: "For pre-vetted IMPERIA ESTATES properties with complete legal documentation, pre-approval sanction letters are issued within 48 hours."
    },
    {
      q: "How does IMPERIA ESTATES assist with Home Loan Balance Transfers?",
      a: "We perform a comparative interest analysis. If lower interest rates are available, we manage the seamless transfer of your existing mortgage balance to a lower-rate bank with top-up capital options."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      
      {/* Hero Banner */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Home Financing' },
          ]}
          eyebrow="PRIVATE BANKING DESK"
          heading={
            <>Bespoke Home Financing & <span className="font-normal text-[#8A8A85]">Debt Structuring</span></>
          }
          description="Institutional debt advisory, express 48-hour approvals, and ultra-low interest rates through our direct collaborations with Tier-1 private banking networks."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24 font-sans">
        
        {/* Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              FINANCIAL ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-snug tracking-tight">
              Unlocking Strategic Capital For Luxury Acquisitions
            </h2>
            <p className="text-[#8A8A85] font-normal text-sm leading-relaxed">
              Optimizing capital allocation is as critical as selecting the property itself. IMPERIA ESTATES’ Private Banking Desk collaborates directly with senior credit committees across leading financial institutions to curate custom mortgage frameworks, preferential interest rates, and tailored tax-efficient debt structures.
            </p>
            <div className="p-6 rounded-2xl bg-white border border-[#E8E4DA] space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#F5A623] text-sm font-bold">
                <Percent className="w-5 h-5 shrink-0 stroke-[2]" />
                <span>Preferential HNI Interest Rates</span>
              </div>
              <p className="text-xs text-[#8A8A85] font-normal leading-relaxed">
                Enjoy customized repayment schedules, step-down EMIs, and zero processing fee charges across all Tier-1 banking partners.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 h-[400px] rounded-3xl overflow-hidden relative border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <ImageWithSkeleton
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80"
              alt="Private Banking Suite Consultation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
          </div>
        </section>

        {/* Key Benefits Grid */}
        <section className="space-y-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold block">
              FINANCING PILLARS
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Home Financing Services</h2>
            <p className="text-[#8A8A85] font-normal text-sm max-w-xl">
              Six strategic financial solutions designed to maximize purchasing leverage and preserve liquid capital.
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
              LOAN CHOREOGRAPHY
            </span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">4-Step Financing Roadmap</h2>
            <p className="text-[#8A8A85] font-normal text-xs">
              From financial assessment to express loan disbursement with complete transparency.
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
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Why Choose Our Banking Desk</h2>
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
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Home Financing Questions</h2>
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
              FINANCIAL CONSULTATION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Schedule a Private Banking Briefing
            </h2>
            <p className="text-xs md:text-sm text-stone-300 font-normal leading-relaxed">
              Speak with our private debt managers to calculate your borrowing capacity or structure home financing for your next acquisition.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openBookModal('Home Financing')}
              className="px-8 py-4 bg-[#F5A623] hover:bg-amber-400 text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-full shadow-md cursor-pointer transition-all duration-300"
            >
              Book a Private Consultation
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white/20 hover:border-[#F5A623] text-white hover:text-[#F5A623] font-bold text-xs tracking-wider uppercase rounded-full bg-white/5 transition-all duration-300"
            >
              Contact Private Desk
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomeFinancingPage;
