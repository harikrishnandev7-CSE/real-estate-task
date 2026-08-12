import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import PageHero from '../components/PageHero';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: "How does IMPERIA verify property title deeds?", a: "Every property in our portfolio undergoes a 30-year backward legal search conducted by senior High Court advocates, verifying EC certificates, parent deeds, and municipal approvals." },
    { q: "Can NRIs purchase property through IMPERIA without physical presence?", a: "Yes. We offer complete digital power of attorney (POA) drafting, video walkthroughs, and remote sub-registrar coordination for international clients." },
    { q: "What is the procedure for booking a chauffeur-driven site visit?", a: "Simply submit your visit request on any property page or concierge form. An advisor will coordinate pickup details within 15 minutes." },
    { q: "Does IMPERIA provide home loan financing assistance?", a: "Yes, we partner with premier private banking desks including HDFC, ICICI, and SBI for 48-hour pre-approvals and preferential interest rates." }
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans pb-20">
      <PageHero
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ' }
        ]}
        eyebrow="CLIENT KNOWLEDGE DESK"
        heading="Frequently Asked Questions"
        description="Clear answers regarding property verification, title audits, NRI purchasing protocols, and chauffeur visit bookings."
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 font-sans">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center cursor-pointer font-bold text-sm text-[#363C46]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#CFB6A8] transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-xs text-[#5D6472] leading-relaxed border-t border-[rgba(93,100,114,0.15)] pt-4 font-sans font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
