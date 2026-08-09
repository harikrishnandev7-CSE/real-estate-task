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
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
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
import { formatPricePreview } from '../../utils/formatters';

const STEPS = [
  { id: 1, label: 'Basics', number: '01' },
  { id: 2, label: 'Pricing & Specs', number: '02' },
  { id: 3, label: 'Media', number: '03' },
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
  const [createdPropId, setCreatedPropId] = useState(null);

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

  const updateBedroomImages = (bedNum, files) => {
    setFormData(prev => {
      const currentBedObj = (typeof prev.images?.bedrooms === 'object' && !Array.isArray(prev.images?.bedrooms))
        ? prev.images.bedrooms
        : {};
      return {
        ...prev,
        images: {
          ...(prev.images || {}),
          bedrooms: {
            ...currentBedObj,
            [bedNum]: files
          }
        }
      };
    });
  };

  const updateBathroomImages = (bathNum, files) => {
    setFormData(prev => {
      const currentBathObj = (typeof prev.images?.bathrooms === 'object' && !Array.isArray(prev.images?.bathrooms))
        ? prev.images.bathrooms
        : {};
      return {
        ...prev,
        images: {
          ...(prev.images || {}),
          bathrooms: {
            ...currentBathObj,
            [bathNum]: files
          }
        }
      };
    });
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

  const addCon = () => {
    if (!newConText.trim()) return;
    setFormData(prev => ({ ...prev, cons: [...prev.cons, newConText.trim()] }));
    setNewConText('');
  };

  const removeCon = (idx) => {
    setFormData(prev => ({ ...prev, cons: prev.cons.filter((_, i) => i !== idx) }));
  };

  // Helper to count total uploaded images across all categories
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

  // Scroll to first invalid/error field automatically
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

  // Check if step has errors (for red dot on step indicator)
  const stepHasError = (stepNum) => {
    if (stepNum === 1 && (errors.title || errors.location)) return true;
    if (stepNum === 2 && (errors.numericPrice || errors.area)) return true;
    if (stepNum === 3 && (errors.entrance || errors.image)) return true;
    if (stepNum === 5 && (errors.entrance || errors.image || errors.reraNumber)) return true;
    return false;
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
      showToast("Please resolve the required fields before advancing.");
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
      payload.append('builder', formData.builder || '');
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

      // 1. Entrance file or URL
      if (formData.images?.entrance) {
        if (formData.images.entrance instanceof File) {
          payload.append('entrance', formData.images.entrance);
        } else if (typeof formData.images.entrance === 'string') {
          payload.append('entranceUrl', formData.images.entrance);
        }
      }

      // 2. Structured categories (hall, kitchen, bedrooms, bathrooms, terrace)
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
      setCreatedPropId(newRecord?.id || newRecord?._id || 'prop-1');
      setShowSuccessModal(true);
    } catch (err) {
      if (showToast) showToast(`Creation failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-8 font-sans pb-24">
      
      {/* ── HEADER BANNER ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/properties" className="text-xs font-bold text-[#8A8A85] hover:text-[#1A1A1A]">
              Properties
            </Link>
            <span className="text-[#8A8A85] text-xs">/</span>
            <span className="text-xs font-bold text-[#F5A623]">New Listing</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
            Add Luxury Property Listing
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowDiscardModal(true)}
          className="px-4 py-2 bg-[#F4F1EA] hover:bg-stone-200 text-[#1A1A1A] text-xs font-bold rounded-full transition-colors cursor-pointer self-start sm:self-auto"
        >
          Cancel & Discard
        </button>
      </div>

      {/* ── MAIN CONTENT: STEP INDICATOR + STEP FORM ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side 1 Col: Amber Numeral Vertical Step Indicator */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] h-fit space-y-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A8A85] font-extrabold block border-b border-[#E8E4DA] pb-3">
            WIZARD PROGRESS
          </span>

          <div className="space-y-4">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const hasError = stepHasError(step.id);

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (isCompleted || validateStep(currentStep)) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-[#F4F1EA] text-[#1A1A1A] hover:bg-stone-200'
                      : 'text-[#8A8A85] hover:text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-extrabold font-mono tracking-wider ${
                        isActive ? 'text-[#F5A623]' : isCompleted ? 'text-[#1A1A1A]' : 'text-[#8A8A85]'
                      }`}
                    >
                      {step.number}
                    </span>
                    <span className="text-xs font-extrabold">{step.label}</span>
                  </div>

                  {hasError ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" title="Step has missing required fields" />
                  ) : isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side 3 Cols: Active Step Form Container */}
        <div className="lg:col-span-3 bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.04)] space-y-6">
          
          <AnimatePresence mode="wait">
            {/* ── STEP 1: BASICS ─────────────────────────────────── */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E8E4DA] pb-4">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Step 01 — Property Basics</h3>
                  <p className="text-xs text-[#8A8A85] mt-0.5">Define core property identification, category, and location credentials.</p>
                </div>

                <TextInput
                  label="Property Title"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  error={errors.title}
                  placeholder="e.g. The ECR Beachfront Villa"
                />

                <SegmentedControl
                  label="Property Category"
                  options={PROPERTY_TYPES}
                  value={formData.type}
                  onChange={(val) => updateField('type', val)}
                />

                <div className="w-full sm:w-72">
                  <SegmentedControl
                    label="Listing Purpose"
                    options={PURPOSES}
                    value={formData.purpose}
                    onChange={(val) => updateField('purpose', val)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectInput
                    label="Property Tag"
                    value={formData.tag}
                    onChange={(e) => updateField('tag', e.target.value)}
                    options={TAGS}
                  />

                  <TextInput
                    label="Developer / Builder"
                    value={formData.builder}
                    onChange={(e) => updateField('builder', e.target.value)}
                    placeholder="e.g. IMPERIA Developers"
                  />

                  <div className="w-full font-sans">
                    <FormLabel>Location City</FormLabel>
                    <input
                      type="text"
                      list="city-suggestions-add"
                      placeholder="e.g. Chennai, Coimbatore, Madurai, Trichy..."
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="w-full bg-[#F4F1EA] border border-[#E8E4DA] focus:border-[#F5A623] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8A8A85] font-medium outline-none transition-colors"
                    />
                    <datalist id="city-suggestions-add">
                      {['Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Trichy', 'Salem', 'Tirunelveli', 'Ooty', 'Pondicherry', 'Kochi'].map(c => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <TextInput
                  label="Full Location Address String"
                  required
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  error={errors.location}
                  placeholder="e.g. East Coast Road, Neelankarai, Chennai"
                />
              </motion.div>
            )}

            {/* ── STEP 2: PRICING & SPECS (Dynamic Swapping) ──────── */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E8E4DA] pb-4">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Step 02 — Pricing & Technical Specifications</h3>
                  <p className="text-xs text-[#8A8A85] mt-0.5">
                    Field layout dynamically customized for <span className="font-bold text-[#1A1A1A]">{formData.type}</span> properties.
                  </p>
                </div>

                {/* Price Input & Live Formatted Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#F4F1EA] border border-[#E8E4DA]">
                  <TextInput
                    label="Asking Price (Numeric ₹)"
                    required
                    type="number"
                    value={formData.numericPrice || ''}
                    onChange={(e) => updateField('numericPrice', e.target.value)}
                    error={errors.numericPrice}
                    placeholder="e.g. 145000000"
                  />

                  <div className="flex flex-col justify-center space-y-1 font-sans">
                    <span className="text-[10px] uppercase font-bold text-[#8A8A85]">Formatted Price Preview</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-[#F5A623] tracking-tight">
                      {formattedPricePreview}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-end gap-3">
                    <TextInput
                      label="Built-up / Land Area"
                      required
                      value={formData.area}
                      onChange={(e) => updateField('area', e.target.value)}
                      error={errors.area}
                      placeholder="e.g. 4,500"
                    />
                    <div className="w-32 shrink-0 pb-0.5">
                      <SegmentedControl
                        options={['sq.ft.', 'Acres']}
                        value={formData.areaUnit}
                        onChange={(val) => updateField('areaUnit', val)}
                      />
                    </div>
                  </div>

                  <TextInput
                    label="Price per Sq.Ft (Optional ₹)"
                    value={formData.pricePerSqft}
                    onChange={(e) => updateField('pricePerSqft', e.target.value)}
                    placeholder="e.g. 32,220"
                  />
                </div>

                {/* DYNAMIC FIELD SWAPPING BASED ON TYPE */}
                <div className="pt-4 border-t border-[#E8E4DA] space-y-6">
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-extrabold block">
                    {formData.type.toUpperCase()} SPECIFIC ATTRIBUTES
                  </span>

                  {['Villa', 'Apartment', 'Penthouse'].includes(formData.type) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <TextInput
                        label="Bedrooms (BHK)"
                        type="number"
                        value={formData.beds}
                        onChange={(e) => updateField('beds', Number(e.target.value))}
                      />
                      <TextInput
                        label="Bathrooms"
                        type="number"
                        value={formData.baths}
                        onChange={(e) => updateField('baths', Number(e.target.value))}
                      />
                      <SelectInput
                        label="Furnishing Status"
                        value={formData.furnished}
                        onChange={(e) => updateField('furnished', e.target.value)}
                        options={['Fully Furnished', 'Semi-Furnished', 'Unfurnished']}
                      />
                    </div>
                  )}

                  {formData.type === 'Plot' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <TextInput
                        label="Road Width"
                        value={formData.roadWidth}
                        onChange={(e) => updateField('roadWidth', e.target.value)}
                        placeholder="e.g. 40 ft Road"
                      />
                      <SelectInput
                        label="Facing Direction"
                        value={formData.facing}
                        onChange={(e) => updateField('facing', e.target.value)}
                        options={['East Facing', 'West Facing', 'North Facing', 'South Facing']}
                      />
                      <SelectInput
                        label="Approval Body"
                        value={formData.approval}
                        onChange={(e) => updateField('approval', e.target.value)}
                        options={['DTCP Approved', 'CMDA Approved', 'HMDA Approved']}
                      />
                    </div>
                  )}

                  {['Commercial', 'Office', 'Co-working'].includes(formData.type) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <TextInput
                        label="Floor Level"
                        value={formData.floor}
                        onChange={(e) => updateField('floor', e.target.value)}
                        placeholder="e.g. 12th Floor"
                      />
                      <TextInput
                        label="Estimated Rental Yield"
                        value={formData.yieldRate}
                        onChange={(e) => updateField('yieldRate', e.target.value)}
                        placeholder="e.g. 8.5% YoY"
                      />
                      <SelectInput
                        label="Furnishing Status"
                        value={formData.furnished}
                        onChange={(e) => updateField('furnished', e.target.value)}
                        options={['Fully Furnished', 'Bare Shell', 'Warm Shell']}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: MEDIA UPLOADS ──────────────────────────── */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E8E4DA] pb-4">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Step 03 — Structured Media & Room Assets</h3>
                  <p className="text-xs text-[#8A8A85] mt-0.5">Specify room counts below to generate exact upload dropzones for each bedroom and bathroom in order: Entrance, Hall, Kitchen, Bedrooms, Bathrooms, and Terrace.</p>
                </div>

                {/* Room Count Configuration Card */}
                <div className="p-5 bg-[#F4F1EA] border border-[#E8E4DA] rounded-2xl space-y-4 font-sans">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F5A623] block">
                    ROOM CONFIGURATION SETUP
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Number of Bedrooms (BHK Count)"
                      type="number"
                      min={1}
                      max={12}
                      value={formData.beds}
                      onChange={(e) => updateField('beds', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    />
                    <TextInput
                      label="Number of Bathrooms"
                      type="number"
                      min={1}
                      max={12}
                      value={formData.baths}
                      onChange={(e) => updateField('baths', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    />
                  </div>
                </div>

                {/* 1. Entrance Image (Single file) */}
                <div className="space-y-2">
                  <FormLabel required>1. ENTRANCE IMAGE (Single Photo)</FormLabel>
                  <ImageDropzone
                    id="dropzone-entrance"
                    images={formData.images?.entrance ? [formData.images.entrance] : []}
                    onChange={(imgs) => updateImageCategory('entrance', imgs[0] || '')}
                    maxFiles={1}
                  />
                  {errors.entrance && <FormError message={errors.entrance} />}
                </div>

                {/* 2. Hall Images (Multiple files) */}
                <div className="space-y-2">
                  <FormLabel>2. HALL IMAGES (LIVING ROOM)</FormLabel>
                  <ImageDropzone
                    id="dropzone-hall"
                    images={formData.images?.hall || []}
                    onChange={(imgs) => updateImageCategory('hall', imgs)}
                    maxFiles={10}
                  />
                </div>

                {/* 3. Kitchen Images (Multiple files) */}
                <div className="space-y-2">
                  <FormLabel>3. KITCHEN IMAGES</FormLabel>
                  <ImageDropzone
                    id="dropzone-kitchen"
                    images={formData.images?.kitchen || []}
                    onChange={(imgs) => updateImageCategory('kitchen', imgs)}
                    maxFiles={10}
                  />
                </div>

                {/* 4. Per-Bedroom Images (Generated dynamically based on beds count) */}
                <div className="space-y-4 pt-2 border-t border-[#E8E4DA]">
                  <FormLabel>4. BEDROOM IMAGES ({formData.beds || 1} Bedrooms Configured)</FormLabel>
                  <div className="space-y-4 pl-2 border-l-2 border-[#F5A623]">
                    {Array.from({ length: Math.max(1, formData.beds || 1) }).map((_, idx) => {
                      const bedNum = idx + 1;
                      const currentImgs = (typeof formData.images?.bedrooms === 'object' && !Array.isArray(formData.images?.bedrooms))
                        ? (formData.images.bedrooms[bedNum] || [])
                        : (Array.isArray(formData.images?.bedrooms) ? formData.images.bedrooms : []);

                      return (
                        <div key={`bed-${bedNum}`} className="space-y-1.5 bg-stone-50 p-4 rounded-2xl border border-[#E8E4DA]">
                          <span className="text-xs font-bold text-[#1A1A1A] block">🛏️ Bedroom {bedNum} Photos</span>
                          <ImageDropzone
                            id={`dropzone-bedroom-${bedNum}`}
                            images={currentImgs}
                            onChange={(imgs) => updateBedroomImages(bedNum, imgs)}
                            maxFiles={6}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Per-Bathroom Images (Generated dynamically based on baths count) */}
                <div className="space-y-4 pt-2 border-t border-[#E8E4DA]">
                  <FormLabel>5. BATHROOM IMAGES ({formData.baths || 1} Bathrooms Configured)</FormLabel>
                  <div className="space-y-4 pl-2 border-l-2 border-teal-500">
                    {Array.from({ length: Math.max(1, formData.baths || 1) }).map((_, idx) => {
                      const bathNum = idx + 1;
                      const currentImgs = (typeof formData.images?.bathrooms === 'object' && !Array.isArray(formData.images?.bathrooms))
                        ? (formData.images.bathrooms[bathNum] || [])
                        : (Array.isArray(formData.images?.bathrooms) ? formData.images.bathrooms : []);

                      return (
                        <div key={`bath-${bathNum}`} className="space-y-1.5 bg-stone-50 p-4 rounded-2xl border border-[#E8E4DA]">
                          <span className="text-xs font-bold text-[#1A1A1A] block">🚿 Bathroom {bathNum} Photos</span>
                          <ImageDropzone
                            id={`dropzone-bathroom-${bathNum}`}
                            images={currentImgs}
                            onChange={(imgs) => updateBathroomImages(bathNum, imgs)}
                            maxFiles={6}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Terrace Images (Multiple files) */}
                <div className="space-y-2 pt-2 border-t border-[#E8E4DA]">
                  <FormLabel>6. TERRACE & BALCONY IMAGES</FormLabel>
                  <ImageDropzone
                    id="dropzone-terrace"
                    images={formData.images?.terrace || []}
                    onChange={(imgs) => updateImageCategory('terrace', imgs)}
                    maxFiles={10}
                  />
                </div>

                {/* PDF Brochure Link */}
                <TextInput
                  label="Floor Plan / Brochure PDF URL (Optional)"
                  value={formData.brochureUrl}
                  onChange={(e) => updateField('brochureUrl', e.target.value)}
                  placeholder="https://assets.imperia.com/floorplan-142.pdf"
                />
              </motion.div>
            )}

            {/* ── STEP 4: AMENITIES & DESCRIPTION ─────────────────── */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E8E4DA] pb-4">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Step 04 — Amenities & Architectural Narrative</h3>
                  <p className="text-xs text-[#8A8A85] mt-0.5">Craft copy description, select amenity chips, and build pros/cons list.</p>
                </div>

                <TextAreaInput
                  label="Architectural Narrative / Description"
                  value={formData.desc}
                  onChange={(e) => updateField('desc', e.target.value)}
                  rows={4}
                  placeholder="Describe the architectural design, interior materials, neighborhood highlights..."
                />

                <MultiSelectChips
                  label="Selected Amenities"
                  options={AMENITY_OPTIONS}
                  selected={formData.amenities}
                  onChange={(vals) => updateField('amenities', vals)}
                />

                {/* Pros List Builder (Compare.jsx style) */}
                <div className="space-y-2 pt-2 font-sans">
                  <FormLabel>Estate Pros / Highlights Builder</FormLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Direct beach access"
                      value={newProText}
                      onChange={(e) => setNewProText(e.target.value)}
                      className="flex-1 bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-2 text-xs font-medium outline-none focus:border-[#F5A623]"
                    />
                    <button
                      type="button"
                      onClick={addPro}
                      className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-black"
                    >
                      + Add Pro
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.pros.map((pro, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <span>✓ {pro}</span>
                        <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removePro(idx)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cons List Builder */}
                <div className="space-y-2 pt-2 font-sans">
                  <FormLabel>Estate Considerations / Cons Builder</FormLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. High maintenance fee"
                      value={newConText}
                      onChange={(e) => setNewConText(e.target.value)}
                      className="flex-1 bg-[#F4F1EA] border border-[#E8E4DA] rounded-xl px-4 py-2 text-xs font-medium outline-none focus:border-[#F5A623]"
                    />
                    <button
                      type="button"
                      onClick={addCon}
                      className="px-4 py-2 bg-[#F4F1EA] text-[#1A1A1A] border border-[#E8E4DA] text-xs font-bold rounded-xl cursor-pointer hover:bg-stone-200"
                    >
                      + Add Con
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.cons.map((con, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1.5">
                        <span>• {con}</span>
                        <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removeCon(idx)} />
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: COMPLIANCE & REVIEW (PUBLISH) ──────────── */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-[#E8E4DA] pb-4">
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Step 05 — Compliance & Final Review</h3>
                  <p className="text-xs text-[#8A8A85] mt-0.5">Set RERA certification status and review read-only listing preview card.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#F4F1EA] border border-[#E8E4DA]">
                  <ToggleSwitch
                    label="Government RERA Certified"
                    description="Displays verified green shield on customer view"
                    checked={formData.rera}
                    onChange={(val) => updateField('rera', val)}
                  />

                  {formData.rera && (
                    <TextInput
                      label="RERA Registration Number *"
                      required
                      value={formData.reraNumber}
                      onChange={(e) => updateField('reraNumber', e.target.value)}
                      error={errors.reraNumber}
                      placeholder="TN/01/Building/0142/2025"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SegmentedControl
                    label="Construction Status"
                    options={['Ready to Move', 'Under Construction']}
                    value={formData.status}
                    onChange={(val) => updateField('status', val)}
                  />

                  <SelectInput
                    label="Legal Registration Status"
                    value={formData.registrationStatus}
                    onChange={(e) => updateField('registrationStatus', e.target.value)}
                    options={['Clear Title & DTCP Approved', 'Pending Clearance', 'Joint Venture Title']}
                  />
                </div>

                {/* READ-ONLY REVIEW CARD STYLED LIKE PropertyDetails.jsx */}
                <div className="space-y-3 pt-4 font-sans">
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-extrabold block">
                    LIVE LISTING PREVIEW CARD
                  </span>

                  <div className="bg-[#F4F1EA] border border-[#E8E4DA] rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      <img
                        src={formData.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
                        alt="Preview"
                        className="w-full md:w-48 h-32 rounded-xl object-cover border border-[#E8E4DA] shrink-0"
                      />

                      <div className="space-y-2 flex-1 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#1A1A1A] text-white">
                            {formData.type}
                          </span>
                          <StatusChip status={formData.status} />
                        </div>
                        <h4 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">{formData.title || 'Untitled Estate'}</h4>
                        <p className="text-xs text-[#8A8A85] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#F5A623]" />
                          <span>{formData.location || 'Location pending'}</span>
                        </p>
                        <div className="text-lg font-extrabold text-[#F5A623]">{formattedPricePreview}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── STICKY FOOTER ACTION BAR ───────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E4DA] py-4 px-6 md:px-12 flex items-center justify-between font-sans shadow-lg">
        {/* Left: Back */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-5 py-2.5 rounded-full border border-[#E8E4DA] bg-white text-[#1A1A1A] hover:bg-[#F4F1EA] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Right: Save Draft & Continue / Publish (Amber-filled on Step 5) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handlePublish('Draft')}
            className="px-5 py-2.5 rounded-full border border-[#E8E4DA] bg-[#F4F1EA] text-[#1A1A1A] hover:bg-stone-200 text-xs font-bold transition-all cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`px-7 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2 ${
              currentStep === 5
                ? 'bg-[#F5A623] hover:bg-amber-500 text-white' // Terminal Publish renders amber-filled
                : 'bg-[#1A1A1A] hover:bg-black text-white'
            }`}
          >
            <span>{currentStep === 5 ? 'Publish Listing Now' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
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
        <p className="text-xs text-[#8A8A85]">You can also save your progress as a Draft before exiting.</p>
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
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-300 text-[#F5A623] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>
          <p className="text-xs text-[#8A8A85]">
            The property will be highlighted at the top of the admin catalog with a <span className="font-bold text-[#1A1A1A]">"Just published"</span> badge.
          </p>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/admin/properties');
            }}
            className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase rounded-full shadow-md"
          >
            Go to Properties Catalog
          </button>
        </div>
      </AdminModal>

    </div>
  );
};

export default AdminAddPropertyPage;
