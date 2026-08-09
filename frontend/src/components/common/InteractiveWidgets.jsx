import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Calendar, Check, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// EMI Calculator UI
export const EMICard = ({ initialPrincipal = 50000000 }) => {
  const [loanAmount, setLoanAmount] = useState(initialPrincipal);
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20); // 20 years
  const [calculatedEMI, setCalculatedEMI] = useState(0);

  // Recalculate EMI whenever sliders change
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
    <div className="border border-[#E8E4DA] bg-white rounded-3xl p-6 space-y-6 font-sans shadow-md">
      <div className="flex items-center gap-2 border-b border-[#E8E4DA] pb-4">
        <Calculator className="w-4 h-4 text-[#F5A623]" />
        <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">EMI Estimation Tool</h4>
      </div>

      <div className="space-y-4 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[#8A8A85] font-medium">Loan Principal</span>
            <span className="text-[#1A1A1A] font-bold">₹{(loanAmount / 10000000).toFixed(2)} Cr</span>
          </div>
          <input 
            type="range" 
            min="1000000" 
            max={initialPrincipal * 1.5}
            step="500000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
            className="w-full accent-[#F5A623] cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[#8A8A85] font-medium">Interest Rate (YoY)</span>
            <span className="text-[#1A1A1A] font-bold">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full accent-[#F5A623] cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[#8A8A85] font-medium">Loan Tenure</span>
            <span className="text-[#1A1A1A] font-bold">{tenureYears} Years</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(parseInt(e.target.value))}
            className="w-full accent-[#F5A623] cursor-pointer"
          />
        </div>

        <div className="border-t border-[#E8E4DA] pt-4 mt-2 flex justify-between items-end">
          <div>
            <span className="text-[#8A8A85] text-[10px] uppercase font-semibold">Estimated monthly payment</span>
            <p className="text-xl font-bold text-[#F5A623] mt-0.5">₹{calculatedEMI.toLocaleString('en-IN')}</p>
          </div>
          <span className="text-[9px] text-[#8A8A85] uppercase tracking-widest font-bold bg-[#F4F1EA] border border-[#E8E4DA] px-2 py-1 rounded">80% LTV Max</span>
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
    <div className="border border-[#E8E4DA] bg-white rounded-3xl p-6 md:p-8 space-y-6 font-sans shadow-md">
      <div className="border-b border-[#E8E4DA] pb-4 space-y-1">
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#F5A623] font-bold block">Walkthrough Booking</span>
        <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight">Schedule Private Visit</h3>
      </div>

      {isBooked ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-[#F5A623] text-white flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#1A1A1A]">Visit Request Scheduled</h4>
          <p className="text-xs text-[#8A8A85] leading-relaxed font-sans font-medium">
            A private relationships coordinator will reach out to organize logistics for <span className="text-[#1A1A1A] font-bold">{bookingDate}</span> at <span className="text-[#1A1A1A] font-bold">{bookingTime}</span>.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs text-[#1A1A1A]">
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#8A8A85] uppercase tracking-wider font-bold">Your Name</label>
            <input 
              type="text" 
              placeholder="Enter full name" 
              value={bookingName}
              onChange={(e) => setBookingName(e.target.value)}
              required
              className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-3 text-[#1A1A1A] placeholder-neutral-400 outline-none focus:border-[#F5A623]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#8A8A85] uppercase tracking-wider font-bold">Your Phone</label>
            <input 
              type="tel" 
              maxLength={10}
              placeholder="e.g. 9876543210" 
              value={bookingPhone}
              onChange={(e) => setBookingPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
              className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-3 text-[#1A1A1A] placeholder-neutral-400 outline-none focus:border-[#F5A623]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#8A8A85] uppercase tracking-wider font-bold">Select Date</label>
              <input 
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none focus:border-[#F5A623]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#8A8A85] uppercase tracking-wider font-bold">Preferred Time</label>
              <select 
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none focus:border-[#F5A623] cursor-pointer"
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
            className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-xs font-bold text-white tracking-wider uppercase rounded-full shadow-md cursor-pointer transition-all"
          >
            REQUEST WALKTHROUGH VISIT
          </button>
        </form>
      )}
    </div>
  );
};

// Section Header: Editorial labels with mixed-weight typography
export const SectionHeader = ({ tag, title, desc }) => {
  return (
    <div className="space-y-3 mb-10 text-left font-sans">
      {tag && <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block">{tag}</span>}
      {title && (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans text-[#1A1A1A] tracking-tight [&_em]:font-normal [&_em]:text-[#8A8A85] [&_em]:not-italic [&_span.light]:font-normal [&_span.light]:text-[#8A8A85]">
          {title}
        </h2>
      )}
      {desc && (
        <p className="text-[#8A8A85] text-xs md:text-sm font-sans font-normal leading-relaxed max-w-xl">
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
      className={`px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer font-sans ${
        variant === 'primary'
          ? 'bg-[#1A1A1A] hover:bg-black text-white shadow-md'
          : 'border border-[#E8E4DA] bg-white hover:border-[#F5A623] text-[#1A1A1A] shadow-sm'
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};
