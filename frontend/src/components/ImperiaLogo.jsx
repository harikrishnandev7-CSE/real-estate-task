/**
 * ImperiaLogo — Inline SVG brand mark for IMPERIA Luxury Estates.
 *
 * Phase 2 update: palette aligned to new design tokens.
 *   dark  variant: Arsenic #363C46 ink + Dark Vanilla #CFB6A8 accent
 *   light variant: White #FFFFFF ink + Dark Vanilla #CFB6A8 accent
 *
 * Props, layout, and structure unchanged.
 *
 * @param {'dark'|'light'} variant
 * @param {'lockup'|'icon'|'wordmark'} layout
 * @param {number} height
 * @param {string} className
 * @param {object} ...rest
 */

import React from 'react';

// ─── Design tokens (Phase 2 palette) ────────────────────────────────────────

const INK          = '#363C46';   // Arsenic — primary dark ink
const ACCENT       = '#CFB6A8';   // Dark Vanilla — crown / tagline accent
const CREAM        = '#E0EEE9';   // Azureish White — light variant ink
const DIVIDER      = 'rgba(93,100,114,0.20)';        // Black Coral tint
const DIVIDER_LIGHT = 'rgba(255,255,255,0.22)';

// Inter / Plus Jakarta Sans stack (already loaded globally)
const FONT = "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * The architectural "I" mark — three axis-aligned rectangles.
 * Crown → Dark Vanilla accent; column + plinth → themed ink.
 */
const IconMark = ({ ink, accent }) => (
  <>
    {/* Crown / capital — Dark Vanilla accent */}
    <rect x="0" y="8"    width="38" height="5.5" fill={accent} />
    {/* Column / stem */}
    <rect x="14" y="13.5" width="10" height="23"  fill={ink}   />
    {/* Plinth / base */}
    <rect x="0" y="36.5" width="38" height="5.5" fill={ink}   />
  </>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ImperiaLogo = ({
  variant   = 'dark',
  layout    = 'lockup',
  height,
  className = '',
  ...rest
}) => {
  const isDark = variant === 'dark';

  const ink     = isDark ? INK   : CREAM;
  const accent  = ACCENT;               // always Dark Vanilla in both themes
  const textInk = isDark ? INK   : CREAM;
  const divider = isDark ? DIVIDER : DIVIDER_LIGHT;

  // ── Icon-only ──────────────────────────────────────────────────────────────
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
        {/* Crown */}
        <rect x="15" y="13"  width="70" height="10" fill={accent} />
        {/* Column */}
        <rect x="44" y="23"  width="12" height="53" fill={ink}   />
        {/* Plinth */}
        <rect x="15" y="76"  width="70" height="11" fill={ink}   />
      </svg>
    );
  }

  // ── Wordmark-only ──────────────────────────────────────────────────────────
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
          fontWeight="700"
          fontSize="28"
          letterSpacing="6.5"
          fill={textInk}
        >IMPERIA</text>
        <text
          x="1" y="46"
          fontFamily={FONT}
          fontWeight="500"
          fontSize="7.5"
          letterSpacing="4"
          fill={accent}
        >LUXURY ESTATES</text>
      </svg>
    );
  }

  // ── Horizontal lockup (default) ────────────────────────────────────────────
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
      {/* Icon mark */}
      <IconMark ink={ink} accent={accent} />

      {/* Hairline vertical divider */}
      <line x1="52" y1="9" x2="52" y2="41" stroke={divider} strokeWidth="1" />

      {/* Wordmark — IMPERIA */}
      <text
        x="64" y="33"
        fontFamily={FONT}
        fontWeight="700"
        fontSize="21"
        letterSpacing="5"
        fill={textInk}
      >IMPERIA</text>

      {/* Tagline — LUXURY ESTATES */}
      <text
        x="65" y="44"
        fontFamily={FONT}
        fontWeight="500"
        fontSize="6"
        letterSpacing="3.2"
        fill={accent}
      >LUXURY ESTATES</text>
    </svg>
  );
};

export default ImperiaLogo;
