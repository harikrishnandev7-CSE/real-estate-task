import React from 'react';
import PageHero from '../components/PageHero';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Terms of Service' }
          ]}
          eyebrow="LEGAL FRAMEWORK"
          heading={
            <>Terms of <span className="font-normal text-[#5D6472]">Service</span></>
          }
          description="Terms governing the use of IMPERIA ESTATES property discovery console, site visit reservations, and legal due diligence services."
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 font-sans">
        <div className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-8 md:p-10 shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-6 text-xs text-[#5D6472] leading-relaxed">
          <h3 className="text-lg font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>1. Advisory Scope</h3>
          <p>IMPERIA ESTATES acts as a private real estate concierge and advisory platform. Property specifications, land boundaries, and pricing are subject to final physical legal verification prior to registration.</p>

          <h3 className="text-lg font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>2. Chauffeur Visit Protocol</h3>
          <p>Site visit bookings requested through the console are subject to advisor availability and safety verification. Imperial Concierge reserves the right to reschedule transit based on weather or developer access clearance.</p>

          <h3 className="text-lg font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>3. Intellectual Property</h3>
          <p>All architectural renderings, brand badges, and photography displayed on IMPERIA ESTATES are protected by copyright law.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
