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
      id: "sell",
      title: "Sell / List Property",
      desc: "Targeted high-net-worth buyer marketing, architectural photography, 360 virtual tours, and discreet negotiations.",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
      link: "/sell-property"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans pb-20">
      <PageHero
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
        eyebrow="IMPERIA CONCIERGE SUITE"
        heading="Comprehensive Advisory Services"
        description="End-to-end luxury real estate advisory spanning title due diligence, interior architectural design, home financing, and high-yield asset sales."
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16 font-sans">
        {/* OFFERINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suiteOfferings.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group border border-[rgba(93,100,114,0.15)] hover:border-[#CFB6A8] rounded-xl overflow-hidden bg-white shadow-[0_12px_32px_rgba(54,60,70,0.06)] transition-all flex flex-col justify-between"
            >
              <div className="relative h-[200px] overflow-hidden bg-[#E0EEE9]">
                <ImageWithSkeleton
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3
                    className="text-lg font-bold text-[#363C46] tracking-tight group-hover:text-[#CFB6A8] transition-colors"
                    style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5D6472] leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-[rgba(93,100,114,0.15)] flex items-center text-xs font-bold text-[#CFB6A8] gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore Service</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
