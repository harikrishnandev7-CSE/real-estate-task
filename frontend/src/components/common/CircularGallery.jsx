import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import './CircularGallery.css';

const defaultCategories = [
  { title: 'Premium Plots', count: '42 Properties', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', link: '/premium-plots' },
  { title: 'Architectural Villas', count: '18 Properties', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', link: '/architectural-villas' },
  { title: 'Sky Apartments', count: '29 Properties', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', link: '/sky-apartments' },
  { title: 'Commercial Assets', count: '12 Properties', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', link: '/commercial-assets' },
  { title: 'Luxury Farm Lands', count: '23 Properties', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', link: '/luxury-farm-lands' },
  { title: 'Signature Collection', count: '8 Properties', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', link: '/signature-collection' }
];

const CircularGallery = ({ items = defaultCategories, speed = 0.0035, className = '' }) => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const animRef = useRef(null);
  const progressRef = useRef(0);
  const isPausedRef = useRef(false);
  // Direct DOM refs — bypasses React re-renders entirely
  const cardRefs = useRef([]);

  const count = items.length;

  const applyTransforms = useCallback(() => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const spacing = isDesktop ? 340 : 230;
    const progress = progressRef.current;

    items.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      let u = i - progress;
      while (u > count / 2) u -= count;
      while (u < -count / 2) u += count;

      if (Math.abs(u) > 2.8) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        return;
      }

      const x = u * spacing;
      const rotateZ = u * 12;
      const rotateY = u * -14;
      const translateY = Math.abs(u) * 18;
      const scale = Math.max(0.72, 1 - Math.abs(u) * 0.1);
      const opacity = Math.max(0, 1 - Math.abs(u) * 0.38);
      const zIndex = Math.round(100 - Math.abs(u) * 20);

      el.style.visibility = 'visible';
      el.style.opacity = opacity;
      el.style.zIndex = zIndex;
      el.style.transform = `translate3d(${x}px, ${translateY}px, 0px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`;
    });
  }, [items, count]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const loop = () => {
      if (!isPausedRef.current) {
        progressRef.current = (progressRef.current + speed) % count;
        applyTransforms();
      }
      animRef.current = requestAnimationFrame(loop);
    };

    // Render initial positions before first tick
    applyTransforms();
    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [count, speed, shouldReduceMotion, applyTransforms]);

  return (
    <div className={`circular-gallery-wrapper ${className}`}>
      <div className="circular-gallery-track">
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            onClick={() => item.link && navigate(item.link)}
            onMouseEnter={() => { isPausedRef.current = true; }}
            onMouseLeave={() => { isPausedRef.current = false; }}
            className="reactbits-card-container group"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <div className="reactbits-card-box">
              <div className="reactbits-card-image-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="reactbits-card-img"
                />
              </div>
              <div className="reactbits-card-caption">
                <h3
                  className="reactbits-card-title"
                  style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <span className="reactbits-card-count">{item.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircularGallery;
