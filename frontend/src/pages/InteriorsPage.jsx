import React from 'react';
import { Palette, Sparkles, Check, ArrowRight } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const InteriorsPage = () => {
  const { showToast } = useApp();

  const services = [
    { title: "Turnkey Residential Interiors", desc: "Complete architectural planning, 3D visualizations, custom cabinetry, and Italian marble installations.", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" },
    { title: "Acoustic & Lighting Design", desc: "Bespoke ambient lighting fixtures, sound-dampening panels, and integrated home automation controls.", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80" },
    { title: "Landscape & Terrace Gardens", desc: "Biophilic indoor garden spaces, private pool landscaping, and rooftop lounge architecture.", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Interior Design' }
          ]}
          eyebrow="ARCHITECTURAL DESIGN STUDIO"
          heading={
            <>Architectural Interiors &amp; <span className="font-normal text-[#5D6472]">Turnkey Fitouts</span></>
          }
          description="Transforming residential foundations into bespoke sanctuaries crafted by international interior architects."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item, idx) => (
            <div key={idx} className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(54,60,70,0.06)] flex flex-col justify-between">
              <div className="h-[200px] overflow-hidden bg-[#E0EEE9]">
                <ImageWithSkeleton src={item.img} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <h3
                  className="text-lg font-bold text-[#363C46]"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-[#5D6472] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteriorsPage;
