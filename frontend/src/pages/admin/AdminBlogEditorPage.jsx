import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Eye, 
  Check, 
  Loader2, 
  Sparkles, 
  Bold, 
  Italic, 
  Heading, 
  Link as LinkIcon, 
  Quote, 
  Image as ImageIcon,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { 
  FormLabel, 
  TextInput, 
  SelectInput, 
  TextAreaInput, 
  SegmentedControl, 
  ToggleSwitch, 
  ImageDropzone 
} from '../../components/admin/primitives/FormField';

const CATEGORIES = ['Market Intelligence', 'Design & Style', 'Investment Guides'];
const AUTHORS = ['Pranav Rajan', 'Aditi Sen', 'Sanjay Mehta', 'Vikram Malhotra'];

const AdminBlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs = [], addBlog, updateBlog, deleteBlog, showToast } = useApp();

  const existingArticle = useMemo(() => {
    return blogs.find(b => b.id === id);
  }, [blogs, id]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Market Intelligence',
    author: 'Pranav Rajan',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '5 Min Read',
    image: '',
    excerpt: '',
    body: '',
    featured: false,
    status: 'Published',
    scheduledDateTime: '',
    metaTitle: '',
    metaDesc: ''
  });

  const [isSlugChecking, setIsSlugChecking] = useState(false);
  const [showFeaturedConflictModal, setShowFeaturedConflictModal] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Initialize existing article data
  useEffect(() => {
    if (existingArticle) {
      setFormData({
        title: existingArticle.title || '',
        slug: existingArticle.slug || '',
        category: existingArticle.category || 'Market Intelligence',
        author: existingArticle.author || 'Pranav Rajan',
        date: existingArticle.date || '',
        readTime: existingArticle.readTime || '5 Min Read',
        image: existingArticle.image || '',
        excerpt: existingArticle.excerpt || '',
        body: existingArticle.body || '',
        featured: existingArticle.featured || false,
        status: existingArticle.status || 'Published',
        scheduledDateTime: '',
        metaTitle: existingArticle.metaTitle || '',
        metaDesc: existingArticle.metaDesc || ''
      });
    }
  }, [existingArticle]);

  // Auto-generate slug from title
  const handleTitleChange = (val) => {
    const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, title: val, slug: slugified }));
    
    setIsSlugChecking(true);
    setTimeout(() => {
      setIsSlugChecking(false);
    }, 400);
  };

  // Featured Toggle Handler
  const handleToggleFeatured = (val) => {
    if (val) {
      const currentFeatured = blogs.find(b => b.featured && b.id !== id);
      if (currentFeatured) {
        setShowFeaturedConflictModal(true);
        return;
      }
    }
    setFormData(prev => ({ ...prev, featured: val }));
  };

  // Insert Rich Text Formatting Snippet into Body
  const insertFormatting = (prefix, suffix = '') => {
    setFormData(prev => ({
      ...prev,
      body: `${prev.body} ${prefix}text${suffix} `
    }));
  };

  // Submit Article Action
  const handleSaveArticle = async (statusOverride) => {
    if (!formData.title.trim()) {
      showToast("Article Title is required.");
      return;
    }

    const payload = {
      ...formData,
      status: statusOverride || formData.status,
      image: formData.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    };

    try {
      const targetId = existingArticle?.id || existingArticle?._id || id;
      if (existingArticle) {
        await updateBlog(targetId, payload);
      } else {
        await addBlog(payload);
      }

      navigate('/admin/blogs');
    } catch (err) {
      if (showToast) showToast(`Save failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-8 font-sans pb-24">
      
      {/* ── TOPBAR HEADER & ACTIONS ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/blogs" className="text-xs font-bold text-[#8A8A85] hover:text-[#1A1A1A]">
              Blogs
            </Link>
            <span className="text-[#8A8A85] text-xs">/</span>
            <span className="text-xs font-bold text-[#F5A623]">{existingArticle ? 'Edit Article' : 'New Article'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
            {existingArticle ? `Edit: ${formData.title}` : 'Compose Article'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleSaveArticle('Draft')}
            className="px-4 py-2 bg-[#F4F1EA] hover:bg-stone-200 text-[#1A1A1A] text-xs font-bold rounded-full transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSaveArticle('Published')}
            className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#F5A623]" />
            <span>Publish Article</span>
          </button>

          {existingArticle && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="text-xs font-bold text-red-600 hover:underline cursor-pointer ml-2"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT: EDITOR FORM + STICKY LIVE PREVIEW ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Article Editor */}
        <div className="lg:col-span-2 bg-white border border-[#E8E4DA] rounded-2xl p-6 sm:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.04)] space-y-6 font-sans">
          
          <TextInput
            label="Article Title *"
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. The Rise of Branded Residences in South India"
          />

          {/* Auto Slug with Spinner / Checkmark */}
          <div className="relative">
            <TextInput
              label="URL Slug (Auto-generated)"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            />
            <div className="absolute right-3 top-9 flex items-center gap-1.5">
              {isSlugChecking ? (
                <Loader2 className="w-4 h-4 text-[#F5A623] animate-spin" />
              ) : formData.slug ? (
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" title="Slug available" />
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectInput
              label="Category *"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              options={CATEGORIES}
            />

            <SelectInput
              label="Author *"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              options={AUTHORS}
            />

            <TextInput
              label="Estimated Read Time"
              value={formData.readTime}
              onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
            />
          </div>

          <ImageDropzone
            label="Article Cover Image *"
            images={formData.image ? [formData.image] : []}
            onChange={(imgs) => setFormData(prev => ({ ...prev, image: imgs[0] || '' }))}
            maxFiles={1}
          />

          {/* Excerpt Textarea with Character Counter & Soft Warning */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <FormLabel>Article Excerpt Summary (Recommended &lt; 160 chars)</FormLabel>
              <span className={`text-[10px] font-bold ${formData.excerpt.length > 160 ? 'text-amber-600' : 'text-[#8A8A85]'}`}>
                {formData.excerpt.length} / 160 chars
              </span>
            </div>
            <TextAreaInput
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
              placeholder="Short summary displayed on cards..."
            />
            {formData.excerpt.length > 160 && (
              <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Excerpt exceeds 160 characters. It may get truncated in card previews.</span>
              </p>
            )}
          </div>

          {/* Rich-Text Body Editor with Formatting Toolbar */}
          <div className="space-y-2">
            <FormLabel required>Article Body Content *</FormLabel>
            <div className="border border-[#E8E4DA] rounded-2xl overflow-hidden bg-[#F4F1EA]/30">
              <div className="flex items-center gap-1 p-2 bg-[#F4F1EA] border-b border-[#E8E4DA]">
                <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1.5 rounded-lg hover:bg-stone-200 text-[#1A1A1A]" title="Bold"><Bold className="w-4 h-4" /></button>
                <button type="button" onClick={() => insertFormatting('*', '*')} className="p-1.5 rounded-lg hover:bg-stone-200 text-[#1A1A1A]" title="Italic"><Italic className="w-4 h-4" /></button>
                <button type="button" onClick={() => insertFormatting('### ')} className="p-1.5 rounded-lg hover:bg-stone-200 text-[#1A1A1A]" title="Heading"><Heading className="w-4 h-4" /></button>
                <button type="button" onClick={() => insertFormatting('[', '](https://)')} className="p-1.5 rounded-lg hover:bg-stone-200 text-[#1A1A1A]" title="Link"><LinkIcon className="w-4 h-4" /></button>
                <button type="button" onClick={() => insertFormatting('> ')} className="p-1.5 rounded-lg hover:bg-stone-200 text-[#1A1A1A]" title="Quote Block"><Quote className="w-4 h-4" /></button>
              </div>

              <textarea
                rows={10}
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                className="w-full p-4 bg-white text-xs font-medium text-[#1A1A1A] outline-none leading-relaxed"
                placeholder="Write article body content using Markdown or standard text..."
              />
            </div>
          </div>

          {/* Featured Toggle & Status Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#F4F1EA] border border-[#E8E4DA]">
            <ToggleSwitch
              label="Featured Article on Blog Hero"
              description="Displays article in top hero position"
              checked={formData.featured}
              onChange={handleToggleFeatured}
            />

            <SegmentedControl
              label="Publication Status"
              options={['Published', 'Draft', 'Scheduled']}
              value={formData.status}
              onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
            />
          </div>

          {/* Collapsed Advanced SEO Fields */}
          <div className="border border-[#E8E4DA] rounded-2xl overflow-hidden font-sans">
            <button
              type="button"
              onClick={() => setShowSeo(prev => !prev)}
              className="w-full p-4 bg-[#F4F1EA] flex items-center justify-between text-xs font-extrabold text-[#1A1A1A] cursor-pointer"
            >
              <span>Advanced Search Engine Optimization (SEO) Meta</span>
              {showSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSeo && (
              <div className="p-5 space-y-4 bg-white border-t border-[#E8E4DA]">
                <TextInput
                  label="Meta Title"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Branded Residences South India | IMPERIA Insights"
                />

                <TextAreaInput
                  label="Meta Description"
                  value={formData.metaDesc}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDesc: e.target.value }))}
                  rows={2}
                  placeholder="Compelling search engine description snippet..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: STICKY REAL-TIME LIVE PREVIEW PANEL */}
        <div className="space-y-4 font-sans">
          <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)] sticky top-20 space-y-4">
            <div className="border-b border-[#E8E4DA] pb-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8A85] font-extrabold block">
                LIVE ARTICLE PREVIEW
              </span>
              <StatusChip status={formData.status} />
            </div>

            {/* Customer Blog Card Mirror */}
            <div className="bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden shadow-xs space-y-3 p-3">
              <div className="relative h-44 rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={formData.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#F5A623]">{formData.category}</span>
                <h4 className="text-base font-extrabold text-[#1A1A1A] tracking-tight line-clamp-2">{formData.title || 'Untitled Article'}</h4>
                <p className="text-xs text-[#8A8A85] line-clamp-2 mt-1">{formData.excerpt || 'Excerpt description preview...'}</p>
              </div>

              <div className="border-t border-[#E8E4DA] pt-2 flex items-center justify-between text-[10px] text-[#8A8A85] font-semibold">
                <span>By {formData.author}</span>
                <span>{formData.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURED CONFLICT CONFIRM MODAL ───────────────────────── */}
      <AdminModal
        isOpen={showFeaturedConflictModal}
        onClose={() => setShowFeaturedConflictModal(false)}
        title="Replace Featured Article?"
        subtitle="Only one article can hold the featured slot. Enabling this will replace the current featured article."
        size="sm"
        confirmText="Replace Featured Slot"
        onConfirm={() => {
          setFormData(prev => ({ ...prev, featured: true }));
          setShowFeaturedConflictModal(false);
        }}
      >
        <p className="text-xs text-[#8A8A85]">The previous article will revert to standard publication status.</p>
      </AdminModal>

      {/* ── DESTRUCTIVE DELETE CONFIRM MODAL ───────────────────────── */}
      <AdminModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Article Permanently?"
        subtitle={`Are you sure you want to delete "${formData.title}"?`}
        size="sm"
        isDestructive
        confirmText="Delete Article"
        onConfirm={() => {
          if (existingArticle) deleteBlog(existingArticle.id);
          navigate('/admin/blogs');
        }}
      >
        <p className="text-xs text-[#8A8A85]">This action cannot be undone.</p>
      </AdminModal>

    </div>
  );
};

export default AdminBlogEditorPage;
