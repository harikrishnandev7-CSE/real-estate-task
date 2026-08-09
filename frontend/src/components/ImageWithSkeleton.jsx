import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

const sanitizeSrc = (url) => {
  if (!url || typeof url !== 'string') return FALLBACK_IMAGE;
  if (url.startsWith('blob:')) return FALLBACK_IMAGE;
  return url;
};

const ImageWithSkeleton = ({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  variants,
  loading = "lazy",
  ...props
}) => {
  const initialSrc = sanitizeSrc(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Sync state ONLY when prop `src` changes from parent
  useEffect(() => {
    const validSrc = sanitizeSrc(src);
    setImgSrc(validSrc);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Handle cached images that finish loading before mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [imgSrc]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
      setIsLoaded(true);
    }
  };

  return (
    <div className={`relative overflow-hidden ${wrapperClassName} ${className}`}>
      {/* Shimmer Skeleton Placeholder */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-neutral-900 flex items-center justify-center z-10"
          >
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        variants={variants}
        className="w-full h-full object-cover"
        {...props}
      />

      {/* Shimmer Keyframe CSS */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ImageWithSkeleton;
