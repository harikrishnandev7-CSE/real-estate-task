import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize2, X, Film, Volume2, VolumeX } from 'lucide-react';

const PropertyVideoPlayer = ({ videoUrl, posterUrl, title = 'Property Video Tour' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const hoverVideoRef = useRef(null);

  if (!videoUrl) return null;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hoverVideoRef.current && !isPlaying) {
      hoverVideoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverVideoRef.current) {
      hoverVideoRef.current.pause();
      hoverVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="font-sans space-y-3">
      
      {/* 16:9 Aspect Ratio Video Card */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsPlaying(true)}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0E0E10] border border-[rgba(198,166,107,0.30)] shadow-[0_15px_35px_rgba(0,0,0,0.12)] cursor-pointer group transition-all duration-300 hover:border-[#C6A66B]"
      >
        {!isPlaying ? (
          <>
            {/* Thumbnail Poster / Muted Video Preview */}
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : videoUrl ? (
              <video
                ref={hoverVideoRef}
                src={videoUrl}
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            ) : null}

            {/* Dark Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10]/80 via-black/20 to-transparent" />

            {/* Gold Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-[#C6A66B] text-[#0B0B0B] flex items-center justify-center shadow-[0_10px_25px_rgba(198,166,107,0.40)] group-hover:bg-white transition-colors pl-1"
              >
                <Play className="w-7 h-7 fill-[#0B0B0B]" />
              </motion.div>
            </div>

            {/* Bottom Title & Duration Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#0E0E10]/90 text-[#F4F1EA] border border-[#C6A66B] backdrop-blur-md">
                  HD Video Tour
                </span>
                <span className="text-xs font-bold text-[#F4F1EA] drop-shadow-md truncate max-w-xs">
                  {title}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="p-2 rounded-full bg-[#0E0E10]/90 hover:bg-[#C6A66B] text-[#F4F1EA] hover:text-[#0B0B0B] transition-colors pointer-events-auto border border-[rgba(198,166,107,0.3)]"
                title="Watch Fullscreen Modal"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Inline Video Player */
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            preload="metadata"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black border border-[rgba(198,166,107,0.40)] shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0E0E10]/80 hover:bg-[#C6A66B] text-[#F4F1EA] hover:text-[#0B0B0B] flex items-center justify-center transition-colors border border-[rgba(198,166,107,0.30)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PropertyVideoPlayer;
