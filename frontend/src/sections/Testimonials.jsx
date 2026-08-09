import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Devendra Sharma',
      role: 'Managing Director, Sharma Capital',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      quote: 'Imperia Estates redefined the acquisition process. Their legal due diligence on our ECR villa was meticulous, and their private concierge made the registration completely friction-free. Highly recommended.',
      stars: 5,
      acquired: 'Acquired: Oceanfront Villa, ECR'
    },
    {
      name: 'Anjali Nair',
      role: 'Fine Art Curator & Designer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      quote: 'Finding an architecturally significant space that respects raw concrete minimalism is tough. The team at Imperia understood my aesthetic standard instantly and secured an off-market architectural wonder.',
      stars: 5,
      acquired: 'Acquired: Sky Penthouse, Indiranagar'
    },
    {
      name: 'Vikram Rathore',
      role: 'Co-Founder, Solis Energy',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      quote: 'The capital yields modeling and zoning diligence they prepared for our corporate commercial block was institutional-grade. A highly professional brokerage team focusing on long-term wealth assets.',
      stars: 5,
      acquired: 'Acquired: Commercial Block, Gachibowli'
    }
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  const sectionVariants = {
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
    }
  };

  const testimonialVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : (dir > 0 ? 20 : -20),
      opacity: 0,
      scale: 0.99
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : (dir < 0 ? 20 : -20),
      opacity: 0,
      scale: 0.99,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    }),
    hover: {
      y: shouldReduceMotion ? 0 : -6,
      scale: 1.01,
      borderColor: "#CFB6A8",
      boxShadow: "0 20px 40px rgba(54, 60, 70, 0.08)",
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#E0EEE9] relative border-t border-[rgba(93,100,114,0.15)] overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#CFB6A8] font-bold block font-sans">TESTIMONIALS</span>
            <h2
              className="text-3xl md:text-5xl font-medium text-[#363C46] leading-tight tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Trusted By Global <br />
              <span className="font-normal text-[#5D6472]">Leaders &amp; Creators</span>
            </h2>
          </div>
          <p className="text-[#5D6472] font-normal text-sm md:text-base max-w-md leading-relaxed font-sans">
            Hear from our elite clients who have acquired architectural assets, custom villas, and high-capital office structures through our private office.
          </p>
        </div>

        {/* Testimonial Carousel Panel */}
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative max-w-5xl mx-auto min-h-[420px] lg:min-h-[350px] flex items-center justify-center"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={testimonialVariants}
              initial="enter"
              animate="center"
              exit="exit"
              whileHover="hover"
              className="group w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white border border-[rgba(93,100,114,0.15)] p-8 lg:p-12 rounded-xl shadow-[0_12px_32px_rgba(54,60,70,0.06)] relative cursor-default transition-all duration-300"
            >
              {/* Quote Graphic Icon */}
              <div className="absolute top-8 right-8 text-[#5D6472] opacity-20 pointer-events-none select-none">
                <Quote className="w-16 h-16 stroke-[1]" />
              </div>

              {/* Photo & acquired details */}
              <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4 font-sans">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#CFB6A8] p-1 bg-white shadow-xs">
                  <ImageWithSkeleton 
                    src={testimonials[index].image} 
                    alt={testimonials[index].name} 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold text-[#363C46] tracking-tight"
                    style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                  >
                    {testimonials[index].name}
                  </h3>
                  <p className="text-[#5D6472] text-xs font-normal mt-0.5">
                    {testimonials[index].role}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[#CFB6A8] font-bold mt-3">
                    {testimonials[index].acquired}
                  </p>
                </div>
              </div>

              {/* Text review detail */}
              <div className="lg:col-span-8 space-y-6 flex flex-col justify-between h-full font-sans">
                {/* Rating stars */}
                <div className="flex gap-1 text-[#CFB6A8]">
                  {Array.from({ length: testimonials[index].stars }).map((_, sIdx) => (
                    <Star key={sIdx} className="w-4 h-4 fill-current stroke-none" />
                  ))}
                </div>

                {/* Review Statement */}
                <blockquote className="text-[#363C46] text-base md:text-lg font-medium leading-relaxed">
                  "{testimonials[index].quote}"
                </blockquote>

                {/* Micro divider line */}
                <div className="w-12 h-[2px] bg-[#CFB6A8]" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls Overlay */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="p-3.5 rounded-full border border-[rgba(93,100,114,0.15)] bg-white hover:bg-[#CFB6A8] hover:text-white text-[#363C46] transition-all duration-300 shadow-xs cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </motion.button>
            <span className="text-[#5D6472] text-xs font-bold tracking-widest font-mono">
              0{index + 1} / 0{testimonials.length}
            </span>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="p-3.5 rounded-full border border-[rgba(93,100,114,0.15)] bg-white hover:bg-[#CFB6A8] hover:text-white text-[#363C46] transition-all duration-300 shadow-xs cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5 stroke-[2]" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
