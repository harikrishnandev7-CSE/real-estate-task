import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, PhoneCall } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const MeetExperts = () => {
  const experts = [
    {
      name: 'Aditya Vardhan',
      role: 'Managing Partner & Founder',
      creds: 'Wharton Real Estate | 15+ Yrs Experience',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      email: 'aditya@imperiaestates.com'
    },
    {
      name: 'Meera Krishnan',
      role: 'Director, Private Wealth Acquisitions',
      creds: 'Ex-UBS Wealth Management | 12+ Yrs Experience',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      email: 'meera@imperiaestates.com'
    },
    {
      name: 'Karan Malhotra',
      role: 'Senior Partner, Legal Due Diligence',
      creds: 'High Court Advocate | 18+ Yrs Experience',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      email: 'karan@imperiaestates.com'
    }
  ];

  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1] 
      }
    },
    hover: {
      y: shouldReduceMotion ? 0 : -8,
      borderColor: "#CFB6A8",
      boxShadow: "0 20px 40px rgba(54, 60, 70, 0.1)",
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 1, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#E0EEE9] relative border-t border-[rgba(93,100,114,0.15)] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block font-sans">PARTNERS DIRECTORY</span>
            <h2
              className="text-3xl md:text-5xl font-medium text-[#363C46] leading-tight tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Meet Our Private <br />
              <span className="font-normal text-[#5D6472]">Wealth Advisors</span>
            </h2>
          </div>
          <p className="text-[#5D6472] font-normal text-sm md:text-base max-w-md leading-relaxed font-sans">
            Our firm is led by senior advisors who integrate investment banking principles, property taxation experts, and top real estate attorneys.
          </p>
        </div>

        {/* Expert Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {experts.map((exp, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover="hover"
              className="group relative flex flex-col bg-white border border-[rgba(93,100,114,0.15)] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(54,60,70,0.06)] cursor-pointer transition-all duration-300"
            >
              {/* Profile Image & Overlay */}
              <div className="relative h-[360px] overflow-hidden bg-[#E0EEE9]">
                <ImageWithSkeleton 
                  variants={imageVariants}
                  src={exp.image} 
                  alt={exp.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Custom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                
                {/* Floating Contact Icons on Hover */}
                <motion.div 
                  variants={overlayVariants}
                  className="absolute inset-0 flex items-center justify-center gap-4 bg-[#363C46]/20 backdrop-blur-[2px] z-20"
                >
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={`mailto:${exp.email}`}
                    className="p-3.5 rounded-full bg-white text-[#363C46] hover:bg-[#CFB6A8] hover:text-white transition-all duration-300 flex items-center justify-center shadow-xs"
                    aria-label="Email"
                  >
                    <Mail className="w-4.5 h-4.5 stroke-[2]" />
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="#" 
                    className="p-3.5 rounded-full bg-white text-[#363C46] hover:bg-[#CFB6A8] hover:text-white transition-all duration-300 flex items-center justify-center shadow-xs"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </motion.a>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3.5 rounded-full bg-white text-[#363C46] hover:bg-[#CFB6A8] hover:text-white transition-all duration-300 flex items-center justify-center shadow-xs"
                    aria-label="Book Call"
                  >
                    <PhoneCall className="w-4.5 h-4.5 stroke-[2]" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Card Footer Detail */}
              <div className="p-6 border-t border-[rgba(93,100,114,0.15)] space-y-2 font-sans">
                <h3
                  className="text-xl font-bold text-[#363C46] tracking-tight transition-colors duration-300 group-hover:text-[#CFB6A8]"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  {exp.name}
                </h3>
                <p className="text-[#CFB6A8] text-xs font-bold uppercase tracking-wider">
                  {exp.role}
                </p>
                <p className="text-[#5D6472] text-[11px] font-normal leading-relaxed pt-1">
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
