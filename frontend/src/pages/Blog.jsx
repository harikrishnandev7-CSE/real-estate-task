import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Mail, ArrowRight, User, BookOpen, Star } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

const Blog = () => {
  const { blogs = [], showToast } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [emailVal, setEmailVal] = useState('');

  const categories = ['All', 'Market Intelligence', 'Design & Style', 'Investment Guides'];

  const articlesList = Array.isArray(blogs) && blogs.length > 0 ? blogs : [
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
      showToast("Subscribed to IMPERIA Intelligence Briefings.");
    }
  };

  const filteredArticles = articlesList.filter(a => activeCategory === 'All' || a.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#16161a] font-sans pb-20">
      <PageHero
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Insights & Journal' },
        ]}
        eyebrow="IMPERIA JOURNAL"
        heading="Market Intelligence & Luxury Trends"
        description="Curated essays, tax compliance briefs, and architectural analyses published by our private office."
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12 font-sans">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 justify-center border-b border-[rgba(22,22,26,0.10)] pb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeCategory === c
                  ? 'bg-[#C9A96E] text-[#0B0B0B] font-bold shadow-xs'
                  : 'bg-white border border-[rgba(22,22,26,0.10)] text-[#6B6B6B] hover:text-[#0B0B0B] hover:border-[#C9A96E]'
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
              key={art.id || art._id}
              className="group border border-[rgba(22,22,26,0.10)] hover:border-[#C9A96E] rounded-lg overflow-hidden bg-white shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-[230px] overflow-hidden bg-[#141416]">
                <ImageWithSkeleton
                  src={art.image || art.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A96E]">{art.category}</span>
                  <h3
                    className="text-lg font-bold text-[#16161a] tracking-tight group-hover:text-[#C9A96E] transition-colors leading-snug"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-2">{art.excerpt || art.description}</p>
                </div>
                <div className="pt-4 border-t border-[rgba(22,22,26,0.08)] flex justify-between items-center text-[10px] text-[#6B6B6B] font-semibold">
                  <span>{art.date || "July 2026"}</span>
                  <span>{art.readTime || "5 Min Read"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup Banner */}
        <div className="p-8 md:p-12 rounded-xl bg-[#0E0E10] text-[#F4F1EA] border border-[rgba(201,169,110,0.25)] shadow-2xl text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[rgba(201,169,110,0.15)] text-[#C9A96E] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3
              className="text-2xl md:text-3xl font-medium tracking-tight text-[#F4F1EA]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Subscribe to Private Briefings
            </h3>
            <p className="text-xs text-[rgba(244,241,234,0.70)] max-w-md mx-auto leading-relaxed">
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
                className="flex-1 bg-white/5 border border-white/15 rounded-md px-4 py-3 text-xs text-[#F4F1EA] outline-none focus:border-[#C9A96E]"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#C9A96E] hover:bg-[#E5D3A3] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider rounded-md shadow-xs cursor-pointer transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p className="text-xs text-[#C9A96E] font-bold">You are subscribed to IMPERIA Intelligence Briefings.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Blog;
