import React from 'react';
import { useNavigate } from 'react-router-dom';

const defaultCards = [
  { title: "French Alps", image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80", link: "/buy" },
  { title: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", link: "/buy" },
  { title: "French Riviera", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80", link: "/buy" },
  { title: "Saint-Barth", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", link: "/buy" },
  { title: "South-West", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", link: "/buy" },
  { title: "Chennai", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80", link: "/buy?city=Chennai" },
  { title: "Coimbatore", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", link: "/buy?city=Coimbatore" },
  { title: "Bangalore", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", link: "/buy?city=Bangalore" },
  { title: "Hyderabad", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", link: "/buy?city=Hyderabad" },
  { title: "Mumbai", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80", link: "/buy?city=Mumbai" },
];

const AnimatedCardCarousel = ({ cards = defaultCards, speed = 35, className = "" }) => {
  const navigate = useNavigate();

  // Triple items for a seamless continuous loop animation
  const items = [...cards, ...cards, ...cards];

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      <style>{`
        @keyframes marqueeInfinite {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeInfinite ${speed}s linear infinite;
          will-change: transform;
        }
        .animate-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="animate-marquee-track flex gap-4 md:gap-5">
        {items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => item.link && navigate(item.link)}
            className="group relative shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[350px] h-[340px] sm:h-[380px] md:h-[420px] rounded-md overflow-hidden cursor-pointer bg-[#16161a] border border-[rgba(22,22,26,0.10)] shadow-xs"
          >
            {/* Full Edge-to-Edge Image */}
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />

            {/* Dark Gradient Overlay at Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

            {/* Serif Title Text at Bottom Center */}
            <div className="absolute bottom-6 inset-x-5 z-20 flex flex-col items-center justify-end text-center pointer-events-none">
              <h3
                className="text-xl sm:text-2xl md:text-3xl text-white font-normal tracking-tight italic drop-shadow-md"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCardCarousel;
