import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, ShieldCheck, Calculator, Check, ArrowRight, FileText, ExternalLink, Percent, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const HomeLoansPage = () => {
  const { showToast } = useApp();
  const [loanAmount, setLoanAmount] = useState(25000000);
  const [tenureYears, setTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const calculateEmi = () => {
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureYears * 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const banks = [
    { name: "HDFC Bank Private Banking", rate: "8.35%", tenure: "Up to 30 Yrs", fee: "0.25%" },
    { name: "ICICI Wealth Management", rate: "8.40%", tenure: "Up to 30 Yrs", fee: "0.20%" },
    { name: "SBI Privilege Housing", rate: "8.50%", tenure: "Up to 30 Yrs", fee: "Zero" },
    { name: "Axis Luxury Home Finance", rate: "8.45%", tenure: "Up to 25 Yrs", fee: "0.25%" }
  ];

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Home Loans' }
          ]}
          eyebrow="PREFERRED DEBT ADVISORY"
          heading={
            <>Institutional Wealth &amp; <span className="font-normal text-[#5D6472]">Home Financing</span></>
          }
          description="Tailored mortgage structuring, express pre-approvals, and preferential interest rates via private banking partners."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16 font-sans">
        {/* EMI CALCULATOR & BANK MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 p-8 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(93,100,114,0.15)] pb-4">
              <Calculator className="w-5 h-5 text-[#CFB6A8]" />
              <h3
                className="text-xl font-bold text-[#363C46]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                Luxury EMI Estimator
              </h3>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <div className="flex justify-between text-[#5D6472] mb-1">
                  <span>Loan Amount</span>
                  <span className="text-[#CFB6A8]">₹{(loanAmount / 100000).toFixed(1)} Lakhs</span>
                </div>
                <input
                  type="range"
                  min={5000000}
                  max={200000000}
                  step={2500000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#CFB6A8]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[#5D6472] mb-1">
                  <span>Tenure</span>
                  <span className="text-[#CFB6A8]">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#CFB6A8]"
                />
              </div>
            </div>

            <div className="p-6 rounded-lg bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.15)] text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#5D6472]">Estimated Monthly Installment</span>
              <p
                className="text-3xl font-bold text-[#363C46]"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                ₹{calculateEmi().toLocaleString('en-IN')} <span className="text-xs font-normal text-[#5D6472]">/ mo</span>
              </p>
            </div>
          </div>

          {/* BANKS */}
          <div className="lg:col-span-6 space-y-4">
            <h3
              className="text-xl font-bold text-[#363C46] mb-4"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Banking Partners
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {banks.map((b, idx) => (
                <div key={idx} className="p-5 bg-white border border-[rgba(93,100,114,0.15)] rounded-xl space-y-2 shadow-xs">
                  <p className="font-bold text-xs text-[#363C46]">{b.name}</p>
                  <p className="text-sm font-bold text-[#CFB6A8]">Interest: {b.rate}</p>
                  <p className="text-[11px] text-[#5D6472]">Tenure: {b.tenure}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoansPage;
