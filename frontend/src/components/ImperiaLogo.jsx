import React from 'react';

// ─── Design tokens (Elliman palette) ────────────────────────────────────────

const INK           = '#0B0B0B';   // High-contrast deep black
const ACCENT        = '#C6A66B';   // Bright luxury gold
const CREAM         = '#FFFFFF';   // Bright white light variant
const DIVIDER       = 'rgba(198,166,107,0.30)';
const DIVIDER_LIGHT = 'rgba(255,255,255,0.22)';

const FONT = "'Fraunces', 'Playfair Display', Georgia, serif";
const SANS = "'Inter', system-ui, -apple-system, sans-serif";

const IconMark = ({ ink, accent }) => (
  <>
    <rect x="0" y="8"    width="38" height="5.5" fill={accent} />
    <rect x="14" y="13.5" width="10" height="23"  fill={ink}   />
    <rect x="0" y="36.5" width="38" height="5.5" fill={ink}   />
  </>
);

const ImperiaLogo = ({
  variant   = 'dark',
  layout    = 'lockup',
  height,
  className = '',
  ...rest
}) => {
  const isDark = variant === 'dark';

  const ink     = isDark ? INK   : CREAM;
  const accent  = ACCENT;
  const textInk = isDark ? INK   : CREAM;
  const divider = isDark ? DIVIDER : DIVIDER_LIGHT;

  if (layout === 'icon') {
    const h = height ?? 32;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={h}
        height={h}
        fill="none"
        role="img"
        aria-label="IMPERIA"
        className={className}
        {...rest}
      >
        <rect x="15" y="13"  width="70" height="10" fill={accent} />
        <rect x="44" y="23"  width="12" height="53" fill={ink}   />
        <rect x="15" y="76"  width="70" height="11" fill={ink}   />
      </svg>
    );
  }

  if (layout === 'wordmark') {
    const h = height ?? 36;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 220 50"
        height={h}
        fill="none"
        role="img"
        aria-label="IMPERIA Luxury Estates"
        className={className}
        {...rest}
      >
        <text
          x="0" y="33"
          fontFamily={FONT}
          fontWeight="500"
          fontSize="28"
          letterSpacing="6.5"
          fill={textInk}
        >IMPERIA</text>
        <text
          x="1" y="46"
          fontFamily={SANS}
          fontWeight="600"
          fontSize="7.5"
          letterSpacing="4"
          fill={accent}
        >LUXURY ESTATES</text>
      </svg>
    );
  }

  const h = height ?? 36;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 310 50"
      height={h}
      fill="none"
      role="img"
      aria-label="IMPERIA Luxury Estates"
      className={className}
      {...rest}
    >
      <IconMark ink={ink} accent={accent} />
      <line x1="52" y1="9" x2="52" y2="41" stroke={divider} strokeWidth="1" />
      <text
        x="64" y="33"
        fontFamily={FONT}
        fontWeight="500"
        fontSize="21"
        letterSpacing="5"
        fill={textInk}
      >IMPERIA</text>
      <text
        x="65" y="44"
        fontFamily={SANS}
        fontWeight="600"
        fontSize="6"
        letterSpacing="3.2"
        fill={accent}
      >LUXURY ESTATES</text>
    </svg>
  );
};

export default ImperiaLogo;
