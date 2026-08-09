import React from 'react';
import { ShieldCheck, FileCheck, Scale } from 'lucide-react';
import PageHero from '../components/PageHero';

const LegalAdvisePage = () => {
  const steps = [
    { title: "Title Deed Audit", desc: "30-year backward verification of title deeds, encumbrance certificates (EC), and parent documents." },
    { title: "Zoning & RERA Compliance", desc: "Verifying DTCP, CMDA, and RERA approvals to protect buyers against unauthorized developments." },
    { title: "Registration Concierge", desc: "Drafting bulletproof sale agreements, stamp duty optimization, and physical sub-registrar representation." }
  ];

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Legal Verification' }
          ]}
          eyebrow="TRANSACTIONAL INTEGRITY"
          heading={
            <>Legal Due Diligence &amp; <span className="font-normal text-[#5D6472]">Title Audits</span></>
          }
          description="Institutional legal audit services protecting high-net-worth acquisitions against regulatory liabilities."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <div key={idx} className="p-8 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl space-y-4 shadow-[0_12px_32px_rgba(54,60,70,0.06)]">
              <div className="w-12 h-12 rounded-lg bg-[rgba(207,182,168,0.15)] text-[#CFB6A8] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3
                className="text-lg font-bold text-[#363C46]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                {item.title}
              </h3>
              <p className="text-xs text-[#5D6472] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalAdvisePage;
