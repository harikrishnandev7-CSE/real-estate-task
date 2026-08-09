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
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailVal) {
      setNewsletterSubscribed(true);
      showToast("Subscribed to IMPERIA Intelligence Briefing.");
    }
  };

  const filteredArticles = articles.filter(a => activeCategory === 'All' || a.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#E0EEE9] text-[#363C46] font-sans">
      <div className="pt-[64px] lg:pt-[72px]">
        <PageHero
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Editorial Insights' },
          ]}
          eyebrow="IMPERIA JOURNAL"
          heading={
            <>Market Intelligence &amp; <span className="font-normal text-[#5D6472]">Luxury Trends</span></>
          }
          description="Curated essays, tax compliance briefs, and architectural analyses published by our private office."
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16 font-sans">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-[rgba(93,100,114,0.15)] pb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === c
                  ? 'bg-[#363C46] text-white shadow-xs'
                  : 'bg-white border border-[rgba(93,100,114,0.15)] text-[#5D6472] hover:text-[#363C46]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="group border border-[rgba(93,100,114,0.15)] hover:border-[#CFB6A8] rounded-xl overflow-hidden bg-white shadow-[0_12px_32px_rgba(54,60,70,0.06)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-[220px] overflow-hidden bg-[#E0EEE9]">
                <ImageWithSkeleton
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#CFB6A8]">{art.category}</span>
                  <h3
                    className="text-lg font-bold text-[#363C46] tracking-tight group-hover:text-[#CFB6A8] transition-colors"
                    style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                  >
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#5D6472] leading-relaxed line-clamp-2">{art.excerpt}</p>
                </div>
                <div className="pt-4 border-t border-[rgba(93,100,114,0.15)] flex justify-between items-center text-[10px] text-[#5D6472] font-bold">
                  <span>{art.date}</span>
                  <span>{art.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup Banner */}
        <div className="p-8 md:p-12 rounded-xl bg-white border border-[rgba(93,100,114,0.15)] shadow-[0_12px_32px_rgba(54,60,70,0.06)] text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-lg bg-[rgba(207,182,168,0.15)] text-[#CFB6A8] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3
              className="text-2xl font-bold text-[#363C46] tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
            >
              Subscribe to Private Briefings
            </h3>
            <p className="text-xs text-[#5D6472] max-w-md mx-auto">
              Receive confidential market reports, off-market opportunities, and legal regulatory updates directly in your inbox.
            </p>
          </div>
          {!newsletterSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your private email..."
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                className="flex-1 bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.20)] rounded-lg px-4 py-3 text-xs text-[#363C46] outline-none focus:border-[#CFB6A8]"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#363C46] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs cursor-pointer transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p className="text-xs text-emerald-600 font-bold">You are subscribed to IMPERIA Intelligence Briefings.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Blog;
