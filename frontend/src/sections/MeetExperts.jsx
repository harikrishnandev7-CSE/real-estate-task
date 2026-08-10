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
              className="group flex flex-col bg-white border border-[rgba(22,22,26,0.10)] rounded-md overflow-hidden shadow-[0_1px_2px_rgba(22,22,26,0.04),0_8px_24px_rgba(22,22,26,0.05)] transition-colors duration-300 hover:border-[rgba(22,22,26,0.22)]"
            >
              <div className="relative h-[320px] overflow-hidden bg-[#F7F6F3]">
                <ImageWithSkeleton
                  src={exp.image} 
                  alt={exp.name} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-5 space-y-1.5 font-sans border-t border-[rgba(22,22,26,0.08)]">
                <h3
                  className="text-lg font-medium text-[#16161a] group-hover:text-[#A98A5B] transition-colors"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  {exp.name}
                </h3>
                <p className="text-[#A98A5B] text-xs font-semibold uppercase tracking-wider">
                  {exp.role}
                </p>
                <p className="text-[#4a4a4f] text-xs font-normal pt-1">
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
