import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, FileText, CheckCircle, HelpCircle as HelpIcon } from 'lucide-react';
import { SectionHeader } from '../components/common/InteractiveWidgets';

const FAQ = () => {
  const [searchVal, setSearchVal] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const categories = ['All', 'Sourcing', 'Legal & Tax', 'Site Visits'];

  const faqs = [
    {
      q: "What does IMPERIA ESTATES' sourcing vetting process entail?",
      a: "Every listing undergoes structural reviews (facade status, acoustic glazing levels), developer RERA check assessments, and comprehensive title investigations covering the last 30 years.",
      category: "Sourcing"
    },
    {
      q: "Can IMPERIA ESTATES coordinate legal registries for NRIs?",
      a: "Yes. Our private legal coordinates draft Powers of Attorney (POA), manage TDS clearances, and coordinate with registrars to execute transactions without requiring physical travel.",
      category: "Legal & Tax"
    },
    {
      q: "How do I schedule a site visit walkthrough?",
      a: "Click 'Book Site Visit' on the top nav or specific listings. Enter date coordinates, and an officer will organize private transportation and briefing materials.",
      category: "Site Visits"
    },
    {
      q: "Does IMPERIA ESTATES assist in placement of commercial debt?",
      a: "Yes. We work closely with private banking wings of top-tier institutional banks to secure home loans and yielding commercial debt rates from 8.2% YoY.",
      category: "Legal & Tax"
    },
    {
      q: "What properties constitute the 'Ultra-Private' collection?",
      a: "Off-market oceanfront estates and penthouses under developer NDA. These are accessed exclusively via personal client coordinates upon registration.",
      category: "Sourcing"
    }
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (searchVal) {
      const q = searchVal.toLowerCase();
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="pt-28 min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      
      {/* Editorial Header */}
      <div className="border-b border-[#E8E4DA] py-16 relative overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <SectionHeader tag="HELP & SUPPORT" title="Bespoke FAQ Center" />

          {/* Search bar */}
          <div className="relative w-full md:w-[360px] font-sans">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5A623] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search help topics..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-full py-3.5 pl-11 pr-5 text-xs font-medium outline-none text-[#1A1A1A] placeholder-[#8A8A85] focus:border-[#F5A623] transition-all font-sans"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        
        {/* Category Tabs */}
        <div className="flex gap-2 p-1 bg-white border border-[#E8E4DA] rounded-full text-xs font-sans w-fit mx-auto shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedIndex(null);
              }}
              className={`px-5 py-2.5 rounded-full transition-colors cursor-pointer font-bold ${
                activeCategory === cat 
                  ? 'bg-[#1A1A1A] text-white shadow-xs' 
                  : 'text-[#8A8A85] hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4 font-sans">
          {filteredFaqs.length === 0 ? (
            <div className="border border-[#E8E4DA] bg-white rounded-3xl py-16 text-center space-y-3 px-6 max-w-sm mx-auto shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
              <div className="p-3.5 rounded-full bg-amber-50 text-[#F5A623] w-fit mx-auto shadow-2xs">
                <HelpIcon className="w-5 h-5 stroke-[2]" />
              </div>
              <h4 className="text-sm font-bold text-[#1A1A1A]">No FAQ Matches</h4>
              <p className="text-[#8A8A85] text-xs font-sans font-normal leading-relaxed">
                Try searching different terms or clearing the active filter categorizations.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-[#E8E4DA] rounded-2xl bg-white overflow-hidden transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.03)]"
                >
                  <button
                    onClick={() => setExpandedIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-[#F4F1EA]/50 transition-colors"
                  >
                    <span className="text-base font-bold text-[#1A1A1A] tracking-tight">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#F5A623] shrink-0 transition-transform duration-300 stroke-[3] ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-xs text-[#8A8A85] leading-relaxed font-sans font-normal border-t border-[#E8E4DA] pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default FAQ;
