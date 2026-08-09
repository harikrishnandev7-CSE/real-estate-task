import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, ArrowRight, MapPin, Phone, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Footer — Phase 2 restyled
 * Spacious editorial multi-column footer with Arsenic background,
 * Fraunces serif section headers, muted link colors, refined newsletter input.
 * All logic (subscribe handler, showToast) preserved unchanged.
 */
const Footer = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Thank you for subscribing to IMPERIA ESTATES Private Newsletter.');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const columnVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 15
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

  const footerLinksCompany = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Properties', href: '/buy' },
    { name: 'Projects', href: '/projects' },
    { name: 'Insights / Blog', href: '/blog' }
  ];

  const footerLinksServices = [
    { name: 'Services Suite', href: '/services' },
    { name: 'Legal Verification', href: '/services/legal-verification' },
    { name: 'Home Financing', href: '/services/home-financing' },
    { name: 'Interior Design', href: '/services/interior-design' }
  ];

  const footerLinksLegal = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ Support', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ];

  // ── Shared link style ─────────────────────────────────────────────────────
  const linkCls = 'relative inline-flex items-center group py-0.5 transition-colors duration-250 cursor-pointer';
  const linkStyle = { color: 'rgba(224,238,233,0.52)', fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 400 };
  const linkHoverColor = '#E0EEE9';

  const FooterLink = ({ href, children }) => (
    <li>
      <Link
        to={href}
        className={linkCls}
        style={linkStyle}
        onMouseEnter={e => e.currentTarget.style.color = linkHoverColor}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(224,238,233,0.52)'}
      >
        {children}
        {/* Understated underline */}
        <span
          className="absolute bottom-0 left-0 h-px transition-all duration-300 w-0 group-hover:w-full"
          style={{ background: '#CFB6A8' }}
        />
      </Link>
    </li>
  );

  // ── Column heading style ──────────────────────────────────────────────────
  const colHeadStyle = {
    fontFamily: "'Fraunces', 'Playfair Display', serif",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.04em',
    color: '#E0EEE9',
    marginBottom: '1.25rem',
  };

  return (
    <footer
      style={{
        background: '#363C46',            /* Arsenic */
        borderTop: '1px solid rgba(93,100,114,0.25)',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-14"
      >

        {/* Brand Description Column */}
        <motion.div variants={columnVariants} className="lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            {/* Wordmark in light variant */}
            <span
              style={{
                fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#E0EEE9',
              }}
            >
              IMPERIA
            </span>
            {/* Dark Vanilla accent dot */}
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#CFB6A8',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          </Link>

          <p
            style={{
              fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: 'rgba(224,238,233,0.50)',
              lineHeight: 1.7,
              maxWidth: 320,
            }}
          >
            Curators of the world's most exceptional residential real estate. We deliver bespoke brokerage services, legal advisory, and high-capital growth asset allocations for discerning individuals.
          </p>

          {/* Social Icons — minimal, understated */}
          <div className="flex items-center gap-3">
            {[
              {
                label: 'Instagram',
                path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'
              },
              {
                label: 'Facebook',
                path: 'M9 8H7v3h2v9h4v-9h3.625L17 8h-4V6.5c0-.828.672-1 1-1h3V1h-4c-3.314 0-5 1.686-5 5V8z'
              },
              {
                label: 'LinkedIn',
                path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
              },
            ].map(social => (
              <motion.a
                key={social.label}
                href="#"
                whileHover={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  border: '1px solid rgba(224,238,233,0.15)',
                  color: 'rgba(224,238,233,0.45)',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#CFB6A8';
                  e.currentTarget.style.color = '#CFB6A8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(224,238,233,0.15)';
                  e.currentTarget.style.color = 'rgba(224,238,233,0.45)';
                }}
                aria-label={social.label}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d={social.path} />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Company Links Column */}
        <motion.div variants={columnVariants}>
          <h4 style={colHeadStyle}>Company</h4>
          <ul className="space-y-3">
            {footerLinksCompany.map((link, idx) => (
              <FooterLink key={idx} href={link.href}>{link.name}</FooterLink>
            ))}
          </ul>
        </motion.div>

        {/* Services Links Column */}
        <motion.div variants={columnVariants}>
          <h4 style={colHeadStyle}>Services</h4>
          <ul className="space-y-3">
            {footerLinksServices.map((link, idx) => (
              <FooterLink key={idx} href={link.href}>{link.name}</FooterLink>
            ))}
          </ul>
        </motion.div>

        {/* Legal Links Column */}
        <motion.div variants={columnVariants}>
          <h4 style={colHeadStyle}>Support &amp; Legal</h4>
          <ul className="space-y-3">
            {footerLinksLegal.map((link, idx) => (
              <FooterLink key={idx} href={link.href}>{link.name}</FooterLink>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter Signup Column */}
        <motion.div variants={columnVariants} className="space-y-5">
          <h4 style={colHeadStyle}>Newsletter</h4>
          <p
            style={{
              fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              color: 'rgba(224,238,233,0.48)',
              lineHeight: 1.65,
            }}
          >
            Subscribe to receive private previews of off-market listings and architectural insights.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="relative flex items-center py-2 transition-colors"
            style={{ borderBottom: '1px solid rgba(224,238,233,0.20)' }}
            onFocus={e => e.currentTarget.style.borderBottomColor = '#CFB6A8'}
            onBlur={e => e.currentTarget.style.borderBottomColor = 'rgba(224,238,233,0.20)'}
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full py-1 placeholder-[rgba(224,238,233,0.30)]"
              style={{
                fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
                color: '#E0EEE9',
                fontSize: 12,
              }}
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer shrink-0 transition-colors"
              style={{ color: 'rgba(224,238,233,0.40)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#CFB6A8'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(224,238,233,0.40)'}
              aria-label="Subscribe"
            >
              <ArrowRight className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
            </motion.button>
          </form>
          {subscribed && (
            <p
              className="text-[11px] font-medium"
              style={{ color: '#CFB6A8' }}
            >
              Thank you for subscribing to IMPERIA ESTATES newsletter.
            </p>
          )}
        </motion.div>

      </motion.div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto px-6 md:px-12 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-[11px] tracking-wide"
        style={{
          borderTop: '1px solid rgba(93,100,114,0.25)',
          fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
          fontWeight: 400,
          color: 'rgba(224,238,233,0.38)',
        }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 shrink-0" style={{ color: '#CFB6A8' }} />
          <span>72 Park Avenue, New York, NY 10021</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3 shrink-0" style={{ color: '#CFB6A8' }} />
          <span>+1 (800) 555-IMPERIA</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 shrink-0" style={{ color: '#CFB6A8' }} />
          <span>concierge@imperiaestates.com</span>
        </div>
        <div className="lg:text-right mt-2 md:mt-0">
          <span>© {new Date().getFullYear()} IMPERIA ESTATES. All rights reserved. RERA Regd: NY-0038495.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
