import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './HeroSection.css';

const POSTER_URL = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85";
const EASE = [0.16, 1, 0.3, 1];

const CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE }
  }
};

const HeroSection = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState('buy'); // 'buy' | 'rent'
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const route = activeTab === 'rent' ? '/rent' : '/buy';
    if (searchQuery.trim()) {
      navigate(`${route}?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(route);
    }
  };

  return (
    <section className="hero-section">
      {/* 1. Full-Width Background Image */}
      <div className="hero-bg-container">
        <img
          src={POSTER_URL}
          alt="Refined Architectural Estates & Residences"
          className="hero-bg-image"
          loading="eager"
        />
        <div className="hero-overlay-gradient" />
        <div className="hero-overlay-bottom" />
      </div>

      {/* 2. Left-Aligned Content Block */}
      <div className="hero-content-wrapper">
        <motion.div
          variants={CONTAINER}
          initial="hidden"
          animate="visible"
          className="hero-text-block"
        >
          {/* Eyebrow label */}
          <motion.div variants={ITEM} className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">PRIVATE ESTATE PORTFOLIO</span>
          </motion.div>

          {/* Main Heading (2 lines max) */}
          <motion.h1 variants={ITEM} className="hero-heading">
            Refined Architectural <br />
            <span className="hero-heading-accent">Estates &amp; Residences</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={ITEM} className="hero-subtext">
            Curating high-capital residential acquisitions, private villas, and waterfront developments for discerning clientele.
          </motion.p>
        </motion.div>
      </div>

      {/* 3. Fully Functional Search Section Bar with Dedicated Space Allocation */}
      <div className="hero-search-wrapper">
        <div className="hero-search-card">
          {/* Tabs: Buy / Rental */}
          <div className="hero-search-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className={`hero-search-tab ${activeTab === 'buy' ? 'active' : ''}`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rent')}
              className={`hero-search-tab ${activeTab === 'rent' ? 'active' : ''}`}
            >
              Rental
            </button>
          </div>

          {/* Functional Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hero-search-form">
            <div className="hero-search-input-box">
              <Search className="hero-search-icon" />
              <input
                type="text"
                placeholder={activeTab === 'rent' ? 'Search luxury rentals by city, neighborhood, or keywords...' : 'Search buy listings, villas, neighborhoods...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
            </div>
            <button type="submit" className="btn-hero-search">
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
