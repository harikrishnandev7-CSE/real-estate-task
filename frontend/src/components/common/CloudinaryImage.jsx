/**
 * CloudinaryImage.jsx
 * A drop-in <img> replacement that automatically applies Cloudinary
 * URL transformations based on the `size` prop.
 *
 * Props:
 *  src      — Cloudinary (or any) image URL
 *  size     — 'card' | 'hero' | 'thumb' | 'room'  (default: 'card')
 *  alt, className, ...rest — passed to <img>
 */
import React, { useState } from 'react';
import { cardImageUrl, heroImageUrl, thumbImageUrl, roomImageUrl } from '../../utils/cloudinaryUtils';

const TRANSFORMS = {
  card:  cardImageUrl,
  hero:  heroImageUrl,
  thumb: thumbImageUrl,
  room:  roomImageUrl,
};

const FALLBACK = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

const CloudinaryImage = ({ src, size = 'card', alt = '', className = '', ...rest }) => {
  const [errored, setErrored] = useState(false);
  const transform = TRANSFORMS[size] || cardImageUrl;
  const finalSrc = errored ? FALLBACK : (transform(src) || FALLBACK);

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
      {...rest}
    />
  );
};

export default CloudinaryImage;
