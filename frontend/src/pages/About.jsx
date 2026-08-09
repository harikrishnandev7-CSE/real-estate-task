import React from 'react';
import { ShieldCheck, Target, Eye, Users, Trophy, Award } from 'lucide-react';
import { SectionHeader } from '../components/common/InteractiveWidgets';
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
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
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
            <>Curators of the <span className="font-normal text-[#5D6472]">Exceptional</span></>
          }
          description="IMPERIA ESTATES is a premier real estate concierge, specializing in sourcing, managing, and structuring high-capital acquisitions for discerning private clients, NRIs, and family offices."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-28 font-sans">
        
        {/* COMPANY STORY, MISSION & VISION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader tag="OUR HERITAGE" title="The Story of IMPERIA ESTATES" />
            <p className="text-[#5D6472] text-xs font-normal leading-relaxed">
              Founded over a decade ago as a private advisory group, IMPERIA ESTATES has grown to become the benchmark for ultra-luxury residential listings. We do not aggregate listings; we curate them. Every villa, penthouse, and corporate workspace is vetted for construction standards, title histories, and neighborhood connectivity.
            </p>
            <p className="text-[#5D6472] text-xs font-normal leading-relaxed">
              Today, IMPERIA ESTATES stands as a designated partner for leading developers. We structure acquisitions from negotiation to sub-registrar registration, providing complete capital and transaction security.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border border-[rgba(93,100,114,0.15)] bg-white p-6 rounded-xl space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#CFB6A8] text-white flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5 stroke-[2]" />
                </div>
                <h4
                  className="text-sm font-bold text-[#363C46]"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  Our Mission
                </h4>
                <p className="text-[#5D6472] text-xs font-normal leading-relaxed">To elevate real estate transactions into seamless, institutional-grade experiences of private wealth creation.</p>
              </div>

              <div className="border border-[rgba(93,100,114,0.15)] bg-white p-6 rounded-xl space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#CFB6A8] text-white flex items-center justify-center shadow-xs">
                  <Eye className="w-5 h-5 stroke-[2]" />
                </div>
                <h4
                  className="text-sm font-bold text-[#363C46]"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  Our Vision
                </h4>
                <p className="text-[#5D6472] text-xs font-normal leading-relaxed">To remain the most trusted private real estate desk across India's top metropolitan hubs and international markets.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative h-[480px] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(54,60,70,0.06)] border border-[rgba(93,100,114,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="IMPERIA Corporate Headquarters"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#363C46]/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="space-y-12">
          <SectionHeader tag="GUIDING PRINCIPLES" title="Core Values That Define Us" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="p-8 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl space-y-4 shadow-xs">
                  <div className="w-12 h-12 rounded-lg bg-[rgba(207,182,168,0.15)] text-[#CFB6A8] flex items-center justify-center">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h4
                    className="text-lg font-bold text-[#363C46]"
                    style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                  >
                    {val.title}
                  </h4>
                  <p className="text-[#5D6472] text-xs leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEADERSHIP */}
        <div className="space-y-12">
          <SectionHeader tag="LEADERSHIP DESK" title="Senior Advisory Board" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((member, idx) => (
              <div key={idx} className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl overflow-hidden shadow-xs space-y-4 p-6">
                <div className="h-56 rounded-lg overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h4
                    className="text-base font-bold text-[#363C46]"
                    style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                  >
                    {member.name}
                  </h4>
                  <p className="text-[#CFB6A8] text-xs font-bold uppercase">{member.role}</p>
                  <p className="text-[11px] text-[#5D6472]">Experience: {member.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="space-y-12">
          <SectionHeader tag="MILESTONES" title="Our Growth Journey" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {historyTimeline.map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl space-y-2">
                <span className="text-2xl font-bold text-[#CFB6A8]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>{item.year}</span>
                <h4 className="text-sm font-bold text-[#363C46]">{item.title}</h4>
                <p className="text-xs text-[#5D6472] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
