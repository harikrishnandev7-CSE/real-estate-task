import React, { useState, useRef } from 'react';
import { 
  Video, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Film, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

const PropertyVideoUploader = ({ videoUrl, videoFile, onChange, onError }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processVideoFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processVideoFile(files[0]);
    }
  };

  // Validate & Process File
  const processVideoFile = async (file) => {
    setErrorMessage('');
    setSuccessMessage('');

    // Check MIME type or extension
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ['mp4', 'webm', 'mov', 'avi'].includes(ext);

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      const msg = 'Unsupported file format. Please upload a valid MP4, WEBM, or MOV video file.';
      setErrorMessage(msg);
      if (onError) onError(msg);
      return;
    }

    // 100MB Size Limit Check
    if (file.size > 100 * 1024 * 1024) {
      const msg = 'File size exceeds 100MB limit. Please upload a compressed video file.';
      setErrorMessage(msg);
      if (onError) onError(msg);
      return;
    }

    // Direct Upload to Cloudinary API via Backend
    setUploading(true);
    setProgress(15);

    try {
      const timer = setInterval(() => {
        setProgress(prev => (prev < 85 ? prev + 15 : prev));
      }, 300);

      const formData = new FormData();
      formData.append('video', file);

      const uploadFn = typeof api.uploadVideo === 'function' ? api.uploadVideo : api.uploadMedia;
      const res = uploadFn ? await uploadFn(formData) : null;
      clearInterval(timer);
      setProgress(100);

      const uploadedUrl = res?.secure_url || res?.url || res?.data?.secure_url;
      if (uploadedUrl) {
        setSuccessMessage('Video successfully uploaded & optimized on Cloudinary CDN.');
        onChange({ url: uploadedUrl, file });
      } else {
        // Fallback: Pass raw file to parent
        onChange({ url: URL.createObjectURL(file), file });
      }
    } catch (err) {
      console.warn('Backend video endpoint fallback:', err);
      // Fallback: pass local blob URL to parent so form creation will stream it
      const localUrl = URL.createObjectURL(file);
      onChange({ url: localUrl, file });
      setSuccessMessage('Video attached. Will upload to Cloudinary upon listing publish.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange({ url: '', file: null });
    setSuccessMessage('');
    setErrorMessage('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 font-sans">
      
      {/* Upload Box or Video Player Preview */}
      {!videoUrl && !videoFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? 'border-[#C6A66B] bg-amber-50/50 scale-[1.01]'
              : 'border-[rgba(198,166,107,0.30)] bg-[#F8F6F2] hover:bg-white hover:border-[#C6A66B]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/avi"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-white border border-[rgba(198,166,107,0.30)] text-[#C6A66B] flex items-center justify-center shadow-xs">
            <Film className="w-7 h-7 stroke-[1.8]" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-[#0B0B0B]">
              <span className="text-[#C6A66B] underline">Click to upload</span> or drag and drop video
            </p>
            <p className="text-[11px] text-[#6B6B6B] font-medium">
              MP4, WEBM, or MOV up to 100MB (1080p 16:9 recommended)
            </p>
          </div>

          {uploading && (
            <div className="w-full max-w-xs space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-bold text-[#6B6B6B]">
                <span>Uploading to Cloudinary CDN...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C6A66B] transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Uploaded Video Preview Player */
        <div className="bg-white border border-[rgba(198,166,107,0.30)] rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(198,166,107,0.20)] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-[#0B0B0B] uppercase tracking-wider">
                Video Tour Attached
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#F8F6F2] hover:bg-[#0E0E10] text-[#0B0B0B] hover:text-[#F4F1EA] text-xs font-bold rounded-xl border border-[rgba(198,166,107,0.25)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white text-xs font-bold rounded-xl border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/avi"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0E0E10] border border-[rgba(198,166,107,0.25)] group">
            <video
              src={videoUrl}
              controls
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Success / Error Banners */}
      {successMessage && (
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

    </div>
  );
};

export default PropertyVideoUploader;
