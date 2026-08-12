import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Phone, CheckCircle, ChevronRight, XCircle, Sparkles, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const MyBookings = () => {
  const navigate = useNavigate();
  const { siteVisits = [], cancelSiteVisit, openBookModal, currentUser, fetchSiteVisits } = useApp();

  // Refetch from backend each time this page is visited so admin status updates are visible
  useEffect(() => {
    if (currentUser && fetchSiteVisits) {
      fetchSiteVisits();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans pb-20">
        <PageHero
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'My Bookings' }
          ]}
          eyebrow="VIP ACCESS REQUIRED"
          heading="Private Site Visit Reservations"
          description="Log in to access your upcoming estate walkthroughs, assigned luxury advisor details, and chauffeur transit schedules."
        />
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center space-y-6 font-sans">
          <div className="max-w-md mx-auto p-8 sm:p-10 rounded-2xl bg-white border border-[rgba(201,169,110,0.30)] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(201,169,110,0.15)] border border-[rgba(201,169,110,0.30)] text-[#C9A96E] flex items-center justify-center mx-auto shadow-sm">
              <Calendar className="w-8 h-8 text-[#C9A96E]" />
            </div>
            <h3
              className="text-2xl sm:text-3xl font-bold text-[#0B0B0B] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Please Log In to View Bookings
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-semibold">
              Booking management is reserved for registered account holders. Please sign in to manage your scheduled site visits.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 bg-[#0E0E10] text-[#F4F1EA] hover:bg-[#C9A96E] hover:text-[#0B0B0B] text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer border border-[rgba(201,169,110,0.35)]"
              >
                Continue to Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-3.5 bg-white border border-[rgba(201,169,110,0.40)] text-[#0B0B0B] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.10)] text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'confirmed') {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          Confirmed
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-blue-600" />
          Completed
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <XCircle className="w-3 h-3 text-rose-600" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
        <Clock className="w-3 h-3 text-amber-600" />
        Scheduled
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans pb-20">
      <PageHero
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My Bookings' }
        ]}
        eyebrow="SCHEDULED WALKTHROUGHS"
        heading="Chauffeur Visit Reservations"
        description="View and manage your confirmed site visits, assigned wealth advisors, and chauffeur transit status."
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 font-sans space-y-6">
        <div className="flex justify-between items-center border-b border-[rgba(93,100,114,0.15)] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', serif" }}>
              Your Scheduled Tours ({siteVisits.length})
            </h2>
            <p className="text-xs text-[#5D6472]">Private luxury estate walkthrough reservations</p>
          </div>
          <button
            onClick={() => openBookModal()}
            className="px-4 py-2.5 bg-[#16161a] hover:bg-[#A98A5B] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Book New Visit
          </button>
        </div>

        {siteVisits.length === 0 ? (
          <div className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-12 text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[rgba(207,182,168,0.15)] text-[#A98A5B] flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', serif" }}>No Active Site Visits</h3>
            <p className="text-xs text-[#5D6472] max-w-md mx-auto">You have no upcoming scheduled site tours. Browse our luxury estates to schedule a private walkthrough.</p>
            <div className="pt-2 flex gap-3 justify-center">
              <button
                onClick={() => openBookModal()}
                className="px-6 py-2.5 bg-[#16161a] hover:bg-[#A98A5B] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
              >
                Schedule Private Tour
              </button>
              <Link
                to="/buy"
                className="px-6 py-2.5 border border-[rgba(22,22,26,0.20)] hover:border-[#A98A5B] text-[#16161a] text-xs font-semibold uppercase tracking-wider rounded-md"
              >
                Explore Properties
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {siteVisits.map((visit, idx) => {
              const visitId = visit.id || visit._id || `visit-${idx}`;
              const isCancelled = String(visit.status || '').toLowerCase() === 'cancelled';

              return (
                <div key={visitId} className="bg-white border border-[rgba(93,100,114,0.15)] rounded-xl p-6 shadow-xs space-y-4 hover:border-[#A98A5B] transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(93,100,114,0.10)] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(visit.status)}
                        <span className="text-[10px] text-[#5D6472]">ID: {visitId.slice(-8)}</span>
                      </div>
                      <h4 className="text-lg font-bold text-[#363C46]" style={{ fontFamily: "'Fraunces', serif" }}>
                        {visit.propertyName || visit.propertyTitle || visit.title || 'Signature Residence'}
                      </h4>
                    </div>

                    {!isCancelled && (
                      <button
                        onClick={() => cancelSiteVisit(visitId, 'Cancelled by user')}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                    <div className="flex items-center gap-2 text-[#363C46]">
                      <Calendar className="w-4 h-4 text-[#A98A5B]" />
                      <div>
                        <p className="text-[10px] uppercase text-[#5D6472] font-semibold">Date</p>
                        <p className="font-bold">{visit.date || visit.scheduledDate || 'Date pending'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#363C46]">
                      <Clock className="w-4 h-4 text-[#A98A5B]" />
                      <div>
                        <p className="text-[10px] uppercase text-[#5D6472] font-semibold">Time Slot</p>
                        <p className="font-bold">{visit.time || visit.scheduledTime || '10:00 AM'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#363C46]">
                      <MapPin className="w-4 h-4 text-[#A98A5B]" />
                      <div>
                        <p className="text-[10px] uppercase text-[#5D6472] font-semibold">Location / City</p>
                        <p className="font-bold">{visit.city || 'Chennai'}</p>
                      </div>
                    </div>
                  </div>

                  {visit.assignedConsultant && (
                    <div className="p-3 rounded-lg bg-[#F7F6F3] border border-[rgba(22,22,26,0.06)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#16161a] text-white flex items-center justify-center font-bold text-xs">
                          {visit.assignedConsultant.name ? visit.assignedConsultant.name.charAt(0) : 'A'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#16161a]">{visit.assignedConsultant.name || 'Assigned Wealth Advisor'}</p>
                          <p className="text-[10px] text-[#5D6472]">{visit.assignedConsultant.role || 'Luxury Property Specialist'}</p>
                        </div>
                      </div>
                      {visit.assignedConsultant.phone && (
                        <a href={`tel:${visit.assignedConsultant.phone}`} className="text-xs font-semibold text-[#A98A5B] flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          Call Advisor
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

