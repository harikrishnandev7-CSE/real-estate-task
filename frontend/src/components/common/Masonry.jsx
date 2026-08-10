import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    return values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  };

  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async urls => {
  await Promise.all(
    urls.map(
      src =>
        new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick
}) => {
  const columns = useMedia(
    ['(min-width:1280px)', '(min-width:900px)', '(min-width:600px)'],
    [3, 2, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const { grid, totalHeight } = useMemo(() => {
    if (!width) return { grid: [], totalHeight: 700 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const computedGrid = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height || 360;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });

    return { grid: computedGrid, totalHeight: Math.max(...colHeights, 700) };
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h
      };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item, index);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: 'blur(10px)' })
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8,
          ease: 'power3.out',
          delay: index * stagger
        });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: duration,
          ease: ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (e, item) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = (e, item) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div ref={containerRef} className="masonry-list" style={{ height: `${totalHeight}px` }}>
      {grid.map(item => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            data-key={item.id}
            className="item-wrapper"
            onClick={() => onItemClick ? onItemClick(item) : (item.url && window.open(item.url, '_self'))}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            <div
              className="item-img group relative flex flex-col justify-between p-6 transition-all duration-300"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              {/* Luxury Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-[#0B0B0B]/40 to-[#0B0B0B]/20 group-hover:from-[#0B0B0B]/95 transition-opacity duration-500" />

              {/* Top Header: Badge & Icon */}
              <div className="relative z-10 flex items-center justify-between">
                {item.badge && (
                  <span className="px-3 py-1 bg-[#0B0B0B]/80 backdrop-blur-md text-[10px] font-extrabold tracking-widest text-[#C6A66B] uppercase rounded-md border border-[rgba(198,166,107,0.3)] shadow-xs">
                    {item.badge}
                  </span>
                )}
                {Icon && (
                  <div className="w-9 h-9 rounded-xl bg-white/90 text-[#0B0B0B] flex items-center justify-center shadow-md">
                    <Icon className="w-4.5 h-4.5 text-[#C6A66B]" />
                  </div>
                )}
              </div>

              {/* Bottom Body Content */}
              <div className="relative z-10 space-y-3 pt-12">
                {item.title && (
                  <h3
                    className="text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-[#C6A66B] transition-colors"
                    style={{ fontFamily: "'Playfair Display', 'Fraunces', serif" }}
                  >
                    {item.title}
                  </h3>
                )}

                {item.desc && (
                  <p className="text-xs text-white/80 font-normal leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                )}

                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[11px] uppercase tracking-wider font-extrabold text-[#C6A66B]">
                  <span>DISCOVER SERVICE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
