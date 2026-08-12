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
      acquired: 'Oceanfront Villa, ECR'
    },
    {
      name: 'Anjali Nair',
      role: 'Fine Art Curator & Designer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bgImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      quote: 'Finding an architecturally significant space that respects minimalist design is difficult. The team at Imperia understood my aesthetic standards instantly and secured an off-market penthouse.',
      acquired: 'Sky Penthouse, Indiranagar'
    },
    {
      name: 'Vikram Rathore',
      role: 'Co-Founder, Solis Energy',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      bgImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      quote: 'The capital yields modeling and zoning diligence prepared for our corporate commercial block was institutional-grade. A highly professional brokerage team for private office wealth assets.',
      acquired: 'Commercial Block, Gachibowli'
    }
  ];

  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleNext = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative py-16 md:py-20 bg-[#0B0B0B] text-white overflow-hidden font-sans border-t border-[rgba(201,169,110,0.15)]">
      {/* Background Image Cross-Fade Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 0.30, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={testimonials[index].bgImage}
            alt="Real Estate Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/85 to-[#0B0B0B]/90 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A96E]">
            Client Testimonials
          </span>
          <h2
            className="text-2xl md:text-4xl font-medium text-[#F4F1EA] tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Client Perspectives
          </h2>
        </div>

        {/* Ultra-Luxury Quote Panel (Solid Translucent Dark Card - No Glassmorphism) */}
        <div className="bg-[#141416]/90 border border-[rgba(201,169,110,0.25)] rounded-2xl p-6 md:p-10 text-center shadow-2xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <Quote className="w-7 h-7 text-[#C9A96E] mx-auto opacity-85" />

              <blockquote
                className="text-base md:text-xl font-normal text-[#F4F1EA] leading-relaxed max-w-xl mx-auto italic"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                "{testimonials[index].quote}"
              </blockquote>

              <div className="flex flex-col items-center space-y-2 pt-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A96E] shadow-lg">
                  <ImageWithSkeleton
                    src={testimonials[index].image}
                    alt={testimonials[index].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F4F1EA]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {testimonials[index].name}
                  </h3>
                  <p className="text-[11px] text-[#A09D96] mt-0.5">{testimonials[index].role}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C9A96E] pt-0.5">
                  Acquired: {testimonials[index].acquired}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Minimal Controls & Page Indicator */}
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(201,169,110,0.15)] max-w-xs mx-auto">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-[#C9A96E]/40 text-[#F4F1EA] hover:bg-[#C9A96E] hover:text-[#0B0B0B] transition-all duration-200 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === index ? 'w-6 bg-[#C9A96E]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-[#C9A96E]/40 text-[#F4F1EA] hover:bg-[#C9A96E] hover:text-[#0B0B0B] transition-all duration-200 cursor-pointer"
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
