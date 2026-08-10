import React, { useState, useEffect, useRef } from 'react';
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

const CircularGallery = ({ items = defaultCategories, speed = 0.003, className = '' }) => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animRef = useRef(null);
  const progressRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const loop = () => {
      if (!isPausedRef.current) {
        progressRef.current = (progressRef.current + speed) % items.length;
        setProgress(progressRef.current);
      }
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [items.length, speed, shouldReduceMotion]);

  const count = items.length;

  return (
    <div className={`circular-gallery-wrapper ${className}`}>
      <div className="circular-gallery-track">
        {items.map((item, i) => {
          let u = i - progress;
          while (u > count / 2) u -= count;
          while (u < -count / 2) u += count;

          if (Math.abs(u) > 2.8) return null;

          const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
          const spacing = isDesktop ? 340 : 230;

          const x = u * spacing;
          const rotateZ = u * 12; // ReactBits signature Z-axis tilt angle (-12deg left, 0deg center, +12deg right)
          const rotateY = u * -14; // 3D depth perspective angle
          const translateY = Math.abs(u) * 18; // curved arch offset
          const scale = Math.max(0.72, 1 - Math.abs(u) * 0.1);
          const opacity = Math.max(0, 1 - Math.abs(u) * 0.38);
          const zIndex = Math.round(100 - Math.abs(u) * 20);

          return (
            <div
              key={i}
              onClick={() => item.link && navigate(item.link)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="reactbits-card-container group"
              style={{
                transform: `translate3d(${x}px, ${translateY}px, 0px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
              }}
            >
              <div className="reactbits-card-box">
                {/* Image */}
                <div className="reactbits-card-image-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="reactbits-card-img"
                  />
                </div>

                {/* ReactBits Title underneath Card */}
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
          );
        })}
      </div>
    </div>
  );
};

export default CircularGallery;
