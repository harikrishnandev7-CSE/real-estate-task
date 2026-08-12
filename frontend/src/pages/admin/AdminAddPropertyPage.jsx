import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Plus, 
  X, 
  Upload, 
  ShieldCheck, 
  Building, 
  MapPin, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Eye,
  Film
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdminLayout } from '../../layouts/AdminLayout';
import { 
  FormLabel, 
  FormError, 
  TextInput, 
  SelectInput, 
  TextAreaInput, 
  SegmentedControl, 
  ToggleSwitch, 
  MultiSelectChips, 
  ImageDropzone 
} from '../../components/admin/primitives/FormField';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import PropertyVideoUploader from '../../components/admin/PropertyVideoUploader';
import PropertyVideoPlayer from '../../components/common/PropertyVideoPlayer';
import { formatPricePreview } from '../../utils/formatters';

const STEPS = [
  { id: 1, label: 'Basics', number: '01' },
  { id: 2, label: 'Pricing & Specs', number: '02' },
  { id: 3, label: 'Media Uploads', number: '03' },
  { id: 4, label: 'Amenities & Copy', number: '04' },
  { id: 5, label: 'Compliance & Publish', number: '05' }
];

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Penthouse', 'Plot', 'Office', 'Commercial', 'Co-working'];
const PURPOSES = ['Buy', 'Rent'];
const CITIES = ['Chennai', 'Coimbatore', 'Hyderabad', 'Bengaluru'];
const TAGS = ['Signature', 'New Launch', 'Exclusive', 'DTCP Approved', 'Premium Office', 'Luxury Villa'];
const AMENITY_OPTIONS = [
  'Infinity Pool', 'Private Gym', '24/7 Concierge', 'Home Automation', 'Sea View',
  'Private Cinema', 'Private Garden', 'Wine Cellar', 'Helipad', 'Fibre Internet',
  'Conference Room', 'Valet Parking', 'DTCP Approved', 'Power Backup'
];

const AdminAddPropertyPage = () => {
  const navigate = useNavigate();
  const { addProperty, showToast } = useApp();
  const { collapsed } = useAdminLayout();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Villa',
    purpose: 'Buy',
    tag: 'Signature',
    builder: 'IMPERIA Developers',
    city: 'Chennai',
    location: '',
    price: '',
    numericPrice: 0,
    pricePerSqft: '',
    area: '',
    areaUnit: 'sq.ft.',
    beds: 3,
    baths: 4,
    furnished: 'Fully Furnished',
    yearBuilt: '2025',
    floor: '2nd Floor',
    roadWidth: '40 ft Road',
    facing: 'East Facing',
    approval: 'DTCP Approved',
    frontage: '60 ft',
    dimensions: '40 x 60 ft',
    yieldRate: '8.5%',
    image: '',
    videoUrl: '',
    videoFile: null,
    gallery: [],
    brochureUrl: '',
    desc: '',
    amenities: ['Infinity Pool', '24/7 Concierge'],
    pros: ['Prime luxury connectivity', 'High appreciation potential'],
    cons: ['Limited available units'],
    rera: true,
    reraNumber: 'TN/01/Building/0142/2025',
    status: 'Ready to Move',
    registrationStatus: 'Clear Title & DTCP Approved',
    images: {
      entrance: '',
      hall: [],
      kitchen: [],
      bedrooms: [],
      bathrooms: [],
      terrace: []
    }
  });

  const [newProText, setNewProText] = useState('');
  const [newConText, setNewConText] = useState('');

  // Validation Error State
  const [errors, setErrors] = useState({});
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Format price preview string using shared utility
  const formattedPricePreview = useMemo(() => {
    return formatPricePreview(formData.numericPrice, formData.purpose);
  }, [formData.numericPrice, formData.purpose]);

  // Update Field Handler
  const updateField = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const updateImageCategory = (category, files) => {
    setFormData(prev => ({
      ...prev,
      images: {
        ...(prev.images || {}),
        [category]: files
      }
    }));
    if (errors[category]) {
      setErrors(prev => ({ ...prev, [category]: null }));
    }
  };

  // Add Pro / Con Chips
  const addPro = () => {
    if (!newProText.trim()) return;
    setFormData(prev => ({ ...prev, pros: [...prev.pros, newProText.trim()] }));
    setNewProText('');
  };

  const removePro = (idx) => {
    setFormData(prev => ({ ...prev, pros: prev.pros.filter((_, i) => i !== idx) }));
  };

  // Helper to count total uploaded images
  const getTotalUploadedImagesCount = (imagesObj) => {
    if (!imagesObj || typeof imagesObj !== 'object') return 0;
    let count = 0;
    if (imagesObj.entrance) count += 1;

    ['hall', 'kitchen', 'terrace'].forEach(cat => {
      const list = imagesObj[cat];
      if (Array.isArray(list)) count += list.length;
    });

    ['bedrooms', 'bathrooms'].forEach(cat => {
      const list = imagesObj[cat];
      if (Array.isArray(list)) {
        count += list.length;
      } else if (list && typeof list === 'object') {
        Object.values(list).forEach(subList => {
          if (Array.isArray(subList)) count += subList.length;
        });
      }
    });

    return count;
  };

  // Scroll to first error element
  const scrollToFirstError = (errs) => {
    if (!errs || Object.keys(errs).length === 0) return;

    setTimeout(() => {
      const firstKey = Object.keys(errs)[0];
      const errorEl = 
        document.querySelector(`[name="${firstKey}"]`) ||
        document.querySelector(`#dropzone-${firstKey}`) ||
        document.querySelector(`[data-field="${firstKey}"]`) ||
        document.querySelector(`.border-red-500`) ||
        document.querySelector(`.text-red-500`);

      if (errorEl) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof errorEl.focus === 'function') {
          errorEl.focus();
        }
      } else {
        window.scrollTo({ top: 150, behavior: 'smooth' });
      }
    }, 120);
  };

  // Step Validation Logic
  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.title.trim()) errs.title = 'Property title is required';
      if (!formData.location.trim()) errs.location = 'Full location address is required';
    }
    if (step === 2) {
      if (!formData.numericPrice || Number(formData.numericPrice) <= 0) errs.numericPrice = 'Price must be greater than 0';
      if (!formData.area.trim()) errs.area = 'Area value is required';
    }
    if (step === 3 || step === 5) {
      const totalImages = getTotalUploadedImagesCount(formData.images);
      const hasEntrance = Boolean(formData.images?.entrance);
      if (!hasEntrance && totalImages === 0 && !formData.image) {
        errs.entrance = 'At least 1 property image (Entrance photo recommended) is required before proceeding';
      }
    }
    if (step === 5) {
      if (formData.rera && !formData.reraNumber.trim()) errs.reraNumber = 'RERA Registration Number is required when RERA is enabled';
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      scrollToFirstError(errs);
      return false;
    }

    return true;
  };

  // Step Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handlePublish('Published');
      }
    } else {
      if (showToast) showToast("Please resolve the required fields before advancing.");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Publish / Save Draft
  const handlePublish = async (statusType = 'Published') => {
    if (statusType === 'Published' && !validateStep(5)) {
      return;
    }

    try {
      const parsedArea = parseInt(formData.area, 10) || 0;
      const parsedPrice = Number(formData.numericPrice) || parseInt(formData.price, 10) || 0;

      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('type', formData.type);
      payload.append('purpose', formData.purpose);
      payload.append('tag', formData.tag || '');
      payload.append('developer', formData.developer || formData.builder || '');
      payload.append('builder', formData.developer || formData.builder || '');
      payload.append('city', formData.city || '');
      payload.append('location', formData.location || '');
      payload.append('price', formattedPricePreview);
      payload.append('numericPrice', parsedPrice);
      payload.append('area', formData.area || '');
      payload.append('numericArea', parsedArea);
      payload.append('beds', formData.beds || 0);
      payload.append('baths', formData.baths || 0);
      payload.append('status', statusType);
      payload.append('furnishing', formData.furnished === 'Fully Furnished' ? 'full' : formData.furnished === 'Semi Furnished' ? 'semi' : 'none');
      payload.append('desc', formData.desc || '');
      payload.append('amenities', JSON.stringify(formData.amenities || []));
      payload.append('pros', JSON.stringify(formData.pros || []));
      payload.append('cons', JSON.stringify(formData.cons || []));

      // Video File or Video URL
      if (formData.videoFile) {
        payload.append('video', formData.videoFile);
      } else if (formData.videoUrl) {
        payload.append('videoUrl', formData.videoUrl);
      }

      // Entrance file or URL
      if (formData.images?.entrance) {
        if (formData.images.entrance instanceof File) {
          payload.append('entrance', formData.images.entrance);
        } else if (typeof formData.images.entrance === 'string') {
          payload.append('entranceUrl', formData.images.entrance);
        }
      }

      // Structured categories (hall, kitchen, bedrooms, bathrooms, terrace)
      const categories = ['hall', 'kitchen', 'bedrooms', 'bathrooms', 'terrace'];
      const stringifiedUrls = {};

      categories.forEach(cat => {
        const rawData = formData.images?.[cat] || [];
        let items = [];
        if (Array.isArray(rawData)) {
          items = rawData;
        } else if (rawData && typeof rawData === 'object') {
          items = Object.values(rawData).flat();
        }

        const existingUrls = [];
        items.forEach(item => {
          if (item instanceof File) {
            payload.append(cat, item);
          } else if (typeof item === 'string' && item.trim()) {
            existingUrls.push(item);
          }
        });
        stringifiedUrls[cat] = existingUrls;
      });

      stringifiedUrls.entrance = typeof formData.images?.entrance === 'string' ? formData.images.entrance : null;
      payload.append('images', JSON.stringify(stringifiedUrls));

      const newRecord = await addProperty(payload);
      setShowSuccessModal(true);
    } catch (err) {
      if (showToast) showToast(`Creation failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen font-sans pb-32 bg-[#F8F6F2] text-[#0B0B0B]">
      
      {/* ── CENTERED CONTAINER ────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ── 1. PAGE HEADER BAR ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-extrabold text-[#6B6B6B]">
              <Link to="/admin/properties" className="hover:text-[#C6A66B] transition-colors">
                Properties
              </Link>
              <span>/</span>
              <span className="text-[#C6A66B]">Create New Listing</span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold text-[#0B0B0B] tracking-tight mt-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Add Luxury Property Listing
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowDiscardModal(true)}
            className="px-4 py-2.5 bg-[#F8F6F2] hover:bg-[#0E0E10] text-[#0B0B0B] hover:text-[#F4F1EA] text-xs font-bold rounded-xl border border-[rgba(198,166,107,0.25)] transition-all cursor-pointer self-start sm:self-auto"
          >
            Cancel & Discard
          </button>
        </div>

        {/* ── 2. TOP HORIZONTAL STEPPER ──────────────────────────────── */}
        <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-x-auto custom-scrollbar">
          <div className="flex items-center justify-between min-w-[620px] md:min-w-0">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isLast = idx === STEPS.length - 1;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (isCompleted || validateStep(currentStep)) {
                          setCurrentStep(step.id);
                        }
                      }}
                      className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isCompleted
                          ? 'bg-[#C6A66B] text-[#0B0B0B] shadow-xs'
                          : isActive
                          ? 'bg-[#0E0E10] text-[#F4F1EA] border-2 border-[#C6A66B] shadow-md ring-4 ring-[#C6A66B]/15'
                          : 'bg-[#F8F6F2] text-[#8A8A85] border border-[rgba(22,22,26,0.15)]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold leading-none ${isActive ? 'text-[#C6A66B]' : isCompleted ? 'text-[#0B0B0B]' : 'text-[#8A8A85]'}`}>
                        Step {step.number}
                      </span>
                      <span className={`text-xs font-bold mt-0.5 whitespace-nowrap ${isActive ? 'text-[#0B0B0B]' : isCompleted ? 'text-[#0B0B0B]' : 'text-[#8A8A85]'}`}>
                        {step.label}
                      </span>
                    </div>
                  </div>

                  {!isLast && (
                    <div className={`flex-1 h-[2px] mx-3.5 rounded-full transition-colors ${
                      isCompleted ? 'bg-[#C6A66B]' : 'bg-[rgba(22,22,26,0.10)]'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── 3. STEP FORM CONTENT ────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-8 font-sans"
          >
            
            {/* ── STEP 1: BASICS ────────────────────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-8">
                
                {/* Section 1: Property Identity */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      SECTION 1
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Property Identity
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                      Enter title, building specs, and listing classification.
                    </p>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <FormLabel required>Property Title</FormLabel>
                    <TextInput
                      name="title"
                      placeholder="e.g. The ECR Beachfront Villa & Residency"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      error={errors.title}
                    />
                  </div>

                  {/* Property Type & Purpose */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel required>Property Classification</FormLabel>
                      <SelectInput
                        value={formData.type}
                        onChange={(e) => updateField('type', e.target.value)}
                        options={PROPERTY_TYPES}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel required>Listing Purpose</FormLabel>
                      <SegmentedControl
                        options={PURPOSES.map(p => ({ value: p, label: p }))}
                        value={formData.purpose}
                        onChange={(val) => updateField('purpose', val)}
                      />
                    </div>
                  </div>

                  {/* Tag & Builder */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel>Property Collection Tag</FormLabel>
                      <SelectInput
                        value={formData.tag}
                        onChange={(e) => updateField('tag', e.target.value)}
                        options={TAGS}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Developer / Builder</FormLabel>
                      <TextInput
                        placeholder="e.g. IMPERIA Developers"
                        value={formData.builder}
                        onChange={(e) => updateField('builder', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Location Details */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      SECTION 2
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Location &amp; Address
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                      Specify city, street address, and neighbourhood context.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2 sm:col-span-1">
                      <FormLabel required>Location City</FormLabel>
                      <div className="relative">
                        <input
                          type="text"
                          list="city-suggestions-add"
                          placeholder="e.g. Madurai, Chennai, Coimbatore..."
                          value={formData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          className="w-full bg-[#F8F6F2] border border-[rgba(198,166,107,0.35)] focus:border-[#C6A66B] focus:ring-2 focus:ring-[#C6A66B]/30 rounded-xl px-4 py-3.5 text-sm text-[#0B0B0B] font-bold outline-none transition-all shadow-xs"
                        />
                        <datalist id="city-suggestions-add">
                          {['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Bengaluru', 'Hyderabad', 'Ooty', 'Salem', 'Tirunelveli', 'Pondicherry', 'Kochi', 'Mumbai'].map(c => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <FormLabel required>Full Location Address String</FormLabel>
                      <TextInput
                        name="location"
                        placeholder="e.g. East Coast Road, Neelankarai, Chennai"
                        value={formData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        error={errors.location}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ── STEP 2: PRICING & SPECS ──────────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-8">
                
                {/* Section 1: Valuation */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      SECTION 1
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Financial Valuation &amp; Pricing
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                      Define numerical asking price, price/sqft, and rental yield.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel required>Asking Price (in ₹ numeric INR)</FormLabel>
                      <TextInput
                        name="numericPrice"
                        type="number"
                        placeholder="45000000"
                        value={formData.numericPrice || ''}
                        onChange={(e) => updateField('numericPrice', e.target.value)}
                        error={errors.numericPrice}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Formatted Live Price Preview</FormLabel>
                      <div className="p-3.5 bg-[#F8F6F2] border border-[rgba(198,166,107,0.25)] rounded-xl font-extrabold text-[#0B0B0B] text-base">
                        {formattedPricePreview || '₹ 0'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel>Price / sq.ft. (Optional)</FormLabel>
                      <TextInput
                        placeholder="e.g. ₹12,500 / sq.ft."
                        value={formData.pricePerSqft}
                        onChange={(e) => updateField('pricePerSqft', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Expected Rental Yield Rate</FormLabel>
                      <TextInput
                        placeholder="e.g. 8.5%"
                        value={formData.yieldRate}
                        onChange={(e) => updateField('yieldRate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Floorplan Specs */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      SECTION 2
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Physical Dimensions &amp; Layout
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                      Configure carpet area, room count, and orientational specs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <FormLabel required>Carpet / Built-up Area</FormLabel>
                      <TextInput
                        name="area"
                        placeholder="e.g. 4500"
                        value={formData.area}
                        onChange={(e) => updateField('area', e.target.value)}
                        error={errors.area}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Area Unit</FormLabel>
                      <SelectInput
                        value={formData.areaUnit}
                        onChange={(e) => updateField('areaUnit', e.target.value)}
                        options={['sq.ft.', 'sq.yd.', 'acres', 'grounds']}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Facing Direction</FormLabel>
                      <SelectInput
                        value={formData.facing}
                        onChange={(e) => updateField('facing', e.target.value)}
                        options={['East Facing', 'North Facing', 'South Facing', 'West Facing', 'North-East Facing']}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <FormLabel>Bedrooms (BHK)</FormLabel>
                      <SelectInput
                        value={formData.beds}
                        onChange={(e) => updateField('beds', Number(e.target.value))}
                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Bathrooms</FormLabel>
                      <SelectInput
                        value={formData.baths}
                        onChange={(e) => updateField('baths', Number(e.target.value))}
                        options={[1, 2, 3, 4, 5, 6, 7, 8]}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Furnishing State</FormLabel>
                      <SelectInput
                        value={formData.furnished}
                        onChange={(e) => updateField('furnished', e.target.value)}
                        options={['Fully Furnished', 'Semi Furnished', 'Unfurnished']}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <FormLabel>Year Built</FormLabel>
                      <TextInput
                        placeholder="2025"
                        value={formData.yearBuilt}
                        onChange={(e) => updateField('yearBuilt', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Floor Level</FormLabel>
                      <TextInput
                        placeholder="e.g. 2nd Floor (G+3)"
                        value={formData.floor}
                        onChange={(e) => updateField('floor', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Road Width</FormLabel>
                      <TextInput
                        placeholder="e.g. 40 ft Road"
                        value={formData.roadWidth}
                        onChange={(e) => updateField('roadWidth', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ── STEP 3: MEDIA UPLOADS (PHOTOGRAPHY + VIDEO TOUR) ───── */}
            {currentStep === 3 && (
              <div className="space-y-8">
                
                {/* Dedicated Property Video Tour Upload Section */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      CINEMATIC WALKTHROUGH
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Property Video Tour
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                      Upload high-definition property video walkthrough (stored &amp; optimized on Cloudinary CDN).
                    </p>
                  </div>

                  <PropertyVideoUploader
                    videoUrl={formData.videoUrl || (typeof formData.images?.video === 'string' ? formData.images.video : '')}
                    videoFile={formData.videoFile}
                    onChange={({ url, file }) => {
                      updateField('videoUrl', url);
                      if (file) updateField('videoFile', file);
                    }}
                  />
                </div>

                {/* Hero Entrance Image */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      PRIMARY HERO IMAGE
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Entrance &amp; Façade Photography
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                      High-resolution primary image displayed on listing cards and search previews.
                    </p>
                  </div>

                  <div id="dropzone-entrance">
                    <FormLabel required>Entrance Photo Upload</FormLabel>
                    <ImageDropzone
                      value={formData.images?.entrance}
                      onChange={(val) => updateImageCategory('entrance', Array.isArray(val) ? val[0] || '' : val)}
                      maxFiles={1}
                      multiple={false}
                    />
                    {errors.entrance && <FormError message={errors.entrance} />}
                  </div>
                </div>

                {/* Living & Dining Gallery */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      INTERIOR GALLERY
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Hall, Living Room &amp; Kitchen Photos
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <FormLabel>Grand Living Hall Photos</FormLabel>
                      <ImageDropzone
                        value={formData.images?.hall}
                        onChange={(files) => updateImageCategory('hall', files)}
                        multiple
                      />
                    </div>

                    <div>
                      <FormLabel>Gourmet Kitchen Photos</FormLabel>
                      <ImageDropzone
                        value={formData.images?.kitchen}
                        onChange={(files) => updateImageCategory('kitchen', files)}
                        multiple
                      />
                    </div>
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      SUITE GALLERY
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Bedrooms, Bathrooms &amp; Terrace
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <FormLabel>Master Bedrooms &amp; Guest Suites</FormLabel>
                      <ImageDropzone
                        value={formData.images?.bedrooms}
                        onChange={(files) => updateImageCategory('bedrooms', files)}
                        multiple
                      />
                    </div>

                    <div>
                      <FormLabel>Luxury En-suite Bathrooms</FormLabel>
                      <ImageDropzone
                        value={formData.images?.bathrooms}
                        onChange={(files) => updateImageCategory('bathrooms', files)}
                        multiple
                      />
                    </div>

                    <div>
                      <FormLabel>Private Terrace &amp; Rooftop</FormLabel>
                      <ImageDropzone
                        value={formData.images?.terrace}
                        onChange={(files) => updateImageCategory('terrace', files)}
                        multiple
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ── STEP 4: AMENITIES & COPY ─────────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-8">
                
                {/* Amenities Selection */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      SECTION 1
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Luxury Amenities &amp; Features
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                      Select key features and concierge services included with this estate.
                    </p>
                  </div>

                  <MultiSelectChips
                    options={AMENITY_OPTIONS}
                    selected={formData.amenities}
                    onChange={(selected) => updateField('amenities', selected)}
                  />
                </div>

                {/* Editorial Description */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      SECTION 2
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Editorial Copy &amp; Description
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Property Narrative &amp; Overview</FormLabel>
                    <TextAreaInput
                      rows={6}
                      placeholder="Write an elegant narrative describing architectural craftsmanship, view corridors, and luxury finishes..."
                      value={formData.desc}
                      onChange={(e) => updateField('desc', e.target.value)}
                    />
                  </div>

                  {/* Highlights (Pros) */}
                  <div className="space-y-3 pt-2">
                    <FormLabel>Key Luxury Highlights (Pros)</FormLabel>
                    <div className="flex gap-2">
                      <TextInput
                        placeholder="Add highlight (e.g. Private infinity pool overlooking ocean)"
                        value={newProText}
                        onChange={(e) => setNewProText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                      />
                      <button
                        type="button"
                        onClick={addPro}
                        className="px-4 py-3 bg-[#0E0E10] text-[#F4F1EA] hover:bg-[#C6A66B] hover:text-[#0B0B0B] text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.pros.map((pro, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-[#0B0B0B] border border-amber-200">
                          <span>{pro}</span>
                          <button type="button" onClick={() => removePro(idx)} className="hover:text-red-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ── STEP 5: COMPLIANCE & PUBLISH ──────────────────────── */}
            {currentStep === 5 && (
              <div className="space-y-8">
                
                {/* Legal Compliance */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      SECTION 1
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Legal Compliance &amp; Regulatory Approval
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
                      Configure RERA registration status and title clearance certifications.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[#0B0B0B]">RERA Registered Project</p>
                      <p className="text-[11px] text-[#6B6B6B]">Toggle ON if this listing has an official RERA registration number</p>
                    </div>
                    <ToggleSwitch
                      checked={formData.rera}
                      onChange={(checked) => updateField('rera', checked)}
                    />
                  </div>

                  {formData.rera && (
                    <div className="space-y-2">
                      <FormLabel required>RERA Registration Number</FormLabel>
                      <TextInput
                        name="reraNumber"
                        placeholder="TN/01/Building/0142/2025"
                        value={formData.reraNumber}
                        onChange={(e) => updateField('reraNumber', e.target.value)}
                        error={errors.reraNumber}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel>Construction / Readiness Status</FormLabel>
                      <SelectInput
                        value={formData.status}
                        onChange={(e) => updateField('status', e.target.value)}
                        options={['Ready to Move', 'Under Construction', 'New Launch']}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Title Registration Clearance</FormLabel>
                      <TextInput
                        value={formData.registrationStatus}
                        onChange={(e) => updateField('registrationStatus', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Storefront Live-Preview Card & Video Preview */}
                <div className="bg-white border border-[rgba(198,166,107,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-extrabold block">
                      CLIENT STOREFRONT PREVIEW
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B0B0B] tracking-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Storefront Listing Review
                    </h3>
                  </div>

                  <div className="bg-[#F8F6F2] p-5 rounded-2xl border border-[rgba(198,166,107,0.20)] space-y-5 font-sans">
                    <div className="flex flex-col sm:flex-row gap-5 items-center">
                      <div className="w-full sm:w-44 h-32 rounded-xl bg-[#0E0E10] overflow-hidden shrink-0 flex items-center justify-center border border-[rgba(198,166,107,0.25)]">
                        {formData.images?.entrance ? (
                          <img
                            src={typeof formData.images.entrance === 'string' ? formData.images.entrance : URL.createObjectURL(formData.images.entrance)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building className="w-8 h-8 text-[#C6A66B]" />
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0E0E10] text-[#F4F1EA] border border-[#C6A66B]">
                            {formData.type}
                          </span>
                          <StatusChip status={formData.status} />
                        </div>
                        <h4
                          className="text-lg font-bold text-[#0B0B0B] truncate"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {formData.title || 'Untitled Luxury Estate'}
                        </h4>
                        <p className="text-xs text-[#6B6B6B] flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#C6A66B]" />
                          <span>{formData.location || 'Location pending'}</span>
                        </p>
                        <div className="text-lg font-extrabold text-[#C6A66B] pt-0.5">
                          {formattedPricePreview}
                        </div>
                      </div>
                    </div>

                    {/* Show Video Tour Preview if attached */}
                    {formData.videoUrl && (
                      <div className="pt-2 border-t border-[rgba(198,166,107,0.20)]">
                        <p className="text-xs font-bold text-[#0B0B0B] mb-2 flex items-center gap-1.5">
                          <Film className="w-4 h-4 text-[#C6A66B]" />
                          <span>Attached Video Walkthrough Preview</span>
                        </p>
                        <PropertyVideoPlayer videoUrl={formData.videoUrl} title={formData.title} />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* ── 4. PART 11: REDESIGNED LIGHT LUXURY STICKY FOOTER CTA ────── */}
      <div className={`fixed bottom-0 left-0 ${collapsed ? 'md:left-20' : 'md:left-64'} right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8E4DA] py-4 px-6 md:px-12 flex items-center justify-between font-sans shadow-[0_-10px_25px_rgba(0,0,0,0.05)] transition-all duration-300`}>
        {/* Left: Minimal Text Back Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="text-xs font-bold text-[#6B6B6B] hover:text-[#0B0B0B] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 py-2 px-1"
        >
          <ArrowLeft className="w-4 h-4 text-[#C6A66B]" />
          <span>Back</span>
        </button>

        {/* Center: Auto Saved Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#6B6B6B]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Auto Saved • All changes saved</span>
        </div>

        {/* Right: Save Draft Outline & Continue Gold CTAs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handlePublish('Draft')}
            className="px-5 py-2.5 rounded-xl border border-[rgba(22,22,26,0.18)] bg-transparent text-[#0B0B0B] hover:bg-[#F8F6F2] text-xs font-bold transition-all cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 bg-[#C6A66B] hover:bg-[#0E0E10] text-[#0B0B0B] hover:text-[#F4F1EA] border border-[#C6A66B]"
          >
            <span>{currentStep === 5 ? 'Publish Listing Now' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4 text-[#0B0B0B] group-hover:text-[#F4F1EA]" />
          </button>
        </div>
      </div>

      {/* ── MODALS: DISCARD CONFIRMATION & SUCCESS ─────────────────── */}
      <AdminModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        title="Discard Unsaved Listing?"
        subtitle="Are you sure you want to cancel? All form entries entered in this wizard session will be lost."
        size="sm"
        confirmText="Discard & Exit"
        onConfirm={() => navigate('/admin/properties')}
      >
        <p className="text-xs text-[#6B6B6B] font-medium">You can also save your progress as a Draft before exiting.</p>
      </AdminModal>

      <AdminModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/admin/properties');
        }}
        title="Property Published Successfully!"
        subtitle="Your new luxury estate listing is now active and synchronized across discovery catalogs."
        size="sm"
      >
        <div className="text-center py-4 space-y-4 font-sans">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-300 text-[#C6A66B] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>
          <p className="text-xs text-[#6B6B6B] font-medium">
            The property will be highlighted at the top of the admin catalog with a <span className="font-bold text-[#0B0B0B]">"Just published"</span> badge.
          </p>
          <button
            type="button"
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/admin/properties');
            }}
            className="w-full py-3.5 bg-[#0E0E10] hover:bg-[#C6A66B] text-[#F4F1EA] hover:text-[#0B0B0B] text-xs font-extrabold uppercase rounded-xl border border-[#C6A66B] shadow-md transition-all"
          >
            Go to Properties Catalog
          </button>
        </div>
      </AdminModal>

    </div>
  );
};

export default AdminAddPropertyPage;
