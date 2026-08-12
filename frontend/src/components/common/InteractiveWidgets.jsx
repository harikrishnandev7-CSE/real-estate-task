import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Calendar, Check, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// EMI Calculator UI
export const EMICard = ({ initialPrincipal = 50000000 }) => {
  const [loanAmount, setLoanAmount] = useState(initialPrincipal);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [calculatedEMI, setCalculatedEMI] = useState(0);

  useEffect(() => {
    if (loanAmount > 0) {
      const P = loanAmount;
      const r = interestRate / 12 / 100;
      const n = tenureYears * 12;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setCalculatedEMI(Math.round(emi));
    }
  }, [loanAmount, interestRate, tenureYears]);

  return (
    <div className="border border-[rgba(201,169,110,0.30)] bg-white rounded-xl p-6 space-y-6 font-sans shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2 border-b border-[rgba(201,169,110,0.20)] pb-4">
        <Calculator className="w-5 h-5 text-[#C9A96E]" />
        <h4
          className="text-base font-bold text-[#0B0B0B]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          EMI Estimation Tool
        </h4>
      </div>

      <div className="space-y-5 text-xs font-bold">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#555555] font-bold">Loan Principal</span>
            <span className="text-[#0B0B0B] font-extrabold text-sm">₹{(loanAmount / 10000000).toFixed(2)} Cr</span>
          </div>
          <input 
            type="range" 
            min="1000000" 
            max={initialPrincipal * 1.5}
            step="500000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
            className="w-full accent-[#C9A96E] cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#555555] font-bold">Interest Rate (YoY)</span>
            <span className="text-[#0B0B0B] font-extrabold text-sm">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full accent-[#C9A96E] cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#555555] font-bold">Loan Tenure</span>
            <span className="text-[#0B0B0B] font-extrabold text-sm">{tenureYears} Years</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(parseInt(e.target.value))}
            className="w-full accent-[#C9A96E] cursor-pointer"
          />
        </div>

        <div className="border-t border-[rgba(201,169,110,0.20)] pt-4 mt-2 flex justify-between items-end">
          <div>
            <span className="text-[#6B6B6B] text-[10px] uppercase font-extrabold tracking-wider block">Estimated monthly payment</span>
            <p
              className="text-2xl font-extrabold text-[#C9A96E] mt-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              ₹{calculatedEMI.toLocaleString('en-IN')}
            </p>
          </div>
          <span className="text-[10px] text-[#0B0B0B] uppercase tracking-widest font-extrabold bg-[rgba(201,169,110,0.15)] border border-[rgba(201,169,110,0.30)] px-2.5 py-1 rounded-md">
            80% LTV Max
          </span>
        </div>
      </div>
    </div>
  );
};

// Booking Card: Concierge visit scheduler
export const BookingCard = ({ propertyTitle, propertyCity, propertyId, onConsultantAssigned }) => {
  const { showToast, addSiteVisit } = useApp();
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate) return;

    setIsSubmitting(true);
    const clientEmail = `${bookingName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}@imperiaestates.com`;

    try {
      if (addSiteVisit) {
        const res = await addSiteVisit({
          propertyId,
          propertyName: propertyTitle || 'IMPERIA Residence',
          city: propertyCity || 'Chennai',
          date: bookingDate,
          time: bookingTime,
          status: 'Scheduled',
          name: bookingName,
          phone: bookingPhone,
          email: clientEmail,
        });

        if (res?.assignedConsultant && typeof onConsultantAssigned === 'function') {
          onConsultantAssigned(res.assignedConsultant);
        }
      }

      setIsSubmitting(false);
      setIsBooked(true);
      if (showToast) showToast('Private tour scheduled! Our executive will contact you.');
    } catch (err) {
      setIsSubmitting(false);
      if (showToast) showToast(`Booking failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="border border-[rgba(201,169,110,0.30)] bg-white rounded-xl p-6 md:p-8 space-y-6 font-sans shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="border-b border-[rgba(201,169,110,0.20)] pb-4 space-y-1">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-extrabold block">VIP CHAUFFEUR WALKTHROUGH</span>
        <h3
          className="text-xl font-bold text-[#0B0B0B] tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Schedule Private Visit
        </h3>
      </div>

      {isBooked ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-[#C9A96E] bg-[rgba(201,169,110,0.12)] rounded-lg p-6 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-[#C9A96E] text-[#0B0B0B] flex items-center justify-center mx-auto shadow-xs">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h4
            className="text-lg font-bold text-[#0B0B0B]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Visit Request Scheduled
          </h4>
          <p className="text-xs text-[#555555] leading-relaxed font-sans font-semibold">
            A private relationships coordinator will reach out to organize logistics for <span className="text-[#0B0B0B] font-extrabold">{bookingDate}</span> at <span className="text-[#0B0B0B] font-extrabold">{bookingTime}</span>.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs text-[#0B0B0B]">
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#555555] uppercase tracking-wider font-bold">Your Name</label>
            <input 
              type="text" 
              placeholder="Enter full name" 
              value={bookingName}
              onChange={(e) => setBookingName(e.target.value)}
              required
              className="w-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.15)] rounded-lg px-4 py-3 text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#555555] uppercase tracking-wider font-bold">Your Phone</label>
            <input 
              type="tel" 
              maxLength={10}
              placeholder="e.g. 9876543210" 
              value={bookingPhone}
              onChange={(e) => setBookingPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
              className="w-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.15)] rounded-lg px-4 py-3 text-[#0B0B0B] font-bold placeholder-[#888888] outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#555555] uppercase tracking-wider font-bold">Select Date</label>
              <input 
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.15)] rounded-lg px-3 py-2.5 text-[#0B0B0B] font-bold outline-none focus:border-[#C9A96E]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#555555] uppercase tracking-wider font-bold">Preferred Time</label>
              <select 
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full bg-[#F7F6F3] border border-[rgba(22,22,26,0.15)] rounded-lg px-3 py-2.5 text-[#0B0B0B] font-bold outline-none focus:border-[#C9A96E] cursor-pointer"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#0E0E10] hover:bg-[#C9A96E] text-xs font-bold text-[#F4F1EA] hover:text-[#0B0B0B] tracking-widest uppercase rounded-lg shadow-md cursor-pointer transition-all border border-[rgba(201,169,110,0.30)]"
          >
            {isSubmitting ? 'PROCESSING...' : 'REQUEST WALKTHROUGH VISIT'}
          </button>
        </form>
      )}
    </div>
  );
};

// Section Header: Editorial labels with mixed-weight typography
export const SectionHeader = ({ tag, title, desc }) => {
  return (
    <div className="space-y-2 mb-6 text-left font-sans">
      {tag && <span className="text-xs uppercase tracking-[0.25em] text-[#C9A96E] font-extrabold block">{tag}</span>}
      {title && (
        <h2
          className="text-2xl md:text-3xl font-bold text-[#0B0B0B] tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h2>
      )}
      {desc && (
        <p className="text-[#555555] text-xs md:text-sm font-sans font-semibold leading-relaxed max-w-xl">
          {desc}
        </p>
      )}
    </div>
  );
};

// Animated Button CTA wrapper
export const AnimatedButton = ({ children, onClick, className = "", variant = "primary" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer font-sans ${
        variant === 'primary'
          ? 'bg-[#0E0E10] hover:bg-[#C9A96E] text-[#F4F1EA] hover:text-[#0B0B0B] shadow-md border border-[rgba(201,169,110,0.30)]'
          : 'border border-[rgba(201,169,110,0.30)] bg-white hover:border-[#C9A96E] text-[#0B0B0B] shadow-xs'
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};
