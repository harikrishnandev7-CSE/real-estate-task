import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Video, Layers } from 'lucide-react';

const LatestArticles = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-20 md:py-24 bg-[#F8F6F2] text-[#111111] border-t border-[rgba(198,166,107,0.2)] font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="eyebrow-accent">MARKET INTELLIGENCE</span>
            <h2
              className="text-3xl md:text-5xl font-bold text-[#0B0B0B] leading-tight tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
            >
              Journal &amp; <br />
              <span className="font-normal text-[#6B6B6B]">Private Insights</span>
            </h2>
          </div>
          <p className="text-[#6B6B6B] font-normal text-sm md:text-base max-w-md leading-relaxed">
            Stay informed with research reports, legal compliance briefs, and capital growth projections written by our internal wealth advisory team.
          </p>
        </div>

        {/* JamesEdition Exact Replica Grid: No Border Radius, Sharp Corners, Tight 1px Spacing */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-1.5 bg-[#FFFFFF] p-1 shadow-sm"
        >
          
          {/* ── CARD 1: Executive Interview Card (Top Left) ───────────────── */}
          <motion.article
            variants={cardVariants}
            onClick={() => navigate('/blog')}
            className="group relative h-[420px] md:h-[460px] rounded-none overflow-hidden cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80" 
              alt="Mexico's Coastal Property Rise" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />

            {/* Top Half: Executive Portraits */}
            <div className="absolute top-8 left-0 right-0 z-10 flex items-center justify-center gap-4 px-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/80 shadow-md mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Jason Waller" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">JASON WALLER</p>
                <p className="text-[9px] text-white/70 uppercase max-w-[120px] leading-tight">CEO OF CHRISTIE'S INT. REAL ESTATE</p>
              </div>

              <span className="text-xl md:text-2xl font-serif text-white/80 italic font-light">&amp;</span>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/80 shadow-md mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Eric Finnas Dahlstrom" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">ERIC DAHLSTROM</p>
                <p className="text-[9px] text-white/70 uppercase max-w-[120px] leading-tight">CEO OF JAMESEDITION</p>
              </div>
            </div>

            {/* Bottom Title & Subtitle Quote */}
            <div className="absolute bottom-6 left-0 right-0 px-6 text-center z-10 space-y-1">
              <h3 
                className="text-2xl md:text-3xl font-medium text-white tracking-tight leading-tight group-hover:text-[#C6A66B] transition-colors"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Mexico's Coastal Property Rise
              </h3>
              <p className="text-xs md:text-sm text-white/80 font-serif italic">
                "We're not really salespeople, we are tour guides."
              </p>
            </div>
          </motion.article>


          {/* ── CARD 2: Italy Waterfront (Top Middle) ─────────────────────── */}
          <motion.article
            variants={cardVariants}
            onClick={() => navigate('/blog')}
            className="group relative h-[420px] md:h-[460px] rounded-none overflow-hidden cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80" 
              alt="The New Trophy Asset" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            <div className="absolute bottom-10 left-6 right-6 z-10">
              <h3 
                className="text-2xl md:text-3xl font-normal text-white leading-snug group-hover:text-[#C6A66B] transition-colors drop-shadow-md"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The New Trophy Asset: How U.S. Buyers Drive Italy's Shift to Waterfront Luxury
              </h3>
            </div>
          </motion.article>


          {/* ── CARD 3: Historic Italian Villa (Top Right) ─────────────────── */}
          <motion.article
            variants={cardVariants}
            onClick={() => navigate('/blog')}
            className="group relative h-[420px] md:h-[460px] rounded-none overflow-hidden cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" 
              alt="Mona Lisa Villa" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            <div className="absolute bottom-10 left-6 right-6 z-10">
              <h3 
                className="text-2xl md:text-3xl font-normal text-white leading-snug group-hover:text-[#C6A66B] transition-colors drop-shadow-md"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                This Villa Is Believed to Have Once Belonged to the Woman Behind the Mona Lisa
              </h3>
            </div>
          </motion.article>


          {/* ── CARD 4: Expensive Homes U.S. (Bottom Left) ────────────────── */}
          <motion.article
            variants={cardVariants}
            onClick={() => navigate('/blog')}
            className="group relative h-[420px] md:h-[460px] rounded-none overflow-hidden cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80" 
              alt="Most Expensive Homes" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Video Badge Top Right */}
            <div className="absolute top-4 right-4 z-10 p-2 text-white/90">
              <Video className="w-5 h-5" />
            </div>

            <div className="absolute bottom-10 left-6 right-6 z-10">
              <h3 
                className="text-2xl md:text-3xl font-normal text-white leading-snug group-hover:text-[#C6A66B] transition-colors drop-shadow-md"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                These Are the Most Expensive Homes for Sale in the U.S.
              </h3>
            </div>
          </motion.article>


          {/* ── CARD 5: Vineyard Estate (Bottom Middle) ───────────────────── */}
          <motion.article
            variants={cardVariants}
            onClick={() => navigate('/blog')}
            className="group relative h-[420px] md:h-[460px] rounded-none overflow-hidden cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80" 
              alt="Architectural Vineyard Estate" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Video Badge Top Right */}
            <div className="absolute top-4 right-4 z-10 p-2 text-white/90">
              <Video className="w-5 h-5" />
            </div>

            <div className="absolute bottom-10 left-6 right-6 z-10">
              <h3 
                className="text-2xl md:text-3xl font-normal text-white leading-snug group-hover:text-[#C6A66B] transition-colors drop-shadow-md"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                An Architectural Vineyard Estate Shaped by the Beauty of Knights Valley, California
              </h3>
            </div>
          </motion.article>


          {/* ── CARD 6: Swae Lee Gated Mansion (Bottom Right) ──────────────── */}
          <motion.article
            variants={cardVariants}
            onClick={() => navigate('/blog')}
            className="group relative h-[420px] md:h-[460px] rounded-none overflow-hidden cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80" 
              alt="Swae Lee Gated Estate" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Gallery Badge Top Right */}
            <div className="absolute top-4 right-4 z-10 p-2 text-white/90">
              <Layers className="w-5 h-5" />
            </div>

            <div className="absolute bottom-8 left-6 right-20 z-10">
              <h3 
                className="text-2xl md:text-3xl font-normal text-white leading-snug group-hover:text-[#C6A66B] transition-colors drop-shadow-md"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Rapper Swae Lee Is Selling His Gated Estate
              </h3>
            </div>

            {/* Bottom Right Avatar Circle */}
            <div className="absolute bottom-6 right-6 z-20 w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Swae Lee Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
          </motion.article>

        </motion.div>
      </div>
    </section>
  );
};

export default LatestArticles;
