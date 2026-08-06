import React from 'react';
import { ShieldCheck, Target, Eye, Users, Trophy, Award } from 'lucide-react';
import { SectionHeader, AnimatedButton } from '../components/common/InteractiveWidgets';
import PageHero from '../components/PageHero';

const About = () => {
  const coreValues = [
    { title: "Absolute Discretion", desc: "We protect our clients' coordinates and transactional parameters with institutional-grade privacy protocols.", icon: ShieldCheck },
    { title: "Architectural Integrity", desc: "We curate only properties that showcase elite craftsmanship, structural resilience, and aesthetic permanence.", icon: Trophy },
    { title: "Client Concierge", desc: "Every relationship is designated a private officer, providing advisory on asset allocation, taxes, and blueprints.", icon: Users }
  ];

  const leadershipTeam = [
    { name: "Siddharth Vardhan", role: "Founder & Chief Advisor", exp: "22 Years", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80" },
    { name: "Elena Rostova", role: "Principal Sourcing Director", exp: "18 Years", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80" },
    { name: "Madhavan Swamy", role: "Head of Private Client Desk", exp: "15 Years", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80" }
  ];

  const historyTimeline = [
    { year: "2012", title: "Inception of IMPERIA ESTATES", desc: "Established private client desk in Chennai, sourcing off-market estates." },
    { year: "2016", title: "Luxury Real Estate Expansion", desc: "Opened commercial yields advisory division and expanded land banks in Coimbatore." },
    { year: "2020", title: "Bespoke Digital Integration", desc: "Launched interactive property access consoles and international NRI coordinate desks." },
    { year: "2026", title: "IMPERIA ESTATES Premier Global Hubs", desc: "Expanding premium property connectivity to key hubs on the French Riviera and Dubai Marina." }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      {/* HERO SECTION */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'About' },
          ]}
          eyebrow="ABOUT US"
          heading={
            <>Curators of the <span className="font-normal text-[#8A8A85]">Exceptional</span></>
          }
          description="IMPERIA ESTATES is a premier real estate concierge, specializing in sourcing, managing, and structuring high-capital acquisitions for discerning private clients, NRIs, and family offices."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-28 font-sans">
        
        {/* COMPANY STORY, MISSION & VISION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader tag="OUR HERITAGE" title="The Story of IMPERIA ESTATES" />
            <p className="text-[#8A8A85] text-xs font-normal leading-relaxed">
              Founded over a decade ago as a private advisory group, IMPERIA ESTATES has grown to become the benchmark for ultra-luxury residential listings. We do not aggregate listings; we curate them. Every villa, penthouse, and corporate workspace is vetted for construction standards, title histories, and neighborhood connectivity.
            </p>
            <p className="text-[#8A8A85] text-xs font-normal leading-relaxed">
              Today, IMPERIA ESTATES stands as a designated partner for leading developers. We structure acquisitions from negotiation to sub-registrar registration, providing complete capital and transaction security.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border border-[#E8E4DA] bg-white p-6 rounded-3xl space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Our Mission</h4>
                <p className="text-[#8A8A85] text-xs font-normal leading-relaxed">
                  To simplify the discovery of premium real estate, providing clean titles, structural guarantees, and private banking debt placement under one concierge hub.
                </p>
              </div>

              <div className="border border-[#E8E4DA] bg-white p-6 rounded-3xl space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white flex items-center justify-center shadow-xs">
                  <Eye className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Our Vision</h4>
                <p className="text-[#8A8A85] text-xs font-normal leading-relaxed">
                  To become the most trusted private asset allocator in luxury residential and yielding commercial corridors, linking global wealth to exceptional architecture.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 h-[480px] rounded-3xl overflow-hidden relative border border-[#E8E4DA] shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
              alt="IMPERIA ESTATES Heritage" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3 font-sans">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold">CONSTITUTION</span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Our Core Values</h2>
            <p className="text-[#8A8A85] text-xs font-normal leading-relaxed">
              We govern all transactional and consultancy operations by three foundational principles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="border border-[#E8E4DA] bg-white p-8 rounded-3xl space-y-4 text-center shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#F5A623] transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#F5A623] text-white flex items-center justify-center mx-auto shadow-xs">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h4 className="text-base font-bold text-[#1A1A1A] tracking-tight">{val.title}</h4>
                  <p className="text-[#8A8A85] text-xs font-normal leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-b border-[#E8E4DA] py-12 font-sans">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">₹8,500+ Cr</p>
            <p className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold mt-1">Transaction Value</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">350+</p>
            <p className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold mt-1">HNIs Serviced</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">15+</p>
            <p className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold mt-1">Years Experience</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A]">100%</p>
            <p className="text-[10px] text-[#8A8A85] uppercase tracking-widest font-bold mt-1">RERA Vetted</p>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="space-y-12">
          <SectionHeader tag="HISTORY" title="Our Journey Timeline" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative pt-4">
            {historyTimeline.map((item, idx) => (
              <div key={idx} className="border border-[#E8E4DA] bg-white p-6 rounded-3xl space-y-3 shadow-xs">
                <span className="w-10 h-10 rounded-full bg-[#F5A623] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {item.year}
                </span>
                <h5 className="text-sm font-bold text-[#1A1A1A] tracking-tight">{item.title}</h5>
                <p className="text-[#8A8A85] text-xs font-normal leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* LEADERSHIP */}
        <div className="space-y-12 font-sans">
          <SectionHeader tag="THE TEAM" title="Our Leadership Group" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((lead, idx) => (
              <div key={idx} className="border border-[#E8E4DA] bg-white rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#F5A623] transition-all duration-300">
                <div className="h-[220px] bg-stone-100 relative overflow-hidden">
                  <img src={lead.img} alt={lead.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 space-y-1">
                  <h4 className="text-sm font-bold text-[#1A1A1A]">{lead.name}</h4>
                  <p className="text-xs text-[#8A8A85] font-normal">{lead.role}</p>
                  <p className="text-[10px] text-[#F5A623] font-bold uppercase tracking-wider mt-2">{lead.exp} Experience</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AWARDS */}
        <div className="border border-[#E8E4DA] bg-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-sans">
          <div className="space-y-3 max-w-lg">
            <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
            <h4 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Awards & Global Recognition</h4>
            <p className="text-[#8A8A85] text-xs leading-relaxed font-normal">
              Recognized as 'Best Luxury Property Sourcing Group' at the southern property awards in 2024, and certified compliant by state RERA registration councils.
            </p>
          </div>
          <div className="flex gap-4 shrink-0 font-sans text-xs">
            <span className="px-4 py-2 border border-[#E8E4DA] bg-[#F4F1EA] rounded-full text-[#1A1A1A] font-bold">Winner 2024</span>
            <span className="px-4 py-2 border border-[#E8E4DA] bg-[#F4F1EA] rounded-full text-[#1A1A1A] font-bold">RERA Vetted</span>
          </div>
        </div>

        {/* BOOK CONSULTATION CTA */}
        <div className="border border-stone-800 bg-[#1A1A1A] text-white rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-2xl font-sans">
          <span className="text-xs uppercase tracking-[0.2em] text-[#F5A623] font-bold">ACQUISITIONS DESK</span>
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Book Private Consultation</h3>
          <p className="text-stone-300 text-xs leading-relaxed font-normal max-w-md mx-auto">
            Arrange a secure briefing with our sourcing leads. We coordinate logistics, private banking options, and title registries under complete NDA.
          </p>
          <button 
            onClick={() => window.location.href = '/contact'}
            className="px-8 py-4 bg-[#F5A623] hover:bg-amber-400 text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-full shadow-md cursor-pointer transition-all duration-300"
          >
            Connect with Sourcing Lead
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;
