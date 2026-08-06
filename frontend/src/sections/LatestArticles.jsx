import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const LatestArticles = () => {
  const articles = [
    {
      title: 'Luxury Trends 2026: The Rise of Biophilic Mansions',
      excerpt: 'Discover how elite home buyers are prioritizing carbon-neutral materials, solar roof grids, and indoor forests in micro-markets.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80',
      date: 'July 28, 2026',
      readTime: '5 min read'
    },
    {
      title: 'Zoning & RERA: Private Family Office Compliance Guide',
      excerpt: 'Understanding project approval timelines, developer escrow account regulations, and structural liabilities under recent RERA amendments.',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80',
      date: 'June 15, 2026',
      readTime: '8 min read'
    },
    {
      title: 'Chennai ECR Coastal Land: Capital Growth & Outlook',
      excerpt: 'A detailed report of upcoming sea-side infrastructure pipelines, coastal zoning clearances, and land appreciation rates on the ECR belt.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
      date: 'May 30, 2026',
      readTime: '6 min read'
    }
  ];

  const shouldReduceMotion = useReducedMotion();

  // Motion variants with stagger and access checks
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
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
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    },
    hover: {
      y: shouldReduceMotion ? 0 : -8,
      borderColor: "#F5A623",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
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
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const ctaTextVariants = {
    hidden: { color: "#8A8A85" },
    visible: { color: "#8A8A85" },
    hover: {
      color: "#1A1A1A",
      transition: { duration: 0.3 }
    }
  };

  const ctaIconVariants = {
    hidden: { x: 0, backgroundColor: "rgba(0, 0, 0, 0)", borderColor: "#E8E4DA", color: "#1A1A1A" },
    visible: { x: 0, backgroundColor: "rgba(0, 0, 0, 0)", borderColor: "#E8E4DA", color: "#1A1A1A" },
    hover: {
      x: 6,
      backgroundColor: "#1A1A1A",
      borderColor: "#1A1A1A",
      color: "#ffffff",
      transition: {
        duration: 0.35,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#F4F1EA] relative border-t border-[#E8E4DA]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold block font-sans">IMPERIA ESTATES INSIGHTS</span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] leading-tight font-sans tracking-tight">
              Latest Market <br />
              <span className="font-normal text-[#8A8A85]">Intelligence</span>
            </h2>
          </div>
          <p className="text-[#8A8A85] font-normal text-sm md:text-base max-w-md leading-relaxed font-sans">
            Stay informed with research reports, legal compliance briefs, and capital growth projections written by our internal wealth advisory team.
          </p>
        </div>

        {/* Articles Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {articles.map((art, idx) => (
            <motion.article
              key={idx}
              variants={cardVariants}
              whileHover="hover"
              className="group relative flex flex-col bg-white border border-[#E8E4DA] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-[240px] overflow-hidden bg-stone-100">
                <ImageWithSkeleton 
                  variants={imageVariants}
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
              </div>

              {/* Card Body content */}
              <div className="p-6 flex-1 flex flex-col justify-between font-sans">
                <div className="space-y-4">
                  {/* Article Metadata */}
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold">
                    <div className="flex items-center gap-1.5 font-sans">
                      <Calendar className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{art.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-sans">
                      <Clock className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{art.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight transition-colors duration-300 group-hover:text-[#F5A623]">
                    {art.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[#8A8A85] text-xs font-normal leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                {/* Footer Read Action Trigger */}
                <div className="mt-6 pt-4 border-t border-[#E8E4DA] flex items-center justify-between text-xs font-bold tracking-wider uppercase font-sans">
                  <motion.span variants={ctaTextVariants}>READ INTELLIGENCE</motion.span>
                  <motion.div 
                    variants={ctaIconVariants}
                    className="p-1 rounded-full border border-[#E8E4DA] flex items-center justify-center"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LatestArticles;
