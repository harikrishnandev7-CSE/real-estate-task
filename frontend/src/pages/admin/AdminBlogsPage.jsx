import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Eye, 
  Pencil, 
  Copy, 
  Trash2, 
  Calendar, 
  User, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/admin/primitives/DataTable';
import StatusChip from '../../components/admin/primitives/StatusChip';
import AdminModal from '../../components/admin/primitives/AdminModal';
import { SelectInput } from '../../components/admin/primitives/FormField';

const CATEGORIES = ['All', 'Market Intelligence', 'Design & Style', 'Investment Guides'];
const STATUSES = ['All', 'Published', 'Draft', 'Scheduled'];

const AdminBlogsPage = () => {
  const navigate = useNavigate();
  const { blogs = [], deleteBlog, addBlog, showToast } = useApp();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filtered Articles
  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      if (searchVal.trim()) {
        const q = searchVal.toLowerCase();
        const matches = (
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }

      if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
      if (selectedStatus !== 'All' && b.status !== selectedStatus) return false;

      return true;
    });
  }, [blogs, searchVal, selectedCategory, selectedStatus]);

  // Duplicate Article
  const handleDuplicate = (article) => {
    const copyData = {
      ...article,
      title: `${article.title} (Copy)`,
      status: 'Draft',
      featured: false
    };
    delete copyData.id;
    addBlog(copyData);
  };

  // DataTable Column Definitions
  const columns = [
    {
      key: 'title',
      label: 'Article Title & Excerpt',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3 font-sans">
          <img src={row.image} alt={row.title} className="w-12 h-12 rounded-xl object-cover border border-[#E8E4DA] shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#1A1A1A] block truncate">{row.title}</span>
              {row.featured && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-[#F5A623] border border-amber-200 uppercase">
                  Featured
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#8A8A85] truncate block">{row.excerpt}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (val) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F4F1EA] text-[#1A1A1A] border border-[#E8E4DA]">
          {val}
        </span>
      )
    },
    {
      key: 'author',
      label: 'Author',
      render: (val) => <span className="font-bold text-[#1A1A1A]">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusChip status={val || 'Published'} />
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (val) => <span className="text-xs font-semibold text-[#8A8A85]">{val}</span>
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (val) => <span className="font-bold text-[#1A1A1A]">{val ?? 450}</span>
    }
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* ── TOPBAR CONTROLS ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5A623] font-extrabold block">
            CONTENT MARKETING
          </span>
          <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
            Blog Articles Catalog
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8A8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, author..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-[#F4F1EA] border border-[#E8E4DA] rounded-full text-xs px-4 py-2 pl-9 text-[#1A1A1A] placeholder-[#8A8A85] focus:outline-none focus:border-[#F5A623] w-48 sm:w-56 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="w-40">
            <SelectInput
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={CATEGORIES}
            />
          </div>

          {/* Status Filter */}
          <div className="w-32">
            <SelectInput
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={STATUSES}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#F4F1EA] border border-[#E8E4DA] rounded-full">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#8A8A85] hover:text-[#1A1A1A]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* New Article Button */}
          <button
            onClick={() => navigate('/admin/blogs/new')}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#F5A623]" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* ── TABLE VIEW vs GRID VIEW ─────────────────────────────────── */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredBlogs}
          pageSize={8}
          onRowClick={(row) => navigate(`/admin/blogs/${row.id}/edit`)}
          onEdit={(row) => navigate(`/admin/blogs/${row.id}/edit`)}
          onDelete={(row) => deleteBlog(row.id)}
        />
      ) : (
        /* GRID VIEW (Matching Blog.jsx article card design) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {filteredBlogs.map(article => (
            <div
              key={article.id}
              className="group bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.04)] hover:border-[#1A1A1A] transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <StatusChip status={article.status || 'Published'} />
                  {article.featured && (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#1A1A1A] text-white">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#F5A623] tracking-wider">{article.category}</span>
                  <h3 className="text-base font-extrabold text-[#1A1A1A] tracking-tight mt-1 line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-[#8A8A85] mt-1.5 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                </div>

                <div className="border-t border-[#E8E4DA] pt-3 flex items-center justify-between text-xs text-[#8A8A85]">
                  <span>By {article.author}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/admin/blogs/${article.id}/edit`)} className="p-1.5 hover:text-[#1A1A1A]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDuplicate(article)} className="p-1.5 hover:text-[#F5A623]"><Copy className="w-4 h-4" /></button>
                    <button onClick={() => deleteBlog(article.id)} className="p-1.5 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminBlogsPage;
