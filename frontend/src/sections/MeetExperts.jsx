import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const MeetExperts = () => {
  const experts = [
    {
      name: 'Aditya Vardhan',
      role: 'Managing Partner & Founder',
      creds: 'Wharton Real Estate | 15+ Yrs Advisory Experience',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Meera Krishnan',
      role: 'Director, Private Wealth Acquisitions',
      creds: 'Ex-UBS Wealth Management | 12+ Yrs Experience',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Karan Malhotra',
      role: 'Senior Partner, Legal Due Diligence',
      creds: 'High Court Advocate | 18+ Yrs Title Diligence',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    }
  ];

  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#F7F6F3] text-[#16161a] border-t border-[rgba(22,22,26,0.08)] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="eyebrow">ADVISORY TEAM</span>
            <h2
              className="text-3xl md:text-5xl font-medium text-[#16161a] tracking-tight leading-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Meet Our Private <br />
              <span className="font-normal text-[#4a4a4f]">Wealth Advisors</span>
            </h2>
          </div>
          <p className="text-[#4a4a4f] font-normal text-sm md:text-base max-w-md leading-relaxed">
            Our firm is led by senior advisors integrating private office principles, real estate taxation experts, and top title attorneys.
          </p>
        </div>

        {/* Expert Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {experts.map((exp, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="group flex flex-col bg-white border border-[rgba(201,169,110,0.30)] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-[#C9A96E] hover:shadow-[0_25px_50px_rgba(201,169,110,0.25)] cursor-pointer"
            >
              <div className="relative h-[320px] overflow-hidden bg-[#141416]">
                <ImageWithSkeleton
                  src={exp.image} 
                  alt={exp.name} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                />
              </div>

              <div className="p-6 space-y-2 font-sans border-t border-[rgba(201,169,110,0.20)] bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3
                    className="text-xl font-bold text-[#0B0B0B] group-hover:text-[#C9A96E] transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {exp.name}
                  </h3>
                  <p className="text-[#C9A96E] text-xs font-bold uppercase tracking-wider">
                    {exp.role}
                  </p>
                </div>
                <p className="text-[#555555] text-xs font-medium pt-2 border-t border-[rgba(201,169,110,0.15)]">
                  {exp.creds}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MeetExperts;
