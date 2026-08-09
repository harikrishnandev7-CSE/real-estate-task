import React from 'react';
import PageHero from '../components/PageHero';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' }
          ]}
          eyebrow="DATA GOVERNANCE"
          heading={
            <>Privacy &amp; Data <span className="font-normal text-[#5D6472]">Protection</span></>
          }
          description="IMPERIA ESTATES is committed to complete transactional privacy and institutional data protection."
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 font-sans">
        <div className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-8 md:p-10 shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-6 text-xs text-[#5D6472] leading-relaxed">
          <h3 className="text-lg font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>1. Client Information Governance</h3>
          <p>We collect personal information including name, phone number, and acquisition parameters solely for coordinating property viewings, due diligence reports, and private advisory services. Your personal data is never commercialized or shared with unverified third parties.</p>

          <h3 className="text-lg font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>2. Encryption & Financial Security</h3>
          <p>All communication channels, document transmissions, and saved portfolio data are protected using standard TLS/SSL encryption standards.</p>

          <h3 className="text-lg font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>3. Contact & Opt-Out</h3>
          <p>You may request full deletion of your client profile or opt out of advisory updates at any time by emailing privacy@imperiaestates.com.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
