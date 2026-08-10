import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Devendra Sharma',
      role: 'Managing Director, Sharma Capital',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      quote: 'Imperia Estates redefined our acquisition process. Their legal due diligence on our ECR villa was meticulous, and their private concierge made the transaction completely friction-free.',
      acquired: 'Acquired: Oceanfront Villa, ECR'
    },
    {
      name: 'Anjali Nair',
      role: 'Fine Art Curator & Designer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bgImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      quote: 'Finding an architecturally significant space that respects minimalist design is difficult. The team at Imperia understood my aesthetic standards instantly and secured an off-market penthouse.',
      acquired: 'Acquired: Sky Penthouse, Indiranagar'
    },
    {
      name: 'Vikram Rathore',
      role: 'Co-Founder, Solis Energy',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      bgImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      quote: 'The capital yields modeling and zoning diligence prepared for our corporate commercial block was institutional-grade. A highly professional brokerage team for private office wealth assets.',
      acquired: 'Acquired: Commercial Block, Gachibowli'
    }
  ];

  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleNext = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative py-24 md:py-28 lg:py-32 bg-[#16161a] text-white overflow-hidden font-sans border-t border-[rgba(22,22,26,0.08)]">
      {/* Dynamic Cloudinary Real Estate Background Image with Cross-Fade Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.40, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={testimonials[index].bgImage}
            alt="Real Estate Property Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlay Gradient for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-[#16161a]/75 to-[#16161a]/85 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="eyebrow text-[#A98A5B]">CLIENT TESTIMONIALS</span>
          <h2
            className="text-3xl md:text-5xl font-medium text-white tracking-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
          >
            Client Perspectives
          </h2>
        </div>

        {/* Luxury Quote Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-lg p-8 md:p-14 text-center space-y-8 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <Quote className="w-8 h-8 text-[#A98A5B] mx-auto opacity-75" />

              <blockquote
                className="text-lg md:text-2xl font-normal text-white leading-relaxed italic max-w-2xl mx-auto drop-shadow-sm"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                "{testimonials[index].quote}"
              </blockquote>

              <div className="flex flex-col items-center space-y-2 pt-2">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#A98A5B] shadow-md">
                  <ImageWithSkeleton
                    src={testimonials[index].image}
                    alt={testimonials[index].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white" style={{ fontFamily: "'Fraunces', serif" }}>
                    {testimonials[index].name}
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5">{testimonials[index].role}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A98A5B] pt-1">
                  {testimonials[index].acquired}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Minimal Controls */}
          <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/10">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-[#16161a] transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-white/80 font-semibold tracking-wider">
              0{index + 1} / 0{testimonials.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-[#16161a] transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
