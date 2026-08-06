import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Mail, ArrowRight, User, BookOpen, Star } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const Blog = () => {
  const { showToast } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [emailVal, setEmailVal] = useState('');

  const categories = ['All', 'Market Intelligence', 'Design & Style', 'Investment Guides'];

  const articles = [
    {
      id: "art-1",
      title: "The Rise of Branded Residences in South India",
      excerpt: "Analyzing the premium demand for developers partnering with iconic hospitality brands to build luxury residential towers.",
      category: "Market Intelligence",
      date: "July 24, 2026",
      readTime: "6 Min Read",
      author: "Pranav Rajan",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      featured: true
    },
    {
      id: "art-2",
      title: "Minimalist Master Bedrooms: An Interior Guide",
      excerpt: "Discover the material choices, acoustic panels, and smart curtains that define high-end private retreats.",
      category: "Design & Style",
      date: "July 18, 2026",
      readTime: "4 Min Read",
      author: "Aditi Sen",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80",
      featured: false
    },
    {
      id: "art-3",
      title: "Real Estate Tax Optimizations for NRIs",
      excerpt: "A complete guide on capital gains, TDS exemptions, and legal registration frameworks for foreign investments.",
      category: "Investment Guides",
      date: "July 12, 2026",
      readTime: "8 Min Read",
      author: "Sanjay Mehta",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
      featured: false
    },
    {
      id: "art-4",
      title: "Chennai ECR Corridor: The Ultimate Wealth Haven",
      excerpt: "Why Chennai's coastal strip is outperforming standard cities in land value growth and luxury villa acquisitions.",
      category: "Market Intelligence",
      date: "June 28, 2026",
      readTime: "5 Min Read",
      author: "Pranav Rajan",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
      featured: false
    },
    {
      id: "art-5",
      title: "Bespoke Lighting Design: Sculpting Luxury Spaces",
      excerpt: "How dynamic lighting fixtures and smart automation systems affect physical well-being and premium aesthetics.",
      category: "Design & Style",
      date: "June 22, 2026",
      readTime: "3 Min Read",
      author: "Aditi Sen",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
      featured: false
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailVal) {
      setNewsletterSubscribed(true);
      showToast('Subscribed to IMPERIA ESTATES Journal Intel newsletter.');
    }
  };

  const handleArticleClick = (artTitle) => {
    showToast(`Opening paper: "${artTitle}"`);
  };

  const filteredArticles = activeCategory === 'All' 
    ? articles.filter(a => !a.featured)
    : articles.filter(a => a.category === activeCategory && !a.featured);

  const featuredArticle = articles.find(a => a.featured);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const imageVariants = {
    hidden: { opacity: 1, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.04,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A]">

      {/* PageHero — editorial reading/lounge mood image */}
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Insights' },
          ]}
          eyebrow="EDITORIAL INTELLIGENCE"
          heading={
            <>The IMPERIA ESTATES <span className="font-normal text-[#8A8A85]">Journal</span></>
          }
          description="Bespoke essays, investment breakdowns, and design inspirations curated weekly by our specialist advisory and interior design divisions."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-20">
        
        {/* FEATURED ARTICLES SECTION */}
        {featuredArticle && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F5A623] font-sans">
              <Star className="w-4 h-4 fill-current" />
              <span>FEATURED INTEL</span>
            </div>
            
            <div 
              onClick={() => handleArticleClick(featuredArticle.title)}
              className="border border-[#E8E4DA] bg-white rounded-3xl overflow-hidden p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer group hover:border-[#F5A623] transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)]"
            >
              {/* Image */}
              <div className="lg:col-span-7 h-[280px] md:h-[400px] rounded-2xl overflow-hidden bg-stone-100">
                <ImageWithSkeleton 
                  variants={imageVariants}
                  src={featuredArticle.image} 
                  alt={featuredArticle.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none" />
              </div>

              {/* Text Meta info */}
              <div className="lg:col-span-5 space-y-6 font-sans">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-[#3A3732] font-bold">
                  <span className="text-[#D97706] font-extrabold">{featuredArticle.category}</span>
                  <span className="h-1 w-1 bg-stone-400 rounded-full" />
                  <span>{featuredArticle.date}</span>
                  <span className="h-1 w-1 bg-stone-400 rounded-full" />
                  <span>{featuredArticle.readTime}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight group-hover:text-[#F5A623] transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-[#2B2926] text-xs font-medium leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {featuredArticle.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#1A1A1A]">{featuredArticle.author}</p>
                    <p className="text-[10px] text-[#4A4640] font-semibold">Specialist Analyst</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY NAV BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E4DA] pb-4 font-sans">
          <div className="flex gap-2 p-1 bg-white border border-[#E8E4DA] rounded-full text-xs shadow-2xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full transition-colors cursor-pointer font-bold ${
                  activeCategory === cat 
                    ? 'bg-[#1A1A1A] text-white' 
                    : 'text-[#3A3732] hover:text-[#1A1A1A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#3A3732] font-bold">Discovered {filteredArticles.length} papers</span>
        </div>

        {/* REGULAR ARTICLES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredArticles.map((art) => (
            <motion.div
              key={art.id}
              variants={itemVariants}
              whileHover="hover"
              onClick={() => handleArticleClick(art.title)}
              className="group relative border border-[#E8E4DA] rounded-3xl overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#F5A623] flex flex-col justify-between cursor-pointer transition-all duration-300"
            >
              <div>
                <div className="relative h-[220px] overflow-hidden bg-stone-100">
                  <ImageWithSkeleton 
                    variants={imageVariants}
                    src={art.image} 
                    alt={art.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none" />
                </div>

                <div className="p-6 space-y-4 font-sans">
                  <div className="flex items-center gap-3 text-[9px] uppercase tracking-wider text-[#3A3732] font-bold">
                    <span className="text-[#D97706] font-extrabold">{art.category}</span>
                    <span className="h-1 w-1 bg-stone-400 rounded-full" />
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight group-hover:text-[#F5A623] transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-[#2B2926] text-xs font-medium line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-[#E8E4DA] flex items-center justify-between text-[10px] uppercase tracking-wider text-[#1A1A1A] font-extrabold font-sans mt-auto">
                <span className="group-hover:text-[#F5A623] transition-colors">READ JOURNAL</span>
                <ChevronRight className="w-4 h-4 text-[#F5A623] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* NEWSLETTER SIGNUP PANEL */}
        <div className="border border-[#E8E4DA] bg-white rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-sans">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-3 bg-amber-50 text-[#F5A623] rounded-2xl w-fit shadow-2xs">
              <Mail className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">Subscribe to the Journal</h3>
            <p className="text-[#8A8A85] text-xs leading-relaxed font-normal max-w-sm">
              Receive weekly research briefings on real estate market projections, state tax compliance guidelines, and designer architecture trends.
            </p>
          </div>

          <div className="lg:col-span-6">
            {newsletterSubscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-[#F5A623]/30 bg-amber-50 rounded-2xl p-8 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#F5A623] text-white flex items-center justify-center mx-auto shadow-xs">
                  <CheckOpenIcon />
                </div>
                <h4 className="text-base font-bold text-[#1A1A1A] tracking-tight">Subscription Confirmed</h4>
                <p className="text-xs text-[#8A8A85] leading-relaxed font-normal">
                  We have added your coordinate to IMPERIA ESTATES' private weekly mailing database. Welcome to the circle.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#8A8A85] uppercase tracking-wider font-bold">Your Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="e.g. client@familyoffice.com" 
                      value={emailVal}
                      onChange={(e) => setEmailVal(e.target.value)}
                      required
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] rounded-full py-4 pl-5 pr-14 text-[#1A1A1A] placeholder-[#8A8A85] font-medium outline-none focus:border-[#F5A623]"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#1A1A1A] hover:bg-black text-white rounded-full transition-all cursor-pointer flex items-center justify-center"
                      aria-label="Subscribe"
                    >
                      <ArrowRight className="w-4 h-4 text-[#F5A623]" />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const CheckOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Blog;
