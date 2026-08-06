/**
 * ImperiaLogo — Inline SVG brand mark for IMPERIA Luxury Estates.
 *
 * Renders entirely in SVG with no external image request, so it:
 *   – scales perfectly at any resolution
 *   – is theme-aware (dark / light prop)
 *   – can be coloured / sized via props
 *   – works in the navbar, splash screens, footers, OG images, etc.
 *
 * @param {'dark'|'light'} variant
 *   'dark'  → near-black ink + amber, for cream / white backgrounds (default)
 *   'light' → cream ink + amber, for dark / near-black backgrounds
 *
 * @param {'lockup'|'icon'|'wordmark'} layout
 *   'lockup'   → icon mark + divider + wordmark, horizontal (default)
 *   'icon'     → standalone icon / monogram only (square crop)
 *   'wordmark' → wordmark text only (no icon)
 *
 * @param {number} height
 *   Rendered height in px. Width is set to 'auto' so the SVG scales
 *   proportionally from its intrinsic viewBox aspect ratio.
 *   Defaults: lockup → 36, icon → 32, wordmark → 36
 *
 * @param {string} className   Extra Tailwind / CSS classes on the <svg>
 * @param {object} ...rest     Any other props forwarded to <svg>
 */

import React from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────

const INK   = '#1A1A1A';
const AMBER = '#F5A623';
const CREAM = '#F4F1EA';
const RULE  = '#E8E4DA';
const RULE_LIGHT = 'rgba(255,255,255,0.18)';

// Font stack — Plus Jakarta Sans is loaded globally via Google Fonts in
// index.html; the rest of the stack guarantees a clean geometric sans
// fallback in contexts where that font hasn't loaded yet.
const FONT  = "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * The architectural "I" mark — three axis-aligned rectangles.
 * Proportions derived from a 100 × 100 unit grid; scaled here to
 * fit a 38 × 42 unit slot inside the lockup viewBox (height 50 units).
 *
 * @param {string} ink    Colour for column + plinth
 * @param {string} amber  Colour for crown (always amber in both themes)
 */
const IconMark = ({ ink, amber }) => (
  <>
    {/* Crown / capital — amber accent, always #F5A623 */}
    <rect x="0" y="8"    width="38" height="5.5" fill={amber} />
    {/* Column / stem — themed colour */}
    <rect x="14" y="13.5" width="10" height="23"  fill={ink}   />
    {/* Plinth / base — themed colour */}
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

  // Resolved colours for this variant
  const ink      = isDark ? INK   : CREAM;
  const amber    = AMBER; // stays amber in both themes by brand spec
  const textInk  = isDark ? INK   : CREAM;
  const divider  = isDark ? RULE  : RULE_LIGHT;

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
        <rect x="15" y="13"  width="70" height="10" fill={amber} />
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
          fontWeight="800"
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
          fill={amber}
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
      <IconMark ink={ink} amber={amber} />

      {/* Hairline vertical divider */}
      <line x1="52" y1="9" x2="52" y2="41" stroke={divider} strokeWidth="1" />

      {/* Wordmark — IMPERIA */}
      <text
        x="64" y="33"
        fontFamily={FONT}
        fontWeight="800"
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
        fill={amber}
      >LUXURY ESTATES</text>
    </svg>
  );
};

export default ImperiaLogo;
