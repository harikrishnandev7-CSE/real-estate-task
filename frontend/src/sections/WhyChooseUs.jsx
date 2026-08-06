import React, { useRef } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { Shield, Scale, Users, CheckCircle, Coins, Compass, ArrowRight } from 'lucide-react';

// Sub-component for premium editorial mosaic cards.
// Parallax has been removed from all mosaic images — the spec limits
// parallax to a single hero/featured image. Applying it to all 7 thumbnails
// was spawning 7 independent useScroll listeners and 14 useTransform hooks
// that recalculated on every scroll tick across the entire mosaic, which
// was the primary source of the section-level jank.
const ImageCard = ({ src, alt, caption, heightClass, variants }) => {
  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      className={`relative overflow-hidden rounded-2xl bg-[#0B0B0C] group cursor-pointer border border-white/5 hover:border-[#C8A15A]/35 hover:shadow-[0_8px_30px_rgba(200,161,90,0.15)] transition-[border-color,box-shadow] duration-300 w-full ${heightClass} will-change-transform lg:hover:-translate-y-[6px] sm:hover:-translate-y-[3px] hover:-translate-y-0`}
    >
      <div className="relative w-full h-full overflow-hidden">
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full h-full object-cover origin-center select-none"
        />
      </div>

      {/* Editorial Overlay — dark gradient at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Sheen sweep on hover — a single premium light streak, not a looping effect */}
      <motion.div
        initial={{ x: '-120%', opacity: 0 }}
        whileHover={{ x: '120%', opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="absolute inset-y-0 left-0 w-1/3 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
      />

      {/* Thin Gold Border Overlay */}
      <div className="absolute inset-0 border border-[#C8A15A]/0 group-hover:border-[#C8A15A]/35 rounded-2xl transition-[border-color,box-shadow] duration-300 z-20 pointer-events-none shadow-[inset_0_0_10px_rgba(200,161,90,0.15)]" />

      {/* Caption details — slide-up on hover, hidden on mobile */}
      <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-[opacity,transform] duration-300 pointer-events-none hidden sm:block">
        <p className="font-serif text-[12px] tracking-widest text-[#C8A15A] uppercase font-semibold leading-relaxed">
          {caption}
        </p>
      </div>
    </motion.div>
  );
};

// Sub-component for feature cards — subtle pointer-driven tilt so each card
// feels like a physical plaque catching light. The card owns its own scroll
// entry trigger (useInView once:true) and caches the bounding rect on
// mouseenter rather than on every mousemove to avoid layout-thrash jank.
const FeatureCard = ({ feat, index, reduceMotion }) => {
  const Icon = feat.icon;
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.35, margin: '0px 0px -40px 0px' });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 26, mass: 0.5 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 26, mass: 0.5 });

  const GLOW_SIZE = 220;
  const glowX = useMotionValue(-GLOW_SIZE / 2);
  const glowY = useMotionValue(-GLOW_SIZE / 2);
  const springGlowX = useSpring(glowX, { stiffness: 180, damping: 24, mass: 0.4 });
  const springGlowY = useSpring(glowY, { stiffness: 180, damping: 24, mass: 0.4 });

  const rectRef = useRef(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (reduceMotion || !rectRef.current) return;
    const rect = rectRef.current;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    rotateY.set((px / rect.width - 0.5) * 6);
    rotateX.set((0.5 - py / rect.height) * 6);
    glowX.set(px - GLOW_SIZE / 2);
    glowY.set(py - GLOW_SIZE / 2);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    rectRef.current = null;
  };

  const col = index % 3;
  const delay = reduceMotion ? 0 : col * 0.1;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 24 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion ? {} : { y: -6, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: reduceMotion ? 0 : springRotateX,
        rotateY: reduceMotion ? 0 : springRotateY,
        transformPerspective: 900,
        willChange: 'transform',
      }}
      className="group relative flex flex-col justify-between p-8 bg-white border border-[#E8E4DA] hover:border-[#F5A623] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)]"
    >
      {/* Faint index numeral */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, x: reduceMotion ? 0 : 10 }}
        animate={isInView ? { opacity: 0.12, x: 0 } : { opacity: 0, x: reduceMotion ? 0 : 10 }}
        transition={{ duration: 0.8, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-3 right-3 text-[88px] leading-none font-sans font-black text-stone-300 select-none pointer-events-none"
      >
        {feat.num}
      </motion.span>

      {/* Amber cursor glow */}
      {!reduceMotion && (
        <motion.div
          style={{
            x: springGlowX,
            y: springGlowY,
            width: GLOW_SIZE,
            height: GLOW_SIZE,
            willChange: 'transform',
          }}
          className="absolute top-0 left-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(circle,rgba(245,166,35,0.15),transparent_70%)]"
        />
      )}

      <div className="space-y-6 relative z-10 font-sans">
        {/* Amber Circular Icon Badge with Spring Bounce */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: reduceMotion ? 0 : -14 }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: reduceMotion ? 0 : -14 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: delay + 0.2 }}
          whileHover={reduceMotion ? {} : { scale: 1.1 }}
          style={{ willChange: 'transform' }}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-[#F5A623] text-white shadow-md transition-transform duration-300"
        >
          <Icon className="w-5 h-5 stroke-[2]" />
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 10 }}
          transition={{ duration: 0.6, delay: delay + 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2.5"
        >
          <h3 className="text-xl font-bold font-sans text-[#1A1A1A] tracking-tight transition-colors duration-300 group-hover:text-[#F5A623]">
            {feat.title}
          </h3>
          <p className="text-[#8A8A85] text-xs leading-relaxed font-normal font-sans">
            {feat.desc}
          </p>
        </motion.div>
      </div>

      {/* Learn More link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.4 }}
        className="pt-6 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#8A8A85] font-sans group-hover:text-[#1A1A1A] transition-colors relative z-10"
      >
        <span>LEARN MORE</span>
        <ArrowRight className="w-4 h-4 text-[#F5A623] transition-transform duration-300 group-hover:translate-x-1.5" />
      </motion.div>
    </motion.div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      num: '01',
      title: 'RERA Compliance',
      desc: 'All projects listed in our properties are 100% vetted and registered under state RERA authorities for secure capital investments.',
      icon: Shield
    },
    {
      num: '02',
      title: 'Full Legal Advisory',
      desc: 'Our in-house legal experts perform comprehensive title due diligence, ensuring clean documentation and absolute security.',
      icon: Scale
    },
    {
      num: '03',
      title: 'Elite Industry Experts',
      desc: 'Our brokers possess decadal experience managing institutional investments, family office acquisitions, and private properties.',
      icon: Users
    },
    {
      num: '04',
      title: 'Verified Listings',
      desc: 'Every single residence is audited physically and digitally by our inspection team before entering our premium catalog.',
      icon: CheckCircle
    },
    {
      num: '05',
      title: 'Transparent Pricing',
      desc: 'Zero hidden transaction charges, clear cost breakdowns, and developer direct price matches for complete peace of mind.',
      icon: Coins
    },
    {
      num: '06',
      title: '24/7 Concierge Support',
      desc: 'A dedicated relationship concierge stays with you from initial site visit and developer negotiations to keys handover.',
      icon: Compass
    }
  ];

  const shouldReduceMotion = useReducedMotion();

  // Mosaic stagger container — feature cards manage their own scroll triggers
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  // Entrance: opacity + y only. Scale has been removed — scale on 7 mosaic
  // items all firing simultaneously added unnecessary compositor overhead.
  const mosaicItemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 28,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-[#F4F1EA] text-[#1A1A1A] relative border-t border-[#E8E4DA]">
      {/* Ambient atmosphere — fades in once on mount. The previous version
          oscillated x/y infinitely (repeat: Infinity), keeping the compositor
          active for the entire time the section was in the DOM. */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 65%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs uppercase tracking-[0.25em] text-[#F5A623] font-bold inline-block font-sans"
            >
              VALUE PROPOSITION
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-bold text-[#1A1A1A] leading-tight font-sans tracking-tight"
            >
              Why Discerning Clients <br />
              <span className="relative inline-block font-normal text-[#8A8A85]">
                Choose IMPERIA ESTATES
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 -bottom-1 h-[2px] w-full origin-left bg-[#F5A623]"
                />
              </span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#8A8A85] font-normal text-sm md:text-base max-w-md leading-relaxed font-sans"
          >
            We bridge the gap between architectural ambition and secure asset ownership, delivering institutional security with a personalized luxury touch.
          </motion.p>
        </div>

        {/* Luxury Image Mosaic — stagger-revealed via variants, no per-image scroll listeners */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24 relative"
        >
          {/* Column 1: Stack of 2 */}
          <div className="flex flex-col gap-6 justify-start">
            <ImageCard
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=75"
              alt="Luxury Villa Facade"
              caption="Luxury Villas"
              heightClass="h-[200px]"
              variants={mosaicItemVariants}
            />
            <ImageCard
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=400&q=75"
              alt="Architectural Interior Detail"
              caption="Premium Interiors"
              heightClass="h-[160px]"
              variants={mosaicItemVariants}
            />
          </div>

          {/* Column 2: 1 Tall offset */}
          <div className="flex flex-col justify-start lg:mt-8">
            <ImageCard
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=75"
              alt="Modern Architecture Living Room"
              caption="Trusted Advisors"
              heightClass="h-[360px]"
              variants={mosaicItemVariants}
            />
          </div>

          {/* Column 3: Stack of 2 */}
          <div className="flex flex-col gap-6 justify-start">
            <ImageCard
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=75"
              alt="Premium Property Consultation"
              caption="Investment Opportunities"
              heightClass="h-[160px]"
              variants={mosaicItemVariants}
            />
            <ImageCard
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=75"
              alt="Satisfied Clients Discussion"
              caption="Architectural Excellence"
              heightClass="h-[200px]"
              variants={mosaicItemVariants}
            />
          </div>

          {/* Column 4: 1 Tall offset */}
          <div className="flex flex-col justify-start lg:mt-4">
            <ImageCard
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=75"
              alt="Luxury Penthouse View"
              caption="Private Residences"
              heightClass="h-[360px]"
              variants={mosaicItemVariants}
            />
          </div>

          {/* Column 5: Stack of 2 */}
          <div className="flex flex-col gap-6 justify-start">
            <ImageCard
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=75"
              alt="Executive Broker Portrait"
              caption="Luxury Lifestyle"
              heightClass="h-[200px]"
              variants={mosaicItemVariants}
            />
            <ImageCard
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=75"
              alt="Coastal Villa Poolside"
              caption="Elite Property Network"
              heightClass="h-[160px]"
              variants={mosaicItemVariants}
            />
          </div>
        </motion.div>

        {/* Feature Cards Grid — each card owns its own scroll-entry trigger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20 lg:-mt-16">
          {features.map((feat, idx) => (
            <FeatureCard
              key={feat.num}
              feat={feat}
              index={idx}
              reduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
