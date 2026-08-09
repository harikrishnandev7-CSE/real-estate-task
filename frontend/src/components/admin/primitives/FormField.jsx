import React, { useState } from 'react';
import { ChevronDown, Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { api } from '../../../services/api';

/**
 * FormField Primitives Suite for IMPERIA Admin Panel
 */

export const FormLabel = ({ children, required, className = '' }) => (
  <label className={`text-[10px] uppercase tracking-wider text-[#8A8A85] font-bold mb-1.5 block font-sans ${className}`}>
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
      className={`w-full bg-[#F4F1EA] border ${
        error ? 'border-red-500 focus:border-red-500' : 'border-[#E8E4DA] focus:border-[#F5A623]'
      } rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8A8A85] font-medium outline-none transition-colors ${className}`}
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
        className={`w-full bg-[#F4F1EA] border ${
          error ? 'border-red-500 focus:border-red-500' : 'border-[#E8E4DA] focus:border-[#F5A623]'
        } rounded-xl px-4 py-3 text-sm text-[#1A1A1A] font-medium outline-none appearance-none pr-10 cursor-pointer transition-colors ${className}`}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-[#8A8A85] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
    <FormError message={error} />
  </div>
);

export const TextAreaInput = ({ label, error, required, rows = 4, className = '', ...props }) => (
  <div className="w-full font-sans">
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <textarea
      rows={rows}
      className={`w-full bg-[#F4F1EA] border ${
        error ? 'border-red-500 focus:border-red-500' : 'border-[#E8E4DA] focus:border-[#F5A623]'
      } rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8A8A85] font-medium outline-none transition-colors ${className}`}
      {...props}
    />
    <FormError message={error} />
  </div>
);

export const SegmentedControl = ({ label, options = [], value, onChange, className = '' }) => (
  <div className="w-full font-sans">
    {label && <FormLabel>{label}</FormLabel>}
    <div className={`flex flex-wrap gap-1.5 p-1.5 bg-[#F4F1EA] rounded-xl border border-[#E8E4DA] ${className}`}>
      {options.map((opt) => {
        const val = typeof opt === 'object' ? opt.value : opt;
        const lbl = typeof opt === 'object' ? opt.label : opt;
        const isActive = value === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`flex-1 min-w-[70px] py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
              isActive
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#8A8A85] hover:text-[#1A1A1A]'
            }`}
          >
            {lbl}
          </button>
        );
      })}
    </div>
  </div>
);

export const ToggleSwitch = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between font-sans">
    <div>
      {label && <span className="text-xs font-bold text-[#1A1A1A] block">{label}</span>}
      {description && <span className="text-[10px] text-[#8A8A85] block">{description}</span>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer relative ${
        checked ? 'bg-[#1A1A1A]' : 'bg-[#E8E4DA]'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-[#F5A623] transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const MultiSelectChips = ({ label, options = [], selected = [], onChange }) => {
  const toggleOption = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(i => i !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="w-full font-sans">
      {label && <FormLabel>{label}</FormLabel>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleOption(opt)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F4F1EA] text-[#8A8A85] hover:text-[#1A1A1A] border border-[#E8E4DA]'
              }`}
            >
              {opt} {isSelected && '✓'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ImageDropzone = ({ label, id, images = [], onChange, maxFiles = 6 }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputId = useState(() => id || `dropzone-${Math.random().toString(36).substring(2, 9)}`)[0];

  const processUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      console.log('Uploading to Cloudinary...');
      const formData = new FormData();
      files.forEach(file => formData.append('media', file));

      const res = await api.uploadMedia(formData);
      const uploadedList = res?.urls || res?.data?.urls || (res?.url ? [{ url: res.url }] : []);
      const newCloudinaryUrls = uploadedList.map(item => typeof item === 'string' ? item : item.url).filter(Boolean);
      
      console.log('Cloudinary Upload Success:', newCloudinaryUrls);
      onChange([...images, ...newCloudinaryUrls].slice(0, maxFiles));
    } catch (err) {
      console.error('Cloudinary upload failed:', err.message || err);
      alert(`Image upload failed: ${err.message || 'Error uploading to Cloudinary'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    processUpload(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processUpload(files);
  };

  const removeImage = (idx) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full font-sans">
      {label && <FormLabel>{label}</FormLabel>}
      
      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-[#F5A623] bg-amber-50/40'
            : 'border-[#E8E4DA] bg-[#F4F1EA] hover:border-[#1A1A1A]'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
          disabled={uploading}
        />
        <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-white border border-[#E8E4DA] text-[#F5A623] flex items-center justify-center shadow-xs">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5 stroke-[2]" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-[#1A1A1A]">
              {uploading ? 'Uploading to Cloudinary...' : <>Drag & drop images here, or <span className="text-[#F5A623] underline">browse files</span></>}
            </p>
            <p className="text-[10px] text-[#8A8A85] mt-0.5 font-medium">
              PNG, JPG, WEBP up to 10MB each (max {maxFiles} images)
            </p>
          </div>
        </label>
      </div>

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#E8E4DA] aspect-square bg-white shadow-xs">
              <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                title="Remove image"
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

