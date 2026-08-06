import React from 'react';
import { SectionHeader } from '../components/common/InteractiveWidgets';

const Terms = () => {
  return (
    <div className="pt-28 min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">
      
      {/* Page Header */}
      <div className="border-b border-[#E8E4DA] py-12 relative overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <SectionHeader tag="LEGAL FRAMEWORK" title="Terms & Conditions" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 font-sans text-xs text-[#8A8A85] space-y-8 leading-relaxed font-normal">
        <p className="font-bold text-[#1A1A1A]">
          Effective Date: August 1, 2026.
        </p>

        <section className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8E4DA] shadow-2xs">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">1. Platform Scope & Listing Mockups</h3>
          <p>
            IMPERIA ESTATES provides high-end residential listings for buy and lease discovery. While we perform deep-tier audits, all pricing tables, areas, timelines, and possession indicators are estimates. Final transactional parameters are governed exclusively by physically signed Agreements of Sale.
          </p>
        </section>

        <section className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8E4DA] shadow-2xs">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">2. Brokerage Representation</h3>
          <p>
            By submitting site visit schedules or loan requests, you authorize IMPERIA ESTATES to initiate coordination with partner developers and bank managers on your behalf.
          </p>
        </section>

        <section className="space-y-3 p-6 rounded-2xl bg-white border border-[#E8E4DA] shadow-2xs">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">3. RERA Disclaimers</h3>
          <p>
            Developers remain solely liable for constructions, delays, and state RERA registrations. IMPERIA ESTATES acts strictly as a sourcing advisory and transactions coordinator.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
