import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload, X, Image as ImageIcon, GripVertical, Check } from 'lucide-react';
import { api } from '../../../services/api';

export const FormLabel = ({ children, required, className = '' }) => (
  <label className={`text-[11px] uppercase tracking-wider text-[#111111] font-extrabold mb-1.5 block font-sans ${className}`}>
    {children} {required && <span className="text-rose-600">*</span>}
  </label>
);

export const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <span className="text-xs font-bold text-rose-600 mt-1 block font-sans">
      {message}
    </span>
  );
};

export const TextInput = ({ label, error, required, className = '', ...props }) => (
  <div className="w-full font-sans">
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <input
      className={`w-full bg-white border ${
        error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200' : 'border-[#BFA76F] focus:border-[#C6A66B] focus:ring-[#C6A66B]/30'
      } focus:ring-2 rounded-xl px-4 py-3.5 text-sm text-[#111111] placeholder-[#6B6B6B] font-medium outline-none transition-all shadow-xs ${className}`}
      {...props}
    />
    <FormError message={error} />
  </div>
);

export const SelectInput = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  error, 
  required, 
  className = '', 
  name,
  disabled,
  placeholder = 'Select option...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format options into [{ label, value }]
  const formattedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return { label: String(opt.label), value: opt.value };
    }
    return { label: String(opt), value: opt };
  });

  const selectedOption = formattedOptions.find(opt => String(opt.value) === String(value)) || formattedOptions[0];

  const handleSelect = (optValue) => {
    setIsOpen(false);
    if (onChange) {
      const syntheticEvent = {
        target: {
          name: name || '',
          value: optValue
        }
      };
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full font-sans relative" ref={dropdownRef}>
      {label && <FormLabel required={required}>{label}</FormLabel>}

      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-[#F8F6F2] border ${
            error 
              ? 'border-rose-500 ring-1 ring-rose-200' 
              : isOpen
              ? 'border-[#C6A66B] ring-2 ring-[#C6A66B]/25 bg-white'
              : 'border-[rgba(198,166,107,0.35)] hover:border-[#C6A66B]'
          } rounded-xl px-4 py-3.5 text-sm text-[#0B0B0B] font-extrabold flex items-center justify-between outline-none transition-all shadow-xs cursor-pointer ${className}`}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-[#C6A66B] shrink-0 transition-transform duration-200 stroke-[2.5] ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Custom Luxury Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 right-0 mt-2 z-50 bg-white border border-[rgba(198,166,107,0.30)] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] py-2 max-h-60 overflow-y-auto custom-scrollbar"
            >
              {formattedOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E0E10] text-[#F4F1EA] font-extrabold'
                        : 'text-[#0B0B0B] hover:bg-[#F8F6F2] hover:text-[#C6A66B]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C6A66B] stroke-[3]" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FormError message={error} />
    </div>
  );
};

export const PhoneInput = ({ label, value, onChange, error, required, className = '', placeholder = '9876543210', ...props }) => {
  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = cleaned;
    if (onChange) onChange(e);
  };

  return (
    <div className="w-full font-sans">
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-xs font-extrabold text-[#C6A66B] pointer-events-none">
          +91
        </span>
        <input
          type="tel"
          maxLength={10}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`w-full bg-[#F8F6F2] border ${
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200' : 'border-[rgba(198,166,107,0.35)] focus:border-[#C6A66B] focus:ring-[#C6A66B]/30'
          } focus:ring-2 rounded-xl pl-12 pr-4 py-3.5 text-sm text-[#0B0B0B] placeholder-[#8A8A85] font-extrabold tracking-wider outline-none transition-all shadow-xs ${className}`}
          {...props}
        />
      </div>
      <FormError message={error} />
    </div>
  );
};

export const TextAreaInput = ({ label, error, required, rows = 4, className = '', ...props }) => (
  <div className="w-full font-sans">
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <textarea
      rows={rows}
      className={`w-full bg-white border ${
        error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200' : 'border-[#BFA76F] focus:border-[#C6A66B] focus:ring-[#C6A66B]/30'
      } focus:ring-2 rounded-xl p-4 text-sm text-[#111111] placeholder-[#6B6B6B] font-medium outline-none transition-all shadow-xs ${className}`}
      {...props}
    />
    <FormError message={error} />
  </div>
);

export const SegmentedControl = ({ options = [], value, onChange, className = '' }) => (
  <div className={`flex gap-1 p-1 bg-[#E0EEE9]/50 border border-[rgba(93,100,114,0.15)] rounded-lg font-sans ${className}`}>
    {options.map(opt => {
      const val = typeof opt === 'object' ? opt.value : opt;
      const lbl = typeof opt === 'object' ? opt.label : opt;
      const isSelected = value === val;
      return (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
            isSelected
              ? 'bg-[#363C46] text-white shadow-xs'
              : 'text-[#5D6472] hover:text-[#363C46]'
          }`}
        >
          {lbl}
        </button>
      );
    })}
  </div>
);

export const ToggleSwitch = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between font-sans">
    <div>
      {label && <span className="text-xs font-bold text-[#363C46] block">{label}</span>}
      {description && <span className="text-[11px] text-[#5D6472]">{description}</span>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
        checked ? 'bg-[#CFB6A8]' : 'bg-[rgba(93,100,114,0.25)]'
      }`}
    >
      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${checked ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);

export const MultiSelectChips = ({ options = [], value = [], onChange, label }) => {
  const toggleOption = (optVal) => {
    if (value.includes(optVal)) {
      onChange(value.filter(v => v !== optVal));
    } else {
      onChange([...value, optVal]);
    }
  };

  return (
    <div className="space-y-2 font-sans">
      {label && <FormLabel>{label}</FormLabel>}
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          const isSelected = value.includes(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => toggleOption(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#363C46] border-[#363C46] text-white'
                  : 'bg-white border-[rgba(93,100,114,0.20)] text-[#5D6472] hover:border-[#CFB6A8]'
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ImageDropzone = ({ value = [], onChange, multiple = true, label, maxFiles = 10 }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const processedAssets = [];

      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('media', file);
          const res = await api.uploadMedia(formData);
          const url = res?.url || res?.secure_url || res?.urls?.[0]?.url;
          if (url) {
            processedAssets.push(url);
          } else {
            processedAssets.push(file);
          }
        } catch (err) {
          // If backend upload API is not available directly, store File object for form submit
          processedAssets.push(file);
        }
      }

      if (multiple) {
        const existing = Array.isArray(value) ? value : value ? [value] : [];
        onChange([...existing, ...processedAssets]);
      } else {
        onChange(processedAssets[0] || value);
      }
    } catch (err) {
      console.error('Image dropzone processing error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    if (Array.isArray(value)) {
      onChange(value.filter((_, i) => i !== idx));
    } else {
      onChange('');
    }
  };

  const currentImages = Array.isArray(value) ? value : value ? [value] : [];

  const getImageSrc = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (img instanceof File) return URL.createObjectURL(img);
    return '';
  };

  return (
    <div className="space-y-3 font-sans">
      {label && <FormLabel>{label}</FormLabel>}

      <div className="border-2 border-dashed border-[rgba(198,166,107,0.30)] hover:border-[#C6A66B] rounded-2xl p-6 bg-[#F8F6F2] hover:bg-white text-center transition-all relative cursor-pointer group">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3.5 rounded-2xl bg-white border border-[rgba(198,166,107,0.25)] text-[#C6A66B] shadow-xs group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5 stroke-[2]" />
          </div>
          <p className="text-xs font-bold text-[#0B0B0B]">
            {uploading ? 'Processing assets...' : 'Drag & drop image assets or click to browse'}
          </p>
          <p className="text-[10px] text-[#6B6B6B] font-medium">Supports PNG, JPG, WEBP up to 10MB</p>
        </div>
      </div>

      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {currentImages.map((img, idx) => {
            const src = getImageSrc(img);
            return (
              <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-[rgba(198,166,107,0.25)] bg-[#0E0E10] group shadow-xs">
                {src ? (
                  <img src={src} alt={`Uploaded asset ${idx + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#F4F1EA]">
                    Image {idx + 1}
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-[#0E0E10]/80 hover:bg-rose-600 text-white transition-colors cursor-pointer z-20 border border-[rgba(198,166,107,0.30)]"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
