/**
 * PropertyImageUploader.jsx
 * Admin component for uploading property images to Cloudinary
 * via the backend /api/v1/admin/properties/media endpoint.
 *
 * Usage:
 *   <PropertyImageUploader
 *     propertyId="some-id"
 *     onUploaded={(urls) => console.log(urls)}
 *   />
 */
import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, ImageIcon, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const ROOM_TYPES = ['exterior', 'hall', 'bedroom', 'kitchen', 'bathroom'];
const VARIANTS   = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'empty',     label: 'Empty / Unfurnished' },
];

const PropertyImageUploader = ({ propertyId, onUploaded }) => {
  const [selectedFiles, setSelectedFiles]   = useState([]);
  const [previews,      setPreviews]        = useState([]);
  const [roomType,      setRoomType]        = useState('exterior');
  const [variant,       setVariant]         = useState('furnished');
  const [uploading,     setUploading]       = useState(false);
  const [uploadedUrls,  setUploadedUrls]    = useState([]);
  const [error,         setError]           = useState(null);
  const fileInputRef = useRef(null);

  const handleFilePick = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
    setError(null);
    setUploadedUrls([]);
  };

  const removeFile = (idx) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    setSelectedFiles(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const formData = new FormData();

      selectedFiles.forEach(file => formData.append('media', file));
      formData.append('roomType',  roomType);
      formData.append('variant',   variant);
      formData.append('furnished', variant === 'furnished' ? 'true' : 'false');

      const res = await fetch(`${API_BASE}/admin/properties/media`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || 'Upload failed');
      }

      const data = await res.json();
      const urls = data.data?.urls || [];
      setUploadedUrls(urls);
      setSelectedFiles([]);
      setPreviews([]);
      if (onUploaded) onUploaded(urls);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="font-sans space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#1A1A1A]">Upload Property Images</h3>
        <p className="text-xs text-[#8A8A85]">Images are stored on Cloudinary CDN. Max 20 files, 10 MB each.</p>
      </div>

      {/* Room type & variant selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8A8A85] mb-1.5">Room Type</label>
          <select
            value={roomType}
            onChange={e => setRoomType(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#E8E4DA] rounded-xl text-sm font-sans text-[#1A1A1A] bg-white focus:outline-none focus:border-[#F5A623] cursor-pointer"
          >
            {ROOM_TYPES.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8A8A85] mb-1.5">Furnishing State</label>
          <select
            value={variant}
            onChange={e => setVariant(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#E8E4DA] rounded-xl text-sm font-sans text-[#1A1A1A] bg-white focus:outline-none focus:border-[#F5A623] cursor-pointer"
          >
            {VARIANTS.map(v => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#E8E4DA] hover:border-[#F5A623] rounded-2xl p-8 text-center cursor-pointer transition-colors group"
      >
        <Upload className="w-8 h-8 text-[#8A8A85] group-hover:text-[#F5A623] mx-auto mb-3 transition-colors" />
        <p className="text-sm font-semibold text-[#1A1A1A]">Drop images here or click to browse</p>
        <p className="text-xs text-[#8A8A85] mt-1">JPG, PNG, WEBP up to 10 MB each</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFilePick}
        />
      </div>

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-[#E8E4DA]">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Uploaded URLs */}
      {uploadedUrls.length > 0 && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            {uploadedUrls.length} image{uploadedUrls.length > 1 ? 's' : ''} uploaded to Cloudinary!
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {uploadedUrls.map((item, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-emerald-200">
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-[#1A1A1A] hover:bg-[#F5A623] disabled:bg-[#E8E4DA] disabled:text-[#8A8A85] text-white font-bold text-sm uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading to Cloudinary…
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}` : 'Images'}
          </>
        )}
      </button>
    </div>
  );
};

export default PropertyImageUploader;
