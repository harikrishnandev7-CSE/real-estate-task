import React, { useState } from 'react';
import { ChevronDown, Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { api } from '../../../services/api';

export const FormLabel = ({ children, required, className = '' }) => (
  <label className={`text-[10px] uppercase tracking-wider text-[#5D6472] font-bold mb-1.5 block font-sans ${className}`}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

export const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <span className="text-[10px] font-bold text-red-500 mt-1 block font-sans">
      {message}
    </span>
  );
};

export const TextInput = ({ label, error, required, className = '', ...props }) => (
  <div className="w-full font-sans">
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <input
      className={`w-full bg-[#E0EEE9]/50 border ${
        error ? 'border-red-500 focus:border-red-500' : 'border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8]'
      } rounded-lg px-4 py-3 text-xs text-[#363C46] placeholder-[#5D6472]/60 font-medium outline-none transition-colors ${className}`}
      {...props}
    />
    <FormError message={error} />
  </div>
);

export const SelectInput = ({ label, options = [], error, required, className = '', ...props }) => (
  <div className="w-full font-sans relative">
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <div className="relative">
      <select
        className={`w-full bg-[#E0EEE9]/50 border ${
          error ? 'border-red-500 focus:border-red-500' : 'border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8]'
        } rounded-lg px-4 py-3 text-xs text-[#363C46] font-bold outline-none appearance-none pr-10 cursor-pointer transition-colors ${className}`}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-[#5D6472] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
    <FormError message={error} />
  </div>
);

export const TextAreaInput = ({ label, error, required, rows = 4, className = '', ...props }) => (
  <div className="w-full font-sans">
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <textarea
      rows={rows}
      className={`w-full bg-[#E0EEE9]/50 border ${
        error ? 'border-red-500 focus:border-red-500' : 'border-[rgba(93,100,114,0.20)] focus:border-[#CFB6A8]'
      } rounded-lg p-3.5 text-xs text-[#363C46] placeholder-[#5D6472]/60 font-medium outline-none transition-colors ${className}`}
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
      const urls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data?.url) {
          urls.push(res.data.url);
        }
      }
      if (multiple) {
        onChange([...value, ...urls]);
      } else {
        onChange(urls[0] || value);
      }
    } catch (err) {
      console.error('Image upload failed', err);
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

  return (
    <div className="space-y-3 font-sans">
      {label && <FormLabel>{label}</FormLabel>}

      <div className="border-2 border-dashed border-[rgba(93,100,114,0.20)] hover:border-[#CFB6A8] rounded-xl p-6 bg-[#E0EEE9]/30 text-center transition-colors relative cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-full bg-white text-[#CFB6A8] shadow-xs group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5 stroke-[2]" />
          </div>
          <p className="text-xs font-bold text-[#363C46]">
            {uploading ? 'Uploading assets...' : 'Drag & drop image assets or click to browse'}
          </p>
          <p className="text-[10px] text-[#5D6472]">Supports PNG, JPG, WEBP up to 10MB</p>
        </div>
      </div>

      {currentImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3 pt-2">
          {currentImages.map((img, idx) => (
            <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-[rgba(93,100,114,0.15)] group">
              <img src={img} alt="Uploaded preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
