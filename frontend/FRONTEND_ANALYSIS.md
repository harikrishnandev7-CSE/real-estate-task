# IMPERIA ESTATES — FRONTEND ARCHITECTURE & TECHNICAL SPECIFICATION DOCUMENT

> **Document Version:** 1.0.0  
> **Target Audience:** Backend AI Engineers, Technical Architects, Database Designers, Full-Stack Developers  
> **Scope:** Comprehensive, non-destructive analysis of the IMPERIA Luxury Estates frontend application.  
> **Status:** Production-Ready Frontend Codebase Analysis

---

## 1. Project Overview

### 1.1 Purpose of the Website
**IMPERIA — Luxury Estates** is an ultra-premium real estate web application engineered to showcase luxury residential properties (villas, penthouses, sky apartments, beachfront estates), commercial assets (corporate suites, coworking lounges, retail showrooms), and high-appreciation land parcels (DTCP/CMDA/HMDA/BIAAPA approved plots, farm lands). The portal communicates restraint, architectural mastery, and discreet luxury, catering to high-net-worth individuals (HNWIs) and institutional investors.

### 1.2 Business Goals
1. **Lead Generation & High-Intent Conversion:** Enable HNWIs to schedule private, curated site visits (`BookSiteVisitModal`) and engage with assigned luxury real estate consultants via a dedicated WhatsApp Concierge (`WhatsAppPanel`).
2. **Property Discovery & Portfolio Curation:** Provide an intuitive search, filtering, wishlist (`Wishlist.jsx`), and side-by-side comparison system (`Compare.jsx`) capable of handling complex property attributes.
3. **Services Portfolio Promotion:** Market specialized real estate advisory services including 30-Year Title Search & Legal Verification, Private Bank Debt Placement & Financing, and Bespoke Interior Design.
4. **User Engagement & Personalization:** Onboard users with customized property preferences (`OnboardingPreferencesPage.jsx`) and provide a personalized VIP Dashboard (`DashboardPage.jsx`).

### 1.3 Target Users
* **Primary Buyer/Tenant (Customer):** High-Net-Worth Individuals, corporate executives, family offices, and investors looking for premium properties in Chennai, Coimbatore, Bangalore, Hyderabad, and hill retreats.
* **Property Sellers / Developers:** Luxury builders (e.g., IMPERIA Infra, Ritz Group) listing landmark projects.
* **IMPERIA Advisory Team (Admin / Consultant):** Private real estate advisors handling concierge requests, site visits, and client management.

### 1.4 User Flows

```
[ Visitor / Unauthenticated User ]
       │
       ├─► Landing Page (Home.jsx) ──► Hero / Categories / Featured Estates
       ├─► Discovery ───────────────► Buy.jsx / Rent.jsx / Projects.jsx / CollectionPage.jsx
       ├─► Property Deep Dive ──────► PropertyDetails.jsx (ID: imperia-ritz, imperia-beachfront, etc.)
       ├─► Conversion Points ───────► Book Site Visit Modal / WhatsApp Concierge Panel
       └─► Auth Entry ──────────────► SignupPage.jsx / LoginPage.jsx
                                             │
                                             ▼
                                 [ Registered Customer ]
                                             │
                                             ├─► Onboarding Preferences (Location, Budget, Purpose)
                                             ├─► Welcome / Personalised Feed
                                             ├─► DashboardPage.jsx (Site Visit Schedule, Saved Assets)
                                             └─► ProfilePage.jsx (Edit Preferences & Account Settings)
```

---

## 2. Complete Folder Structure

```
c:\real estate site\frontend\
├── index.html                       # Base HTML5 entry, Google & Fontshare typography links
├── vite.config.js                   # Vite build tool configuration
├── package.json                     # Node dependencies (React 19, React Router 7, Framer Motion, Lucide React, Tailwind CSS v4)
├── FRONTEND_ANALYSIS.md             # Master Technical Analysis & Specification (this document)
├── public/
│   ├── favicon.svg                  # Architectural "I" monogram favicon (cream tile, amber crown)
│   ├── icons.svg                    # SVG icon set
│   └── logo/                        # Vector SVG brand assets
│       ├── imperia-icon-dark.svg    # Architectural "I" mark (dark ink + amber)
│       ├── imperia-icon-light.svg   # Architectural "I" mark (cream + amber)
│       ├── imperia-lockup-dark.svg  # Primary horizontal logo lockup (dark ink)
│       ├── imperia-lockup-light.svg # Primary horizontal logo lockup (light/reversed)
│       ├── imperia-wordmark-dark.svg# Wordmark alone (dark)
│       └── imperia-wordmark-light.svg# Wordmark alone (light)
└── src/
    ├── main.jsx                     # Application root mounting App into DOM
    ├── App.jsx                      # Main Router, Layout Shell, Global Modals, Toast & Preloader
    ├── App.css                      # App-level styling imports
    ├── index.css                    # Design Tokens (@theme), Glassmorphism, Clip-path, Custom Scrollbar
    ├── context/
    │   └── AppContext.jsx           # Global Context Provider (Properties, Auth, Wishlist, Compare, Visits, Modals)
    ├── data/
    │   └── consultants.js           # Static consultant dataset for WhatsApp Concierge
    ├── components/
    │   ├── Navbar.jsx               # Responsive sticky glass header with search overlay & mega menus
    │   ├── Footer.jsx               # Dark architectural footer with newsletter subscription & quick links
    │   ├── ImperiaLogo.jsx          # Theme-aware inline SVG brand logo component (lockup/icon/wordmark)
    │   ├── PageHero.jsx             # Generic reusable page header banner with breadcrumbs
    │   ├── Preloader.jsx            # 3D cinematic architectural intro preloader animation
    │   ├── ScrollToTop.jsx          # Route change scroll reset handler
    │   ├── ImageWithSkeleton.jsx    # Image loader component with shimmer skeleton state
    │   ├── common/
    │   │   ├── BookSiteVisitModal.jsx# Global site visit booking modal with date/time picker
    │   │   ├── Toast.jsx            # Floating toast alert notification banner
    │   │   ├── CardsAndBadges.jsx   # UI Badges (RERA, Status, Tag) and spec pills
    │   │   ├── InteractiveWidgets.jsx# Financial calculators & interactivity widgets
    │   │   ├── LuxuryGallery.jsx    # High-resolution image modal gallery with thumbnails
    │   │   └── FeedbackStates.jsx   # Empty states, loading spinners, and error alerts
    │   ├── whatsapp/
    │   │   ├── FloatingWhatsAppButton.jsx # Floating trigger button for direct concierge chat
    │   │   ├── WhatsAppPanel.jsx    # Slide-over chat drawer with consultant selection
    │   │   ├── ConsultantCard.jsx   # Consultant profile card item in WhatsApp drawer
    │   │   ├── MessageComposer.jsx  # Input field & quick question buttons for chat
    │   │   └── QuickQuestions.jsx   # One-click question preset chips
    │   └── images/                  # Bundled local high-res hero images
    ├── pages/
    │   ├── Home.jsx                 # Landing page assembling home sections
    │   ├── Buy.jsx                  # Property sale directory with sidebar filters & view toggle
    │   ├── Rent.jsx                 # Rental & commercial lease directory with lease term chips
    │   ├── Projects.jsx             # Landmark projects & ongoing development showcase
    │   ├── PropertyDetails.jsx      # Full detail view for individual property (specs, gallery, visit booking)
    │   ├── Search.jsx               # Dedicated search result page with search parameter parsing
    │   ├── Wishlist.jsx             # User's saved properties grid
    │   ├── Compare.jsx              # Side-by-side comparison matrix (up to 4 properties)
    │   ├── ServicesPage.jsx         # Advisory services index page
    │   ├── LegalVerificationPage.jsx# 30-Year Title Search & EC Clearance service detail page
    │   ├── HomeFinancingPage.jsx    # Private Bank Debt Placement & Loan calculator page
    │   ├── InteriorDesignPage.jsx   # Custom architectural interior design service page
    │   ├── CollectionPage.jsx       # Curated collection page (plots, villas, sky apartments, etc.)
    │   ├── SignupPage.jsx           # Account creation page with validation
    │   ├── LoginPage.jsx            # Account sign-in page with credential checking
    │   ├── OnboardingPreferencesPage.jsx # Multi-step customer preference onboarding form
    │   ├── OnboardingWelcomePage.jsx# Personalized post-onboarding welcome screen
    │   ├── DashboardPage.jsx        # Customer VIP dashboard (Site visits, saved items, stats)
    │   ├── ProfilePage.jsx          # User profile settings & preferences editor
    │   ├── Blog.jsx                 # Real estate market insights & news listing
    │   ├── About.jsx                # Brand story, philosophy, leadership team, and milestones
    │   ├── Contact.jsx              # Office locations, direct inquiry form, and concierge details
    │   ├── Privacy.jsx              # Privacy policy documentation
    │   ├── Terms.jsx                # Terms of service documentation
    │   ├── FAQ.jsx                  # Frequently Asked Questions accordion page
    │   └── NotFoundPage.jsx         # Custom 404 error page with navigation actions
    └── sections/
        ├── Hero.jsx                 # 3D tilted hero container with crossfading Ken-Burns carousel & adaptive scrim
        ├── Categories.jsx           # Property category cards (Villas, Penthouses, Commercial, Plots)
        ├── FeaturedProperties.jsx   # Curated featured property carousel/grid
        ├── InvestmentLocations.jsx  # High-growth investment region spotlight (OMR, ECR, Race Course, etc.)
        ├── WhyChooseUs.jsx          # Value proposition & craftsmanship pillars
        ├── Statistics.jsx           # Key brand metrics & trust indicators
        ├── Services.jsx             # Homepage services overview grid
        ├── MeetExperts.jsx          # Senior real estate advisors showcase
        ├── Testimonials.jsx         # Client stories & review quotes
        ├── LatestArticles.jsx       # Latest market analysis article cards
        └── BookSiteVisit.jsx        # Homepage CTA section for scheduling site tours
```

---

## 3. Route Map & Navigation Flow

The application uses `react-router-dom` v7 with `AnimatePresence` page transitions (`App.jsx`).

| Route Path | Page Component | Public / Protected | Role | Purpose & Description | Navigation Flow |
|---|---|---|---|---|---|
| `/` | `Home.jsx` | Public | All | Primary landing page showcasing hero carousel, categories, featured listings, locations, and concierge CTAs. | Entry point → Navigate to `/buy`, `/rent`, `/property/:id`, `/services` |
| `/buy` | `Buy.jsx` | Public | All | Complete directory of properties available for purchase with sidebar filters (Budget, Beds, Area, Status, Amenities). | `/` or Navbar → `/property/:id`, `/compare`, `/wishlist` |
| `/rent` | `Rent.jsx` | Public | All | Rental and commercial lease listings with specialized filters (Lease terms, Space type). | Navbar → `/property/:id`, `/compare` |
| `/projects` | `Projects.jsx` | Public | All | Showcase of flagship developments and ongoing residential/commercial master plans. | Navbar Mega Menu → `/property/:id` |
| `/property/:id` | `PropertyDetails.jsx` | Public | All | Full property page containing gallery, specs, amenities, RERA compliance, schedule visit form, and mortgage calculator. | Listings / Cards → Book Visit Modal / Contact / Compare |
| `/search` | `Search.jsx` | Public | All | Search results page driven by URL query parameter `?q=...`. | Navbar Search Bar → `/property/:id` |
| `/wishlist` | `Wishlist.jsx` | Customer | User | Grid of properties saved by the user stored in state/localStorage. | Navbar Account Menu → `/property/:id` |
| `/compare` | `Compare.jsx` | Public | All | Side-by-side spec comparison table for up to 4 selected properties. | Navbar / Property Cards → `/property/:id` |
| `/services` | `ServicesPage.jsx` | Public | All | Catalogue of IMPERIA luxury estate services (Legal, Financing, Interior Design). | Navbar → `/services/legal-verification`, `/services/home-financing`, `/services/interior-design` |
| `/services/legal-verification` | `LegalVerificationPage.jsx` | Public | All | Detailed service page for 30-Year Title Search & EC Audits with inquiry form. | Services Page → Book Consultation |
| `/services/home-financing` | `HomeFinancingPage.jsx` | Public | All | Private bank debt placement service page with interactive loan EMI calculator. | Services Page → EMI Calculator / Inquiry |
| `/services/interior-design` | `InteriorDesignPage.jsx` | Public | All | Custom interior design service showcase with portfolio showcase and consultation form. | Services Page → Book Consultation |
| `/premium-plots` | `CollectionPage.jsx` | Public | All | Specialized collection directory filtering `collectionSlug="premium-plots"`. | Navbar Mega Menu → `/property/:id` |
| `/architectural-villas` | `CollectionPage.jsx` | Public | All | Specialized collection directory filtering `collectionSlug="architectural-villas"`. | Navbar Mega Menu → `/property/:id` |
| `/sky-apartments` | `CollectionPage.jsx` | Public | All | Specialized collection directory filtering `collectionSlug="sky-apartments"`. | Navbar Mega Menu → `/property/:id` |
| `/commercial-assets` | `CollectionPage.jsx` | Public | All | Collection directory for commercial suites and coworking lounges. | Footer / Mega Menu → `/property/:id` |
| `/luxury-farm-lands` | `CollectionPage.jsx` | Public | All | Collection directory for luxury eco-estates and farm lands. | Footer → `/property/:id` |
| `/signature-collection` | `CollectionPage.jsx` | Public | All | Ultra-exclusive signature properties collection. | Hero / Footer → `/property/:id` |
| `/signup` | `SignupPage.jsx` | Public | Guest | User registration form (Name, Email, Phone, Password, Role). | Navbar Account Menu → `/onboarding/preferences` |
| `/onboarding/preferences` | `OnboardingPreferencesPage.jsx` | Customer | User | Multi-step preferences quiz (Purpose, Property Type, Budget, Locations). | Signup Flow → `/welcome` |
| `/welcome` | `OnboardingWelcomePage.jsx` | Customer | User | Post-onboarding confirmation screen summarizing user preferences. | Onboarding Flow → `/dashboard` |
| `/login` | `LoginPage.jsx` | Public | Guest | User authentication form with email/password and "Remember Me" toggle. | Navbar Account Menu → `/dashboard` |
| `/dashboard` | `DashboardPage.jsx` | Protected | User | Customer VIP portal displaying scheduled site visits, saved properties, recent views, and account stats. | Navbar Account Menu → `/profile`, `/property/:id` |
| `/profile` | `ProfilePage.jsx` | Protected | User | User profile editor for personal details, contact info, and investment preferences. | Dashboard / Navbar → Save Profile |
| `/blog` | `Blog.jsx` | Public | All | Real estate market insights, luxury trends, and architectural news articles. | Footer / Navbar → Article Modal / Reading |
| `/about` | `About.jsx` | Public | All | IMPERIA brand history, values, leadership team, and milestones. | Footer → Contact |
| `/contact` | `Contact.jsx` | Public | All | Office addresses, concierge hotline, and direct message inquiry form. | Footer → Form Submission |
| `/privacy` | `Privacy.jsx` | Public | All | Legal privacy policy documentation. | Footer |
| `/terms` | `Terms.jsx` | Public | All | Terms of service and site usage agreement. | Footer |
| `/faq` | `FAQ.jsx` | Public | All | Categorized Frequently Asked Questions accordion. | Footer → Contact |
| `*` | `NotFoundPage.jsx` | Public | All | 404 error page with action button to return home. | Any invalid path → `/` |

---

## 4. Comprehensive Page Breakdown

### 4.1 Home (`src/pages/Home.jsx`)
* **Sections:** `Hero`, `Categories`, `FeaturedProperties`, `InvestmentLocations`, `WhyChooseUs`, `Statistics`, `Services`, `MeetExperts`, `Testimonials`, `LatestArticles`, `BookSiteVisit`.
* **Interactions:** Image carousel cycling, 3D tilt movement on mouse move, filter navigation, category clicks, site visit modal trigger, WhatsApp drawer trigger.

### 4.2 Buy (`src/pages/Buy.jsx`)
* **Sections:** `PageHero`, Filter Sidebar (Desktop & Mobile Drawer), Top Control Bar (Sort, View Mode Toggle, Result Count), Property Cards Grid / List.
* **Filter Controls:** Search query input, City chips, Property Type checkboxes, Budget range slider, Beds/Baths selector, Area range, Construction status, Amenities checkboxes.
* **Interactions:** Real-time client-side array filtering, layout mode toggle (Grid vs. List), sorting by Price (Low-to-High, High-to-Low) / Rating / Area.

### 4.3 Rent (`src/pages/Rent.jsx`)
* **Sections:** `PageHero`, Rental Filter Sidebar, Lease Term Requirements (Pill Chips: "1 Year Minimum", "2+ Years Lock-in", "Flexible Lease", "Long Term Corporate"), Space Type selector (Furnished, Semi-Furnished, Bare Shell), Property Cards.
* **Interactions:** Multi-attribute filtering, Wishlist toggle, Compare toggle, Book Visit action.

### 4.4 Property Details (`src/pages/PropertyDetails.jsx`)
* **Sections:** Property Header (Title, Location, RERA Badge, Price, Action buttons), `LuxuryGallery` (Main image + thumbnail grid + full-screen lightbox), Overview Specs Grid, Description, Key Features (Pros & Cons), Amenities Grid, Mortgage EMI Calculator, Assigned Consultant Card, Schedule Tour Form, Similar Properties Carousel.
* **Interactions:** Lightbox open/close, EMI slider changes (Down payment, Interest rate, Tenure), Tour booking submission, Direct WhatsApp link.

### 4.5 Search (`src/pages/Search.jsx`)
* **Sections:** Search Header displaying active query parameter `?q=...`, Search Input Bar, Result Stats, Filter Pills, Filtered Property Cards Grid.
* **Interactions:** Live search query updates, clear search, navigating to `/property/:id`.

### 4.6 Wishlist (`src/pages/Wishlist.jsx`)
* **Sections:** `PageHero`, Empty Wishlist State (with CTA to `/buy`), Saved Properties Grid, Quick Remove action, Clear All Wishlist button.
* **Interactions:** Removing item from `wishlist` array in `AppContext` and `localStorage`, navigating to details.

### 4.7 Compare (`src/pages/Compare.jsx`)
* **Sections:** `PageHero`, Comparison Matrix Header (up to 4 property columns + sticky attributes column), Attribute Rows (Price, Location, Type, Beds/Baths, Area, Price/sq.ft, Status, Builder, Rating, Amenities checklist, Actions).
* **Interactions:** Removing property from compare, adding property from dropdown, clearing all comparison slots.

### 4.8 Services Suite Pages (`ServicesPage.jsx`, `LegalVerificationPage.jsx`, `HomeFinancingPage.jsx`, `InteriorDesignPage.jsx`)
* **Sections:** Service hero, Value propositions, Step-by-step workflow process, Interactive Calculator (Financing page), Portfolio Gallery (Interior page), Consultation Request Form.
* **Interactions:** Submitting service inquiry form, calculating monthly debt service EMI.

### 4.9 Onboarding & Auth Pages (`SignupPage.jsx`, `LoginPage.jsx`, `OnboardingPreferencesPage.jsx`, `OnboardingWelcomePage.jsx`)
* **Sections:** Auth Card Container, Form inputs (with validation messages), Social auth placeholders, Multi-step wizard progress bar (Preferences), Confirmation screen with summary.
* **Interactions:** User state creation/login via `AppContext`, storing user payload in `localStorage` (`imperia_user`), redirecting to `/dashboard`.

### 4.10 Customer Dashboard (`src/pages/DashboardPage.jsx`)
* **Sections:** VIP Welcome Banner, Account Stats Bar (Saved Estates, Confirmed Site Visits, Active Enquiries, Advisory Status), Upcoming Site Visits Table, Saved Wishlist Preview Carousel, Recently Viewed Properties, Quick Action Cards.
* **Interactions:** Rescheduling/cancelling site visits, navigating to profile editor.

### 4.11 User Profile (`src/pages/ProfilePage.jsx`)
* **Sections:** Profile Header with Avatar Upload trigger, Personal Info Form (Name, Email, Phone, City, State), Investment Preferences Form (Purpose, Preferred Types, Budget Range, Target Locations), Security Settings (Password change fields).
* **Interactions:** Updating `currentUser` object in `AppContext` & `localStorage`, firing toast notifications.

---

## 5. UI Component Inventory

| Component Name | File Path | Props Received | Internal State | Parent Component | Purpose & Description |
|---|---|---|---|---|---|
| `Navbar` | `src/components/Navbar.jsx` | None | `isScrolled`, `activeMegaMenu`, `mobileMenuOpen`, `searchOpen`, `searchVal`, `accountOpen`, `notificationsOpen`, `notifications` | `AppContent` | Sticky header with logo, mega-menus, search overlay, account dropdown, and notification drawer. |
| `Footer` | `src/components/Footer.jsx` | None | `email`, `subscribed` | `AppContent` | Site footer with quick links, office addresses, newsletter subscribe input, legal links. |
| `ImperiaLogo` | `src/components/ImperiaLogo.jsx` | `variant` ('dark'\|'light'), `layout` ('lockup'\|'icon'\|'wordmark'), `height`, `className` | None | `Navbar`, `Footer`, `Preloader` | Inline SVG logo component rendering architectural "I" monogram & wordmark without external image requests. |
| `PageHero` | `src/components/PageHero.jsx` | `title`, `subtitle`, `category`, `breadcrumbs` | None | Various Pages | Standardized luxury header banner with breadcrumbs and background treatment. |
| `Preloader` | `src/components/Preloader.jsx` | `onComplete` | `progress`, `phase` | `AppContent` | 3D architectural intro preloader with loading bar and smooth exit transition. |
| `BookSiteVisitModal` | `src/components/common/BookSiteVisitModal.jsx` | None | `formData`, `errors`, `isSubmitting`, `isSubmitted` | `AppContent` | Global modal for scheduling site visits with property selector, date, and time slot picker. |
| `Toast` | `src/components/common/Toast.jsx` | `message`, `show`, `onClose` | None | `AppContent` | Animated floating notification banner for user feedback. |
| `LuxuryGallery` | `src/components/common/LuxuryGallery.jsx` | `images`, `title` | `activeIndex`, `isOpen` | `PropertyDetails` | Full-screen image lightbox gallery with thumbnails and arrow navigation. |
| `InteractiveWidgets` | `src/components/common/InteractiveWidgets.jsx` | `property` | `downPayment`, `interestRate`, `tenure` | `PropertyDetails`, `HomeFinancingPage` | Mortgage EMI calculator with live monthly payment calculation. |
| `FloatingWhatsAppButton` | `src/components/whatsapp/FloatingWhatsAppButton.jsx` | None | `unreadBadge` | `AppContent` | Floating action button triggering the WhatsApp concierge drawer. |
| `WhatsAppPanel` | `src/components/whatsapp/WhatsAppPanel.jsx` | None | `selectedConsultant`, `messages`, `inputText` | `AppContent` | Direct concierge chat panel with consultant profiles and pre-filled inquiry templates. |

---

## 6. Forms & Validation Specifications

### 6.1 Site Visit Booking Form (`BookSiteVisitModal.jsx`)
* **Purpose:** Schedule a physical or virtual site tour.
* **Fields:**
  1. `property` (Select/Readonly): Target property title. Required. Default: Active property title.
  2. `name` (Text): Full Name. Required. Min length: 2 chars. Placeholder: "e.g. Vikramaditya Roy".
  3. `email` (Email): Email address. Required. Regex: `/\S+@\S+\.\S+/`. Placeholder: "v.roy@domain.com".
  4. `phone` (Tel): Phone number. Required. Min length: 8 digits. Placeholder: "+91 98765 43210".
  5. `date` (Date): Preferred Visit Date. Required. Min value: Today.
  6. `time` (Radio/Chips): Preferred Time Slot (`09:00 AM`, `11:00 AM`, `02:00 PM`, `04:00 PM`, `06:00 PM`). Required. Default: `"10:00 AM"`.
* **Submission Flow:** Validates fields -> Displays inline error text if invalid -> Shows `Loader2` spinner (1000ms delay) -> Adds visit record to `siteVisits` array in `AppContext` -> Triggers toast message -> Displays success confirmation view inside modal.

### 6.2 User Registration Form (`SignupPage.jsx`)
* **Fields:** `name` (Text), `email` (Email), `phone` (Tel), `password` (Password, min 6 chars), `confirmPassword` (Password, must match `password`), `agreeTerms` (Checkbox, required).
* **Expected API:** `POST /api/v1/auth/register`

### 6.3 User Login Form (`LoginPage.jsx`)
* **Fields:** `email` (Email, required), `password` (Password, required), `rememberMe` (Checkbox, optional).
* **Expected API:** `POST /api/v1/auth/login`

### 6.4 Onboarding Preferences Form (`OnboardingPreferencesPage.jsx`)
* **Steps:**
  1. *Purpose Selection:* Radio chips (`Buy`, `Rent`, `Invest`).
  2. *Property Types:* Multi-select checkboxes (`Villa`, `Penthouse`, `Apartment`, `Plot`, `Office`).
  3. *Budget Range:* Single-select radio chips (`Under ₹2 Cr`, `₹2 Cr – ₹5 Cr`, `₹5 Cr – ₹10 Cr`, `₹10 Cr+`).
  4. *Target Locations:* Multi-select chips (`Chennai (ECR/OMR)`, `Coimbatore`, `Bangalore`, `Hyderabad`, `Hill Retreats`).
* **Expected API:** `POST /api/v1/user/preferences`

### 6.5 User Profile Editor (`ProfilePage.jsx`)
* **Fields:** `name`, `email`, `phone`, `city`, `state`, `purpose`, `propertyTypes`, `budget`, `locations`.
* **Expected API:** `PUT /api/v1/user/profile`

### 6.6 Contact / Service Inquiry Form (`Contact.jsx`, `LegalVerificationPage.jsx`, `InteriorDesignPage.jsx`)
* **Fields:** `fullName` (Text), `emailAddress` (Email), `phoneNumber` (Tel), `serviceRequested` (Select), `message` (Textarea).
* **Expected API:** `POST /api/v1/inquiries`

---

## 7. Master Input Fields Inventory & Backend Mapping

| Page | Form | Field Name | Input Type | Validation Rules | Required? | Example Value | Backend Field Mapping |
|---|---|---|---|---|---|---|---|
| `BookSiteVisitModal` | Site Visit | `name` | `text` | Trimmed, non-empty | Yes | `"Vikramaditya Roy"` | `site_visit.user_name` |
| `BookSiteVisitModal` | Site Visit | `email` | `email` | Standard email regex | Yes | `"v.roy@imperia.com"` | `site_visit.user_email` |
| `BookSiteVisitModal` | Site Visit | `phone` | `tel` | Min 8 chars | Yes | `"+919876543210"` | `site_visit.user_phone` |
| `BookSiteVisitModal` | Site Visit | `date` | `date` | Valid future date | Yes | `"2026-08-10"` | `site_visit.scheduled_date` |
| `BookSiteVisitModal` | Site Visit | `time` | `radio` | One of `timeSlots` | Yes | `"11:00 AM"` | `site_visit.scheduled_time` |
| `BookSiteVisitModal` | Site Visit | `property` | `select` | Non-empty string | Yes | `"The Ritz-Carlton"` | `site_visit.property_id` |
| `SignupPage` | Registration | `name` | `text` | Non-empty | Yes | `"Ananya Sharma"` | `users.full_name` |
| `SignupPage` | Registration | `email` | `email` | Unique, valid email | Yes | `"ananya@domain.com"` | `users.email` |
| `SignupPage` | Registration | `phone` | `tel` | Min 10 digits | Yes | `"+919812345678"` | `users.phone_number` |
| `SignupPage` | Registration | `password` | `password` | Min 6 chars | Yes | `"SecretPass123!"` | `users.password_hash` |
| `LoginPage` | Login | `email` | `email` | Valid email | Yes | `"v.roy@imperia.com"` | `auth.email` |
| `LoginPage` | Login | `password` | `password` | Non-empty | Yes | `"MyPassword123"` | `auth.password` |
| `LoginPage` | Login | `rememberMe` | `checkbox` | Boolean | No | `true` | Client session persistence |
| `Buy` / `Rent` | Filters | `searchQuery` | `text` | String search | No | `"Beachfront"` | `query_params.q` |
| `Buy` / `Rent` | Filters | `selectedCity` | `select` | Valid city string | No | `"Chennai"` | `query_params.city` |
| `Buy` / `Rent` | Filters | `propertyTypes` | `checkbox` | Array of strings | No | `["Villa", "Plot"]` | `query_params.types` |
| `Buy` / `Rent` | Filters | `minPrice` | `range/number`| Numeric | No | `20000000` | `query_params.min_price` |
| `Buy` / `Rent` | Filters | `maxPrice` | `range/number`| Numeric | No | `150000000` | `query_params.max_price` |
| `Buy` / `Rent` | Filters | `beds` | `buttons` | Number or "All" | No | `4` | `query_params.beds` |
| `Buy` / `Rent` | Filters | `baths` | `buttons` | Number or "All" | No | `3` | `query_params.baths` |
| `Buy` / `Rent` | Filters | `amenities` | `checkbox` | Array of strings | No | `["Infinity Pool"]` | `query_params.amenities` |
| `ProfilePage` | Profile | `purpose` | `radio` | `Buy` \| `Rent` \| `Invest` | Yes | `"Buy"` | `user_profile.purpose` |
| `ProfilePage` | Profile | `budget` | `radio` | String range | Yes | `"₹2Cr–₹5Cr"` | `user_profile.budget_range` |
| `Contact` | Inquiry | `message` | `textarea` | Min 10 chars | Yes | `"Interested in ECR"` | `inquiries.message_text` |
| `Footer` | Newsletter | `email` | `email` | Valid email | Yes | `"subscriber@domain.com"`| `subscriptions.email` |

---

## 8. Master Buttons Inventory

| Button Location | Label / Icon | Action / Function | Target Route | Expected API Endpoint | Expected Response |
|---|---|---|---|---|---|
| Navbar Header | `"BOOK SITE VISIT"` | Opens `BookSiteVisitModal` | Modal Overlay | None (Local State) | Displays Modal |
| Navbar Right | Search Icon | Opens search overlay | Overlay | None (Local State) | Focuses search input |
| Navbar Account | User Icon / `"Account"` | Toggles account dropdown | Dropdown | None | Displays menu options |
| Navbar Dropdown | `"Log Out"` | Executes `logoutUser()` | `/login` | `POST /api/v1/auth/logout` | `{ success: true }` |
| Hero Section | `"EXPLORE ESTATES"` | Navigation | `/buy` | None | Navigates to Buy page |
| Hero Section | `"Book Site Visit"` | Opens `BookSiteVisitModal` | Modal Overlay | None | Displays Modal |
| Property Cards | `"View Residence"` / Card click | Navigation | `/property/:id` | `GET /api/v1/properties/:id` | Returns property details object |
| Property Cards | Heart Icon | Toggles `wishlist` | Local State | `POST /api/v1/wishlist/toggle` | `{ inWishlist: boolean }` |
| Property Cards | Scale / Compare Icon | Toggles `compareList` | Local State | `POST /api/v1/compare/toggle` | `{ inCompare: boolean }` |
| Property Details | `"Schedule Private Tour"` | Opens `BookSiteVisitModal` | Modal Overlay | None | Displays Modal |
| Property Details | WhatsApp Icon | Opens WhatsApp Panel | Drawer | None | Slides over chat drawer |
| Property Details | `"Add to Compare"` | Adds to compare array | Local State | None | Updates compare count |
| Wishlist Page | `"Remove"` / Trash | Removes item from wishlist | Local State | `DELETE /api/v1/wishlist/:id` | `{ success: true }` |
| Compare Page | `"Clear All"` | Empties compare array | Local State | `DELETE /api/v1/compare/all` | `{ success: true }` |
| Signup Page | `"CREATE VIP ACCOUNT"` | Submits signup form | `/onboarding/preferences` | `POST /api/v1/auth/register` | `{ token: "...", user: {...} }` |
| Login Page | `"LOG IN TO IMPERIA"` | Submits login form | `/dashboard` | `POST /api/v1/auth/login` | `{ token: "...", user: {...} }` |
| Profile Page | `"SAVE PREFERENCES"` | Submits profile form | Local State | `PUT /api/v1/user/profile` | `{ success: true, user: {...} }` |
| WhatsApp Drawer| `"Send via WhatsApp"` | Opens `api.whatsapp.com` | External URL | `POST /api/v1/concierge/log` | Opens WhatsApp Web/App |

---

## 9. Filters Specification

The frontend implements comprehensive client-side array filtering in `Buy.jsx` and `Rent.jsx`.

### Filter Parameters & Query String Mapping:
```http
GET /api/v1/properties?purpose=Buy&city=Chennai&types=Villa,Apartment&minPrice=20000000&maxPrice=150000000&beds=4&baths=3&minArea=2000&maxArea=8000&status=Ready+to+Move&amenities=Infinity+Pool,Concierge&sort=price_desc&page=1&limit=12
```

#### Filter Parameters:
1. `purpose`: `"Buy"` | `"Rent"` (Derived from route path)
2. `city`: `"All"` | `"Chennai"` | `"Coimbatore"` | `"Bangalore"` | `"Hyderabad"` | `"Madurai"`
3. `type`: `"All"` | `"Apartment"` | `"Villa"` | `"Penthouse"` | `"Plot"` | `"Office"` | `"Co-working"` | `"Commercial"`
4. `minPrice` / `maxPrice`: Numeric values in INR (e.g. `10000000` to `250000000`)
5. `beds`: `"All"` | `1` | `2` | `3` | `4` | `5+`
6. `baths`: `"All"` | `1` | `2` | `3` | `4` | `5+`
7. `minArea` / `maxArea`: Sq.ft range (e.g. `1000` to `100000`)
8. `status`: `"All"` | `"Ready to Move"` | `"Under Construction"`
9. `amenities`: Array of strings (`"Infinity Pool"`, `"Private Gym"`, `"24/7 Concierge"`, `"Home Automation"`, `"Private Beach Access"`, `"Helipad"`, `"DTCP Approved"`, `"CMDA Approved"`)
10. `leaseTerm` *(Rent page specific)*: `"1 Year Minimum"` | `"2+ Years Lock-in"` | `"Flexible Lease"` | `"Long Term Corporate"`

---

## 10. Search Feature Specification

### Header Search Bar & Search Page (`Search.jsx`)
* **Trigger:** Click search icon in Navbar or submit inline input.
* **Navigation:** `navigate('/search?q=' + encodeURIComponent(query))`
* **Expected API:** `GET /api/v1/search?q={query}`
* **Search Matching Fields:** `title`, `location`, `city`, `type`, `builder`, `tag`, `desc`, `amenities`.
* **Response Payload Expectations:**
```json
{
  "query": "ECR Beachfront",
  "totalResults": 3,
  "results": [
    {
      "id": "imperia-beachfront",
      "title": "The ECR Beachfront Villa",
      "price": "₹22.0 Cr",
      "location": "ECR, Chennai",
      "type": "Villa",
      "beds": 5,
      "baths": 6,
      "area": "7,200 sq.ft.",
      "image": "https://images.unsplash.com/..."
    }
  ]
}
```

---

## 11. Tables Specification

### 11.1 Property Overview Specs Table (`PropertyDetails.jsx`)
* **Columns:** Attribute Key (`Year Built`, `Floor`, `Furnished`, `Security`, `Plot Area`, `Road Width`, `Facing`, `Approval`), Value.
* **Data Source:** `property.specs` object.

### 11.2 Side-by-Side Comparison Matrix (`Compare.jsx`)
* **Columns:** Feature Label Column + up to 4 Property Columns.
* **Rows:** Image & Title, Price, Location, Type, Bedrooms, Bathrooms, Area, Price per Sq.ft, RERA Status, Builder, Rating, Amenities (Checkmark list), Actions.

### 11.3 Upcoming Site Visits Table (`DashboardPage.jsx`)
* **Columns:** Property Name, Date & Time, Assigned Advisor, Status Badge (`Confirmed`, `Pending`, `Completed`), Action (`Cancel` / `Reschedule`).
* **Data Source:** `siteVisits` array in `AppContext`.

---

## 12. Cards Inventory

### 12.1 Standard Property Card (`Buy.jsx`, `Rent.jsx`, `Home.jsx`)
* **Elements:**
  - Property Image with hover scale effect
  - Top Badge (`SIGNATURE`, `NEW LAUNCH`, `EXCLUSIVE`, `DTCP APPROVED`, `LUXURY VILLA`)
  - Wishlist Heart Button (top right)
  - Compare Scale Button (top right)
  - Title, Location (`Icon + Text`)
  - Key Specs Bar (Bedrooms, Bathrooms, Sq.ft Area)
  - Builder & Rating Badge (`★ 4.95`)
  - CTA Button (`"View Residence"`)

### 12.2 Collection Card (`CollectionPage.jsx`, `Categories.jsx`)
* **Elements:** Background image with dark overlay, Category Title, Property Count Badge, Description, `"Explore Collection →"` link.

### 12.3 Consultant Profile Card (`MeetExperts.jsx`, `WhatsAppPanel.jsx`)
* **Elements:** Avatar image, Name, Title ("Senior Private Advisor"), Specialization ("ECR & OMR Luxury Estates"), Rating ("4.98 ★"), Direct Phone & WhatsApp trigger buttons.

---

## 13. Customer VIP Dashboard (`DashboardPage.jsx`)

### 13.1 Displayed Information & Widgets
1. **VIP Welcome Banner:** Displays user name, membership tier ("VIP Member"), primary location, and quick avatar image.
2. **Account Statistics Row:**
   - Saved Estates Count (`wishlist.length`)
   - Scheduled Visits Count (`siteVisits.length`)
   - Active Enquiries Count (Default: `3`)
   - Advisory Status (`"24/7 Concierge Active"`)
3. **Upcoming Site Visits Section:** Table/list of confirmed site visits with date, time, assigned advisor, and cancel action.
4. **Saved Properties Carousel:** Horizontal scrollable row of wishlist items.
5. **Recently Viewed Properties:** History of properties visited by the user (`recentlyViewed`).
6. **Quick Advisory Actions:** Buttons to trigger WhatsApp Concierge, schedule new visit, or edit preferences.

---

## 14. Authentication System & State Persistence

### 14.1 Auth Flow Diagram

```
[ Visitor ] ──► /signup ──► Fill Form ──► AppContext.signupUser() ──► Saved to localStorage ("imperia_user")
                                                                                  │
                                                                                  ▼
[ Logged In User ] ◄── AppContext.loginUser() ◄── Fill Form ◄── /login ◄── /onboarding/preferences
        │
        ├─► User Profile Loaded into Context (`currentUser`)
        ├─► Header shows User First Name & VIP Badge
        ├─► Route Access Granted: /dashboard, /profile
        └─► Logout Action ──► AppContext.logoutUser() ──► isLoggedIn: false ──► Redirect /login
```

### 14.2 LocalStorage Persistence Keys
* `imperia_user`: JSON object storing `currentUser` data (`name`, `email`, `phone`, `city`, `state`, `purpose`, `propertyTypes`, `budget`, `locations`, `isLoggedIn`).
* `imperia_wishlist`: JSON array of saved property objects.
* `imperia_compare`: JSON array of compared property objects (max 4).
* `imperia_recent`: JSON array of recently viewed property objects (max 8).
* `imperia_site_visits`: JSON array of booked site visit objects.

---

## 15. Customer Features Inventory

1. **Property Discovery & Multi-Parametric Search:** Real-time search across titles, locations, builders, and descriptions.
2. **Advanced Filtering Engine:** Filter by Purpose, City, Property Type, Price Range, Bedrooms, Bathrooms, Sq.ft Area, Construction Status, Amenities, and Lease Terms.
3. **Property Comparison Engine (`Compare.jsx`):** Compare up to 4 properties side-by-side with attribute highlights.
4. **Wishlist & Favorites (`Wishlist.jsx`):** One-click save to local state and localStorage.
5. **Site Visit Booking System (`BookSiteVisitModal.jsx`):** Select property, date, time slot, and contact details to request a private tour.
6. **WhatsApp Private Concierge Drawer (`WhatsAppPanel.jsx`):** Direct instant messaging integration with specific consultants.
7. **Mortgage & Financial EMI Calculator (`InteractiveWidgets.jsx`):** Interactive loan repayment calculator with down payment sliders.
8. **Interactive High-Res Lightbox Gallery (`LuxuryGallery.jsx`):** Full-screen image viewing with keyboard arrow controls.
9. **Personalized Onboarding Wizard (`OnboardingPreferencesPage.jsx`):** Customizes property recommendations based on user answers.
10. **VIP Customer Dashboard (`DashboardPage.jsx`):** Overview of visits, wishlist, activity, and personal stats.
11. **Profile & Preferences Management (`ProfilePage.jsx`):** Update personal details and investment criteria.

---

## 16. Admin Features (Frontend-Ready Interfaces)

While currently populated with mock data, the frontend contains UI elements designed for Admin/Advisor workflows:
1. **Site Visit Management:** Ability to view, confirm, reschedule, or cancel site visit bookings.
2. **Consultant Roster (`consultants.js`):** Advisors with assigned phone numbers, email addresses, areas of expertise, and online availability statuses.
3. **RERA Verification & Compliance Badging:** UI displays RERA registration status, certificates, and compliance ratings per property.
4. **Property Specs & Investment Growth Ratings:** Displaying YoY growth rates (e.g. `+14.6% YoY`) and investment ratings (`AAA+`, `AA+`).

---

## 17. Complete State Management Inventory

### 17.1 AppContext (`src/context/AppContext.jsx`)

| State Property | Data Type | Default Value | Purpose |
|---|---|---|---|
| `properties` | `Array<Object>` | 12 detailed mock properties | Global catalog of luxury properties |
| `toast` | `Object` | `{ show: false, message: '' }` | Controls global toast banner visibility and text |
| `isBookModalOpen` | `Boolean` | `false` | Controls site visit modal visibility |
| `bookModalProperty`| `String` | `''` | Property title pre-filled in site visit modal |
| `isWhatsAppOpen` | `Boolean` | `false` | Controls WhatsApp drawer visibility |
| `whatsAppInitialMessage`| `String`| `''` | Pre-filled text message for WhatsApp |
| `wishlist` | `Array<Object>` | From `localStorage("imperia_wishlist")` | Saved user properties |
| `compareList` | `Array<Object>` | From `localStorage("imperia_compare")` | Properties in compare matrix (max 4) |
| `recentlyViewed` | `Array<Object>` | From `localStorage("imperia_recent")` | Browsing history (max 8) |
| `currentUser` | `Object \| null` | From `localStorage("imperia_user")` | Active logged-in user profile |
| `siteVisits` | `Array<Object>` | From `localStorage("imperia_site_visits")` | Booked site visits list |

---

## 18. Dummy Data Audit & Database Schema Mapping

The frontend currently uses static mock datasets in `AppContext.jsx` and `consultants.js`. The table below defines how this data must map to relational database tables in the future backend.

### 18.1 Database Table: `properties`
```sql
CREATE TABLE properties (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tag VARCHAR(50),
    price_display VARCHAR(50) NOT NULL, -- e.g. "₹14.5 Cr"
    numeric_price BIGINT NOT NULL,      -- e.g. 145000000
    location VARCHAR(255) NOT NULL,     -- e.g. "OMR, Chennai"
    city VARCHAR(100) NOT NULL,         -- e.g. "Chennai"
    type VARCHAR(50) NOT NULL,          -- "Apartment", "Villa", "Penthouse", "Plot", "Office"
    beds INT DEFAULT 0,
    baths INT DEFAULT 0,
    area_display VARCHAR(50) NOT NULL,  -- e.g. "4,500 sq.ft."
    numeric_area INT NOT NULL,          -- e.g. 4500
    price_per_sqft VARCHAR(50),
    image_url TEXT NOT NULL,
    gallery_urls JSONB,
    amenities JSONB,                    -- ["Infinity Pool", "24/7 Concierge"]
    rera_approved BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) NOT NULL,        -- "Ready to Move", "Under Construction"
    purpose VARCHAR(20) NOT NULL,       -- "Buy", "Rent"
    builder VARCHAR(100),
    rating NUMERIC(3,2) DEFAULT 4.90,
    growth_rate VARCHAR(20),            -- "+12.4% YoY"
    investment_rating VARCHAR(10),      -- "AAA+"
    description TEXT,
    specs JSONB,                        -- {"Year Built": "2025", "Floor": "32nd"}
    pros JSONB,                         -- ["Branded services", "Sea view"]
    cons JSONB,                         -- ["High maintenance fee"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 18.2 Database Table: `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    purpose VARCHAR(20) DEFAULT 'Buy',
    preferred_types JSONB,
    budget_range VARCHAR(50),
    target_locations JSONB,
    role VARCHAR(20) DEFAULT 'customer', -- 'customer', 'admin', 'consultant'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 18.3 Database Table: `site_visits`
```sql
CREATE TABLE site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE CASCADE,
    property_name VARCHAR(255) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(30) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(20) NOT NULL,
    consultant_name VARCHAR(150) DEFAULT 'Vikram Malhotra',
    status VARCHAR(30) DEFAULT 'Confirmed', -- 'Confirmed', 'Pending', 'Cancelled', 'Completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 19. Expected Backend REST API Specifications

### 19.1 Authentication Endpoints
* `POST /api/v1/auth/register`
  - **Body:** `{ name, email, phone, password }`
  - **Response (201):** `{ token: "JWT...", user: { id, name, email, phone } }`
* `POST /api/v1/auth/login`
  - **Body:** `{ email, password }`
  - **Response (200):** `{ token: "JWT...", user: { id, name, email, role } }`
* `POST /api/v1/auth/logout`
  - **Headers:** `Authorization: Bearer <token>`
  - **Response (200):** `{ message: "Logged out successfully" }`

### 19.2 Property Endpoints
* `GET /api/v1/properties`
  - **Query Params:** `purpose`, `city`, `type`, `minPrice`, `maxPrice`, `beds`, `baths`, `status`, `amenities`, `sort`, `page`, `limit`
  - **Response (200):** `{ total: 12, page: 1, properties: [...] }`
* `GET /api/v1/properties/:id`
  - **Response (200):** Full property detail object with gallery, specs, pros/cons.
* `POST /api/v1/properties` *(Admin)*
  - **Body:** Property schema payload.

### 19.3 Site Visit Endpoints
* `POST /api/v1/site-visits`
  - **Body:** `{ propertyId, propertyName, name, email, phone, date, time }`
  - **Response (201):** `{ visitId, status: "Confirmed", scheduledDate, scheduledTime }`
* `GET /api/v1/site-visits/my-visits`
  - **Headers:** `Authorization: Bearer <token>`
  - **Response (200):** Array of user's booked site visits.

### 19.4 Wishlist & User Preference Endpoints
* `GET /api/v1/user/wishlist`
* `POST /api/v1/user/wishlist/toggle` -> `{ propertyId }`
* `PUT /api/v1/user/profile` -> `{ name, phone, city, state, budget, locations }`

---

## 20. File Upload Specifications

Although asset management currently uses Unsplash URLs and local assets, the production backend will need to handle binary uploads for:

1. **User Profile Avatars (`ProfilePage.jsx`):**
   - File Types: `image/jpeg`, `image/png`, `image/webp`
   - Max Size: `5 MB`
   - Target Endpoint: `POST /api/v1/user/avatar`
2. **Property Gallery & Floor Plans (Admin Property Creation):**
   - File Types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`
   - Max Size: `15 MB` per image
   - Target Endpoint: `POST /api/v1/admin/properties/media`
3. **Property E-Brochure PDFs (`PropertyDetails.jsx`):**
   - File Types: `application/pdf`
   - Max Size: `25 MB`
   - Target Endpoint: `POST /api/v1/admin/properties/brochure`

---

## 21. Complete UI Navigation Hierarchy

```
[ Root Header: Navbar ]
   ├── Home ( / )
   ├── Buy ( /buy )
   ├── Rent ( /rent )
   ├── Projects ( /projects )
   ├── Collections Mega Menu
   │     ├── Premium Plots ( /premium-plots )
   │     ├── Architectural Villas ( /architectural-villas )
   │     └── Sky Apartments ( /sky-apartments )
   ├── Services Mega Menu
   │     ├── Services Suite ( /services )
   │     ├── Legal Verification ( /services/legal-verification )
   │     ├── Home Financing ( /services/home-financing )
   │     └── Interior Design ( /services/interior-design )
   ├── Search Overlay ( Triggered via Search Icon )
   ├── Account Dropdown
   │     ├── Dashboard ( /dashboard )
   │     ├── Profile & Preferences ( /profile )
   │     ├── Wishlist ( /wishlist )
   │     ├── Compare Properties ( /compare )
   │     └── Login / Signup ( /login , /signup )
   └── CTA: Book Site Visit ( Modal Trigger )
```

---

## 22. Data Flow Architecture

```
[ AppProvider (AppContext.jsx) ]
   │
   ├── Holds Global State: properties, wishlist, compareList, currentUser, siteVisits
   ├── Exposes Action Handlers: addToWishlist, addToCompare, loginUser, addSiteVisit, showToast
   │
   ▼
[ AppContent (App.jsx) ]
   │
   ├── Reads toast & modal state to render <Toast /> and <BookSiteVisitModal />
   │
   ▼
[ AppRoutes (Pages) ]
   │
   ├── Buy.jsx / Rent.jsx ──► Reads `properties` ──► Applies filters ──► Renders PropertyCards
   ├── PropertyDetails.jsx ──► Finds property by `id` ──► Triggers `openBookModal(title)`
   ├── Wishlist.jsx / Compare.jsx ──► Reads `wishlist` / `compareList` ──► Renders Grid/Matrix
   └── DashboardPage.jsx ──► Reads `currentUser` & `siteVisits` ──► Renders User VIP Dashboard
```

---

## 23. Backend System Requirements Summary

To support this frontend seamlessly, the backend must provide:

1. **Authentication & Authorization Service:**
   - JWT-based authentication (Access Tokens + Refresh Tokens in HTTP-only cookies).
   - Role-Based Access Control (`RBAC`) supporting `customer`, `advisor`, and `admin` roles.
2. **Relational Database (PostgreSQL / MySQL):**
   - Full support for JSONB / JSON fields for dynamic property specs, amenities, pros/cons, and user preferences.
   - Text search indexes (`pg_trgm` or full-text search) for property title and location queries.
3. **Media & Document Storage:**
   - Cloud storage integration (AWS S3 / Cloudinary) for property images, floor plans, avatars, and PDF brochures.
4. **Transactional Email & SMS Service:**
   - Email triggers (SendGrid / AWS SES) for site visit confirmations, account registration, and password resets.
   - SMS/WhatsApp API integration (Twilio) for instant appointment reminders.

---

## 24. Missing Backend Dependencies Inventory

| Frontend Feature | Current Implementation | Missing Backend Dependency |
|---|---|---|
| User Authentication | `localStorage` mock state (`imperia_user`) | Real JWT auth endpoints (`POST /api/v1/auth/login`, `register`) |
| Site Visit Booking | Adds object to React state & `localStorage` | Database insertion endpoint (`POST /api/v1/site-visits`) + Email notification service |
| Wishlist & Compare | Client `localStorage` arrays | Persistent database user tables (`wishlists`, `comparisons`) |
| Search & Filters | In-memory JavaScript `.filter()` array methods | Server-side database querying (`SELECT * FROM properties WHERE ...`) |
| Profile & Preferences | Context state mutation | Persistence API (`PUT /api/v1/user/profile`) |
| E-Brochure Download | Toast message placeholder | Static PDF generation / file hosting service |
| Contact Form | Simulated timeout & Toast message | Contact form handler & CRM integration (`POST /api/v1/contact`) |

---

## 25. Final Technical Summary

The **IMPERIA — Luxury Estates** frontend is a production-grade, highly sophisticated single-page web application built with **React 19**, **Vite**, **Framer Motion**, and **Tailwind CSS v4**.

It features a modular component architecture, robust context-driven state management, responsive layouts, rich interactive widgets (EMI calculators, image galleries, filter drawers), and a luxury design system with custom design tokens (`#F4F1EA`, `#1A1A1A`, `#F5A623`, `#8A8A85`, `#E8E4DA`, `--color-text-on-image-secondary`).

All user actions, form inputs, filter states, and component contracts are explicitly documented in this specification (`FRONTEND_ANALYSIS.md`), enabling backend engineers and AI systems to construct an exact, production-ready backend API and database architecture without ambiguity.
