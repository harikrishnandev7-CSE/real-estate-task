import React from 'react';
import { Calendar, MapPin, Clock, User, Phone, CheckCircle, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const MyBookings = () => {
  const { siteVisits = [] } = useApp();

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'My Bookings' }
          ]}
          eyebrow="SCHEDULED WALKTHROUGHS"
          heading={
            <>Chauffeur Visit <span className="font-normal text-[#5D6472]">Reservations</span></>
          }
          description="View and manage your confirmed site visits, assigned wealth advisors, and chauffeur transit status."
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 font-sans">
        {siteVisits.length === 0 ? (
          <div className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-12 text-center space-y-4 shadow-xs">
            <Calendar className="w-12 h-12 text-[#CFB6A8] mx-auto" />
            <h3 className="text-xl font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>No Active Site Visits</h3>
            <p className="text-xs text-[#5D6472]">You have no upcoming scheduled site tours. Browse our luxury estates to schedule a private visit.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {siteVisits.map((visit, idx) => (
              <div key={idx} className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#CFB6A8]">CONFIRMED VISIT</span>
                  <h4 className="text-lg font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}>
                    {visit.propertyName || visit.propertyTitle || 'Signature Residence'}
                  </h4>
                  <p className="text-xs text-[#5D6472]">Date: {visit.date || 'Scheduled'} | Pickup: Chauffeur Reserved</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold uppercase">
                    Advisor Assigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
