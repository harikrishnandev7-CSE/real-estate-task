import React from 'react';
import { SectionHeader } from '../components/common/InteractiveWidgets';

const Privacy = () => {
  return (
    <div className="pt-28 min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      
      {/* Page Header */}
      <div className="border-b border-[#E8E4DA] py-12 relative overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <SectionHeader tag="LEGAL FRAMEWORK" title="Privacy Policy" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 font-sans text-xs text-[#8A8A85] space-y-8 leading-relaxed font-normal">
        <p className="font-bold text-[#1A1A1A]">
          Effective Date: August 1, 2026.
        </p>

        <section className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8E4DA] shadow-2xs">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">1. Sourcing Parameters Information</h3>
          <p>
            At IMPERIA ESTATES, we enforce the highest discretion policies. We collect client names, private email coordinates, phone logs, and financial parameters solely to structure briefings, book site visits, and coordinate legal title audits. We do not Sell, license, or disclose parameters to third-party marketing networks.
          </p>
        </section>

        <section className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8E4DA] shadow-2xs">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">2. Transaction NDA Security</h3>
          <p>
            All information disclosed in search brief logs, EMI estimators, and registrar filings are stored on secure local databases. Access is limited strictly to your designated relationship manager and direct legal partners.
          </p>
        </section>

        <section className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8E4DA] shadow-2xs">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">3. Cookies & Analytical Console</h3>
          <p>
            We use essential session indicators to maintain your saved wishlist drawer and compared properties selection list. Analytical tags monitor site load latencies without tracing IP coordinates to real-world identities.
          </p>
        </section>

        <section className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8E4DA] shadow-2xs">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">4. Contact Sourcing Desk</h3>
          <p>
            If you wish to purge your data coordinate logs from IMPERIA ESTATES' database, contact concierge@imperiaestates.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
