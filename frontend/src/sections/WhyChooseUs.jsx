import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Shield, Scale, Users, CheckCircle, Coins, Compass, ArrowRight } from 'lucide-react';

const WhyChooseUs = () => {
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      num: '01',
      title: 'RERA Compliance',
      badge: 'RERA AUDITED',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      desc: 'All projects listed in our portfolio are 100% vetted and registered under state RERA authorities for secure capital investments.',
      icon: Shield
    },
    {
      num: '02',
      title: 'Full Legal Advisory',
      badge: 'TITLE VERIFIED',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      desc: 'Our in-house legal experts perform comprehensive title due diligence, ensuring clean documentation and absolute security.',
      icon: Scale
    },
    {
      num: '03',
      title: 'Elite Industry Experts',
      badge: 'EXECUTIVE ADVISORS',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      desc: 'Our advisors possess decadal experience managing institutional investments, family office acquisitions, and private properties.',
      icon: Users
    },
    {
      num: '04',
      title: 'Verified Listings',
      badge: '100% INSPECTED',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      desc: 'Every single residence is audited physically and digitally by our inspection team before entering our catalog.',
      icon: CheckCircle
    },
    {
      num: '05',
      title: 'Transparent Pricing',
      badge: 'DIRECT MATCH',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      desc: 'Zero hidden transaction charges, clear cost breakdowns, and developer direct price matches for complete peace of mind.',
      icon: Coins
    },
    {
      num: '06',
      title: '24/7 Concierge Support',
      badge: 'VIP SERVICES',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      desc: 'A dedicated relationship concierge stays with you from initial site visit and developer negotiations to keys handover.',
      icon: Compass
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#F8F6F2] text-[#111111] border-t border-[rgba(198,166,107,0.2)] font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="eyebrow-accent">VALUE PROPOSITION</span>
            <h2
              className="text-3xl md:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
            >
              Why Discerning Clients <br />
              <span className="font-normal text-[#6B6B6B]">Choose IMPERIA ESTATES</span>
            </h2>
          </div>
          <p className="text-[#6B6B6B] font-normal text-sm md:text-base max-w-md leading-relaxed">
            We bridge the gap between architectural ambition and secure asset ownership, delivering institutional security with a personalized luxury touch.
          </p>
        </div>

        {/* Feature Image Gallery Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.num}
                variants={cardVariants}
                className="group relative flex flex-col bg-white border border-[rgba(201,169,110,0.30)] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-[#C9A96E] hover:shadow-[0_25px_50px_rgba(201,169,110,0.22)] cursor-pointer"
              >
                {/* Feature Image Header */}
                <div className="relative h-48 overflow-hidden bg-[#141416]">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-[#0B0B0B]/30 to-transparent" />
                  
                  {/* Badge & Icon */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 bg-[#0B0B0B]/90 backdrop-blur-md text-[10px] font-extrabold tracking-widest text-[#C9A96E] uppercase rounded-md border border-[rgba(201,169,110,0.4)] shadow-sm">
                      {feat.badge}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-white/95 text-[#0B0B0B] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-[#C9A96E]" />
                    </div>
                  </div>

                  <span className="absolute bottom-3 left-4 text-[10px] font-bold text-[#F4F1EA] uppercase tracking-widest font-sans">
                    FEATURE {feat.num}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight group-hover:text-[#C9A96E] transition-colors"
                      style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
                    >
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#555555] font-normal leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[rgba(201,169,110,0.20)] flex items-center justify-between text-[11px] uppercase tracking-wider font-extrabold text-[#C9A96E]">
                    <span>Explore Assurance</span>
                    <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
