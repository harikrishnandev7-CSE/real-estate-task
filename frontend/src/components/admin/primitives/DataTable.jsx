import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  Eye, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Check,
  Compass
} from 'lucide-react';
import { EmptyState } from '../../common/FeedbackStates';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyMessage = "There are no data records available to display at this time.",
  onRowClick,
  onEdit,
  onView,
  onDelete,
  bulkActions = [],
  pageSize = 8,
  className = ''
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key, sortable) => {
    if (!sortable) return;
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else setSortKey(null);
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row.id || row._id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !paginatedData.some(r => (r.id || r._id) === id)));
    } else {
      const currentPageIds = paginatedData.map(r => r.id || r._id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className={`bg-white border border-[rgba(93,100,114,0.15)] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(54,60,70,0.06)] font-sans ${className}`}>
        <div className="p-4 bg-[#E0EEE9] border-b border-[rgba(93,100,114,0.15)] animate-pulse flex items-center justify-between">
          <div className="h-4 bg-[rgba(93,100,114,0.15)] rounded w-1/4" />
          <div className="h-4 bg-[rgba(93,100,114,0.15)] rounded w-1/6" />
        </div>
        <div className="divide-y divide-[rgba(93,100,114,0.15)]">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-4 flex items-center gap-4 animate-pulse">
              <div className="w-5 h-5 bg-[rgba(93,100,114,0.15)] rounded" />
              <div className="h-4 bg-[rgba(93,100,114,0.15)] rounded flex-1" />
              <div className="h-4 bg-[rgba(93,100,114,0.15)] rounded w-1/4" />
              <div className="h-4 bg-[rgba(93,100,114,0.15)] rounded w-1/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[rgba(93,100,114,0.15)] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(54,60,70,0.06)] font-sans relative flex flex-col ${className}`}>
      
      {/* Sticky Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#363C46] text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-20 animate-fadeIn">
          <div className="flex items-center gap-3 text-xs font-bold font-sans">
            <span className="w-5 h-5 rounded-full bg-[#CFB6A8] text-[#363C46] flex items-center justify-center text-[10px]">
              {selectedIds.length}
            </span>
            <span>{selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected — Bulk actions</span>
          </div>

          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.action(selectedIds)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {action.icon ? <action.icon className="w-3.5 h-3.5" /> : null}
                <span>{action.label}</span>
              </button>
            ))}
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-[#CFB6A8] hover:text-white underline ml-2 cursor-pointer font-semibold"
            >
              Deselect all
            </button>
          </div>
        </div>
      )}

      {/* Main Table View */}
      {sortedData.length === 0 ? (
        <div className="p-12 text-center">
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[#E0EEE9] text-[10px] uppercase tracking-wider text-[#5D6472] font-bold border-b border-[rgba(93,100,114,0.15)]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-[rgba(93,100,114,0.20)] text-[#363C46] focus:ring-0 cursor-pointer accent-[#363C46]"
                  />
                </th>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, col.sortable)}
                    className={`py-3.5 px-4 select-none ${col.sortable ? 'cursor-pointer hover:text-[#363C46]' : ''}`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="text-[#5D6472]">
                          {sortKey === col.key ? (
                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-[#CFB6A8]" /> : <ChevronDown className="w-3 h-3 text-[#CFB6A8]" />
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {(onView || onEdit || onDelete) && (
                  <th className="py-3.5 px-4 text-right">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[rgba(93,100,114,0.15)] text-xs text-[#363C46]">
              {paginatedData.map((row, rowIdx) => {
                const rowId = row._id || row.id || rowIdx;
                const isSelected = selectedIds.includes(rowId);
                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors font-medium ${
                      isSelected ? 'bg-[rgba(207,182,168,0.15)]' : 'hover:bg-[#E0EEE9]/40'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectRow(rowId, e)}
                        className="rounded border-[rgba(93,100,114,0.20)] text-[#363C46] focus:ring-0 cursor-pointer accent-[#363C46]"
                      />
                    </td>

                    {columns.map(col => (
                      <td key={col.key} className="py-4 px-4">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </td>
                    ))}

                    {(onView || onEdit || onDelete) && (
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="p-1.5 rounded-md text-[#5D6472] hover:text-[#CFB6A8] hover:bg-[rgba(207,182,168,0.15)] transition-colors cursor-pointer"
                              title="View details"
                            >
                              <Eye className="w-4 h-4 stroke-[2]" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-1.5 rounded-md text-[#5D6472] hover:text-[#363C46] hover:bg-[#E0EEE9] transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 stroke-[2]" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="p-1.5 rounded-md text-[#5D6472] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {sortedData.length > 0 && (
        <div className="py-3 px-6 bg-white border-t border-[rgba(93,100,114,0.15)] flex items-center justify-between font-sans">
          <p className="text-xs text-[#5D6472]">
            Showing <span className="font-bold text-[#363C46]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-[#363C46]">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
            <span className="font-bold text-[#363C46]">{sortedData.length}</span> entries
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-[rgba(93,100,114,0.20)] flex items-center justify-center text-[#363C46] hover:bg-[#E0EEE9] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#363C46] text-white shadow-xs'
                      : 'text-[#5D6472] hover:bg-[#E0EEE9] hover:text-[#363C46]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-[rgba(93,100,114,0.20)] flex items-center justify-center text-[#363C46] hover:bg-[#E0EEE9] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
