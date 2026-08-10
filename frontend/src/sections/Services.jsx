import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Users, TrendingUp, ShieldCheck, FileText, Palette } from 'lucide-react';
import Masonry from '../components/common/Masonry';

const Services = () => {
  const navigate = useNavigate();

  const serviceItems = [
    {
      id: '1',
      title: 'Bespoke Home Loans',
      badge: 'FINANCING & MORTGAGE',
      desc: 'Access ultra-low interest mortgage structures through our direct collaborations with premier private banking networks.',
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      icon: Landmark,
      url: '/services/home-financing',
      height: 480
    },
    {
      id: '2',
      title: 'Property Advisory',
      badge: 'EXECUTIVE ADVISORY',
      desc: 'One-on-one sessions with veteran luxury advisors to map locations, developer properties, and lifestyle criteria.',
      img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      icon: Users,
      url: '/services',
      height: 360
    },
    {
      id: '3',
      title: 'Investment Guidance',
      badge: 'CAPITAL GROWTH',
      desc: 'In-depth capital growth modeling, cash-yield calculations, and market cycle analysis to maximize property returns.',
      img: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=800&q=80',
      icon: TrendingUp,
      url: '/services',
      height: 520
    },
    {
      id: '4',
      title: 'Legal Verification',
      badge: 'TITLE & COMPLIANCE',
      desc: 'Complete inspection of title deeds, layout approvals, encumbrance clearances, and regulatory compliance certificates.',
      img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      icon: ShieldCheck,
      url: '/services/legal-verification',
      height: 380
    },
    {
      id: '5',
      title: 'Interior Architecture',
      badge: 'DESIGN & ARCHITECTURE',
      desc: 'Collaborative consultations with award-winning luxury interior designers to custom-tailor your acquired estate.',
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      icon: Palette,
      url: '/services/interior-design',
      height: 500
    },
    {
      id: '6',
      title: 'Documentation & Tax',
      badge: 'PATTA & REGISTRATION',
      desc: 'Comprehensive management of draft agreements, sale deed registrations, patta transfers, and tax formalities.',
      img: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=800&q=80',
      icon: FileText,
      url: '/services',
      height: 360
    }
  ];

  const handleItemClick = (item) => {
    if (item.url) {
      navigate(item.url);
    }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#F8F6F2] text-[#111111] border-t border-[rgba(198,166,107,0.2)] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="eyebrow-accent">OUR CAPABILITIES</span>
            <h2
              className="text-3xl md:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
            >
              Comprehensive Real <br />
              <span className="font-normal text-[#6B6B6B]">Estate Services</span>
            </h2>
          </div>
          <p className="text-[#6B6B6B] font-normal text-sm md:text-base max-w-md leading-relaxed">
            From financial structuring and architectural customization to rigorous legal vetting, we streamline every facet of premium acquisitions.
          </p>
        </div>

        {/* Integrated ReactBits GSAP Masonry Component */}
        <Masonry
          items={serviceItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.08}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.97}
          blurToFocus={true}
          colorShiftOnHover={false}
          onItemClick={handleItemClick}
        />
      </div>
    </section>
  );
};

export default Services;
